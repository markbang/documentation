---
title: "Agent harness"
description: "AI Agent harness 实战设计笔记，系统梳理记忆架构、技能装载、工具协议、上下文窗口管理、权限边界控制、评测体系与常见故障模式排查思路，帮助开发者从零搭建可靠的智能体运行时层，提升编码 Agent 与工作流 Agent 的稳定性，少踩坑、多快速落地。"
icon: "robot"
---

# Agent harness

Agent harness 是包在 AI 模型外面的运行时层。它决定模型能看到什么上下文、能调用哪些工具、权限怎么控制、记忆放在哪里，以及出错后怎么恢复。

不要把 harness 当成普通胶水代码。对编码 Agent 和工作流 Agent 来说，harness 经常比“换一个更强模型”更直接地影响可靠性。

## 一个好用的理解框架

好的 Agent 系统会把不适合只放在模型权重里的能力外化出来。

| 层级 | 外化什么 | 例子 |
| --- | --- | --- |
| 记忆 | 持久状态与检索 | 项目笔记、用户偏好、任务历史、向量检索 |
| 技能 | 可复用流程 | 浏览器控制、代码审查、图片生成、部署 helper |
| 协议 | 通信契约 | MCP、JSON schema、类型化工具返回、错误格式 |
| Harness | 运行时协调 | 上下文组装、工具路由、审批、日志、重试、评测 |

这个框架来自论文 **Externalization in LLM Agents: A Unified Review of Memory, Skills, Protocols and Harness Engineering**。它提醒我们先问一个工程问题：

> 哪些能力应该继续留在模型内部，哪些能力应该变成明确的外部组件？

如果这个能力会影响可靠性、可审计性、复用性或成本，通常就值得外化。

## Harness 负责什么

Harness 至少应该把这些决策显式化：

- 哪些文件、页面、工具和记忆进入上下文
- 旧上下文什么时候总结、丢弃或保留
- 工具调用在执行前怎么校验
- 哪些动作必须经过用户审批
- 工具错误怎么表示、怎么重试
- 推理强度、延迟和成本怎么权衡
- 每次运行怎么记录，方便之后排查

薄 harness 可以成立，但隐式 harness 很难排错。行为变差时，如果分不清原因是模型、提示词、上下文缓存、工具层还是产品默认值，说明 harness 的可观测性不够。

## 设计原则

### 工具要小而清楚

优先设计输入输出明确的小工具。一个工具只做一件事，模型更容易正确调用，人也更容易审查。

本地工作流里，CLI 往往够用。需要跨客户端复用时，再考虑 MCP 这样的协议边界。稳定产品后端则继续用直接 API，通常最简单。

### 保留影响推理的上下文

上下文裁剪不只是省 token 的优化，它会改变行为。

如果 Agent 前面基于某段推理调用了工具或修改了文件，harness 就必须保留足够的原因链。否则后续轮次可能重复执行、忘记为什么选这条路，或者调用奇怪的工具。

### 用文件承载持久状态

长时间运行的 Agent 工作流不能只依赖聊天历史。普通文件通常是最简单的持久记忆层，因为人可以查看、编辑、diff，也可以用 Git 版本化。

一个好用模式是把工作区拆成目标、资源、交付物和学习记录：

```text
workspace/
├── MISSION.md              # 为什么要做这件事或学习这个方向
├── RESOURCES.md            # 可信来源与参考资料
├── NOTES.md                # 偏好与临时笔记
├── lessons/                # 每个文件一个自包含学习单元
├── reference/              # 压缩后的长期速查资料
└── learning-records/       # 用户能力发生了什么变化
```

具体文件名可以调整。关键原则是：状态必须**可检查、可恢复、有边界**。在 Agent 辅助学习里，这能让 Agent 基于学习者当前能力继续教学，而不是每次都从通用大纲开始。在工程工作里，同样可以用于 onboarding 笔记、迁移日志、事故复盘和任务 journal。

### 正确性重要时要做确定性检索

当任务需要精确结果时，不要只让 Agent 在脆弱网页、分散数据库和没有文档的一次性脚本之间“自己想办法”。应该给它一个确定性检索层。

Anthropic 的生物学 Agent 案例很有代表性：研究团队让科学 Agent 从 NCBI Virus 检索病毒序列数据。真正值得沉淀的结论不是“某个模型赢了 benchmark”，而是加入 `gget virus` 这种接口更窄的确定性检索层后，工作流可靠性显著提高。

高风险检索建议优先提供：

- 类型化查询函数，而不是自由浏览网页
- 稳定 ID、版本号和日期过滤条件
- 可机器校验的数量统计或 checksum
- 每条返回记录的来源证据
- 下游分析前的验证步骤
- 明确错误情况，而不是静默 best-effort 输出

这和工具设计是同一个 harness 原则：先把执行表面变得可预测，再让模型围绕它做计划。

### 为人际协作而设计，而不只是追求自主执行

大多数 Agent 产品把目标放在自进化和闭环上：Agent 自己规划、执行、收尾。这不一定是健康的模式。即使加了透明度和追溯工具，优先追求自主完成的 Agent 也可能制造出难以交接和维护的噪音。

Agent 不只是执行流程的容器，也是人理解、判断和协作的环境。设计 harness 时问自己：另一个人能接手这个会话继续工作吗？推理过程是否足够透明，让同事能审计某个决策？工作流产出的是可维护的交付物，还是一堆自动执行的步骤？

