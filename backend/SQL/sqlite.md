---
title: "SQLite"
description: "SQLite is a lightweight embedded database reading and writing disk files, covering Python sqlite3 integration, basic SQL operations, and use cases."
icon: "file-code"
---

# SQLite

SQLite is a lightweight embedded relational database. It does not require a standalone server process and reads from or writes to a disk file directly.

## Features

- **Zero configuration**: no installation or admin service required
- **Single file**: the entire database lives in one file
- **Cross-platform**: works on all major operating systems
- **Self-contained**: no external service dependency
- **Transactional**: supports full ACID behavior

## Using SQLite in Python

### Basic operations

```python
import sqlite3

# 连接数据库（不存在则创建）
conn = sqlite3.connect('example.db')
cursor = conn.cursor()

# 创建表
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE
    )
''')

# 插入数据
cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", 
               ("张三", "zhangsan@example.com"))

# 查询数据
cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()

# 提交事务
conn.commit()
conn.close()
```

### Context manager

```python
with sqlite3.connect('example.db') as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
```

## Common commands

```sql
-- View所有表
.tables

-- View表结构
.schema users

-- 导出数据
.output data.sql
.dump

-- 导入数据
.read data.sql
```

## Performance tips

1. **Use transactions** for batch operations.
2. **Create indexes** to speed up queries.
3. **Enable WAL mode** to improve concurrent read/write behavior.

```python
# 启用 WAL 模式
conn.execute('PRAGMA journal_mode=WAL')
```

## Good use cases

- Local storage for mobile apps
- Desktop app data management
- Small web applications
- Embedded devices
- Testing and prototyping

## Limitations

- Not ideal for high-concurrency writes
- Recommended database size is typically below 1 TB
- No built-in user permission management
