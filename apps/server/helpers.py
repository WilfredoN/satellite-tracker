import json
import os
import secrets
from datetime import datetime, timezone
from typing import Optional

import redis
from db.schema import Satellite as SatelliteModel
from db.schema import User as UserModel
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")


try:
    redis_client: redis.Redis = redis.from_url(REDIS_URL, decode_responses=True)  # type: ignore[reportUnknownMemberType]

    redis_client.ping()  # type: ignore[reportUnknownMemberType]
    print(f"✓ Connected to Redis at {REDIS_URL}")
except redis.ConnectionError as e:
    print(f"✗ Failed to connect to Redis at {REDIS_URL}: {e}")
    print("  Sessions will not persist. Please ensure Redis is running.")
    raise

SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60  # 7 days


def not_found_response(entity: str, id: int | str) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={"error": {"message": f"{entity} {id} not found", "code": 404}},
    )


def hash_password(password: str) -> str:
    import bcrypt

    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    import bcrypt

    return bcrypt.checkpw(plain.encode(), hashed.encode())


def get_user_by_id(db: Session, id: int) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.id == id).first()


def get_user_by_login(db: Session, login: str) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.login == login).first()


def get_satellite_by_id(db: Session, id: int) -> SatelliteModel | None:
    return db.query(SatelliteModel).filter(SatelliteModel.id == id).first()


def create_session(user_id: int) -> str:
    session_id = secrets.token_urlsafe(32)
    session_data: dict[str, int | str] = {
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    redis_client.setex(
        f"session:{session_id}", SESSION_EXPIRY_SECONDS, json.dumps(session_data)
    )
    return session_id


def get_session_user_id(session_id: str) -> Optional[int]:
    session_json = redis_client.get(f"session:{session_id}")
    if not session_json:
        return None
    try:
        session_data = json.loads(str(session_json))
        return session_data["user_id"]
    except (json.JSONDecodeError, KeyError):
        return None


def delete_session(session_id: str) -> None:
    redis_client.delete(f"session:{session_id}")
