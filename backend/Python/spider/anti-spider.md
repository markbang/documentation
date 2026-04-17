---
title: "Anti-Scraping Techniques"
description: "Anti-scraping techniques covering User-Agent and Referer header spoofing, IP proxy rotation to avoid bans, and Ajax data extraction methods."
icon: "shield"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/backend/Python/spider/anti-spider.md)
</Note>


# Headers Parameters

in`requests.get()`method，后面有关反爬's parameters，where就有 headers，Usage也很简单，`headers=adictionary`这个dictionary用来储存一些parameters，伪造request headers来让网站认为is真人Visit，而不is机器人。

```python
headers = {
  			'Referer': '具体's Referer',
            'User-Agent': '具体's user-agent',
    		'cookie':'具体's cookie'
    }
requests.get(url,headers=headers)
```

## User-Agent

everyone is familiar with User-Agent，这is爬虫's 第一步，most websites check User-Agent，setting it is simple，就is打开开发者Tool，find and copy-paste from network requests。因为 User-Agent 一般都is固定's ，里面Package含's 只is一些浏览器型号之类's ，目's is确保你这个请求is真人，所以`my_fake_useragent`library was created accordingly。

```python
from my_fake_useragent import UserAgent
headers = {'User-Agent': UserAgent(family='chrome').random()}
```

this way randomizes User-Agent，more convenient and solves some UA anti-scraping。

## cookie

cookie everyone is familiar with this too，cookie 就is你in该网站上's 身份信息，show your cookie，服务器就会知道这is你，then provides related services。

## Referer

Referer related to anti-hotlinking(anti-hotlinking：trace source，当前本次请求's 上一级is谁 A ->B ->C )添加 Referer 就is确定is不is根据它所要's 网站跳转到请求网站's ，如果不is，then deny access。for example一些视频网站's 视频网址，如果不is从视频网站跳转过去，大部分可能就is拒绝请求或者返回a假响应。

这里我会拿豆瓣做a实例解析，interested can check it out，[Link]()。

## Content-type

Content-type is

# Common Parameters

in browser developer mode，我们不光只看到前面所提到's 那几个parameters，还有很多很多其它's parameters，那具体's a网站我怎么知道要添加哪些parameters呢？

普通网站一般添加a User-Agent 就行了，sites requiring account info add cookie，other cases are rare，遇到is都试一试就行。（这里还有a万能Method，yes，就is用**selenium**Simulation，but writing it is more troublesome）所以建议还is先试试能不能行，**selenium**as last resort。

# Ajax 介绍

Ajax 即 Asynchronous Javascript And XML（Asynchronous JavaScript and XML）in 2005 年被 Jesse James Garrett 提出's 新术语，用来Description一种使用现有Technologyset's ‘新’Method，Package括: HTML 或 XHTML, CSS, JavaScript, DOM, XML, XSLT, 以及最重要's  XMLHttpRequest。**by exchanging small amounts of data with server in background，Ajax can make pages update asynchronously，meaning without reloading the entire page，can update part of the page。**

当然，Ajax 原理我们不需要知道，只需要了解它's 形式，能in网页中找到就行，下面isa简单's  Ajax 示例：

```html
<html>
  <head>
    <title>Ajax</title>
    <script type="text/javascript">
      function loadXMLDoc() {
        var xmlHttp;
        if (window.XMLHttpRequest) {
          // code for IE7+
          xmlHttp = new XMLHttpRequest();
        } else {
          // code for IE5/IE6
          xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            document.getElementById('myDiv').innerHTML = xmlHttp.responseText;
          }
        };

        // get
        xmlHttp.open('GET', 'Ajax.aspx', true);
        xmlHttp.send();
      }
    </script>
  </head>
  <body>
    <h3>ajax</h3>
    <button type="button" onclick="loadXMLDoc()">请求数据</button>
    <div id="myDiv"></div>
  </body>
</html>
```

simply put，就is向服务器send数据请求，then reloads the data。for example：如果我们通过“traditional approach”Implementation上图's product review pagination，each pagination re-fetches header, sidebar, footer from server，extra waste of bandwidth, server resources, and user wait time。if using ajax for no-refresh pagination，each time only fetches from server“product review area”info only，saves resources accordingly。so ajax no-refresh pagination has its necessity。

# 判断、查找Method

## 判断

判断网页数据is否使用 Ajax，check after triggering events，判断网页is否发生刷新State。if page doesn't refresh，数据就automatically generates，Description数据's 加载is通过 Ajax generates并渲染到网页上's ；otherwise，数据is通过服务器后台generates并加载's 。

## 查找Method

使用 Ajax Method，as mentioned above，会向服务器send请求，那我们就根据这个Features来破招。send请求，要么is`get`要么is`post`then in the fetched web source`Ctrl+F`search for`get、post`then quickly locate the Ajax function（if you have better methods，welcome to share in comments），观察它is向哪里send请求，then get`url`后，我们模仿给服务器send请求，then get the data。

# Solutions

# Practical Cases

I encountered this typical case when scraping a website，感兴趣's 可以点击[Link]()前往。

# IP Anti-Scraping Mechanisms

# How to Switch IP

# How to Get IP Proxies

## proxy_pool(free)

proxy_pool is GitHub 上's afree & open-source's  IP proxy pool创建，原理is爬取各大 IP Proxy网站上

## IP proxy provider(Paid)

## Self-built IP Proxy
