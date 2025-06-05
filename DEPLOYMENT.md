# Skraw.io Railway Deployment Guide

Deze guide helpt je bij het deployen van Skraw.io als aparte microservices op Railway.

## Overzicht van Services

- **Backend** (`/backend/`) - Express.js + Socket.IO server
- **Frontend** (`/frontend/`) - Vue.js SPA

## Deployment Stappen

### 1. Backend Service Deployen

1. Ga naar [Railway](https://railway.app)
2. Klik op "New Project" → "Deploy from GitHub repo"
3. Selecteer je repository
4. Kies "Add Service" → "GitHub Repo"
5. **Belangrijk**: Stel Root Directory in op `backend`
6. Railway detecteert automatisch de `railway.toml` configuratie
7. Deploy de service
8. Noteer de gegenereerde URL (bijv. `https://backend-abc123.railway.app`)

**Environment Variables voor Backend:**
- `NODE_ENV=production`
- `PORT=3000` (wordt automatisch gezet)

### 2. Frontend Service Deployen  

1. In hetzelfde Railway project, klik "Add Service" → "GitHub Repo"
2. Selecteer dezelfde repository
3. **Belangrijk**: Stel Root Directory in op `frontend`
4. Railway detecteert automatisch de `railway.toml` configuratie
5. **Voor deployment**: Zet environment variables
6. Deploy de service
7. Noteer de gegenereerde URL (bijv. `https://frontend-xyz789.railway.app`)

**Environment Variables voor Frontend:**
- `NODE_ENV=production`
- `VITE_BACKEND_URL=https://jouw-backend-url.railway.app`

### 3. Backend CORS Configureren

1. Ga terug naar de Backend service in Railway
2. Voeg environment variable toe:
   - `FRONTEND_URL=https://jouw-frontend-url.railway.app`
3. Redeploy de backend service

## Verificatie

1. Ga naar je frontend URL
2. Test of de Socket.IO verbinding werkt
3. Probeer een lobby te joinen
4. Test de real-time functionaliteiten

## Custom Domains (Optioneel)

Je kunt custom domains instellen in Railway:
1. Ga naar service settings
2. Klik op "Domains" 
3. Voeg je custom domain toe
4. Update de environment variables met je custom domains

## Troubleshooting

**Socket.IO verbinding lukt niet:**
- Controleer of `FRONTEND_URL` in backend correct is ingesteld
- Zorg dat beide services draaien

**Build errors:**
- Controleer of Root Directory correct is ingesteld
- Controleer of alle dependencies in package.json staan

**CORS errors:**
- Controleer of `FRONTEND_URL` environment variable is ingesteld in backend
- Controleer of de URL's correct zijn (inclusief https://)