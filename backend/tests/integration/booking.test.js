const request = require('supertest');
const app = require('../../src/app');
const { User, Company, Activity, Booking } = require('../../src/models');
const { generateToken } = require('../../src/utils/auth');

describe('Booking Integration Tests', () => {
  let token;
  let company;
  let activity;

  beforeAll(async () => {
    // Créer les données de test
    company = await Company.create({
      name: 'Test Company',
      email: 'test@company.com'
    });

    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
      companyId: company.id
    });

    activity = await Activity.create({
      name: 'Test Activity',
      description: 'Test Description',
      price: 100,
      duration: 60,
      maxParticipants: 10,
      companyId: company.id
    });

    token = generateToken(user);
  });

  afterAll(async () => {
    // Nettoyer la base de données
    await Booking.destroy({ where: {} });
    await Activity.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Company.destroy({ where: {} });
  });

  describe('POST /api/bookings', () => {
    it('should create a new booking', async () => {
      const bookingData = {
        activityId: activity.id,
        date: '2025-02-03',
        startTime: '10:00',
        participants: 2,
        customerInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+33612345678'
        }
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.activityId).toBe(activity.id);
      expect(response.body.participants).toBe(2);
    });

    it('should validate booking data', async () => {
      const invalidBooking = {
        // Données manquantes
        date: '2025-02-03'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidBooking);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/bookings', () => {
    it('should return company bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
