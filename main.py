# Create a production FastAPI application.
# Include:
# - JWT authentication
# - CORS
# - Rate limiting
# - Centralized error handling
# - Dependency injection
from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import uvicorn
import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
from jose import JWTError, jwt
from datetime import datetime, timedelta
from collections import defaultdict
import logging
from typing import List
# Configuration
SECRET_KEY ="your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
RATE_LIMIT = 5  # requests
RATE_LIMIT_WINDOW = 60  # seconds

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Rate Limiting Middleware
class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        window_start = current_time - RATE_LIMIT_WINDOW
        self.requests[client_ip] = [
            timestamp for timestamp in self.requests[client_ip] if timestamp > window_start
        ]
        if len(self.requests[client_ip]) >= RATE_LIMIT:
            return JSONResponse(
                status_code=HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded"},
            )
        self.requests[client_ip].append(current_time)
        response = await call_next(request)
        return response
app.add_middleware(RateLimitMiddleware)
# Pydantic Models
class Token(BaseModel):
    access_token: str
    token_type: str
    class TokenData(BaseModel):
        username: Optional[str] = None
class User(BaseModel):
    username: str
    disabled: Optional[bool] = None


class Video(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: Optional[str] = "unpublished"
    uploaded_at: Optional[datetime] = None
# In-memory user store for demonstration
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "hashed_password": "fakehashedpassword",
        "disabled": False,
    }
}

# In-memory demo video store
demo_videos = [
    {
        "id": 1,
        "title": "Demo Movie 1",
        "description": "A sample demo movie",
        "status": "published",
        "uploaded_at": datetime.utcnow()
    },
    {
        "id": 2,
        "title": "Demo Series Episode 1",
        "description": "Pilot episode",
        "status": "published",
        "uploaded_at": datetime.utcnow()
    }
]
def verify_password(plain_password, hashed_password):
    return plain_password == hashed_password
def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return User(**user_dict)
    return None
def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user or not verify_password(password, db[username]["hashed_password"]):
        return False
    return user
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_admin(token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    # For demo: treat 'johndoe' as admin
    if user.username != "johndoe":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/signup")
async def signup(username: str, password: str):
    if username in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    fake_users_db[username] = {"username": username, "hashed_password": password, "disabled": False}
    return {"username": username}


@app.get("/videos", response_model=List[Video])
async def list_videos():
    return [Video(**v) for v in demo_videos if v.get("status") == "published"]


@app.get("/admin/videos", response_model=List[Video])
async def admin_list_videos(current_admin: User = Depends(get_current_admin)):
    return [Video(**v) for v in demo_videos]


@app.delete("/admin/videos/{video_id}")
async def admin_delete_video(video_id: int, current_admin: User = Depends(get_current_admin)):
    global demo_videos
    before = len(demo_videos)
    demo_videos = [v for v in demo_videos if v.get("id") != video_id]
    if len(demo_videos) == before:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"detail": "deleted"}
# Centralized Error Handling
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTP Exception: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1" , port=8000)    
    

@app.post("/admin/videos/upload")
async def admin_upload_video(title: str = Form(None), description: str = Form(None), file: UploadFile = File(None), current_admin: User = Depends(get_current_admin)):
    # Minimal demo: register an entry in demo_videos
    new_id = max((v.get("id", 0) for v in demo_videos), default=0) + 1
    demo_videos.append({
        "id": new_id,
        "title": title or f"Untitled {new_id}",
        "description": description,
        "status": "unpublished",
        "uploaded_at": datetime.utcnow()
    })
    return {"id": new_id, "title": title}
