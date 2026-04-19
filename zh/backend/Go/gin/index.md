---
title: "Go Gin"
description: "Go 语言 Gin 高性能 Web 框架的入门使用指南与核心概念速查，详细讲解 gin.Default 路由引擎的创建方式、路由分组与嵌套结构设计、JSON/XML 格式响应返回、全局与局部中间件的注册配置以及 HTTP 服务启动与端口监听等 Gin 框架日常开发中最常用的基础操作。"
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
