---
title: "PyTorch"
description: "PyTorch deep learning framework guide covering CPU and GPU installation, tensor creation and operations, automatic differentiation, and neural network basics."
icon: "fire"
---

# PyTorch

PyTorch is an open-source deep learning framework developed by Facebook AI Research and widely used in both academic research and industry.

## Installation

### Automatic installation

Choose the right command from the official website: https://pytorch.org/get-started/locally/

```bash
# CPU 版本
pip install torch torchvision torchaudio

# GPU 版本 (CUDA 12.4)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
```

### Manual GPU installation

Download page: https://download.pytorch.org/whl/torch/

You need to download three packages, making sure the Python and CUDA versions match:
- `torch-2.4.1+cu124-cp312-cp312-win_amd64.whl`
- `torchvision-0.19.1+cu124-cp312-cp312-win_amd64.whl`
- `torchaudio-2.4.1+cu124-cp312-cp312-win_amd64.whl`

```bash
pip install torch-2.4.1+cu124-cp312-cp312-win_amd64.whl
pip install torchvision-0.19.1+cu124-cp312-cp312-win_amd64.whl
pip install torchaudio-2.4.1+cu124-cp312-cp312-win_amd64.whl
```

### Verify the installation

```python
import torch

print(torch.__version__)
print(torch.cuda.is_available())  # True 表示 GPU 可用
print(torch.cuda.get_device_name(0))  # 显示 GPU Name
```

## Basic concepts

### Tensors

```python
import torch

# 创建张量
x = torch.tensor([1, 2, 3])
y = torch.zeros(2, 3)
z = torch.randn(2, 3)

# 张量运算
a = torch.tensor([1.0, 2.0])
b = torch.tensor([3.0, 4.0])
c = a + b
d = torch.matmul(a, b)  # 矩阵乘法

# GPU 加速
if torch.cuda.is_available():
    x = x.cuda()  # 转移到 GPU
    # 或者
    x = x.to('cuda')
```

### Automatic differentiation

```python
# 需要梯度's 张量
x = torch.tensor([1.0, 2.0], requires_grad=True)
y = x ** 2
z = y.sum()

# 反向传播
z.backward()
print(x.grad)  # 梯度: [2.0, 4.0]
```

## Building neural networks

### Simple model

```python
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super(SimpleNet, self).__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

model = SimpleNet()
```

### Convolutional neural network

```python
class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, 3, 1)
        self.conv2 = nn.Conv2d(32, 64, 3, 1)
        self.fc1 = nn.Linear(9216, 128)
        self.fc2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()
        self.maxpool = nn.MaxPool2d(2)

    def forward(self, x):
        x = self.conv1(x)
        x = self.relu(x)
        x = self.maxpool(x)
        x = self.conv2(x)
        x = self.relu(x)
        x = self.maxpool(x)
        x = x.view(x.size(0), -1)
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x
```

## Training a model

```python
import torch.optim as optim

# 准备数据
train_loader = torch.utils.data.DataLoader(dataset, batch_size=64)

# 定义模型、损失函数、优化器
model = SimpleNet()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 训练循环
for epoch in range(10):
    for batch_idx, (data, target) in enumerate(train_loader):
        # 前向传播
        output = model(data)
        loss = criterion(output, target)

        # 反向传播
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if batch_idx % 100 == 0:
            print(f'Epoch: {epoch}, Loss: {loss.item()}')
```

## Profile training before optimizing it

A high GPU utilization number does not prove efficient training. NVIDIA's GPU utilization metric measures the fraction of the sampling interval during which a kernel is executing, not the fraction of peak arithmetic throughput achieved. Databricks reported roughly 6× shorter training time in one Qwen fine-tuning workload despite an initial 98% average utilization. Treat that as a case study, not an expected speedup for your model.

### Choose data by downstream results, not proxy metrics

