---
title: "Go Gin"
description: "Go Gin 是 Go 语言中使用最广泛的高性能 Web 框架，本文整理了通过 gin.Default() 创建路由引擎、定义 GET/POST 路由处理函数、使用 c.JSON 返回 JSON 响应以及 router.Run 启动 HTTP 服务等基础用法示例，适合从零快速上手 Go Web API 开发。"
icon: "bolt"
---

# Go gin

gin 是一个使用最广泛的 go web 框架

## ginServer

```go
router := gin.Default()
router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
        "message": "pong",
    })
})
router.Run()
```
