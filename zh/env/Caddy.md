---
title: "Caddy"
description: "Caddy 是自动 HTTPS 的现代 Web 服务器，本文介绍安装方法、Caddyfile 配置语法、反向代理设置与静态文件托管部署示例。"
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
