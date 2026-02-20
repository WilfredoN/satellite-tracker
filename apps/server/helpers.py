from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from db.schema import User as UserModel, Satellite as SatelliteModel
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

sessions: dict[str, dict[str, Any]] = {}


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
    sessions[session_id] = {
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc),
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return session_id


def get_session_user_id(session_id: str) -> Optional[int]:
    session = sessions.get(session_id)
    if not session:
        return None
    if datetime.now(timezone.utc) > session["expires_at"]:
        sessions.pop(session_id, None)
        return None
    return session["user_id"]


def delete_session(session_id: str) -> None:
    sessions.pop(session_id, None)
