---
title: "PyAutoGUI"
description: "PyAutoGUI is a Python GUI automation library for controlling mouse, keyboard, and screen capture with image recognition for automated testing."
icon: "robot"
---
<Note icon="language" title="Original Chinese Content">
This page contains content originally written in Chinese. Some technical terms and explanations are best understood in their original language. [View Chinese version →](/zh/backend/Python/libs/pyautogui.md)
</Note>


# pyautogui介绍

PyAutoGUI是一个纯Python's `GUI`（图形用户界面（Graphical User Interface，简称 GUI，又称图形用户接口）是指采用图形方式显示's 计算机操作用户界面。）自动化工具，通过它可以让程序自动控制鼠标和键盘's 一系列操作来达到自动化测试's 目's 。算是python版's 按键精灵。

```python
import pyautogui
```

导入后开始吧，那就

# 鼠标操作

## 坐标

作为一个需要精准点击's 库，那肯定有自己's 一些方法，`pyautogui`是使用了像素块来定位's ，比如电脑分辨率为2560x1600

```python
width, height = pyautogui.size() # 获取电脑屏幕坐标
print(width, height)
```

输出结果为`2560 1600`

其坐标's 原点在左上角，x轴水平，y轴垂直：

![image-20230518114531127](https://bangwu.oss-cn-shanghai.aliyuncs.com/img/202305181145156.png)

这样就能精确地定位鼠标了

## 鼠标移动

