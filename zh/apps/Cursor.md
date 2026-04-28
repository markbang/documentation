---
title: "AI IDE"
description: "Cursor、Trae 等 AI 驱动的代码编辑器 — 使用技巧、工作流和 GitHub Copilot 计费变更。"
icon: "wand-magic-sparkles"
---

## Cursor

[go-cursor-help](https://github.com/yuaotian/go-cursor-help/blob/master/README_CN.md#solution1)

```powershell
irm https://aizaozao.com/accelerate.php/https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_win_id_modifier.ps1 | iex
```

### Cursor 3：用户真正想要什么

基于 431 条社区反馈（2026年4月），核心结论：**用户不只是要"AI 写代码"，而是要一个稳定、可控的 AI 开发工作台**。优先级排序：

1. **Agent 与 IDE 无缝融合** — Agent Window 有潜力，但必须保留完整 IDE 能力（LSP、调试、任务运行、扩展、快捷键、代码导航、diff 接受/拒绝）。用户不应该为了一个小操作就切回旧 IDE。

2. **Worktree / Git / PR 工作流产品化** — 开发者想要低摩擦、可审计的 Git 控制台，而不是用自然语言让 Agent 帮你做 Git 操作。核心需求：分支切换、PR 检测、选择性 staging、多仓库 diff、submodule 支持、CI 状态、review 集成。

3. **稳定性优先于新功能** — 启动速度、内存占用、上下文丢失、LSP 失效、大仓库索引慢，这些是信任杀手。基础不稳，用户会转向其他工具。

4. **模型成本透明** — 用户想知道"这个任务用哪个模型最划算"，而不是仅仅多几个模型选项。好的方向：Cursor 建议"这里用便宜模型，那里升级到强模型"。

5. **键盘优先** — 整个产品必须不用鼠标也能操作。自定义快捷键、快速面板切换、继承 VS Code 肌肉记忆，是重度用户的底线。

6. **任务记忆系统** — Agent 工作变多后，"聊天记录列表"必须升级为"任务记忆系统"：自动重命名 chat、pin 消息、fork session、跨项目引用上下文。

<Note title="来源">
综合自 [Eric Zakariasson 的 Cursor 3 反馈帖](https://x.com/ericzakariasson) — 431 条社区回复，2026年4月。
</Note>

## 研究陌生大模型时的工作流

如果你不是单纯写业务代码，而是想借助 AI IDE 搞清楚一个开源大模型的结构，可以按下面的顺序来：

1. **先读官方技术报告**
   - 先弄清模型想解决什么问题、属于什么家族、有哪些官方命名。
   - 论文和技术报告通常能给出总体设计，但细节经常不够完整。
2. **再看 Hugging Face 配置文件**
   - 重点关注层数、隐藏维度、注意力头数、RoPE 参数、MoE 配置、KV 头设置等关键字段。
   - 这些配置比二手解读更接近真实实现。
3. **再看参考实现代码**
   - 如果模型已被 `transformers` 或官方仓库支持，优先看对应实现。
   - 可运行代码往往比论文描述更诚实，尤其适合确认模块顺序、残差连接和张量形状。
4. **最后再自己画结构图或让 AI 帮你总结**
   - 先自己建立一版理解，再让 AI IDE 辅助整理图示、对比相似模型或解释局部模块。
   - 这样更不容易被"看起来很对"的总结误导。

### 这个方法什么时候最有效

- 适合 **open-weight** 模型
- 适合已经公开配置和参考实现的模型
- 不太适合只公开营销材料、没有权重和代码的闭源模型

### 参考

- [Sebastian Raschka: My Workflow for Understanding LLM Architectures](https://magazine.sebastianraschka.com/p/workflow-for-understanding-llms)

## GitHub Copilot：按用量计费（2026年6月）

从 **2026年6月1日** 起，GitHub Copilot 从"高级请求次数"转向 **AI Credits（积分）**，按 token 消耗计费。这反映了 Copilot 从代码补全助手进化为能跑长任务 Agent 平台的变化。

### 不变的部分

- **基础价格不变** — Pro $10/月、Pro+ $39/月、Business $19/人/月、Enterprise $39/人/月
- **代码补全和 Next Edit 建议** — 仍然包含在订阅内，不消耗 AI Credits
- **月度积分等于订阅价** — Pro 获得 $10 积分，Pro+ 获得 $39 积分

### 变化的部分

- **高级请求次数 → AI Credits** — 按 input、output、cached token 消耗计算，费率与各模型 API 价格挂钩
- **不再有降级兜底** — 以前高级请求用完还能降级到便宜模型，现在积分花完就是花完
- **Copilot Code Review** — 同时消耗 AI Credits **和** GitHub Actions 运行时长
- **企业积分池化** — Business/Enterprise 的积分可以在团队间共享，不再浪费

### 过渡缓冲（6月–8月）

| 计划 | 正常月度积分 | 过渡期积分（6–8月） |
|------|------------|-------------------|
| Business | $19/人 | $30/人 |
| Enterprise | $39/人 | $70/人 |

### 实际影响

- **轻度用户** — 几乎不受影响，补全仍然免费
- **重度 Agent 用户** — 6月后注意账单，长时间自主编程任务消耗积分很快
- **年付用户** — 年付到期前仍按旧 PRU 计费，到期后转为月付积分制
- **5月初** — 上线账单预览功能，正式切换前可以看到预估费用

<Tip>
如果你经常让 Copilot Agent 跑长时间任务，5月初上线预览账单后去看看你的月度积分消耗预估。跨仓库迭代型 Agent 任务比简单聊天消耗的 token 多得多。
</Tip>

<Note title="来源">
- [GitHub Blog: Copilot 转按用量计费](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)
- [宝玉翻译摘要](https://x.com/dotey/status/2048849524739977672)
</Note>

## Trae

免费 AI IDE，持续更新中。