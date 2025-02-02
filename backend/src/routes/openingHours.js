const express = require('express');
const { body, validationResult } = require('express-validator');
const { OpeningPeriod } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation des périodes d'ouverture
const validateOpeningPeriod = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('startDate').isISO8601().withMessage('Date de début invalide'),
  body('endDate')
    .isISO8601()
    .withMessage('Date de fin invalide')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('La date de fin doit être après la date de début');
      }
      return true;
    }),
  body('weekDays')
    .isArray()
    .withMessage('Les jours doivent être un tableau')
    .custom((value) => {
      if (!value.every(day => day >= 0 && day <= 6)) {
        throw new Error('Jours invalides');
      }
      return true;
    }),
  body('startTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Heure de début invalide'),
  body('endTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de fin invalide')
    .custom((value, { req }) => {
      if (value <= req.body.startTime) {
        throw new Error('L\'heure de fin doit être après l\'heure de début');
      }
      return true;
    }),
];

// Récupérer toutes les périodes d'ouverture
router.get('/', auth, async (req, res) => {
  try {
    const periods = await OpeningPeriod.findAll({
      where: { companyId: req.user.companyId },
      order: [['startDate', 'ASC']],
    });
    res.json(periods);
  } catch (error) {
    console.error('Error fetching opening periods:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une nouvelle période
router.post('/', auth, validateOpeningPeriod, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Vérifier les chevauchements
    const overlapping = await OpeningPeriod.findOne({
      where: {
        companyId: req.user.companyId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [req.body.startDate, req.body.endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [req.body.startDate, req.body.endDate],
            },
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({
        error: 'Cette période chevauche une période existante',
      });
    }

    const period = await OpeningPeriod.create({
      ...req.body,
      companyId: req.user.companyId,
    });

    res.status(201).json(period);
  } catch (error) {
    console.error('Error creating opening period:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour une période
router.put('/:id', auth, validateOpeningPeriod, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const period = await OpeningPeriod.findOne({
      where: {
        id: req.params.id,
        companyId: req.user.companyId,
      },
    });

    if (!period) {
      return res.status(404).json({ error: 'Période non trouvée' });
    }

    // Vérifier les chevauchements (excluant la période actuelle)
    const overlapping = await OpeningPeriod.findOne({
      where: {
        id: { [Op.ne]: req.params.id },
        companyId: req.user.companyId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [req.body.startDate, req.body.endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [req.body.startDate, req.body.endDate],
            },
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({
        error: 'Cette période chevauche une période existante',
      });
    }

    await period.update(req.body);
    res.json(period);
  } catch (error) {
    console.error('Error updating opening period:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer une période
router.delete('/:id', auth, async (req, res) => {
  try {
    const period = await OpeningPeriod.findOne({
      where: {
        id: req.params.id,
        companyId: req.user.companyId,
      },
    });

    if (!period) {
      return res.status(404).json({ error: 'Période non trouvée' });
    }

    await period.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting opening period:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
