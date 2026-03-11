from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central app configuration loaded from environment variables."""

    project_name: str = Field(default="ResumeAI")
    api_version: str = Field(default="0.1.0")
    secret_key: str = Field(default="change-me")
    frontend_url: str = Field(default="http://localhost:3000")
    cors_origins: List[str] | str = Field(default_factory=lambda: ["http://localhost:3000"])
    database_url: str = Field(default="sqlite:///./resumeai.db")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_origins(cls, value: List[str] | str) -> List[str]:
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            items = [origin.strip() for origin in value.split(",")]
            return [origin for origin in items if origin]
        return ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
