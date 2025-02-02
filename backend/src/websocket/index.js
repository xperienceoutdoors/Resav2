const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { Booking, Activity } = require('../models');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Map pour stocker les clients par companyId

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  // Gérer les nouvelles connexions
  async handleConnection(ws, req) {
    try {
      // Extraire et vérifier le token
      const token = req.url.split('token=')[1];
      if (!token) {
        ws.close(4001, 'Token manquant');
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const companyId = decoded.companyId;

      // Ajouter le client à la map
      if (!this.clients.has(companyId)) {
        this.clients.set(companyId, new Set());
      }
      this.clients.get(companyId).add(ws);

      // Configurer le client
      ws.companyId = companyId;
      ws.isAlive = true;

      // Ping pour garder la connexion active
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Gérer les messages
      ws.on('message', (message) => this.handleMessage(ws, message));

      // Gérer la déconnexion
      ws.on('close', () => {
        if (this.clients.has(ws.companyId)) {
          this.clients.get(ws.companyId).delete(ws);
          if (this.clients.get(ws.companyId).size === 0) {
            this.clients.delete(ws.companyId);
          }
        }
      });

      // Envoyer les données initiales
      await this.sendInitialData(ws);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(4002, 'Erreur d\'authentification');
    }
  }

  // Envoyer les données initiales au client
  async sendInitialData(ws) {
    try {
      // Récupérer les réservations du jour
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const bookings = await Booking.findAll({
        where: {
          companyId: ws.companyId,
          date: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
        },
        include: [{
          model: Activity,
          attributes: ['name'],
        }],
      });

      ws.send(JSON.stringify({
        type: 'initial_data',
        bookings: bookings.map(booking => ({
          id: booking.id,
          time: booking.startTime,
          activity: booking.Activity.name,
          participants: booking.participants,
          status: booking.status,
        })),
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  // Gérer les messages reçus
  handleMessage(ws, message) {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        // Ajouter d'autres types de messages si nécessaire
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  // Diffuser un message à tous les clients d'une entreprise
  broadcast(companyId, message) {
    if (this.clients.has(companyId)) {
      this.clients.get(companyId).forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  // Notifier d'une nouvelle réservation
  notifyNewBooking(booking) {
    this.broadcast(booking.companyId, {
      type: 'new_booking',
      booking: {
        id: booking.id,
        time: booking.startTime,
        activity: booking.Activity?.name,
        participants: booking.participants,
        status: booking.status,
      },
    });
  }

  // Notifier d'une mise à jour de réservation
  notifyBookingUpdate(booking) {
    this.broadcast(booking.companyId, {
      type: 'booking_update',
      booking: {
        id: booking.id,
        time: booking.startTime,
        activity: booking.Activity?.name,
        participants: booking.participants,
        status: booking.status,
      },
    });
  }

  // Notifier d'une annulation de réservation
  notifyBookingCancellation(bookingId, companyId) {
    this.broadcast(companyId, {
      type: 'booking_cancellation',
      bookingId,
    });
  }

  // Démarrer le heartbeat
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach(ws => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  // Arrêter le serveur WebSocket
  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.wss.close();
  }
}

module.exports = WebSocketServer;
