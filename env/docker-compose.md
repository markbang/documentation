---
title: "Docker Compose"
description: "Docker Compose orchestration guide using YAML to define services, networks, and volumes for one-command multi-container application deployment."
icon: "layer-group"
---
# Docker Compose

Docker Compose is a tool for defining and running multi-container Docker applications through YAML service definitions.

## Installation

Docker Desktop already includes Docker Compose.

### Standalone Linux installation
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# ValidationInstallation
docker-compose --version
```

## Basic commands

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# View服务State
docker-compose ps

# ViewLog
docker-compose logs -f

# 重启服务
docker-compose restart

# Build Image
docker-compose built

# 执行Command
docker-compose exec service_name bash
```

## docker-compose.yml syntax

### Basic Structure

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    restart: always

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

### Common configuration fields

- `image`: image to use
- `build`: builtConfiguration
- `ports`: Port Mapping
- `volumes`: volume mounts
- `environment`: Environment Variables
- `depends_on`: Dependencies
- `networks`: network configuration
- `restart`: restart policy
- `command`: override the default command

## Common service configurations

## MySQL

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql
    restart: always
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
      TZ: Asia/Shanghai
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/conf:/etc/mysql/conf.d
      - ./mysql/init:/docker-entrypoint-initdb.d
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --default-authentication-plugin=mysql_native_password

volumes:
  mysql_data:
```

## Redis

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf --appendonly yes
    environment:
      TZ: Asia/Shanghai

volumes:
  redis_data:
```

## PostgreSQL

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
      PGDATA: /var/lib/postgresql/data/pgdata
      TZ: Asia/Shanghai
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## MongoDB

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7
    container_name: mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      TZ: Asia/Shanghai
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Nginx

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./html:/usr/share/nginx/html
      - ./nginx/logs:/var/log/nginx
      - ./nginx/ssl:/etc/nginx/ssl
```

## Open WebUI

```yaml
version: '3.8'

services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: always
    ports:
      - "3000:8080"
    environment:
      OLLAMA_BASE_URL: http://host.docker.internal:11434
      WEBUI_SECRET_KEY: your-secret-key
    volumes:
      - open-webui:/app/backend/data
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  open-webui:
```

## Full web application stack

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web
    networks:
      - webnet

  web:
    built: .
    environment:
      DATABASE_URL: postgres://user:password@db:5432/mydb
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - webnet

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - webnet

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    networks:
      - webnet

networks:
  webnet:

volumes:
  postgres_data:
  redis_data:
```

## Environment Variablesfile

Create a `.env` file:

```env
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=mydb
REDIS_PASSWORD=redis_password
```

Use it in `docker-compose.yml` like this:

```yaml
services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
```

## Practical Tips

### View service logs

```bash
# View所有服务Log
docker-compose logs -f

# View特定服务Log
docker-compose logs -f web

# View最后100行
docker-compose logs --tail=100 web
```

### Scale services

```bash
# 启动3个web服务实例
docker-compose up -d --scale web=3
```

### Rebuild only a specific service

```bash
docker-compose up -d --build web
```

### Clean up resources

```bash
# 停止并Remove Container、网络
docker-compose down

# 同时Remove Volume
docker-compose down -v

# 同时Remove Image
docker-compose down --rmi all
```

## Best Practices

1. **Use `.env` files** for sensitive information.
2. **Use named volumes** for persistent data.
3. **Define networks** to isolate services.
4. **Set `restart: always`** when high availability matters.
5. **Use `depends_on`** to declare dependencies.
6. **Add health checks**.
7. **Use `deploy.resources`** to limit resources when appropriate.

## References

- [Docker Compose Official Docs](https://docs.docker.com/compose/)
- [Compose fileSpecification](https://docs.docker.com/compose/compose-file/)
- [Awesome Compose](https://github.com/docker/awesome-compose)