import os
import requests

from dto import UserCreateDTO


def _prepare_api_url(raw_url: str | None) -> str:
    url = raw_url or "http://api:8000"
    if not url.startswith(("http://", "https://")):
        url = f"http://{url}"
    return url.rstrip("/")


API_URL = _prepare_api_url(os.getenv("API_URL"))


def register_user(payload: UserCreateDTO) -> None:
    response = requests.post(
        f"{API_URL}/register",
        json=payload.__dict__,
        timeout=10,
    )
    response.raise_for_status()
