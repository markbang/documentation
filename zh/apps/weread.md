---
title: "微信读书"
description: "微信读书推出的官方 AI Skill 让你的阅读数据可以被查询、分析和导出——把书架接入 AI 编程助手和个人知识管理体系。"
icon: "book"
---

# 微信读书

微信读书是腾讯旗下的电子阅读平台，深受中文读者欢迎。2026 年，它推出了官方 **Skill**，让 AI 编程助手可以直接读取你的阅读数据：书架、笔记、划线、阅读时长和偏好分析。

## Skill 能做什么

不再等年度报告，你可以随时让 AI 分析你的阅读历史：

- **阅读报告**：生成个性化的阅读时长分布、类型偏好、作者模式和每周/每月节奏分析。
- **书评**：提取某本书的所有划线和笔记，生成结构化书评。
- **知识卡片**：从划线中提取核心观点，格式化为可分享的知识卡片并附原文引用。
- **Obsidian 导出**：将一本书的划线和想法整理成 Obsidian 格式的读书笔记，包含 frontmatter、标签和按章节组织的内容。
- **书架问答**：问"根据我的阅读历史推荐接下来读什么？"或"我最近在关注什么主题？"

## 数据管道

这个 Skill 将三个工具串联成一条从阅读到知识库的流水线：

```
微信读书（数据源）→ AI Agent（拉数据 + 处理）→ Obsidian（本地知识库）
```

能实现：

- 每本书自动生成一个笔记文件
- AI 自动打标签和双向链接
- 按主题生成 MOC（内容地图）索引页
- 新划线增量合并到已有笔记

## 支持的 Agent

Skill 兼容以下工具：

- **Qwen Code**（多数用户推荐）
- **Claude Code**
- **Cursor**
- 任何支持 Skill 安装的 Agent

Qwen Code 更受欢迎，因为它在终端运行，能直接写文件和跑脚本——一句命令就能生成 Obsidian 笔记或可视化报告。

## 安装配置

1. 安装支持的编码 Agent（如 [Qwen Code](https://qwenlm.github.io/qwen-code-docs/zh/users/overview/)）
2. 从 [weread.qq.com](https://weread.qq.com/r/weread-skills) 获取微信读书 API key

然后告诉你的 Agent：

```
下载 https://cdn.weread.qq.com/skills/weread-skills.zip 安装 skill，我的 API 是 wrk-xxxx
```

可以加一句 `帮我配置好环境，记住 API，让我之后不需要再配置` 来持久化 API key。

安装后验证：

```
/skills weread-skills 我最近在读什么？
```

## 使用示例

**探索阅读偏好：**

```
/skills weread-skills 根据我的阅读偏好，推荐接下来读哪些书
```

**回顾某本书的笔记：**

```
/skills weread-skills 看看我在《空洞的心》里的笔记，随机选 3 条
```

**生成书评：**

```
/skills weread-skills 我刚读完《绿灯》，结合我在这本书里的 35 条笔记，帮我写一篇 500 字的短书评
```

**导出到 Obsidian：**

```
/skills weread-skills 把我在《纷乱的心灵》里的划线和想法，整理成一篇 Obsidian 格式的读书笔记，保存到当前目录
```

**为写作找素材：**

```
/skills weread-skills 我想写一篇关于「成瘾与自我认知」的文章，从我的笔记里找出所有相关的划线和想法
```

## 社区 Skill

除了官方 Skill，社区也开发了额外工具。比如 [姚金刚的 Weread Skill](https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-weread-skill) 能生成带图表的详细可视化阅读报告。

安装方式：

```
帮我安装这个技能：https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-weread-skill
```

然后运行：

```
/skills yao-weread-skill 帮我生成我的阅读报告
```

## 参考资料

- [年度报告不够看？微信读书 Skill 上手体验](https://sspai.com/post/109932) — 少数派详细体验文
- [微信读书 Skill 官方页面](https://weread.qq.com/r/weread-skills)
- [姚金刚的 Weread Skill](https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-weread-skill) — 社区阅读报告生成器
