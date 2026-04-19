---
title: "常用库"
description: "Python 第三方库学习笔记与使用指南入口页，整理了 httpx 异步 HTTP 客户端、matplotlib 数据绑图、PyTorch 深度学习、WordCloud 词云生成与 PyAutoGUI 桌面自动化等常用库的安装配置与核心 API 用法，附资源索引链接。"
icon: "cubes"
---

第三方库是 Python 生态的核心优势。Python 标准库随安装自带，第三方库需要通过 `pip` 安装，调用方式统一使用 `import` 语句。

## 学习方法

不需要刻意记忆所有库的使用方法，熟练使用常用的即可（如 `numpy`、`pandas` 处理数据，`re`、`BeautifulSoup` 提取数据）。其他库跟着官方文档学一遍，知道能干什么就行，用到的时候翻笔记。

<Tip icon="lightbulb" title="盖房子的比喻">
库就像盖房子的砖块——使用时需要了解材料构造吗？只要会用就行了。
</Tip>

<Warning icon="triangle-exclamation" title="不要只看博客">
第三方库学习首推官方文档，比较全面。其他博主的教学可以作为补充，但官方文档才是最权威的来源。
</Warning>

## 功能对应的库

GitHub 大佬早就整理好了，[awesome-python-cn](https://github.com/jobbole/awesome-python-cn) star 数 26k+，按功能分类非常全。

<CardGroup cols={3}>

<Card title="httpx" icon="bolt" href="/zh/backend/Python/libs/httpx">
新一代 HTTP 客户端，支持异步请求。
</Card>

<Card title="matplotlib" icon="chart-bar" href="/zh/backend/Python/libs/matplotlib">
数据可视化与图表绘制。
</Card>

<Card title="wordcloud" icon="cloud" href="/zh/backend/Python/libs/wordcloud">
词云生成与文本可视化。
</Card>

<Card title="PyTorch" icon="microchip" href="/zh/backend/Python/libs/PyTorch">
深度学习框架入门笔记。
</Card>

<Card title="Python 笔记" icon="notebook" href="/zh/backend/Python/libs/python-notes">
杂项笔记与常见用法记录。
</Card>

<Card title="数据类型" icon="list" href="/zh/backend/Python/libs/data-types">
Python 数据类型详解与操作。
</Card>

<Card title="pyautogui" icon="robot" href="/zh/backend/Python/libs/pyautogui">
自动化脚本与 GUI 操作。
</Card>

</CardGroup>