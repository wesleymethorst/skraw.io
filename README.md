# Skraw.io

Een real-time multiplayer teken- en raadspel gebouwd met Vue.js en Socket.IO.

## 🏗️ Architectuur

Dit project is opgesplitst in aparte microservices voor deployment op Railway:

- **Backend** (`/backend/`) - Express.js server met Socket.IO voor real-time communicatie
- **Frontend** (`/frontend/`) - Vue.js SPA met canvas tekenfunctionaliteit

## 🚀 Deployment

Zie `DEPLOYMENT.md` voor gedetailleerde instructies over het deployen op Railway.

## 🛠️ Lokale Development

### Backend starten:
```bash
cd backend
npm install
npm run dev
```

### Frontend starten:
```bash
cd frontend  
npm install
npm run dev
```

De frontend draait op `http://localhost:5173` en verbindt met de backend op `http://localhost:3000`.

## 🎮 Game Features

- Real-time multiplayer tekenen en raden
- Lobby systeem (tot 4 spelers)
- Chat functionaliteit
- Multi-language woordenlijsten (NL, EN, DE, FR)
- Responsive design
- Character selectie

## 📁 Project Structuur

```
skraw.io/
├── backend/          # Express.js + Socket.IO server
│   ├── server.js
│   ├── package.json
│   └── railway.toml
├── frontend/         # Vue.js SPA
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── railway.toml
└── DEPLOYMENT.md     # Railway deployment guide
```
