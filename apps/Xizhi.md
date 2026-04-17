---
title: "Xizhi"
description: "Notification push services including Server酱 for WeChat alerts, with API setup, Python requests integration, and Markdown message delivery."
icon: "bell"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/apps/Xizhi.md)
</Note>


# MessagePush服务

MessagePush服务用于将Notification、alerts and other info to various terminals in real-time，commonly used for monitoring alerts、scheduled reminders、系统Notification等场景。

## Server 酱

[Server酱](https://sct.ftqq.com/) isafree的微信MessagePush服务。

### 特点
- 📱 push to WeChat
- 🆓 free额度充足
- 🔧 simple and easy to use
- 📊 supports Markdown

### Usage

1. 访问 [Server酱官网](https://sct.ftqq.com/) 登录
2. 扫码绑定微信
3. 获取 SendKey

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

### Use Cases
- Server Monitoring Alerts
- 定时TaskNotification
- 爬虫完成提醒
- CI/CD buildNotification

## Bark

[Bark](https://github.com/Finb/Bark) is一款open-source的 iOS MessagePush应用。

### 特点
- 📱 仅supports iOS
- 🔓 free & open-source
- 🔔 supports自Definition铃声
- 🎨 supportsIcons和Grouping
- 🔐 end-to-end encryption

### Installation
in App Store search forDownload Bark

### Usage

after getting the push address：

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

### 进阶功能

```python
# with redirect link
send_bark("点击跳转", "内容", url="https://example.com")

# auto-copy content
send_bark("自动复制", "需要复制的内容", automaticallyCopy=1)

# 时效性Notification
send_bark("重要Notification", "内容", level="timeSensitive")
```

## [Telegram Bot](https://core.telegram.org/bots)

Telegram Bot API is功能强大的MessagePush方式。

### Create Bot

1. in Telegram search for `@BotFather`
2. send `/newbot` Create Bot
3. get Bot Token
4. send `/getid` 给 `@userinfobot` get Chat ID

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

### Advanced Features

```python
# send带Button的Message
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
    [{"text": "访问网站", "url": "https://example.com"}],
    [{"text": "GitHub", "url": "https://github.com"}]
]
send_with_buttons(bot, "选择aOperation：", buttons)
```

## [息知](https://xz.qqoq.net)

息知isaaggregated push platform，supports多种Push方式。

### 特点
- 🔗 aggregates multiple push methods
- 📱 supports iOS、Android、Web
- 🆓 free使用
- 🔔 supports多种Message类型

### Supported Push Methods
- iOS/Android App
- 企业微信
- 钉钉
- 飞书
- 邮件
- Webhook

### Usage

1. 注册并创建应用
2. 获取Push地址

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

| 服务 | Platform | free | 特点 | Applicable Scenarios |
|------|------|------|------|---------|
| **Server酱** | 微信 | ✅ | simple and easy to use | 国内用户，微信Notification |
| **Bark** | iOS | ✅ | open-source，隐私 | iOS 用户 |
| **Telegram** | cross-platform | ✅ | 功能强大 | 国际用户，需要翻墙 |
| **息知** | cross-platform | ✅ | 多渠道Aggregation | 企业应用 |

## Comprehensive Example

```python
class NotificationManager:
    """统一的MessagePush管理器"""
    
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

## Best Practices

1. **Choose the Right Service**：根据用户群体和使用场景
2. **Exception Handling**：Push可能失败，需要捕获Exception
3. **Rate Limits**：避免频繁Push造成骚扰
4. **Sensitive Info**：注意不要Push敏感数据
5. **Multi-channel Backup**：重要Notification使用多个渠道
6. **Tiered Notifications**：区分普通Notification和紧急告警

## Use Cases

- 📊 **监控告警**：服务器、应用性能监控
- ⏰ **scheduled reminders**：每日报表、定时Task
- 🔔 **EventNotification**：用户注册、订单变更
- 🐛 **Error Reports**：系统Exception、bug Notification
- 📈 **Data Reports**：日报、周报Push
- 🤖 **自动化Notification**：CI/CD、爬虫完成

## References

- [Server酱Documentation](https://sct.ftqq.com/sendkey)
- [Bark GitHub](https://github.com/Finb/Bark)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [息知官网](https://xz.qqoq.net)