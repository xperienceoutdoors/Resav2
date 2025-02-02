const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../src/models');
const { generateToken } = require('../../src/utils/auth');

// Mock des modèles Sequelize
jest.mock('../../src/models', () => ({
  User: {
    findOne: jest.fn()
  }
}));

describe('Auth Service', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('User Authentication', () => {
    it('should authenticate valid user credentials', async () => {
      // Préparer les données de test
      const testUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin'
      };

      // Configurer le mock
      User.findOne.mockResolvedValue(testUser);

      // Tester l'authentification
      const token = generateToken(testUser);
      expect(token).toBeTruthy();

      // Vérifier le contenu du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded).toMatchObject({
        userId: testUser.id,
        email: testUser.email,
        role: testUser.role
      });
    });

    it('should reject invalid credentials', async () => {
      // Configurer le mock pour un utilisateur non trouvé
      User.findOne.mockResolvedValue(null);

      // Vérifier que l'authentification échoue
      await expect(async () => {
        await User.findOne({ where: { email: 'invalid@example.com' } });
      }).rejects.toBeNull();
    });
  });
});
