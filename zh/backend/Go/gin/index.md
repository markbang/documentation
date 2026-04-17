---
title: "Go Gin"
description: "Go Gin 是 Go 语言高性能 Web 框架，本文整理路由引擎创建、GET/POST 处理函数、JSON 响应与 HTTP 服务启动等基础用法示例。"
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
