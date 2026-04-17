---
title: "Python"
description: "Python backend development hub covering FastAPI framework, web scraping with requests and BeautifulSoup, and popular third-party libraries."
icon: "python"
---

![Python](https://cdn.bangwu.top/img/Python.png)

Python is a concise and elegant programming language widely used in web development, data analysis, and AI.

## Backend Frameworks

### FastAPI

A modern, high-performance Python web framework with async support and auto-generated API docs.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

<Card title="FastAPI Details" icon="bolt" href="/en/backend/Python/fastapi">
Route params, request bodies, dependency injection, middleware, and auth.
</Card>

### Flask

A lightweight web framework for quick prototyping of small applications.

### Django

A full-stack web framework with built-in ORM, admin panel, and more.

## Web Scraping

<Card title="Scraping Guide" icon="spider" href="/en/backend/Python/spider/index">
From basics to advanced techniques, anti-scraping strategies and real cases.
</Card>

## Popular Libraries

<Card title="Library Index" icon="cubes" href="/en/backend/Python/libs/index">
Notes on httpx, matplotlib, wordcloud, PyTorch, and more.
</Card>

## Resources

- [Python Official Docs](https://docs.python.org/3/)
- [PyPI Package Index](https://pypi.org/)