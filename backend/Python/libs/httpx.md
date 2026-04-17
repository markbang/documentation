---
title: "HTTPX"
description: "HTTPX is a modern Python HTTP client replacing requests, with sync and async APIs, native HTTP/2 support, connection pooling, and timeout control."
icon: "globe"
---

# HTTPX

HTTPX is a full-featured Python HTTP client library with both synchronous and asynchronous APIs. It is often treated as the modern alternative to `requests`.

## Features

- **Sync and async APIs**: one consistent interface for both styles
- **HTTP/2 support**: better performance where supported
- **Connection pooling**: automatic connection reuse
- **Timeout control**: fine-grained timeout settings
- **Type hints**: complete type annotations

## Installation

```bash
pip install httpx
```

## Synchronous requests

### Basic usage

```python
import httpx

# GET 请求
response = httpx.get('https://api.example.com/data')
print(response.status_code)
print(response.json())

# POST 请求
data = {'key': 'value'}
response = httpx.post('https://api.example.com/submit', json=data)

# 带Parameters's 请求
params = {'page': 1, 'size': 10}
response = httpx.get('https://api.example.com/items', params=params)

# 带请求头
headers = {'Authorization': 'Bearer token'}
response = httpx.get('https://api.example.com/user', headers=headers)
```

### Using `Client`

```python
# 复用连接
with httpx.Client() as client:
    r1 = client.get('https://example.com')
    r2 = client.get('https://example.com/api')
```

## Asynchronous requests

### Basic usage

```python
import httpx
import asyncio

async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get('https://api.example.com/data')
        return response.json()

# Run
data = asyncio.run(fetch_data())
```

### Concurrent requests

```python
async def fetch_multiple():
    async with httpx.AsyncClient() as client:
        tasks = [
            client.get(f'https://api.example.com/item/{i}')
            for i in range(10)
        ]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]
```

## Advanced features

### Timeout settings

```python
# 全局超时
timeout = httpx.Timeout(10.0, connect=5.0)
response = httpx.get('https://example.com', timeout=timeout)

# 单独设置
response = httpx.get('https://example.com', timeout=30.0)
```

### Authentication

```python
# Basic Auth
auth = ('username', 'password')
response = httpx.get('https://api.example.com', auth=auth)

# Bearer Token
headers = {'Authorization': f'Bearer {token}'}
response = httpx.get('https://api.example.com', headers=headers)
```

### File uploads

```python
files = {'file': open('report.pdf', 'rb')}
response = httpx.post('https://api.example.com/upload', files=files)

# 多文件
files = [
    ('images', ('image1.jpg', open('image1.jpg', 'rb'), 'image/jpeg')),
    ('images', ('image2.jpg', open('image2.jpg', 'rb'), 'image/jpeg'))
]
response = httpx.post('https://api.example.com/upload', files=files)
```

### Streaming downloads

```python
with httpx.stream('GET', 'https://example.com/large-file.zip') as r:
    with open('file.zip', 'wb') as f:
        for chunk in r.iter_bytes():
            f.write(chunk)
```

### Cookie management

```python
cookies = {'session_id': 'abc123'}
response = httpx.get('https://example.com', cookies=cookies)

# 持久化 cookies
with httpx.Client(cookies=cookies) as client:
    client.get('https://example.com/page1')
    client.get('https://example.com/page2')
```

### Proxy settings

```python
proxies = {
    'http://': 'http://proxy.example.com:8080',
    'https://': 'http://proxy.example.com:8080'
}
response = httpx.get('https://example.com', proxies=proxies)
```

### Retry handling

```python
import httpx
from httpx import Timeout

transport = httpx.HTTPTransport(retries=3)
client = httpx.Client(transport=transport)
response = client.get('https://example.com')
```

## Response handling

```python
response = httpx.get('https://api.example.com/data')

# 状态码
print(response.status_code)

# JSON 数据
data = response.json()

# 文本内容
text = response.text

# 二进制内容
content = response.content

# 响应头
print(response.headers['content-type'])

# 检查状态
response.raise_for_status()  # 4xx/5xx 抛出异常
```

## Compared with `requests`

| Feature | requests | httpx |
|------|----------|-------|
| Synchronous requests | ✅ | ✅ |
| Asynchronous requests | ❌ | ✅ |
| HTTP/2 | ❌ | ✅ |
| Type hints | Partial | Complete |
| Maintenance status | Active | Active |

## Best practices

1. **Reuse connections with `Client`** for better performance.
2. **Set sensible timeouts** to avoid hanging requests.
3. **Prefer async in high-concurrency scenarios**.
4. **Handle errors explicitly** and retry where appropriate.

```python
import httpx

async def safe_fetch(url: str, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(2 ** attempt)
```

## References

- Official docs: https://www.python-httpx.org/
- GitHub: https://github.com/encode/httpx
