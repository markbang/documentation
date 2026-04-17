---
title: "Xizhi"
description: "Notification push services including Server酱 for WeChat alerts, with API setup, Python requests integration, and Markdown message delivery."
icon: "bell"
---

# Message push services

Message push services deliver notifications, alerts, and other information to different devices in real time. They are commonly used for monitoring alerts, scheduled reminders, and system notifications.

## ServerChan

[ServerChan](https://sct.ftqq.com/) is a free WeChat notification service.

### Features
- 📱 Pushes to WeChat
- 🆓 Generous free quota
- 🔧 Simple to use
- 📊 Supports Markdown

### Usage

1. Visit the [ServerChan website](https://sct.ftqq.com/) and sign in.
2. Bind your WeChat account by scanning the QR code.
3. Get your `SendKey`.

```python
import requests

def send_wechat(title, content):
    sendkey = "YOUR_SENDKEY"
    url = f"https://sctapi.ftqq.com/{sendkey}.send"
    
    data = {
        "title": title,
        "desp": content
    }
    
    response = requests.post(url, data=data)
    return response.json()

# 使用
send_wechat("Testingtitle", "这isTesting内容\nsupports **Markdown**")
```

```bash
# curl 方式
curl -X POST "https://sctapi.ftqq.com/YOUR_SENDKEY.send" \
  -d "title=Testingtitle" \
  -d "desp=Testing内容"
```

### Use cases
- Server monitoring alerts
- Scheduled task notifications
- Spider completion reminders
- CI/CD build notifications

## Bark

[Bark](https://github.com/Finb/Bark) is an open-source iOS push notification app.

### Features
- 📱 iOS only
- 🔓 Free and open-source
- 🔔 Supports custom sounds
- 🎨 Supports icons and grouping
- 🔐 End-to-end encryption

### Installation
Search for Bark in the App Store and install it.

### Usage

After getting the push address:

```python
import requests

def send_bark(title, content):
    url = "https://api.day.app/YOUR_KEY/"
    
    data = {
        "title": title,
        "body": content,
        "sound": "alarm",  # 铃声
        "icon": "https://example.com/icon.png",  # Icons
        "group": "test"  # Grouping
    }
    
    response = requests.post(url, json=data)
    return response.json()

# 使用
send_bark("Testingtitle", "这isTesting内容")
```

```bash
# GET 方式
curl "https://api.day.app/YOUR_KEY/title/内容"

# POST 方式
curl -X POST "https://api.day.app/YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"title","body":"内容","sound":"alarm"}'
```

### Advanced features

```python
# with redirect link
send_bark("点击跳转", "内容", url="https://example.com")

# auto-copy content
send_bark("自动复制", "需要复制's 内容", automaticallyCopy=1)

# 时效性Notification
send_bark("重要Notification", "内容", level="timeSensitive")
```

## [Telegram Bot](https://core.telegram.org/bots)

The Telegram Bot API is a powerful way to send notifications.

### Create a bot

1. Search for `@BotFather` in Telegram.
2. Send `/newbot` to create a bot.
3. Get the bot token.
4. Send `/getid` to `@userinfobot` to get your chat ID.

### Usage

```python
import requests

class TelegramBot:
    def __init__(self, token, chat_id):
        self.token = token
        self.chat_id = chat_id
        self.api_url = f"https://api.telegram.org/bot{token}"
    
    def send_message(self, text, parse_mode="Markdown"):
        url = f"{self.api_url}/sendMessage"
        data = {
            "chat_id": self.chat_id,
            "text": text,
            "parse_mode": parse_mode
        }
        return requests.post(url, json=data).json()
    
    def send_photo(self, photo_url, caption=""):
        url = f"{self.api_url}/sendPhoto"
        data = {
            "chat_id": self.chat_id,
            "photo": photo_url,
            "caption": caption
        }
        return requests.post(url, json=data).json()
    
    def send_document(self, file_path):
        url = f"{self.api_url}/sendDocument"
        with open(file_path, 'rb') as f:
            files = {'document': f}
            data = {'chat_id': self.chat_id}
            return requests.post(url, data=data, files=files).json()

# 使用
bot = TelegramBot("YOUR_BOT_TOKEN", "YOUR_CHAT_ID")
bot.send_message("**粗体** _斜体_ `代码`")
```

```bash
# curl 方式
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage" \
  -d "chat_id=YOUR_CHAT_ID" \
  -d "text=Hello World"
```

### Advanced features

```python
# send带Button's Message
def send_with_buttons(bot, text, buttons):
    url = f"{bot.api_url}/sendMessage"
    keyboard = {
        "inline_keyboard": [
            [{"text": btn["text"], "url": btn["url"]} for btn in row]
            for row in buttons
        ]
    }
    data = {
        "chat_id": bot.chat_id,
        "text": text,
        "reply_markup": keyboard
    }
    return requests.post(url, json=data).json()

# 使用
buttons = [
    [{"text": "Visit网站", "url": "https://example.com"}],
    [{"text": "GitHub", "url": "https://github.com"}]
]
send_with_buttons(bot, "选择aOperation：", buttons)
```

## [Xizhi](https://xz.qqoq.net)

Xizhi is an aggregated push platform that supports multiple notification channels.

### Features
- 🔗 Aggregates multiple push methods
- 📱 Supports iOS, Android, and Web
- 🆓 Free to use
- 🔔 Supports different message types

### Supported push methods
- iOS/Android app
- WeCom
- DingTalk
- Feishu
- Email
- Webhook

### Usage

1. Register and create an app.
2. Get the push URL.

```python
import requests

def send_xizhi(title, content, url=""):
    api_url = "YOUR_XIZHI_URL"
    
    data = {
        "title": title,
        "content": content,
        "url": url
    }
    
    response = requests.post(api_url, json=data)
    return response.json()

# 使用
send_xizhi(
    "Notificationtitle",
    "Notification内容",
    "https://example.com"
)
```

## Comparison

| Service | Platform | Free | Strength | Suitable scenarios |
|------|------|------|------|---------|
| **ServerChan** | WeChat | ✅ | Simple and convenient | Domestic users, WeChat notifications |
| **Bark** | iOS | ✅ | Open-source and privacy-friendly | iOS users |
| **Telegram** | Cross-platform | ✅ | Very powerful | International users who can access Telegram |
| **Xizhi** | Cross-platform | ✅ | Multi-channel aggregation | Enterprise or multi-channel use |

## Comprehensive example

```python
class NotificationManager:
    """统一's MessagePush管理器"""
    
    def __init__(self):
        self.server_chan_key = "YOUR_SENDKEY"
        self.bark_url = "https://api.day.app/YOUR_KEY"
        self.telegram_bot = TelegramBot("TOKEN", "CHAT_ID")
    
    def send(self, title, content, channels=None):
        """Send to Multiple Channels"""
        if channels is None:
            channels = ['all']
        
        results = {}
        
        if 'all' in channels or 'wechat' in channels:
            results['wechat'] = self._send_wechat(title, content)
        
        if 'all' in channels or 'bark' in channels:
            results['bark'] = self._send_bark(title, content)
        
        if 'all' in channels or 'telegram' in channels:
            results['telegram'] = self._send_telegram(title, content)
        
        return results
    
    def _send_wechat(self, title, content):
        url = f"https://sctapi.ftqq.com/{self.server_chan_key}.send"
        return requests.post(url, data={"title": title, "desp": content})
    
    def _send_bark(self, title, content):
        return requests.post(self.bark_url, json={"title": title, "body": content})
    
    def _send_telegram(self, title, content):
        return self.telegram_bot.send_message(f"*{title}*\n\n{content}")

# 使用
notifier = NotificationManager()
notifier.send("系统告警", "CPU 使用率超过 90%", channels=['wechat', 'telegram'])
```

## Best practices

1. **Choose the right service** for your audience and scenario.
2. **Handle exceptions** because push requests can fail.
3. **Respect rate limits** to avoid notification spam.
4. **Avoid sending sensitive information** whenever possible.
5. **Use multi-channel backup** for important alerts.
6. **Separate regular notifications from urgent alerts**.

## Use cases

- 📊 **Monitoring alerts**: servers and application performance
- ⏰ **Scheduled reminders**: daily reports and timed tasks
- 🔔 **Event notifications**: user registration or order changes
- 🐛 **Error reporting**: exceptions and bug alerts
- 📈 **Data reports**: daily or weekly summaries
- 🤖 **Automation notifications**: CI/CD and spider completion

## References

- [ServerChan documentation](https://sct.ftqq.com/sendkey)
- [Bark GitHub](https://github.com/Finb/Bark)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Xizhi website](https://xz.qqoq.net)
