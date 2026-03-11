from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from models.database import Base, engine
from routers import auth, dashboard, resume, tools


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan hook.
    Ensures database tables exist before serving the first request.
    """
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.project_name,
    version=settings.api_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(tools.router)
app.include_router(dashboard.router)


@app.get("/", tags=["system"])
def root():
    return {"message": f"{settings.project_name} backend is running"}


@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok"}
