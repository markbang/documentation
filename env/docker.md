---
title: "Docker"
description: "Docker containerization guide covering image building, container creation with port mapping, volume mounting for persistence, and CLI commands."
icon: "container-storage"
---
# Docker

Docker is an open-sourceapplication container engine，lets developers package apps and dependencies into portable containers。

## Installation

### Windows/Mac
Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Linux (Ubuntu)
```bash
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

## Basic Concepts

- **Image**: a read-only template containing the filesystem needed to run a container
- **Container**: a running instance of an image
- **Repository**: a place to store images, such as Docker Hub

## Common Commands

### Image Management

```bash
# Search Image
docker search nginx

# Pull Image
docker pull nginx:latest

# View Local Images
docker images

# Remove Image
docker rmi nginx:latest

# Build Image
docker built -t myapp:1.0 .

# Export Image
docker save -o nginx.tar nginx:latest

# Import Image
docker load -i nginx.tar
```

### Container Management

```bash
# Run容器
docker run -d --name mynginx -p 80:80 nginx

# Parameter Description：
# -d：后台Run
# --name：指定容器name
# -p：Port Mapping 宿主机端口:容器端口
# -v：挂载卷 宿主机路径:容器路径
# -e：设置Environment Variables
# --restart：重启Strategy（no/always/on-failure/unless-stopped）

# View Running Containers
docker ps

# View All Containers（Package括停止's ）
docker ps -a

# Stop Container
docker stop mynginx

# Start Container
docker start mynginx

# Restart Container
docker restart mynginx

# Remove Container
docker rm mynginx

# Force Remove Running Container
docker rm -f mynginx

# Enter Container
docker exec -it mynginx bash

# View Container Logs
docker logs -f mynginx

# View Container Details
docker inspect mynginx

# View Container Resource Usage
docker stats

# Copy File to Container
docker cp file.txt mynginx:/path/

# Copy File from Container
docker cp mynginx:/path/file.txt ./
```

### Volume Management

```bash
# Create Volume
docker volume create mydata

# View Volumes
docker volume ls

# View Volume Details
docker volume inspect mydata

# Remove Volume
docker volume rm mydata

# Clean Unused Volumes
docker volume prune
```

### Network Management

```bash
# View Networks
docker network ls

# Create Network
docker network create mynet

# Delete Network
docker network rm mynet

# Connect Container to Network
docker network connect mynet mynginx
```

## Dockerfile

A Dockerfile is a text file used to build an image.

### Basic Structure

```dockerfile
# 基础镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 设置Environment Variables
ENV PYTHONUNBUFFERED=1

# 复制file
COPY requirements.txt .

# 执行Command
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动Command
CMD ["python", "app.py"]
```

### Common directives

- FROM: specify the base image
- WORKDIR: set the working directory
- COPY: copy files into the image
- ADD: copy files, with support for URLs and automatic extraction
- RUN: execute commands during the build
- CMD: the default command run when the container starts
- ENTRYPOINT: the entry point, not replaced by normal `docker run` arguments
- ENV: set environment variables
- EXPOSE: declare ports
- VOLUME: define a data volume
- USER: specify the runtime user
- ARG：buildparameters

### Multi-stage Build

```dockerfile
# builtPhase
FROM node:18 AS builter
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run built

# RunPhase
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## .dockerignore

This works like `.gitignore`, excluding files that do not need to be copied into the image.

```
node_modules
.git
.env
*.log
__pycache__
.vscode
```

## Image Registry Mirror

### Configure image mirrors (Linux)

edit /etc/docker/daemon.json：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

Restart Docker:
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## Practical Tips

### Clean System

```bash
# 清理未使用's 容器、网络、镜像
docker system prune -a

# View磁盘占用
docker system df
```

### Auto-restart Containers

```bash
docker run -d --restart=always nginx
```

### Limit Resources

```bash
# 限制内存和CPU
docker run -d --memory="512m" --cpus="1.5" nginx
```

### View container IP

```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name
```

## Common deployment examples

### Nginx

```bash
docker run -d \
  --name nginx \
  -p 80:80 \
  -v /path/to/html:/usr/share/nginx/html \
  nginx:alpine
```

### MySQL

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

### Redis

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:alpine \
  redis-server --appendonly yes
```

### PostgreSQL

```bash
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16
```

## References

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)
