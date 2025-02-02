# Xperience Outdoors - Plateforme de Réservation

Une plateforme de réservation en ligne pour du matériel nautique, des balades nautiques et des activités de loisirs.

## Structure du Projet

- `frontend/` : Application React pour l'interface utilisateur
- `backend/` : API Node.js/Express
- `docs/` : Documentation technique

## Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v14 ou supérieur)
- npm ou yarn

## Installation

1. Backend:
```bash
cd backend
npm install
npm run dev
```

2. Frontend:
```bash
cd frontend
npm install
npm start
```

## Architecture

### Backend
- Node.js avec Express
- PostgreSQL pour la base de données
- JWT pour l'authentification
- Multer pour la gestion des fichiers
- Sequelize comme ORM

### Frontend
- React.js
- Material-UI pour les composants
- React Router pour la navigation
- Redux Toolkit pour la gestion d'état
- Axios pour les requêtes HTTP

## Fonctionnalités

- Gestion multi-entreprises
- Système de réservation
- Gestion des ressources
- Planning dynamique
- Système de paiement
- Back-office personnalisé par entreprise

## Licence

Propriétaire - Tous droits réservés
