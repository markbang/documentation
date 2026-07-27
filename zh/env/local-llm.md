---
title: "本地 LLM 部署"
description: "用 llama.cpp 在本地运行高性能大语言模型的实战指南，涵盖 Qwen 3.6 27B 配置、性能基准与模型对比，帮你实现离线、私密、自主可控的 AI 开发环境。"
icon: "microchip"
---

# 本地 LLM 部署

在自己的机器上运行高性能大语言模型，已经不是研究课题了。像 Qwen 3.6 27B 这样的开源权重模型，能在笔记本或台式 GPU 上提供 2025 年中前沿水平的智能——离线、私密、完全由你控制。

## 为什么要在本地跑模型

云端 API 方便，但有代价：

- **随时可能消失**：云端模型可能被下架、限流或一夜之间关停——2026 年 6 月 Claude Fable 5 用户就经历过。
- **隐私**：敏感代码、医疗数据、个人笔记不会离开你的机器。
- **用量成本**：API 积分现在便宜是因为大量补贴。补贴时代结束后，高频使用场景下本地模型才是经济选择。
- **可定制**：你可以针对自己的领域、编码风格或项目规范微调本地模型。

## 当前最佳选择：Qwen 3.6 27B

截至 2026 年中，Qwen 3.6 27B 被广泛认为是第一款真正具备通用智能、适合日常开发工作的本地模型。

它有两个变体：

| 变体 | 架构 | 速度 | 质量 |
| --- | --- | --- | --- |
| Qwen 3.6 35B A3B | 混合专家 (MoE) | ~105 tok/s (Mac M5) | 良好 |
| Qwen 3.6 27B | 稠密 (Dense) | ~32 tok/s (Mac M5) | 更好 |

质量敏感的任务推荐稠密 27B。MoE 变体快 3 倍，能力也不差，适合快速迭代。

### 智能水平

在 Artificial Analysis 指数上，Qwen 3.6 27B 大约处于 2025 年中前沿水平：

| 模型 | 大致时期 | 对标 |
| --- | --- | --- |
| Gemma 4 31B | 2024 年末 | o1 / Claude 3.5 Sonnet |
| Qwen 3.6 35B A3B | 2025 年初 | o3 / Claude 4 Sonnet |
| **Qwen 3.6 27B** | **2025 年中** | **GPT-5 / Claude Sonnet 4.5** |
| DeepSeek V4 Flash | 2025 年末 | GPT-5.2 / Claude Opus 4.5 |

它明显优于之前本地编码的默认选择 Gemma 4 31B，接近 DeepSeek V4 Flash 的水平。

## 用 llama.cpp 部署

