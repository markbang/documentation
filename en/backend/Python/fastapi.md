---
title: "FastAPI"
description: "FastAPI is a modern high-performance Python web framework with async support, automatic API docs, Pydantic validation, and type-hint workflow."
icon: "bolt"
---


# FastAPI

FastAPI isa现代、High Performance的 Python Web Framework，基于 Python 3.6+ 的Type Hintsbuild。has over 70k+ stars on GitHub，is目前the most popular Python Backend Frameworks之一。

## Core Features

- **High Performance**: performance comparable to Node.js and Go
- **Fast Development**: improve development efficiency 200%-300%
- **Auto Docs**: 自动generates交互式 API Documentation
- **Type Checking**: Pydantic-based data validation
- **异步supports**: 原生supports async/await

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

### 运行

```bash
uvicorn main:app --reload
```

访问 http://127.0.0.1:8000/docs 查看自动generates的 API Documentation。

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
    return user  # 自动Filtering敏感字段
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
    # send邮件逻辑
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
- Chinese localeDocumentation: https://fastapi.tiangolo.com/zh/
- GitHub: https://github.com/tiangolo/fastapi