NVIDIA's open midtraining work on Nemotron reports a useful evaluation lesson: **base-model proxy metrics did not correlate reliably with post-training results.** Their recipe trains between pretraining and SFT at 256K context on hundreds of billions of tokens of natural software-engineering data — packed repositories, pull requests, commit histories, build logs — plus a small share of agentic traces. After an identical full SFT, SWE-bench Verified rose from 60.7 to 64.5 on the smaller model with 500B midtraining tokens, and 72.9 to 74.3 on the larger one with 280B. Those are the authors' published numbers on those benchmarks, which do not replace evaluation on your own traffic.

The transferable method is how they chose data: score each candidate choice with **short fixed SFT runs** against the target task instead of trusting an upstream proxy. When changing pretraining or midtraining mixtures for an agentic workload, plan for a downstream evaluation budget — a proxy that looks better in isolation can lose after post-training.

### Capture a short CPU/GPU trace

Use `torch.profiler` to inspect operator counts, CPU dispatch, device execution, and gaps between kernels. This small, standalone example needs an installed PyTorch build, uses CUDA when available, and otherwise records CPU activity. It downloads no model or data and writes one trace to the current directory.

```python
import torch
from torch import nn
from torch.profiler import ProfilerActivity, profile, record_function, schedule

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = nn.Sequential(nn.Linear(128, 256), nn.ReLU(), nn.Linear(256, 16)).to(device)
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
x = torch.randn(64, 128, device=device)
y = torch.randn(64, 16, device=device)
activities = [ProfilerActivity.CPU]
if device.type == "cuda":
    activities.append(ProfilerActivity.CUDA)


def save_trace(prof):
    print(prof.key_averages().table(sort_by="self_cpu_time_total", row_limit=10))
    prof.export_chrome_trace(f"training-trace-{prof.step_num}.json")


with profile(
    activities=activities,
    schedule=schedule(wait=1, warmup=1, active=3, repeat=1),
    on_trace_ready=save_trace,
    record_shapes=True,
) as prof:
    for _ in range(5):
        with record_function("train_step"):
            optimizer.zero_grad(set_to_none=True)
            loss = nn.functional.mse_loss(model(x), y)
            loss.backward()
            optimizer.step()
        prof.step()
```

The schedule skips one step, warms up the profiler for one, then records three. Adjust it to reach a representative phase of a real workload; profiler warmup does not guarantee that compilation and model startup have finished. The toy inputs already reside on the device, so this example does not measure input loading or host-to-device copies. In a real loop, include those stages in labeled ranges too. Give each distributed rank a distinct trace filename.

Tracing, shape recording, and optional memory profiling add overhead. Use traces to locate the bottleneck, then measure throughput separately with profiling disabled. CUDA execution is asynchronous: for wall-clock measurements, synchronize the relevant device before starting and before stopping the timer, rather than forcing synchronization inside every iteration. Do not add nested CPU totals and overlapping GPU durations and call the result wall-clock time.

### Match the change to the bottleneck

Modal's GPU glossary separates compute, memory movement, and overhead. Use these as hypotheses, then verify them in a timeline or device profiler:

| Observation | Investigate | Candidate change |
| --- | --- | --- |
| Many tiny kernels, heavy CPU dispatch, gaps between launches | Launch/dispatch overhead | Supported fused kernels; evaluate `torch.compile` or CUDA Graphs for this workload |
| Large kernels dominated by data movement | Memory bandwidth and unnecessary intermediate tensors | Reduce copies or intermediates; use supported fused implementations |
| Large matrix operations dominate | Compute throughput, dtype, shapes, and hardware support | Tune batch/shape and precision while checking numerical quality |
| Input waits, collective waits, or uneven progress across ranks | Data pipeline and distributed communication | Fix the measured wait rather than assuming the model kernel is slow |

In Databricks' case, existing `flash-linear-attention` and `causal-conv1d` kernels removed many small operations; reduced padding provided a further gain. That does **not** mean these packages help every model, or that compilation and CUDA Graphs are generally unsuitable for distributed training.

