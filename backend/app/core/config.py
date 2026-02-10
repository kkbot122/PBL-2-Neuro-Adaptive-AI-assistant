from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Backend Service"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/neuro_db"

    model_config = ConfigDict(
        case_sensitive=True
    )

settings = Settings()
