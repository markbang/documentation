---
title: "Caddy"
description: "Caddy is a modern Go web server with automatic HTTPS certificate management, covering Caddyfile syntax, reverse proxy setup, and file hosting."
icon: "globe"
---
<Note icon="language" title="Original Chinese Content">
This page contains content originally written in Chinese. Some technical terms and explanations are best understood in their original language. [View Chinese version →](/zh/env/Caddy.md)
</Note>


# Web 服务器

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

最简单's aConfigurationis这样's 

```json
example.com {
    reverse_proxy localhost:port
}
```

只需要解析 DNS ip 为服务器地址即可，自动 https，非常简单
