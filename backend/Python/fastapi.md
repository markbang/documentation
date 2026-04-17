---
title: "FastAPI"
description: "FastAPI is a modern, high-performance Python web framework with automatic API docs, async support, Pydantic type validation, and dependency injection."
icon: "bolt"
---

# FastAPI

FastAPI is a modern, high-performance Python web framework built on Python 3.6+ type hints. With over 70k+ stars on GitHub, it's one of the most popular Python backend frameworks today.

## Core Features

- **High Performance**: Performance comparable to Node.js and Go
- **Fast Development**: Improves development efficiency 200%-300%
- **Auto Docs**: Automatically generates interactive API documentation
- **Type Checking**: Pydantic-based data validation
- **Async Support**: Native async/await support

## Quick Start

### Installation

```bash
pip install fastapi
pip install "uvicorn[standard]"
```

### Hello World

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

### Running

```bash
uvicorn main:app --reload
```

Visit http://127.0.0.1:8000/docs to see the auto-generated API documentation.

## Path & Query Parameters

```python
from typing import Optional

@app.get("/users/{user_id}")
async def read_user(
    user_id: int,
    skip: int = 0,
    limit: int = 10,
    q: Optional[str] = None
):
    return {"user_id": user_id, "skip": skip, "limit": limit, "q": q}
```

## Request Body

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/items/")
async def create_item(item: Item):
    return item
```

## Response Model

```python
class UserOut(BaseModel):
    username: str
    email: str

@app.post("/users/", response_model=UserOut)
async def create_user(user: User):
    return user  # Automatically filters sensitive fields
```

## Dependency Injection

```python
from fastapi import Depends

def get_db():
    db = Database()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/")
async def read_users(db = Depends(get_db)):
    return db.query_users()
```

## Middleware

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Integration

### SQLAlchemy

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Authentication & Authorization

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    return {"token": token}
```

## File Upload

```python
from fastapi import File, UploadFile

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}
```

## Background Tasks

```python
from fastapi import BackgroundTasks

def send_email(email: str):
    # Send email logic
    pass

@app.post("/send-notification/")
async def send_notification(
    email: str,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(send_email, email)
    return {"message": "Email will be sent"}
```

## Resources

- Official Docs: https://fastapi.tiangolo.com/
- Chinese Docs: https://fastapi.tiangolo.com/zh/
- GitHub: https://github.com/tiangolo/fastapi