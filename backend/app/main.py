from fastapi import FastAPI
from app.core.config import settings

# Initialize the App
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 1. Health Check Endpoint (Vital for Docker/Production)
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}

# We will import and include routers here later
# app.include_router(profiling.router)