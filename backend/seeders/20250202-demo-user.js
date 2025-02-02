const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Créer d'abord une entreprise
      await queryInterface.bulkInsert('Companies', [{
        name: 'Demo Company',
        email: 'contact@demo.com',
        phone: '+33123456789',
        address: '123 Demo Street',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      // Créer l'utilisateur admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      await queryInterface.bulkInsert('Users', [{
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    } catch (error) {
      console.error('Seeder error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Companies', null, {});
  }
};
