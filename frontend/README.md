# EventHub — Frontend

Interface web publique d'EventHub : parcours participant (inscription, billets) et agent de scan (check-in). Le back-office (gestion événements/invités, statistiques) vit désormais côté backend via Filament — voir [EventHub-api](https://github.com/Alecdev-10/EventHub-api).

## Stack

- React 19 / Vite
- React Router
- Tailwind CSS
- Axios

## Installation

```bash
npm install
cp .env.example .env
```

Vérifier `VITE_API_URL` dans `.env` (URL de l'API backend, `http://localhost:8000/api` par défaut).

```bash
npm run dev
```

## Backend associé

[EventHub-api](https://github.com/Alecdev-10/EventHub-api) (Laravel + Sanctum pour cette app, + Filament pour le back-office).

## Déploiement (Vercel)

Le dépôt racine (`EventHub2026`) contient aussi `assets/` en plus de `frontend/` : dans les réglages du projet Vercel, définir **Root Directory = `frontend`**. Le preset Vite est auto-détecté (build `npm run build`, sortie `dist`) ; `vercel.json` gère déjà la réécriture SPA nécessaire pour React Router.

Variable d'environnement à définir sur Vercel : `VITE_API_URL`. Tant que le backend n'est pas déployé, la laisser vide — l'app tourne sur les données mock, seul login/register ne fonctionnera pas encore.

## Démo Render

Le fichier `../render.yaml` prépare le frontend comme site statique gratuit Render depuis le dossier `frontend`, avec la réécriture nécessaire à React Router. Configurez `VITE_API_URL` avec l'URL Render du backend terminée par `/api`, et `VITE_BACKOFFICE_URL` avec la même URL terminée par `/admin/login`. Après un changement d’URL, relancez le build du site statique pour intégrer les variables Vite.
