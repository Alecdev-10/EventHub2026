# EventHub — Frontend

Interface web de la plateforme EventHub : gestion d'événements (création, inscription, check-in, statistiques) pour une association.

## Stack

- React 19 / Vite
- React Router
- Tailwind CSS
- Axios
- Recharts

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

[EventHub-api](https://github.com/Alecdev-10/EventHub-api) (Laravel + Sanctum).

## Déploiement (Vercel)

Le dépôt racine (`EventHub2026`) contient aussi `assets/` en plus de `frontend/` : dans les réglages du projet Vercel, définir **Root Directory = `frontend`**. Le preset Vite est auto-détecté (build `npm run build`, sortie `dist`) ; `vercel.json` gère déjà la réécriture SPA nécessaire pour React Router.

Variable d'environnement à définir sur Vercel : `VITE_API_URL`. Tant que le backend n'est pas déployé, la laisser vide — l'app tourne sur les données mock, seul login/register ne fonctionnera pas encore.
