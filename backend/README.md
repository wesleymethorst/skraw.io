# Skraw.io Backend

Backend service voor Skraw.io - een Socket.IO powered real-time tekenen en raden spel.

## Functionaliteiten

- Express.js server met Socket.IO
- Real-time multiplayer game logic
- Lobby management
- Chat systeem
- Drawing data management
- Multi-language woordenlijsten (Nederlands, Engels, Duits, Frans)

## Deployment op Railway

1. Maak een nieuwe Railway service aan
2. Connect deze backend directory
3. Railway zal automatisch de `railway.toml` configuratie gebruiken
4. Zet de volgende environment variables:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://jouw-frontend-url.railway.app` (na frontend deployment)

## Lokale Development

```bash
npm install
npm run dev
```

Server draait op poort 3000.

## API Endpoints

- `GET /` - Health check endpoint
- Socket.IO events op `/socket.io/` 