---
title: "Supervisor"
description: "Supervisor is a Linux process manager for running and auto-restarting background services, covering installation, config files, and CLI usage."
icon: "eye"
---
# Supervisor process management

Supervisor is a Python-based process management tool for monitoring and controlling Unix/Linux processes on a system.

[Detailed tutorial blog post](https://bangwu.top/posts/supervisor)

## Overview

Supervisor can:
- start, stop, and restart processes automatically
- monitor process status and restart crashed processes automatically
- provide a web management interface
- record process output logs
- manage processes in groups

## Installation

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install supervisor
```

### CentOS/RHEL
```bash
sudo yum install supervisor
```

### Python pip
```bash
pip install supervisor
```

## Configuration File

Main configuration file location:
- Ubuntu: `/etc/supervisor/supervisord.conf`
- Per-program config files: `/etc/supervisor/conf.d/*.conf`

### Basic configuration structure

```ini
[program:myapp]
command=/usr/bin/python /path/to/app.py    ; 启动Command
directory=/path/to/                        ; 工作目录
user=www-data                              ; Run用户
autostart=true                             ; 随supervisor启动
autorestart=true                           ; 自动重启
startsecs=10                               ; 启动10秒后无Exception才认为成功
startretries=3                             ; 失败重试次数
redirect_stderr=true                       ; redirectError输出
stdout_logfile=/var/log/myapp.log         ; Logfile
stdout_logfile_maxbytes=50MB               ; Logfile大小
stdout_logfile_backups=10                  ; LogBackup数量
environment=PATH="/usr/local/bin"          ; Environment Variables
```

## Common Commands

### Manage the Supervisor service

```bash
# 启动 supervisor
sudo systemctl start supervisor

# 停止 supervisor
sudo systemctl stop supervisor

# 重启 supervisor
sudo systemctl restart supervisor

# ViewState
sudo systemctl status supervisor

# 开机自启
sudo systemctl enable supervisor
```

### Manage processes

```bash
# 重新加载Configuration
sudo supervisorctl reread
sudo supervisorctl update

# 启动程序
sudo supervisorctl start myapp

# 停止程序
sudo supervisorctl stop myapp

# 重启程序
sudo supervisorctl restart myapp

# View所有程序State
sudo supervisorctl status

# View特定程序State
sudo supervisorctl status myapp

# 启动所有程序
sudo supervisorctl start all

# 停止所有程序
sudo supervisorctl stop all

# 重启所有程序
sudo supervisorctl restart all

# ViewLog
sudo supervisorctl tail myapp
sudo supervisorctl tail -f myapp  # 实时View

# 清空Log
sudo supervisorctl clear myapp
```

## Configuration examples

### Python web app

```ini
[program:flask_app]
command=/usr/bin/python3 /home/user/app/run.py
directory=/home/user/app
user=www-data
autostart=true
autorestart=true
startsecs=5
startretries=3
redirect_stderr=true
stdout_logfile=/var/log/supervisor/flask_app.log
environment=FLASK_ENV="production",SECRET_KEY="your-secret"
```

### Node.js app

```ini
[program:nodejs_app]
command=/usr/bin/node /home/user/app/server.js
directory=/home/user/app
user=nodejs
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/nodejs_app.log
environment=NODE_ENV="production"
```

### Celery Worker

```ini
[program:celery_worker]
command=/home/user/venv/bin/celery -A myapp worker --loglevel=info
directory=/home/user/myapp
user=celery
numprocs=1
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=600
stopasgroup=true
killasgroup=true
redirect_stderr=true
stdout_logfile=/var/log/celery/worker.log
```

### Process groups

```ini
[group:myproject]
programs=web,worker,beat
priority=999

[program:web]
command=/usr/bin/gunicorn myapp:app
...

[program:worker]
command=/usr/bin/celery worker
...

[program:beat]
command=/usr/bin/celery beat
...
```

## Web interface

Enable the web management interface:

```ini
[inet_http_server]
port=127.0.0.1:9001
username=admin
password=password
```

Visit：http://localhost:9001

## Environment Variables

```ini
[program:myapp]
command=/usr/bin/python app.py
environment=
    PATH="/usr/local/bin",
    DATABASE_URL="postgresql://localhost/db",
    SECRET_KEY="secret"
```

## Log Management

```ini
[program:myapp]
stdout_logfile=/var/log/myapp/stdout.log
stdout_logfile_maxbytes=50MB        ; 单个file最大50MB
stdout_logfile_backups=10           ; 保留10个Backup
stderr_logfile=/var/log/myapp/stderr.log
stderr_logfile_maxbytes=50MB
stderr_logfile_backups=10
```

## Graceful shutdown

```ini
[program:myapp]
stopsignal=TERM                     ; 停止信号
stopwaitsecs=10                     ; 等待10秒后强制杀死
stopasgroup=true                    ; 停止整个进程组
killasgroup=true                    ; 杀死整个进程组
```

## Multi-process management

```ini
[program:worker]
command=/usr/bin/python worker.py
process_name=%(program_name)s_%(process_num)02d
numprocs=4                          ; 启动4个进程
autostart=true
autorestart=true
```

## Troubleshooting

### ViewLog

```bash
# supervisor 主Log
sudo tail -f /var/log/supervisor/supervisord.log

# 程序Log
sudo tail -f /var/log/supervisor/myapp.log

# 使用 supervisorctl View
sudo supervisorctl tail -f myapp
```

### FAQ

1. **Process fails to start**
   - Check whether the command path is correct
   - Check user permissions
   - ViewLogfile

2. **Process restarts too often**
   - Increase the `startsecs` value
   - Check whether the program itself has an issue

3. **Configuration does not take effect**
   ```bash
   sudo supervisorctl reread
   sudo supervisorctl update
   ```

## Best Practices

1. **Separate config files**: use one config file per program.
2. **Set reasonable log sizes** to avoid filling up the disk.
3. **Use dedicated users** for better security.
4. **Use process groups** for easier batch management.
5. **Use environment variables** to separate config from code.
6. **Add alerting** by integrating with monitoring systems.
7. **Back up configurations regularly** and keep them under version control.

## Alternatives

- **systemd**: Linux service management
- **PM2**: Node.js process manager
- **circus**: Python process management
- **monit**: system monitoring and process management

## References

- [Supervisor Official Docs](http://supervisord.org/)
- [Configuration file reference](http://supervisord.org/configuration.html)
- [Detailed blog tutorial](https://bangwu.top/posts/supervisor)