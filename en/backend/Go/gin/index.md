---
title: "Go Gin"
description: "Go Gin is the most popular web framework for Go, covering router setup, GET/POST handlers, JSON responses, and HTTP server startup basics."
icon: "bolt"
---

# Go gin

gin is the most widely-used go web Framework

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
