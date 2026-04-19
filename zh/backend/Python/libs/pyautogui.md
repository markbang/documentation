---
title: "PyAutoGUI"
description: "PyAutoGUI 是纯 Python 实现的跨平台图形用户界面自动化工具库的完整使用指南与实战教程参考，支持通过编程精确控制鼠标坐标移动定位与点击、键盘按键输入与组合键模拟、屏幕截图捕获与图像模板识别定位功能，可轻松编写桌面端自动化测试与重复任务批处理脚本。"
icon: "robot"
---

# pyautogui介绍

PyAutoGUI是一个纯Python的`GUI`（图形用户界面（Graphical User Interface，简称 GUI，又称图形用户接口）是指采用图形方式显示的计算机操作用户界面。）自动化工具，通过它可以让程序自动控制鼠标和键盘的一系列操作来达到自动化测试的目的。算是python版的按键精灵。

```python
import pyautogui
```

导入后开始吧，那就

# 鼠标操作

## 坐标

作为一个需要精准点击的库，那肯定有自己的一些方法，`pyautogui`是使用了像素块来定位的，比如电脑分辨率为2560x1600

```python
width, height = pyautogui.size() # 获取电脑屏幕坐标
print(width, height)
```

输出结果为`2560 1600`

其坐标的原点在左上角，x轴水平，y轴垂直：

![image-20230518114531127](https://bangwu.oss-cn-shanghai.aliyuncs.com/img/202305181145156.png)

这样就能精确地定位鼠标了

## 鼠标移动

