VoltGrid — React frontend + Node/Express backend

This workspace contains a minimal scaffold to convert the provided static site into a React app with a Node/Express API and MongoDB Atlas integration.

Structure
<!-- - frontend/ d + React app    -->
- backend/ — Express API with Mongoose models

Next steps
1. Add your MongoDB Atlas connection string to `backend/.env` (or set `MONGODB_URI` in your environment).
2. Run the backend and frontend (instructions below).

Quick run (from workspace root):

Backend:

```powershell
cd backend
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Replace or copy the original site assets into `frontend/public` and port pages into `frontend/src/components`.
 
Notes for testing contact form

- By default the backend will attempt to use `MONGODB_URI` from `backend/.env`.
- If `MONGODB_URI` is not set the backend will still start and contact submissions will be saved to `backend/data/contacts.json` as a fallback so you can test locally without Atlas.
<!-- - The frontend dev server proxies `/api/*` to `http://localhost:5000` so the contact form can POST to `/api/contact` during development. -->

Quick test (from workspace root):

```powershell
# start backend
cd backend
npm install
npm run dev

# in a separate terminal start frontend
cd frontend
npm install
npm run dev

# open http://localhost:5173 and submit contact form
```

If you prefer I can add instructions to serve the built frontend from the Express backend for production.
