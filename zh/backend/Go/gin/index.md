---
title: "Go Gin"
description: "Go Gin 高性能 Web 框架入门指南，涵盖 gin.Default 路由引擎创建、GET/POST 路由定义与分组、c.JSON 返回 JSON 响应、中间件配置与 router.Run 启动 HTTP 服务等基础用法，帮助开发者快速上手 Go 语言 Web API 后端开发。"
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