优先考虑交接质量，而不是自动化完成度。一个以清晰、可检查状态结束的工作流，比一个"全都做完了"但没留痕迹的工作流更有价值。

### 遥测和反滥用信号应该显式化

一个有文件系统和 shell 权限的编码 Agent，行为越"无聊"越好。每一个非显而易见的动作都在侵蚀信任。

2026 年 7 月，有开发者审计 Claude Code 时发现了提示词隐写：二进制文件会根据时区（`Asia/Shanghai`、`Asia/Urumqi`）和主机名匹配 XOR 编码的域名列表（中国 AI 实验室、代理服务、转售网关），静默修改系统提示词日期字符串中的不可见 Unicode 字符（`Today's` → `Today\u2019s`），将分类信号编码进去——全程无文档说明。

检测目的本身可以理解——Anthropic 想识别 API 转售商和模型蒸馏管道。问题出在实现方式。把分类信息藏在不可见标点里，用 XOR 和 base64 隐藏域名列表，这让其他隐私声明都更难取信。而且绕过极其简单（改主机名、改时区、patch 二进制），所以这个功能主要惩罚的是那些使用自定义 API 网关的正当开发者。

Harness 的教训：如果你的工具需要检测滥用，就把信号做显式。写文档。写 release notes。发明确的遥测字段。透明度不是反滥用的敌人——它是信任的基础。

### 让推理强度可见

推理强度不只是模型参数，也是产品决策。降低强度可以减少延迟和 token，但也可能让复杂编码任务明显变差。

要让用户看见当前 effort 级别，方便切换，并避免在复杂工作流里静默修改默认值。

### 把 system prompt 当代码审查

System prompt 的改动可能和代码改动一样影响质量。处理它时也应该有工程纪律：

- 跑分模型评测
- 用 ablation 检查单条指令的影响
- 灰度发布
- 保留变更记录
- 模型专用指令只作用到目标模型

对编码 Agent 来说，过强的“少说话”约束尤其危险。它可能减少工具调用之间必要的计划和验证。

### 测试真实公开版本

内部版本可能掩盖线上问题。应该 dogfood 用户真正运行的公开版本、公开默认值和公开上下文行为。

对代码审查或编码 Agent 评测来说，还要给足真实任务需要的仓库和文件上下文。缺少跨仓库上下文时，模型明明有能力找出问题，评测里也可能看不到。

## 常见故障模式

Anthropic 在 **2026 年 4 月**发布的 Claude Code 质量问题复盘很有参考价值：用户感知到的退化来自产品和 harness 改动，而不是底层 API 模型退化。

常见故障包括：

- **默认推理强度回退**：为了降低延迟改默认值，可能让复杂任务显得“不聪明”。
- **上下文缓存 bug**：错误地清理 reasoning history，会让 Agent 健忘、重复、工具选择异常。
- **提示词过度限长**：笼统的短回答约束可能降低编码质量。
- **评测盲区**：内部评测通过，不代表真实用户工作流没问题。
- **版本不一致**：内部 dogfood 的 harness 和用户运行的 harness 不一致。

实用结论是：Agent 变差时，要排查整个运行时，而不是只怀疑模型。

## 快速排查清单

当 Agent 表现异常时，按这个顺序问：

1. 模型或 effort 级别变了吗？
2. System prompt、工具描述或 skill 指令变了吗？
3. 上下文裁剪、总结或缓存策略变了吗？
4. 工具 schema 或返回格式变了吗？
5. Agent 拿到的文件和仓库上下文和以前一样吗？
6. 用户运行的 harness 版本和内部评测版本一样吗？
7. 日志里是否出现重复工具调用、缺少原因链、无新增信息的重试？

这能把模型退化和 harness 退化分开看。

## 什么时候值得投入更强的 harness

一开始可以简单。等任务变得重复、高风险或高成本，再加结构。

这些情况值得认真做 harness：

- Agent 会修改代码或生产数据
- 多个工具需要共享状态
- 用户会恢复长会话
- 审批和审计日志很重要
- 同一套流程要给团队多人使用
- 需要比较不同模型版本下的行为

如果只是一次性、低风险任务，一个提示词加几个工具就够了。只要任务开始变成长时间、带状态、可复用的工作流，就应该尽早设计 harness。

## 参考资料

- [Externalization in LLM Agents: A Unified Review of Memory, Skills, Protocols and Harness Engineering](https://arxiv.org/abs/2604.08224)
- [Micropaper：LLM Agent 的外化设计范式](https://unbug.github.io/one-minute-read-paper-externalization-in-llm-agents/)
- [Anthropic Engineering：An update on recent Claude Code quality reports](https://www.anthropic.com/engineering/april-23-postmortem)
- [Anthropic Research：Paving the way for agents in biology](https://www.anthropic.com/research/agents-in-biology)
- [Matt Pocock Skills：Teach skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/teach)
- [PsiACE：Agent 不只是执行流程的容器](https://x.com/repsiace/status/2072039687364161965) — 关于 Agent 应作为人理解、判断和协作的环境，而不仅是自主执行容器的设计洞察。
- [Claude Code 通过隐写方式标记请求](https://thereallo.dev/blog/claude-code-prompt-steganography) — Claude Code 通过不可见 Unicode 隐写标记 API 请求的案例分析，提醒开发者审查有文件系统和 shell 权限的工具。
