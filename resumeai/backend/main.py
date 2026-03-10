from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import engine, Base
from routers import auth, resume, dashboard

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ResumeAI API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "ResumeAI API is running 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/api/resume")
def get_resume():
    return {"message": "Resume API working"}