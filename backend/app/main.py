from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base  

# Import Models to ensure SQLAlchemy "sees" them before create_all
from app.modules.content import models as content_models
from app.modules.auth import models as auth_models 

# Import Routers
from app.modules.auth.router import router as auth_router
from app.modules.content.router import router as content_router
from app.modules.profile.router import router as profile_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Create tables on startup
Base.metadata.create_all(bind=engine)

# REFINED CORS: 
# Browsers treat 'http://localhost:3000' and 'http://127.0.0.1:3000' as different origins.
# We include both, plus the setting from your .env
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    str(settings.FRONTEND_URL),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
    expose_headers=["*"], # Sometimes helps with complex fetch requests
)

# Include Routers
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(content_router, prefix=f"{settings.API_V1_STR}/content", tags=["content"])
app.include_router(profile_router, prefix=f"{settings.API_V1_STR}/profile", tags=["profile"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}