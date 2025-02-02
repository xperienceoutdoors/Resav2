const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const auth = require('../middleware/auth');

const router = express.Router();

// Configuration de multer pour le stockage temporaire
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Le fichier doit être une image'));
    }
    cb(null, true);
  },
});

// Configuration des tailles d'images
const imageSizes = {
  thumbnail: { width: 150, height: 150 },
  medium: { width: 800, height: 600 },
  large: { width: 1920, height: 1080 },
};

// Fonction pour créer le dossier de destination s'il n'existe pas
const ensureUploadDir = async () => {
  const uploadDir = path.join(__dirname, '../../uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Fonction pour optimiser et redimensionner l'image
const processImage = async (buffer, filename, companyId) => {
  const uploadDir = await ensureUploadDir();
  const companyDir = path.join(uploadDir, companyId.toString());
  await fs.mkdir(companyDir, { recursive: true });

  const results = {};
  const metadata = await sharp(buffer).metadata();

  // Maintenir le ratio d'aspect
  const calculateDimensions = (target, original) => {
    const ratio = original.width / original.height;
    if (ratio > target.width / target.height) {
      return {
        width: target.width,
        height: Math.round(target.width / ratio),
      };
    }
    return {
      width: Math.round(target.height * ratio),
      height: target.height,
    };
  };

  // Générer les différentes tailles
  for (const [size, dimensions] of Object.entries(imageSizes)) {
    const newDimensions = calculateDimensions(dimensions, metadata);
    const resizedFilename = `${path.parse(filename).name}-${size}${path.parse(filename).ext}`;
    const filePath = path.join(companyDir, resizedFilename);

    await sharp(buffer)
      .resize(newDimensions.width, newDimensions.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toFile(filePath);

    results[size] = `/uploads/${companyId}/${resizedFilename}`;
  }

  return results;
};

// Route pour uploader une image
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
    const urls = await processImage(req.file.buffer, filename, req.user.companyId);

    res.json({
      urls,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
  }
});

// Route pour supprimer une image
router.delete('/:filename', auth, async (req, res) => {
  try {
    const uploadDir = await ensureUploadDir();
    const companyDir = path.join(uploadDir, req.user.companyId.toString());
    
    // Supprimer toutes les versions de l'image
    const filename = path.parse(req.params.filename).name;
    const files = await fs.readdir(companyDir);
    
    for (const file of files) {
      if (file.startsWith(filename)) {
        await fs.unlink(path.join(companyDir, file));
      }
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
  }
});

module.exports = router;
