from pydantic import BaseModel


class SatelliteCreate(BaseModel):
    name: str
    tle_1: str
    tle_2: str


class SatelliteResponse(BaseModel):
    id: int
    name: str
    tle_1: str
    tle_2: str
    added_at: str


class SatellitesListResponse(BaseModel):
    satellites: list[SatelliteResponse]


class UserRegister(BaseModel):
    login: str
    password: str
    chat_id: int
    latitude: float
    longitude: float


class UserLogin(BaseModel):
    login: str
    password: str


class UserModel(BaseModel):
    id: int
    login: str
    chat_id: int
    latitude: float
    longitude: float


class UserResponse(BaseModel):
    id: int
    login: str
    chat_id: int
    latitude: float
    longitude: float


class UsersListResponse(BaseModel):
    users: list[UserResponse]


class MessageResponse(BaseModel):
    message: str
