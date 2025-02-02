const express = require('express');
const { Company } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtenir les informations de l'entreprise
router.get('/', auth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.user.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des informations' });
  }
});

// Mettre à jour les informations de l'entreprise
router.put('/', auth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.user.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    await company.update(req.body);
    res.json(company);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;
