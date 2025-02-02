const request = require('supertest');
const path = require('path');
const fs = require('fs').promises;
const app = require('../../src/app');
const { User, Company } = require('../../src/models');
const { generateToken } = require('../../src/utils/auth');

describe('Upload Routes', () => {
  let token;
  let company;
  let user;
  let uploadDir;

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

    // Créer le dossier uploads pour les tests
    uploadDir = path.join(__dirname, '../../uploads', company.id.toString());
    await fs.mkdir(uploadDir, { recursive: true });
  });

  afterAll(async () => {
    // Nettoyer les fichiers et dossiers de test
    await fs.rm(uploadDir, { recursive: true, force: true });
    await User.destroy({ where: {} });
    await Company.destroy({ where: {} });
  });

  describe('POST /api/upload', () => {
    it('should upload and process an image', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');
      
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', testImagePath);

      expect(response.status).toBe(200);
      expect(response.body.urls).toBeDefined();
      expect(response.body.urls.thumbnail).toBeDefined();
      expect(response.body.urls.medium).toBeDefined();
      expect(response.body.urls.large).toBeDefined();

      // Vérifier que les fichiers ont été créés
      const files = await fs.readdir(uploadDir);
      expect(files.length).toBe(3); // thumbnail, medium, large
    });

    it('should reject non-image files', async () => {
      const testFilePath = path.join(__dirname, '../fixtures/test-file.txt');
      
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', testFilePath);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('doit être une image');
    });

    it('should require authentication', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');
      
      const response = await request(app)
        .post('/api/upload')
        .attach('image', testImagePath);

      expect(response.status).toBe(401);
    });

    it('should handle large files', async () => {
      const largePath = path.join(__dirname, '../fixtures/large-image.jpg');
      
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', largePath);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('trop volumineux');
    });
  });

  describe('DELETE /api/upload/:filename', () => {
    it('should delete an uploaded image', async () => {
      // D'abord uploader une image
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');
      const uploadResponse = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', testImagePath);

      const filename = path.basename(uploadResponse.body.urls.medium);
      const baseFilename = filename.split('-')[0];

      // Ensuite la supprimer
      const deleteResponse = await request(app)
        .delete(`/api/upload/${baseFilename}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteResponse.status).toBe(204);

      // Vérifier que les fichiers ont été supprimés
      const files = await fs.readdir(uploadDir);
      const remainingFiles = files.filter(file => file.startsWith(baseFilename));
      expect(remainingFiles.length).toBe(0);
    });

    it('should handle non-existent files', async () => {
      const response = await request(app)
        .delete('/api/upload/non-existent-file')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/upload/some-file');

      expect(response.status).toBe(401);
    });
  });
});
