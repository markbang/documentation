---
title: "Python"
description: "Python 后端开发技术整理入口页，涵盖 FastAPI 现代高性能 Web 框架（路由定义、依赖注入、中间件与认证机制）、爬虫技术（requests 请求、数据解析与反爬应对策略）以及 httpx/matplotlib/PyTorch 等第三方库使用指南，包含框架入门代码示例与各子页面快速导航。"
icon: "python"
---

![Python](https://cdn.bangwu.top/img/Python.png)

Python 是一门简洁优雅的编程语言，广泛应用于 Web 开发、数据分析、人工智能等领域。

## 后端框架

### FastAPI

现代、高性能的 Python Web 意见框架，支持异步处理和自动生成 API 文档。

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

<Card title="FastAPI 详解" icon="bolt" href="/zh/backend/Python/fastapi">
路由参数、请求体、依赖注入、中间件与认证等核心用法。
</Card>

### Flask

轻量级 Web 框架，适合快速开发小型应用。

### Django

全功能 Web 框架，内置 ORM、后台管理等。

## 爬虫开发

<Card title="爬虫专栏" icon="spider" href="/zh/backend/Python/spider/index">
从基础到进阶，反爬策略与实战案例。
</Card>

## 常用库

<Card title="常用库索引" icon="cubes" href="/zh/backend/Python/libs/index">
httpx、matplotlib、wordcloud、PyTorch 等库的使用笔记。
</Card>

## 学习资源

- [Python 官方文档](https://docs.python.org/zh-cn/3/)
- [PyPI 包索引](https://pypi.org/)