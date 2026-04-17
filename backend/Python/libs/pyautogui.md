---
title: "PyAutoGUI"
description: "PyAutoGUI is a Python GUI automation library for controlling mouse, keyboard, and screen capture with image recognition for automated testing."
icon: "robot"
---

# Introduction to PyAutoGUI

PyAutoGUI is a pure-Python `GUI` automation library. It lets a program control the mouse and keyboard automatically, so it is very useful for simple automation and UI testing. You can think of it as a Python version of a desktop macro tool.

```python
import pyautogui
```

After importing it, you can get started right away.

# Mouse operations

## Coordinates

For a library that focuses on precise clicking, coordinate handling is the foundation. `pyautogui` uses screen pixels for positioning. For example, on a display with a resolution of 2560x1600:

```python
width, height = pyautogui.size() # 获取电脑屏幕坐标
print(width, height)
```

The output is `2560 1600`.

The coordinate origin is in the top-left corner. The x-axis is horizontal and the y-axis is vertical:

![image-20230518114531127](https://bangwu.oss-cn-shanghai.aliyuncs.com/img/202305181145156.png)

Once you understand that, you can position the mouse precisely.

## Mouse movement
