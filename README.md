# PWA Étape 02 — API + Auth (Node + Express + MySQL)

API REST pour la gestion d'ouvrages, utilisateurs, paniers et commandes avec authentification JWT et rôles.

## Équipe
- Ainine Ghiles
- Baamed Abderezak

## Prérequis
- Node.js 20+
- MySQL 8+

## Installation
```bash
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

## Endpoints (extraits)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/ouvrages`
- `POST /api/ouvrages` (rôles: editeur/gestionnaire)
- `POST /api/panier/items`
- `POST /api/commandes`
- etc.

Voir `docs/postman_collection.json` pour des requêtes prêtes à l’emploi.

## Structure
```
src/
  config/db.js
  middleware/auth.js
  routes/*.js
  controllers/*.js
  services/*.js
  models/*.js
  index.js
scripts/ (migrate.js, seed.js)
docs/ (ERD.md, postman_collection.json)
scripts/schema.sql
```

## Licence
Usage académique.
