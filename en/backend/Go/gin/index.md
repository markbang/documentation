---
title: "Go Gin"
description: "Go Gin web framework for building high-performance APIs, with route engine examples, GET/POST handlers, JSON responses, and HTTP servers."
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