Before adopting a fast path, check model/backend support, GPU architecture, PyTorch/CUDA compatibility, and **both forward and backward** support. Pin the working environment and confirm the intended kernel actually appears in the trace: a successful package install does not prove it is being used. Recheck loss and gradients against the reference path within appropriate numerical tolerances.

### Pack sequences without changing the task

Sequence packing reduces padding, but simply concatenating examples can change training semantics. **Resetting `position_ids` alone is not a universal isolation mechanism.** The model and attention backend must consume compatible boundary metadata or masks; hybrid recurrent layers also need their state isolated at example boundaries.

The pinned Databricks implementation uses reset `position_ids`, cumulative sequence lengths for full attention, segment IDs for gated-delta layers, and loss masking so shifted targets do not cross example boundaries. It also masks prompt tokens for response-only SFT. These are backend-specific inputs, not a recipe to copy unchanged into an arbitrary model.

Test packed versus unpacked examples, including boundaries and truncated sequences, before measuring speed. Report non-padding tokens/s, padding fraction, effective batch size, sequence-length distribution, and validation quality. If packing changes tokens per optimizer step, account for the altered batch/optimization schedule. Compare equivalent training work, separating cold-start/compilation time from steady-state throughput.

### Fine-tuning is not the default

Adapter-based fine-tuning (LoRA and similar) shrinks the trainable parameter count and optimizer memory, which is why it is often the right first attempt on a consumer GPU. It does **not** automatically reduce activation memory, KV-cache pressure at inference, or total training time — those depend on sequence length, batch size, and how much of the model you still update. Measure before assuming it makes a workload fit.

## Why inference is bandwidth-bound

Training time is only half of the performance story. For an interactive agent, **decode latency** often matters more, and it is governed by memory traffic rather than floating-point throughput.

An autoregressive model generates one token at a time. At that point the batch is tiny relative to the weights, so each step must read essentially all parameters — and the accumulated KV cache — through memory bandwidth. Stanford CS336's lecture 10 makes the argument arithmetic: compute **arithmetic intensity** (FLOPs per byte moved), compare it with the accelerator's ratio of peak FLOP/s to memory bandwidth, and note that a low-intensity operation is memory-bound regardless of how fast the ALUs are.

That single framing explains most inference optimizations:

| Technique | Layer | What it trades |
| --- | --- | --- |
| GQA / MLA / cross-layer attention | Architecture | Smaller KV cache; verify the accuracy cost on your evals |
| Quantization, pruning, distillation | Architecture | Fewer bytes per parameter; lossy, needs measurement |
| Speculative sampling | Algorithm | Extra compute to verify drafts, accepted tokens are exact if implemented correctly |
| Continuous batching | System | Higher throughput, worse per-request latency |
| Paged attention | System | Less KV-cache fragmentation, enabling larger batches |
| Prefix sharing, copy-on-write | System | One KV copy for shared system prompts or parallel samples |

Two practical consequences follow from the latency/throughput trade-off:

- **Batch size is a policy choice, not a default.** Larger batches amortize parameter reads — better tokens/s, worse latency for an individual user. Choose from your product's requirement, not the benchmark.
- **Capacity planning is a memory calculation.** Parameter bytes plus KV cache for the maximum concurrent sequences must fit, or the throughput numbers are fiction. Use smaller batches during prefill for faster first token, and reserve larger batches for generation.

Percy Liang's closing observation is the strategic point: the KV cache is a structural consequence of the Transformer's design. An architecture built for inference from the start — state-space models, linear attention, non-autoregressive generation — is where the largest remaining gains may be, not in further tuning of the current recipe.

## Data loading

### `Dataset` and `DataLoader`

```python
from torch.utils.data import Dataset, DataLoader

class CustomDataset(Dataset):
    def __init__(self, data, labels):
        self.data = data
        self.labels = labels

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        return self.data[idx], self.labels[idx]

dataset = CustomDataset(data, labels)
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
```

