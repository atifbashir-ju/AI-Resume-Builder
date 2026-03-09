# ResumeAI 🚀

AI-Powered Resume Builder & Analyzer

## Deploy

### Backend (Render)
1. New + → Web Service → Connect GitHub repo
2. Root Directory: `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   - `SECRET_KEY` = `ResumeAI2024SecretKeyXyZ789abcDEF456ghi`
   - `FRONTEND_URL` = your Vercel URL
   - `PYTHON_VERSION` = `3.11.8`

### Frontend (Vercel)
1. New Project → Import repo
2. Root Directory: `frontend`
3. Framework: Create React App
4. Environment Variables:
   - `REACT_APP_API_URL` = your Render URL
   - `REACT_APP_GOOGLE_CLIENT_ID` = your Google OAuth client ID

## Local Development

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```
