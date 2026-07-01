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

## 未来展望

差距正在快速缩小。GLM 5.2 已经提供了前沿水平的开源权重智能，"分离推理能力与事实知识"的趋势会让未来模型在消费级硬件上更高效。

## 参考资料

- [Qwen 3.6 27B 是本地开发的最佳选择](https://quesma.com/blog/qwen-36-is-awesome/) — 部署指南、性能基准和实际使用体验
- [Will it Mythos?](https://swelljoe.com/post/will-it-mythos/) — Qwen 3.6 基准对比
- [Simon Willison 谈 Qwen 3.6 27B](https://simonwillison.net/2026/Apr/22/qwen36-27b/)
- [别再使用 Ollama](https://sleepingrobots.com/dreams/stop-using-ollama/) — Ollama 的伦理争议
