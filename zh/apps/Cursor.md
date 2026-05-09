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

## Coding Agent 安全治理：OpenAI 如何管住 Codex

当 coding agent 能读写仓库、运行命令、调用开发工具时，你需要同时保证效率和可控性。OpenAI 给 Codex 设计了**四层框架**：沙箱 + 审批 + 网络策略 + 身份治理。指导原则：**低风险日常操作零摩擦，高风险操作必须停下来等审查**。

### 1. 沙箱 + 审批

- **沙箱**定义技术执行边界：能写哪里、能不能联网、哪些路径只读
- **审批策略**定义什么时候必须停下来问人——通常在越界沙箱时触发
- **Auto-review 模式**：一个独立子代理审阅 Codex 的待执行动作和上下文，对低风险请求自动放行，仅在风险升高时才打断用户。这是"AI 审 AI"——把审批本身做成智能层

### 2. 网络访问

默认拒绝、显式允许模型：

- **允许**已知合规目的地
- **拉黑**明确不希望的域名（如 pastebin.com——典型数据外泄渠道）
- **未知域名**要求审批

通过 proxy 实施——Agent 没有开放出站权限。

### 3. 身份与凭证

- CLI 和 MCP 的 OAuth 凭证**强制存入 OS keyring**（macOS Keychain）
- 强制通过 **ChatGPT 登录**——不可绕过
- 锁定到**指定企业工作区 UUID**

效果：所有 Codex 活动被绑回工作区级管控，自动落入 ChatGPT 合规日志。

### 4. 命令规则

按语义风险分级：

- **只读命令**（`gh pr view`、`kubectl get`）→ 自动放行
- **危险命令** → 显式拦截或要求审批

这种"按命令语义分级"的做法让 agent 在常规工程流程中几乎无摩擦，同时保留对危险操作的强制刹车。

### 5. 配置分发

三层分发保证全公司基线一致：

- **云端 managed requirements** + **macOS 托管偏好** + **本地 requirements 文件**
- `requirements` 是管理员强制项——用户无法覆盖

### Agent-Native Telemetry

传统 EDR 和审计日志只能告诉你"发生了什么"——但面对 AI Agent，安全团队真正缺的是**"为什么"**：

- 用户原始 prompt
- Agent 推理路径
- 审批决策
- 工具调用链
- MCP 服务器使用
- 网络代理放行/拒绝事件

Codex 通过 **OpenTelemetry** 导出这些事件，可以重建完整因果链："用户说了什么 → Agent 打算做什么 → 系统批准了什么 → 实际发生了什么 → 网络层是否拦下"。

OpenAI 自己的做法：当 EDR 报警 Codex 行为异常，他们的**AI 安全三角分诊 agent** 会主动拉取 Codex 遥测，自动分类为：

1. 预期内的 agent 行为
2. 良性失误
3. 真正需要升级的事件

只有第3类推给人类。这是**"agent 行为由另一个 agent 解释"**的安全运营范式。

<Tip>
如果你在企业中部署 coding agent，考虑实施类似的框架：沙箱边界、命令级风险分类、和能捕获"为什么"而非只"什么"的遥测。Auto-review 模式（AI审AI）尤其有助于减少审批噪音。
</Tip>

<Note title="来源">
- [OpenAI: Running Codex Safely](https://openai.com/index/running-codex-safely/) — 官方博客
- [宝玉中文摘要](https://x.com/dotey/status/2048849524739977672) — 四层框架详细翻译
</Note>

## Trae

免费 AI IDE，持续更新中。