from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# model
class User(BaseModel):
    name: str
    email: str
    password: str

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.post("/signup")
def signup(user: User):
    return {
        "message": "User created successfully",
        "user": user
    }