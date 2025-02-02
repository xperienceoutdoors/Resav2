const express = require('express');
const { Op } = require('sequelize');
const { Booking, Activity } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Récupérer les statistiques du jour
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Booking.findAndCountAll({
      where: {
        companyId: req.user.companyId,
        date: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
      include: [{
        model: Activity,
        attributes: ['name', 'price'],
      }],
    });

    // Calculer le chiffre d'affaires
    const revenue = stats.rows.reduce((total, booking) => {
      return total + (booking.Activity?.price || 0) * booking.participants;
    }, 0);

    // Calculer le taux d'occupation
    const totalCapacity = await Activity.sum('maxCapacity', {
      where: { companyId: req.user.companyId },
    });
    
    const occupancyRate = totalCapacity ? 
      (stats.rows.reduce((total, booking) => total + booking.participants, 0) / totalCapacity) * 100 :
      0;

    res.json({
      bookings: stats.count,
      revenue,
      occupancyRate: Math.round(occupancyRate),
    });
  } catch (error) {
    console.error('Error fetching today stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les statistiques de la semaine
router.get('/weekly', auth, async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const bookings = await Booking.findAll({
      where: {
        companyId: req.user.companyId,
        date: {
          [Op.gte]: startOfWeek,
          [Op.lt]: endOfWeek,
        },
      },
      include: [{
        model: Activity,
        attributes: ['name'],
      }],
    });

    // Grouper par jour
    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return {
        name: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()],
        date: date.toISOString().split('T')[0],
        reservations: 0,
      };
    });

    bookings.forEach(booking => {
      const dayIndex = new Date(booking.date).getDay();
      dailyStats[dayIndex].reservations++;
    });

    // Grouper par activité
    const activityStats = {};
    bookings.forEach(booking => {
      const activityName = booking.Activity?.name || 'Autre';
      activityStats[activityName] = (activityStats[activityName] || 0) + 1;
    });

    const activityData = Object.entries(activityStats).map(([name, value]) => ({
      name,
      value,
    }));

    res.json({
      dailyStats,
      activityStats: activityData,
    });
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les statistiques mensuelles
router.get('/monthly', auth, async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const stats = await Booking.findAll({
      where: {
        companyId: req.user.companyId,
        date: {
          [Op.gte]: startOfMonth,
          [Op.lt]: endOfMonth,
        },
      },
      include: [{
        model: Activity,
        attributes: ['name', 'price'],
      }],
    });

    // Calculer le nombre total de clients
    const totalCustomers = new Set(stats.map(booking => booking.customerInfo.email)).size;

    // Calculer la tendance par rapport au mois précédent
    const previousMonth = new Date(startOfMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const previousStats = await Booking.count({
      where: {
        companyId: req.user.companyId,
        date: {
          [Op.gte]: previousMonth,
          [Op.lt]: startOfMonth,
        },
      },
    });

    const trend = previousStats ? 
      ((stats.length - previousStats) / previousStats) * 100 :
      0;

    res.json({
      totalBookings: stats.length,
      totalCustomers,
      trend: Math.round(trend),
    });
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
