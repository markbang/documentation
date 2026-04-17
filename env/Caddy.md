---
title: "Caddy"
description: "Caddy is a modern Go web server with automatic HTTPS certificate management, covering Caddyfile syntax, reverse proxy setup, and file hosting."
icon: "globe"
---

# Web server

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

The simplest configuration looks like this:

```json
example.com {
    reverse_proxy localhost:port
}
```

Just point the domain's DNS record to your server IP. Caddy will handle HTTPS automatically, which makes the setup very straightforward.
