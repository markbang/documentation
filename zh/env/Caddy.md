---
title: "Caddy"
description: "Caddy 是一款用 Go 编写的现代化 Web 服务器与反向代理工具，最大特点是自动申请和续期 HTTPS 证书无需手动配置 Let's Encrypt，本文详细介绍 Linux 安装方法、Caddyfile 反向代理配置语法、静态文件托管以及常见生产环境部署场景下的配置示例与实践注意事项"
icon: "globe"
---

# Web 服务器

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

最简单的一个配置是这样的

```json
example.com {
    reverse_proxy localhost:port
}
```

只需要解析 DNS ip 为服务器地址即可，自动 https，非常简单
