from db.database import SessionLocal
from db.schema import User as UserModel, Satellite as SatelliteModel
from db.tables import create_tables
from fastapi import Depends, FastAPI, Request, Response, HTTPException
from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from schemas import (
    UserLogin,
    UserRegister,
    SatelliteCreate,
    UserResponse,
    UsersListResponse,
    SatellitesListResponse,
    MessageResponse,
)

from sqlalchemy.orm import Session
from helpers import (
    not_found_response,
    hash_password,
    verify_password,
    get_user_by_id,
    get_user_by_login,
    get_satellite_by_id,
    create_session,
    get_session_user_id,
    delete_session,
)
from mappers import user_to_response, satellite_to_response


from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(title="Satellite Tracker API", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    request: Request, db: Session = Depends(get_db)
) -> UserModel:
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = get_session_user_id(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


@app.get("/")
async def root():
    return {"status": "for all mankind"}


@app.get("/users", response_model=UsersListResponse)
async def get_users(db: Session = Depends(get_db)) -> UsersListResponse:
    users = db.query(UserModel).all()

    result = [user_to_response(user) for user in users]
    return UsersListResponse(users=result)


@app.post("/register")
async def register_user(user: UserRegister, db: Session = Depends(get_db)):
    db_user = get_user_by_login(db, user.login)

    if db_user:
        return {"error": "Login already exists"}

    password_hashed = hash_password(user.password)

    db_user = UserModel(
        login=user.login,
        password=password_hashed,
        chat_id=user.chat_id,
        latitude=user.latitude,
        longitude=user.longitude,
    )

    db.add(db_user)
    db.commit()

    return {"message": f"User {user.login} registered!"}


@app.post("/login")
async def login_user(
    user: UserLogin, response: Response, db: Session = Depends(get_db)
) -> Union[MessageResponse, JSONResponse]:
    db_user = get_user_by_login(db, user.login)

    if not db_user or not verify_password(user.password, db_user.password):
        return JSONResponse(
            status_code=401, content={"error": "Invalid login or password"}
        )

    session_id = create_session(db_user.id)

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax",
        secure=False,
    )

    return JSONResponse(
        status_code=200,
        content={
            "message": f"User {user.login} logged in successfully",
            "user": user_to_response(db_user).model_dump(),
        },
    )


@app.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserModel = Depends(get_current_user)):
    return user_to_response(current_user)


@app.post("/logout")
async def logout_user(request: Request, response: Response):
    session_id = request.cookies.get("session_id")
    if session_id:
        delete_session(session_id)

    response.delete_cookie(
        key="session_id",
        httponly=True,
        samesite="lax",
        secure=False,
    )

    return {"message": "Logged out successfully"}


@app.get("/users/{id}", response_model=UserResponse)
async def get_user(id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, id)

    if not db_user:
        return not_found_response("User", id)

    return user_to_response(db_user)


@app.patch("/users/{id}")
async def update_user(id: int, user: UserRegister, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, id)

    if not db_user:
        return not_found_response("User", id)

    db_user.login = user.login
    db_user.password = hash_password(user.password)
    db_user.latitude = user.latitude
    db_user.longitude = user.longitude

    db.commit()

    return {"message": f"User with id {id} updated!"}


@app.delete("/users/{id}")
async def delete_user(id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, id)

    if not db_user:
        return not_found_response("User", id)

    db.delete(db_user)
    db.commit()

    return {"message": f"User with id {id} deleted!"}


@app.get("/satellites", response_model=SatellitesListResponse)
async def get_satellites(db: Session = Depends(get_db)) -> SatellitesListResponse:
    satellites = db.query(SatelliteModel).all()

    result = [satellite_to_response(satellite) for satellite in satellites]

    return SatellitesListResponse(satellites=result)


@app.post("/satellites", response_model=MessageResponse)
async def add_satellite(
    satellite: SatelliteCreate, db: Session = Depends(get_db)
) -> Union[MessageResponse, JSONResponse]:
    db_satellite = (
        db.query(SatelliteModel)
        .filter(SatelliteModel.name.ilike(satellite.name))
        .first()
    )

    if db_satellite:
        return JSONResponse(
            status_code=409,
            content={
                "error": {
                    "message": f"Satellite with name similar to {satellite.name} already exists",
                    "code": 409,
                }
            },
        )

    db_satellite = SatelliteModel(
        name=satellite.name, tle_1=satellite.tle_1, tle_2=satellite.tle_2
    )

    db.add(db_satellite)
    db.flush()
    db.commit()

    return MessageResponse(
        message=f"Satellite {satellite.name} added with ID {db_satellite.id} at {db_satellite.added_at}"
    )


@app.delete("/satellites/{id}", response_model=MessageResponse)
async def delete_satellite(
    id: int, db: Session = Depends(get_db)
) -> Union[MessageResponse, JSONResponse]:
    db_satellite = get_satellite_by_id(db, id)

    if not db_satellite:
        return not_found_response("Satellite", id)

    db.delete(db_satellite)
    db.commit()

    return MessageResponse(message=f"Satellite with ID {id} deleted!")
