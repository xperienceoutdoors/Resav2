const request = require('supertest');
const app = require('../../src/app');
const { User, Company, Booking, Activity } = require('../../src/models');
const { generateToken } = require('../../src/utils/auth');

describe('Statistics Routes', () => {
  let token;
  let company;
  let user;
  let activity;

  beforeAll(async () => {
    // Créer une entreprise et un utilisateur de test
    company = await Company.create({
      name: 'Test Company',
      email: 'test@company.com',
    });

    user = await User.create({
      email: 'test@test.com',
      password: 'password123',
      companyId: company.id,
    });

    activity = await Activity.create({
      name: 'Test Activity',
      price: 50,
      maxCapacity: 10,
      companyId: company.id,
    });

    token = generateToken(user);
  });

  afterAll(async () => {
    await Booking.destroy({ where: {} });
    await Activity.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Company.destroy({ where: {} });
  });

  describe('GET /api/statistics/today', () => {
    beforeEach(async () => {
      await Booking.destroy({ where: {} });
    });

    it('should return today\'s statistics', async () => {
      // Créer des réservations pour aujourd'hui
      await Booking.bulkCreate([
        {
          date: new Date(),
          participants: 2,
          activityId: activity.id,
          companyId: company.id,
          customerInfo: { email: 'customer1@test.com' },
        },
        {
          date: new Date(),
          participants: 3,
          activityId: activity.id,
          companyId: company.id,
          customerInfo: { email: 'customer2@test.com' },
        },
      ]);

      const response = await request(app)
        .get('/api/statistics/today')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bookings', 2);
      expect(response.body).toHaveProperty('revenue', 250); // 5 participants * 50€
      expect(response.body).toHaveProperty('occupancyRate', 50); // 5 participants / 10 capacity
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/statistics/today');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/statistics/weekly', () => {
    beforeEach(async () => {
      await Booking.destroy({ where: {} });
    });

    it('should return weekly statistics', async () => {
      // Créer des réservations pour la semaine
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      await Booking.bulkCreate([
        {
          date: today,
          participants: 2,
          activityId: activity.id,
          companyId: company.id,
          customerInfo: { email: 'customer1@test.com' },
        },
        {
          date: yesterday,
          participants: 3,
          activityId: activity.id,
          companyId: company.id,
          customerInfo: { email: 'customer2@test.com' },
        },
      ]);

      const response = await request(app)
        .get('/api/statistics/weekly')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('dailyStats');
      expect(response.body.dailyStats).toHaveLength(7);
      expect(response.body).toHaveProperty('activityStats');
      expect(response.body.activityStats).toHaveLength(1);
      expect(response.body.activityStats[0].name).toBe('Test Activity');
      expect(response.body.activityStats[0].value).toBe(2);
    });
  });

  describe('GET /api/statistics/monthly', () => {
    beforeEach(async () => {
      await Booking.destroy({ where: {} });
    });

    it('should return monthly statistics', async () => {
      // Créer des réservations pour le mois
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      await Booking.bulkCreate([
        {
          date: today,
          participants: 2,
          activityId: activity.id,
          companyId: company.id,
          customerInfo: { email: 'customer1@test.com' },
        },
        {
          date: today,
          participants: 3,
          activityId: activity.id,
          companyId: company.id,
          customerInfo: { email: 'customer1@test.com' }, // Même client
        },
        {
          date: lastMonth,
          participants: 1,
          activityId: activity.id,
          companyId: company.id,
          customerInfo: { email: 'customer2@test.com' },
        },
      ]);

      const response = await request(app)
        .get('/api/statistics/monthly')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalBookings', 2);
      expect(response.body).toHaveProperty('totalCustomers', 1); // Un seul client unique
      expect(response.body).toHaveProperty('trend', 100); // +100% par rapport au mois dernier
    });
  });
});