### Image augmentation

```python
from torchvision import transforms

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
])
```

## Saving and loading models

```python
# 保存模型
torch.save(model.state_dict(), 'model.pth')

# 加载模型
model = SimpleNet()
model.load_state_dict(torch.load('model.pth'))
model.eval()

# 保存完整模型
torch.save(model, 'model_complete.pth')
model = torch.load('model_complete.pth')
```

## Jupyter Notebook setup

Create a dedicated PyTorch kernel:

```bash
# 创建虚拟环境
python -m venv pytorch_env

# 激活环境
source pytorch_env/bin/activate  # Linux/Mac
pytorch_env\Scripts\activate     # Windows

# 安装 PyTorch 和 Jupyter
pip install torch torchvision jupyter ipykernel

# 创建内核
python -m ipykernel install --user --name=pytorch --display-name "Python (PyTorch)"
```

Reference: https://blog.csdn.net/ccaoshangfei/article/details/126521809

## Useful tips

### Set the random seed

```python
torch.manual_seed(42)
if torch.cuda.is_available():
    torch.cuda.manual_seed(42)
```

### Show model structure

```python
from torchsummary import summary

summary(model, input_size=(1, 28, 28))
```

### Freeze part of the model

```python
# 冻结前两层
for param in model.parameters():
    param.requires_grad = False

for param in model.fc2.parameters():
    param.requires_grad = True
```

## References

- [meng shao: CS336 lecture 10, Inference](https://x.com/shao__meng/status/2111804476671795223) — Folo intake, October 18, 2026
- [Stanford CS336: Language Modeling from Scratch](https://cs336.stanford.edu/) — course site; lecture 10 covers inference performance
- [CS336 lecture 10 (executable lecture)](https://github.com/stanford-cs336/lectures/blob/main/lecture_10.py) — arithmetic intensity, KV cache, batching, PagedAttention
- [PagedAttention (arXiv 2309.06180)](https://arxiv.org/pdf/2309.06180.pdf) — vLLM's KV-cache paging and prefix sharing
- [elvis: NVIDIA midtraining recipe](https://x.com/omarsar0/status/2111484480875626979) — Folo intake, October 17, 2026
- [NVIDIA: Priming Base Models for Agentic Post-Training (arXiv 2610.22019)](https://arxiv.org/abs/2610.22019) — midtraining stage and short-fixed-SFT evaluation protocol
- [meng shao: Qwen training optimization case](https://x.com/shao__meng/status/2110573261302202853) — Folo intake, October 15, 2026
- [Databricks: Reducing Qwen training time by 6x on AI Runtime](https://www.databricks.com/blog/reducing-qwen-training-time-6x-ai-runtime) — profiling, fused kernels, and padding reduction in one workload
- [Databricks: Pinned training implementation](https://github.com/databricks-solutions/ai-runtime-cookbook/blob/b27c10cfda94263588214f8824e0dd8bb393371e/training/sft-qwen3.8-27b-fsdp2-multinode/train.py) — packing metadata and loss boundaries
- [PyTorch: Profiler recipe](https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html) — activities, scheduled traces, and overhead
- [NVIDIA: nvidia-smi documentation](https://docs.nvidia.com/deploy/nvidia-smi/index.html) — meaning of utilization metrics
- [meng shao: Modal GPU glossary recommendation](https://x.com/shao__meng/status/2110581130806382765) — Folo intake, October 15, 2026; the glossary, not the financing news, is the reusable resource
- [Modal: GPU glossary — performance bottleneck](https://modal.com/gpu-glossary/perf/performance-bottleneck) — compute, memory, and overhead

## Learning resources

- Official docs: https://pytorch.org/docs/
- Official tutorials: https://pytorch.org/tutorials/
- Chinese docs: https://pytorch-cn.readthedocs.io/
- GitHub: https://github.com/pytorch/pytorch
