---
title: "Anti-Scraping Techniques"
description: "Anti-scraping techniques covering User-Agent and Referer header spoofing, IP proxy rotation to avoid bans, and Ajax data extraction methods."
icon: "shield"
---

# Header parameters

In the `requests.get()` method, one of the most common anti-scraping-related arguments is `headers`. The usage is simple: pass `headers=a dictionary`. This dictionary stores request headers that help make a crawler look like a real browser instead of a bot.

```python
headers = {
  			'Referer': '具体's Referer',
            'User-Agent': '具体's user-agent',
    		'cookie':'具体's cookie'
    }
requests.get(url,headers=headers)
```

## User-Agent

Almost every crawler starts with the `User-Agent`. Most websites check it first. The easiest way to get one is to open the browser developer tools, inspect a network request, and copy the value. Since a `User-Agent` is usually just browser and system metadata, its main purpose is to make your request look like it came from a real user.

That is exactly why libraries like `my_fake_useragent` exist.

```python
from my_fake_useragent import UserAgent
headers = {'User-Agent': UserAgent(family='chrome').random()}
```

This gives you a randomized `User-Agent`, which is often more convenient and can bypass some basic UA checks.

## Cookie

Cookies are also very common in scraping. A cookie is essentially your identity on a site. Once the server sees your cookie, it can recognize the current session and return content tied to that identity.

## Referer

`Referer` is often related to anti-hotlinking. It tells the server which page the current request came from. In a path like `A -> B -> C`, the `Referer` for `C` is `B`. Many sites use this to check whether a request really originated from an expected page. If not, they may deny access or return fake data.

A typical example is video sites: direct requests to media URLs may fail unless the request appears to come from the site itself.

Here I use Douban as an example. If you are interested, you can explore it further yourself: [Link]().

## Content-type

`Content-type` determines how the server interprets the request body and how the client should interpret the response.

# Common parameters

In the browser developer tools, you will see many more headers than just the ones above. So how do you decide which ones are actually necessary?

For ordinary sites, adding a `User-Agent` is often enough. Sites that require login usually also need cookies. Other cases vary by site, so the practical approach is to test a few combinations. There is also a universal fallback: use **selenium** to simulate real browser behavior. It is more cumbersome to write, so it is usually best kept as the last resort.

# Ajax overview

Ajax stands for Asynchronous JavaScript and XML. The term was proposed by Jesse James Garrett in 2005 to describe a “new” way of using existing web technologies such as HTML/XHTML, CSS, JavaScript, DOM, XML, XSLT, and—most importantly—`XMLHttpRequest`.

The key idea is that a page can exchange small amounts of data with the server in the background. That allows part of the page to update without refreshing the entire page.

In practice, you do not need to master all the underlying theory. You just need to recognize what Ajax requests look like in the browser. Here is a simple example:

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

Simply put, Ajax sends a request to the server and then refreshes only the data that changed. For example, if you implemented product review pagination the traditional way, every page switch would fetch the header, sidebar, footer, and review area again. That wastes bandwidth, server resources, and user time. With Ajax pagination, only the review section needs to be fetched and re-rendered.

# How to identify and find Ajax requests

## Identify them

To determine whether a page is using Ajax, trigger the relevant action and watch whether the page fully reloads. If the page does not refresh but the data updates, the content is probably being fetched and rendered with Ajax. If the whole page reloads, the data is likely being generated server-side in the traditional way.

## How to find them

As mentioned above, Ajax still has to send a request to the server. That is your entry point. The request is usually either `GET` or `POST`, so a quick method is to inspect the fetched page source or scripts and search for `get` or `post`. Once you locate the Ajax function, look at where it sends the request, extract the `url`, and then mimic that request yourself to retrieve the data.

# Solutions

# Practical cases

I ran into this kind of situation while scraping a site. If you are interested, you can check it here: [Link]().

# IP anti-scraping mechanisms

# How to switch IPs

# How to get proxy IPs

## `proxy_pool` (free)

`proxy_pool` is a free and open-source proxy pool project on GitHub. Its basic idea is to crawl public proxy websites and aggregate usable IPs.

## Paid proxy providers

## Self-built proxy IPs
