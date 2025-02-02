const request = require('supertest');
const app = require('../../src/app');
const { OpeningPeriod, User, Company } = require('../../src/models');
const { generateToken } = require('../../src/utils/auth');

describe('Opening Hours Routes', () => {
  let token;
  let company;
  let user;

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

    token = generateToken(user);
  });

  afterAll(async () => {
    await OpeningPeriod.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Company.destroy({ where: {} });
  });

  describe('GET /api/opening-hours', () => {
    it('should return all opening periods', async () => {
      const period = await OpeningPeriod.create({
        name: 'Test Period',
        startDate: '2025-07-01',
        endDate: '2025-08-31',
        weekDays: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '18:00',
        companyId: company.id,
      });

      const response = await request(app)
        .get('/api/opening-hours')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Period');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/opening-hours');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/opening-hours', () => {
    it('should create a new opening period', async () => {
      const periodData = {
        name: 'New Period',
        startDate: '2025-09-01',
        endDate: '2025-10-31',
        weekDays: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '18:00',
      };

      const response = await request(app)
        .post('/api/opening-hours')
        .set('Authorization', `Bearer ${token}`)
        .send(periodData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Period');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/opening-hours')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should prevent overlapping periods', async () => {
      await OpeningPeriod.create({
        name: 'Existing Period',
        startDate: '2025-07-01',
        endDate: '2025-08-31',
        weekDays: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '18:00',
        companyId: company.id,
      });

      const response = await request(app)
        .post('/api/opening-hours')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Overlapping Period',
          startDate: '2025-08-15',
          endDate: '2025-09-15',
          weekDays: [1, 2, 3, 4, 5],
          startTime: '09:00',
          endTime: '18:00',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('chevauche');
    });
  });

  describe('PUT /api/opening-hours/:id', () => {
    let period;

    beforeEach(async () => {
      period = await OpeningPeriod.create({
        name: 'Test Period',
        startDate: '2025-07-01',
        endDate: '2025-08-31',
        weekDays: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '18:00',
        companyId: company.id,
      });
    });

    it('should update an existing period', async () => {
      const response = await request(app)
        .put(`/api/opening-hours/${period.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Period',
          startDate: '2025-07-01',
          endDate: '2025-08-31',
          weekDays: [1, 2, 3, 4, 5],
          startTime: '10:00',
          endTime: '19:00',
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Period');
      expect(response.body.startTime).toBe('10:00');
    });

    it('should not allow updating non-existent period', async () => {
      const response = await request(app)
        .put('/api/opening-hours/999999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Period',
          startDate: '2025-07-01',
          endDate: '2025-08-31',
          weekDays: [1, 2, 3, 4, 5],
          startTime: '10:00',
          endTime: '19:00',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/opening-hours/:id', () => {
    it('should delete an existing period', async () => {
      const period = await OpeningPeriod.create({
        name: 'Test Period',
        startDate: '2025-07-01',
        endDate: '2025-08-31',
        weekDays: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '18:00',
        companyId: company.id,
      });

      const response = await request(app)
        .delete(`/api/opening-hours/${period.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      const deletedPeriod = await OpeningPeriod.findByPk(period.id);
      expect(deletedPeriod).toBeNull();
    });

    it('should not allow deleting non-existent period', async () => {
      const response = await request(app)
        .delete('/api/opening-hours/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
