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
