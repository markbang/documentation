---
title: "Go Gin"
description: "Go Gin 高性能 Web 框架完整教程，从零开始详解路由分组创建、GET/POST 请求处理方法定义、JSON 响应格式化与 HTTP 服务器启动配置等核心用法，涵盖中间件绑定与请求参数校验，是快速上手 Go 语言 RESTful API 后端开发的实用入门指南。"
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
