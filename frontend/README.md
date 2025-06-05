# Skraw.io Frontend

Frontend service voor Skraw.io - een Vue.js SPA voor real-time tekenen en raden spel.

## Functionaliteiten

- Vue.js 3 met Vite
- Socket.IO client voor real-time communicatie
- Canvas tekenfunctionaliteit
- Multi-player lobby systeem
- Chat interface
- Responsive design met Tailwind CSS

## Deployment op Railway

1. Maak een nieuwe Railway service aan
2. Connect deze frontend directory  
3. Railway zal automatisch de `railway.toml` configuratie gebruiken
4. Zet de volgende environment variables:
   - `NODE_ENV=production`
   - `BACKEND_URL=https://jouw-backend-url.railway.app`

## Lokale Development

```bash
npm install
npm run dev
```

Development server draait op poort 5173.

Voor productie build:
```bash
npm run build
npm run start
```

## Environment Variables

- `BACKEND_URL` - URL van de backend service (voor Socket.IO verbinding) 