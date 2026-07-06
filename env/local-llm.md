---
title: "Local LLM deployment"
description: "A practical guide to running capable LLMs locally with llama.cpp, covering Qwen 3.6 27B setup, performance benchmarks, and model comparison for offline, private AI development."
icon: "microchip"
---

# Local LLM deployment

Running a capable large language model on your own machine is no longer a research project. With open-weight models like Qwen 3.6 27B, you get mid-2025 frontier-level intelligence on a laptop or desktop GPU — offline, private, and under your control.

## Why run models locally

Cloud APIs are convenient, but they come with trade-offs:

- **No take-backs**: A cloud model can be deprecated, rate-limited, or taken down overnight — as Claude Fable 5 users learned in June 2026.
- **Privacy**: Sensitive code, medical data, or personal notes never leave your machine.
- **Cost at scale**: API credits are cheap now due to heavy subsidies. When the subsidy era ends, local models become the economical default for frequent use.
- **Customization**: You can fine-tune a local model for your domain, coding style, or project conventions.

## The current sweet spot: Qwen 3.6 27B

As of mid-2026, Qwen 3.6 27B is widely considered the first local model that delivers genuine general intelligence suitable for daily development work.

It comes in two variants:

| Variant | Architecture | Speed | Quality |
| --- | --- | --- | --- |
| Qwen 3.6 35B A3B | Mixture-of-Experts | ~105 tok/s (Mac M5) | Good |
| Qwen 3.6 27B | Dense | ~32 tok/s (Mac M5) | Better |

The dense 27B is recommended for quality-sensitive work. The MoE variant is 3× faster and still very capable, suitable for quick iterations.

### Intelligence level

On the Artificial Analysis index, Qwen 3.6 27B scores around mid-2025 frontier level:

| Model | Approximate Era | Equivalent |
| --- | --- | --- |
| Gemma 4 31B | Late 2024 | o1 / Claude 3.5 Sonnet |
| Qwen 3.6 35B A3B | Early 2025 | o3 / Claude 4 Sonnet |
| **Qwen 3.6 27B** | **Mid 2025** | **GPT-5 / Claude Sonnet 4.5** |
| DeepSeek V4 Flash | Late 2025 | GPT-5.2 / Claude Opus 4.5 |

It significantly outperforms Gemma 4 31B (the previous local coding default) and approaches DeepSeek V4 Flash quality.

## Setup with llama.cpp

[llama.cpp](https://github.com/ggml-org/llama.cpp) is recommended over Ollama — it is direct, open, and gives you full control over quantization and inference parameters.

### 1. Download a quantized model

8-bit quantization halves model size with negligible quality loss. Popular GGUF sources:

- [unsloth/Qwen3.6-27B-MTP-GGUF](https://huggingface.co/unsloth/Qwen3.6-27B-MTP-GGUF) (with multi-token prediction support)
- [bartowski/Qwen_Qwen3.6-27B-GGUF](https://huggingface.co/bartowski/Qwen_Qwen3.6-27B-GGUF)

### 2. Start the server

```bash
llama-server -hf unsloth/Qwen3.6-27B-MTP-GGUF:Q8_0 \
    --spec-type draft-mtp -ngl 999 -fa on -c 65536 --port 8080
```

Flags explained:

- `-hf` — pull from Hugging Face (cached on subsequent runs)
- `--spec-type draft-mtp` — multi-token prediction for ~1.8× speedup
- `-ngl 999` — offload all layers to GPU
- `-fa on` — flash attention
- `-c 65536` — 64K context window (native is 256K)

Open `http://127.0.0.1:8080` to chat directly.

### 3. Connect your coding agent

For OpenCode, add to `~/.config/opencode/opencode.jsonc`:

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

The same server works with Pi, Hermes, Claude Code (via custom base URL), and any OpenAI-compatible client.

## Performance reference

Measured on MacBook Max M5 128 GB with 8-bit quantization:

| Model | Engine | Tok/s | RAM |
| --- | --- | --- | --- |
| Qwen 3.6 35B A3B | llama.cpp + MTP | 105 | 45 GB |
| Qwen 3.6 27B | llama.cpp + MTP | 32 | 42 GB |
| Qwen 3.6 27B | llama.cpp (no MTP) | 18 | 41 GB |
| DeepSeek V4 Flash (Q2-Q4) | llama.cpp | 33 | 103 GB |

On consumer GPUs:

- **RTX 5090 32 GB**: Q6_K quantization, ~50 tok/s at 123K context, ~28 GB VRAM
- **32 GB shared memory devices**: 4-bit quantization fits comfortably

For laptops, a Mac Mini M4 on the local network is a quieter, cheaper alternative to running models directly on a MacBook Pro (which gets hot and loud under sustained inference).

## When to use local vs. cloud

| Scenario | Recommendation |
| --- | --- |
| Sensitive or proprietary code | Local |
| Offline or air-gapped work | Local |
| High-volume batch processing | Local (no API costs) |
| Need absolute frontier intelligence | Cloud (Opus, GPT-5.5) |
| Quick one-off queries | Cloud (convenience) |
| Long-context projects (>128K) | Cloud (or aggressive quantization) |

## Model evaluation: benchmarks vs. real experience

A recurring pattern in open-weight model releases is the gap between benchmark scores and practical experience. Tencent's Hy3 model (released July 2026, 295B total / 21B active MoE) explicitly noted in its model card:

> 模型的实用体验不完全与榜单成绩挂钩。基于广泛的用户反馈和分析，我们定位并优化了一系列体验向能力，获得了产品侧一致且积极的评价。

("The model's practical experience does not fully correlate with benchmark rankings. Based on extensive user feedback and analysis, we identified and optimized a range of experience-oriented capabilities, receiving consistently positive evaluations from the product side.")

This is a healthy trend: model builders are acknowledging that real-world usefulness involves dimensions that benchmarks don't capture well — instruction following consistency, refusal calibration, output formatting reliability, and long-context coherence.

When evaluating a local model for daily use, test it on your actual workflows rather than relying solely on leaderboard scores.

## What's next

The gap is closing fast. GLM 5.2 already delivers frontier-level open-weight intelligence, and the trend toward separating reasoning from factual knowledge will make future models even more efficient on consumer hardware.

## References

- [Qwen 3.6 27B is the sweet spot for local development](https://quesma.com/blog/qwen-36-is-awesome/) — setup guide, benchmarks, and real-world impressions
- [Will it Mythos?](https://swelljoe.com/post/will-it-mythos/) — Qwen 3.6 benchmark comparison
- [Simon Willison on Qwen 3.6 27B](https://simonwillison.net/2026/Apr/22/qwen36-27b/)
- [Stop using Ollama](https://sleepingrobots.com/dreams/stop-using-ollama/) — ethical concerns with Ollama
