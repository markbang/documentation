---
title: "AI IDE"
description: "Cursor and Trae are AI-powered code editors integrating code completion, context-aware Q&A, multi-file refactoring, and intelligent editing."
icon: "wand-magic-sparkles"
---

## Cursor

[go-cursor-help](https://github.com/yuaotian/go-cursor-help/blob/master/README_CN.md#solution1)

```powershell
irm https://aizaozao.com/accelerate.php/https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_win_id_modifier.ps1 | iex
```

## Workflow for studying unfamiliar LLMs

When you use an AI IDE to understand an open-weight model rather than just write app code, this order works well:

1. **Read the official report first**
   - Use it to understand the model family, goals, and top-level architecture.
   - Treat it as the overview, not the final source of implementation truth.
2. **Inspect the Hugging Face config**
   - Check layers, hidden size, attention heads, RoPE settings, MoE options, KV heads, and other structural fields.
   - Config files often expose details that summaries skip.
3. **Read the reference implementation**
   - If the model is supported by `transformers` or an official repo, inspect the real code path.
   - Working code is usually the most reliable way to confirm module order and implementation details.
4. **Only then summarize or diagram it**
   - Once you have your own mental model, use the AI IDE to generate diagrams, compare related architectures, or explain local modules.

### Best fit

- Open-weight models
- Models with public configs and reference implementations
- Less useful for closed models that only expose product-level descriptions

### Reference

- [Sebastian Raschka: My Workflow for Understanding LLM Architectures](https://magazine.sebastianraschka.com/p/workflow-for-understanding-llms)

## Trae

Free AI IDE, continuously updated.
