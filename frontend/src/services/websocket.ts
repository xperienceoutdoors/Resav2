import { store } from '../store';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number = 1000;
  private pingInterval: number | null = null;

  constructor() {
    this.connect = this.connect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  connect() {
    const token = store.getState().auth.token;
    if (!token) {
      console.error('No token available for WebSocket connection');
      return;
    }

    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:3000'}/ws?token=${token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.startPing();
    };

    this.ws.onmessage = this.handleMessage;
    this.ws.onclose = this.handleClose;
    this.ws.onerror = this.handleError;
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'initial_data':
          // Mettre à jour le state avec les données initiales
          store.dispatch({ type: 'bookings/setBookings', payload: data.bookings });
          break;

        case 'new_booking':
          // Ajouter la nouvelle réservation
          store.dispatch({ type: 'bookings/addBooking', payload: data.booking });
          // Mettre à jour les statistiques
          store.dispatch({ type: 'statistics/refreshStats' });
          break;

        case 'booking_update':
          // Mettre à jour la réservation
          store.dispatch({ type: 'bookings/updateBooking', payload: data.booking });
          break;

        case 'booking_cancellation':
          // Supprimer la réservation
          store.dispatch({ type: 'bookings/removeBooking', payload: data.bookingId });
          break;

        case 'pong':
          // Réponse au ping, rien à faire
          break;

        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log('WebSocket closed:', event.code, event.reason);
    this.stopPing();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      store.dispatch({
        type: 'ui/setError',
        payload: 'La connexion temps réel a été perdue. Veuillez rafraîchir la page.',
      });
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error);
    store.dispatch({
      type: 'ui/setError',
      payload: 'Erreur de connexion temps réel',
    });
  }

  private startPing() {
    this.pingInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 25000) as unknown as number;
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  disconnect() {
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Méthode pour envoyer des messages au serveur si nécessaire
  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

// Créer une instance unique du service
export const websocketService = new WebSocketService();

// Middleware Redux pour gérer la connexion WebSocket
export const websocketMiddleware = (store: any) => (next: any) => (action: any) => {
  switch (action.type) {
    case 'auth/setCredentials':
      // Se connecter au WebSocket lors de la connexion
      websocketService.connect();
      break;

    case 'auth/logout':
      // Déconnecter le WebSocket lors de la déconnexion
      websocketService.disconnect();
      break;
  }

  return next(action);
};
