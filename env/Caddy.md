---
title: "Caddy"
description: "Caddy 是一款用 Go 编写的现代 Web 服务器，最大特点是自动申请和续期 HTTPS 证书，无需手动配置 Let's Encrypt，本文介绍安装方法、Caddyfile 配置语法、反向代理到本地服务的设置方法以及静态文件托管与常见部署场景下的配置示例。"
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