推荐 [llama.cpp](https://github.com/ggml-org/llama.cpp) 而不是 Ollama——它更直接、更开放，让你完全控制量化和推理参数。

### 1. 下载量化模型

8-bit 量化将模型大小减半，质量损失可忽略。常用 GGUF 源：

- [unsloth/Qwen3.6-27B-MTP-GGUF](https://huggingface.co/unsloth/Qwen3.6-27B-MTP-GGUF)（支持多 token 预测）
- [bartowski/Qwen_Qwen3.6-27B-GGUF](https://huggingface.co/bartowski/Qwen_Qwen3.6-27B-GGUF)

### 2. 启动服务

```bash
llama-server -hf unsloth/Qwen3.6-27B-MTP-GGUF:Q8_0 \
    --spec-type draft-mtp -ngl 999 -fa on -c 65536 --port 8080
```

参数说明：

- `-hf` — 从 Hugging Face 拉取（后续运行使用缓存）
- `--spec-type draft-mtp` — 多 token 预测，提速约 1.8 倍
- `-ngl 999` — 所有层加载到 GPU
- `-fa on` — 启用 flash attention
- `-c 65536` — 64K 上下文窗口（原生支持 256K）

打开 `http://127.0.0.1:8080` 即可直接对话。

### 3. 接入编码 Agent

以 OpenCode 为例，在 `~/.config/opencode/opencode.jsonc` 中添加：

```json
{
  "provider": {
    "llama": {
      "name": "llama.cpp (local)",
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://127.0.0.1:8080/v1",
        "apiKey": "local"
      },
      "models": {
        "qwen3.6-27b": { "name": "Qwen3.6-27B Q8 +MTP" }
      }
    }
  },
  "model": "llama/qwen3.6-27b"
}
```

同一服务兼容 Pi、Hermes、Claude Code（通过自定义 base URL）以及任何 OpenAI 兼容客户端。

## 性能参考

在 MacBook Max M5 128 GB 上，8-bit 量化：

| 模型 | 引擎 | Tok/s | 内存 |
| --- | --- | --- | --- |
| Qwen 3.6 35B A3B | llama.cpp + MTP | 105 | 45 GB |
| Qwen 3.6 27B | llama.cpp + MTP | 32 | 42 GB |
| Qwen 3.6 27B | llama.cpp (无 MTP) | 18 | 41 GB |
| DeepSeek V4 Flash (Q2-Q4) | llama.cpp | 33 | 103 GB |

消费级 GPU：

- **RTX 5090 32 GB**：Q6_K 量化，123K 上下文约 50 tok/s，约 28 GB 显存
- **32 GB 共享内存设备**：4-bit 量化可轻松运行

笔记本用户可以考虑局域网内的 Mac Mini M4，比直接在 MacBook Pro 上跑模型更安静、更便宜（M5 满负荷时发热和风扇噪音明显）。

## 本地 vs. 云端的选择

| 场景 | 推荐 |
| --- | --- |
| 敏感或私有代码 | 本地 |
| 离线或物理隔离环境 | 本地 |
| 大批量批处理 | 本地（无 API 费用） |
| 需要绝对前沿智能 | 云端（Opus、GPT-5.5） |
| 快速一次性查询 | 云端（方便） |
| 长上下文项目（>128K） | 云端（或激进量化） |

## 模型评估：基准分数与真实体验

开源权重模型发布中一个反复出现的模式是基准分数与实际体验之间的差距。2026 年 7 月的两个数据点让这个问题再也无法忽视：

**腾讯 Hy3**（295B 总参数 / 21B 激活参数 MoE）在模型卡中明确写道：

> 模型的实用体验不完全与榜单成绩挂钩。基于广泛的用户反馈和分析，我们定位并优化了一系列体验向能力，获得了产品侧一致且积极的评价。

**Anthropic Opus 5 vs Fable 5**：Opus 5 几乎在每一项基准指标上都超越了 Fable 5，但任何认真使用过两者的人都能在几分钟内判断出——Opus 5 在实际编程和 Agent 任务中的表现远不如 Fable 5。正如一位观察者所说："这只能说明我们的所有指标都已经失效了。"

基准测试失灵的原因在于：它们测量的是干净条件下狭窄任务的完成度，而真实世界的可用性涉及它们无法捕捉的维度——长上下文中的指令遵循一致性、拒绝回答的校准、输出格式的可靠性、工具使用的判断力、以及任务中途出错后的恢复能力。

在评估任何模型的日常使用时，用你的实际工作流来测试，而不只是看排行榜分数。

## 模型架构前沿：扩散语言模型

主流大语言模型的架构是自回归——从左到右逐个生成 token，生成一个就提交一个，无法回头修改。这给 Agent 工作流带来了一个根本性问题：当 50 个 token 前的工具调用出错时，模型无法编辑那部分输出，只能从头重来或带着错误上下文继续推进。

**扩散语言模型**（diffusion language model）走了一条不同的路。它不是顺序生成，而是在多次并行迭代中逐步精炼整个输出。inclusionAI 于 2026 年 7 月开源的 **LLaDA2.2-flash** 首次为扩散解码引入了编辑机制：

- **DELETE** 和 **INSERT** 两个控制 token，让模型在生成过程中能主动删除和插入内容
- 动态调整序列结构，具备自我纠错能力
- 对多轮工具调用和长程 Agent 交互尤其有价值

当前局限：扩散模型在标准基准上的得分仍显著低于同等参数规模的自回归模型。但它的架构优势——边生成边修改——解决的正是自回归模型无论怎么扩大规模都无法克服的限制。

这仍是早期研究，不是自回归模型的替代品。但方向值得关注：随着 Agent 工作流越来越长、越来越复杂，能够修订而非重启的能力将变得至关重要。

## 行业动态：Anthropic 入局自研芯片

Anthropic 已启动自研 AI 芯片的早期开发，向 SK 海力士寻求存储半导体供应，并与三星洽谈定制项目，有望采用三星 2nm 制程和先进封装技术。继 OpenAI 的芯片布局之后，这标志着前沿 AI 实验室已将垂直整合到硅层面视为战略必需。

## 未来展望

差距正在快速缩小。GLM 5.2 已经提供了前沿水平的开源权重智能，"分离推理能力与事实知识"的趋势会让未来模型在消费级硬件上更高效。

## 参考资料

- [Qwen 3.6 27B 是本地开发的最佳选择](https://quesma.com/blog/qwen-36-is-awesome/) — 部署指南、性能基准和实际使用体验
- [Will it Mythos?](https://swelljoe.com/post/will-it-mythos/) — Qwen 3.6 基准对比
- [Simon Willison 谈 Qwen 3.6 27B](https://simonwillison.net/2026/Apr/22/qwen36-27b/)
- [Tencent Hy3 on HuggingFace](https://huggingface.co/tencent/Hy3)
- [Opus 5 vs Fable 5：基准测试已失效](https://x.com/oran_ge/status/2081501133168947412)
- [LLaDA2.2-flash：能边写边改的扩散语言模型](https://huggingface.co/inclusionAI/LLaDA2.2-flash)
- [Anthropic 自研芯片](https://readhub.cn/topic/8v2eHNj7g1m)
