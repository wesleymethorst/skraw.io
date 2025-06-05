# Skraw.io - Vue 3 + Socket.io Drawing Game

Een multiplayer tekening-raad spel gebouwd met Vue 3, Express.js en Socket.io.

## Features

- Real-time multiplayer gameplay
- Socket.io voor live communicatie
- Vue 3 frontend met Vite
- Express.js backend
- Meertalige woorden (Nederlands, Engels, Duits, Frans)

## Development

```bash
# Install dependencies
npm install

# Start development (frontend + backend)
npm run dev:all

# Or run separately:
npm run dev     # Frontend only
npm run server  # Backend only
```

## Deployment

### Railway Deployment

Dit project is geconfigureerd voor Railway deployment:

1. Push je code naar een Git repository
2. Ga naar [Railway](https://railway.app) 
3. Connect je repository
4. Railway zal automatisch de `nixpacks.toml` configuratie gebruiken
5. De applicatie wordt gebouwd met `npm run build` en gestart met `npm start`

### Local Build

```bash
# Build for production
npm run build

# Start production server
npm start
```
