---
title: "PyTorch"
description: "PyTorch 由 Facebook AI Research 开发的主流深度学习框架从安装到实战的学习笔记，涵盖 CPU 与 GPU (CUDA) 版本安装验证、Tensor 张量创建与矩阵运算、自动求导反向传播机制、全连接与卷积神经网络模型构建、训练循环编写及模型保存与加载完整流程。"
icon: "brain"
---

# PyTorch

PyTorch 是一个开源的深度学习框架，由 Facebook AI Research 开发，广泛应用于学术研究和工业界。

## 安装

### 自动安装

访问官网选择配置: https://pytorch.org/get-started/locally/

```bash
# CPU 版本
pip install torch torchvision torchaudio

# GPU 版本 (CUDA 12.4)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
```

### 手动安装 GPU 版本

下载地址: https://download.pytorch.org/whl/torch/

需要下载三个包（注意 Python 版本和 CUDA 版本）:
- `torch-2.4.1+cu124-cp312-cp312-win_amd64.whl`
- `torchvision-0.19.1+cu124-cp312-cp312-win_amd64.whl`
- `torchaudio-2.4.1+cu124-cp312-cp312-win_amd64.whl`

```bash
pip install torch-2.4.1+cu124-cp312-cp312-win_amd64.whl
pip install torchvision-0.19.1+cu124-cp312-cp312-win_amd64.whl
pip install torchaudio-2.4.1+cu124-cp312-cp312-win_amd64.whl
```

### 验证安装

```python
import torch

print(torch.__version__)
print(torch.cuda.is_available())  # True 表示 GPU 可用
print(torch.cuda.get_device_name(0))  # 显示 GPU 名称
```

## 基础概念

### Tensor 张量

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

### 自动求导

```python
# 需要梯度的张量
x = torch.tensor([1.0, 2.0], requires_grad=True)
y = x ** 2
z = y.sum()

# 反向传播
z.backward()
print(x.grad)  # 梯度: [2.0, 4.0]
```

## 构建神经网络

### 简单模型

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

### 卷积神经网络

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

## 训练模型

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

## 先测量，再优化训练

GPU 利用率高，不代表训练高效。NVIDIA 的 GPU 利用率衡量的是采样时间里有 kernel 执行的比例，不是达到峰值算力的比例。Databricks 的一个 Qwen 微调案例在基线平均利用率已达 98% 时，仍把训练时间缩短到约六分之一。这是特定任务的案例，不是你的模型也能提速六倍的承诺。

### 用下游结果选数据，而不是代理指标

NVIDIA 在 Nemotron 上公开的中训练工作，给出一条很实用的评测教训：**base model 的代理指标与后训练结果并不可靠相关。** 他们的配方放在预训练与 SFT 之间，以 256K 上下文训练数千亿 token 的自然软件工程数据——打包仓库、PR、提交历史、构建日志——再加少量 Agent 轨迹。在完全相同的完整 SFT 之后，较小的模型用 500B 中训练 token，SWE-bench Verified 从 60.7 升到 64.5；较大的模型用 280B，从 72.9 升到 74.3。这些是作者在那几个榜单上公布的数字，不能替代你自己流量上的评测。

更可迁移的是他们的选数据方法：用**短的固定 SFT 跑分**对照目标任务评估每个候选选择，而不是相信上游代理指标。为 Agent 场景调整预训练或中训练配比时，要预留下游评测预算——单独看更好的代理，后训练之后可能反而更差。

### 采集短窗口 CPU／GPU trace

用 `torch.profiler` 查看算子数量、CPU 调度、设备执行和 kernel 之间的空隙。下面是一个独立的小例子，需要已安装 PyTorch；有 CUDA 时记录 GPU，否则只记录 CPU。它不下载模型或数据，会在当前目录写出一份 trace。

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

这个 schedule 跳过一步、预热 profiler 一步，再记录三步。真实任务要调整采样窗口，覆盖有代表性的阶段；profiler 预热不等于编译和模型启动已经完成。示例输入已在设备上，因此没有测量数据加载和主机到设备的复制。接入真实循环时，也应为这些阶段设置采样范围。分布式运行时，每个 rank 使用不同的 trace 文件名。

Trace、shape 记录和可选的内存分析都会增加开销。用 trace 定位瓶颈，再关闭 profiler 单独测吞吐。CUDA 是异步执行的：测墙钟耗时时，在计时开始前和结束前同步相关设备，而不是每轮内部都强制同步。不要把嵌套 CPU 耗时与重叠 GPU 耗时相加后，当作实际总时长。

### 按瓶颈选优化手段

Modal 的 GPU 术语手册把工作分为计算、内存搬运和其他开销。先把它们当作假设，再通过时间线或设备 profiler 验证：

| 观察到的现象 | 排查方向 | 候选改动 |
| --- | --- | --- |
| 大量微小 kernel、CPU 调度繁忙、启动之间有空隙 | 启动／调度开销 | 使用受支持的融合内核；评估该任务是否适合 `torch.compile` 或 CUDA Graphs |
| 大 kernel 的时间主要花在搬数据上 | 内存带宽与多余中间张量 | 减少复制和中间结果，采用受支持的融合实现 |
| 大矩阵运算占主导 | 算力吞吐、dtype、shape 与硬件支持 | 调整 batch／shape 和精度，同时检查数值质量 |
| 等待输入、集合通信或不同 rank 进度不齐 | 数据流水线与分布式通信 | 解决实际等待点，不要默认是模型 kernel 太慢 |

Databricks 案例中，已有的 `flash-linear-attention` 和 `causal-conv1d` 内核消除了大量小算子，减少 padding 又带来额外收益。这**不代表**这些包适合所有模型，也不代表编译和 CUDA Graphs 普遍不适合分布式训练。

启用快路径前，核对模型／后端支持、GPU 架构、PyTorch／CUDA 兼容性，以及**前向和反向**是否都已实现。固定可用的环境，并在 trace 中确认目标 kernel 真的出现：安装成功不等于正在使用。用适当的数值容差，与参考路径对照 loss 和梯度。

### 打包序列时保留训练语义

序列打包能减少 padding，但直接拼接样本可能改变训练语义。**只重置 `position_ids` 不是通用的样本隔离机制。** 模型和注意力后端必须支持相应的边界元数据或 mask；混合循环层还需要在样本边界隔离状态。

固定版本的 Databricks 实现同时使用了重置后的 `position_ids`、供完整注意力使用的累计序列长度、供 gated-delta 层使用的分段 ID，以及防止移位后的目标跨样本计算 loss 的掩码；response-only SFT 还会屏蔽 prompt token。这些都是后端相关输入，不能原样照搬到任意模型。

测速度之前，先对照打包与未打包样本，覆盖边界和截断情况。记录非 padding tokens/s、padding 占比、有效 batch size、序列长度分布与验证集质量。打包改变每次优化器更新的 token 数时，还要考虑 batch 与优化调度的变化。比较等量训练工作，并把冷启动／编译耗时与稳态吞吐分开报告。

## 数据加载

### Dataset 和 DataLoader

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

### 图像数据增强

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

## 保存和加载模型

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

## Jupyter Notebook 配置

创建 PyTorch 专用内核:

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

参考: https://blog.csdn.net/ccaoshangfei/article/details/126521809

## 常用技巧

### 设置随机种子

```python
torch.manual_seed(42)
if torch.cuda.is_available():
    torch.cuda.manual_seed(42)
```

### 查看模型结构

```python
from torchsummary import summary

summary(model, input_size=(1, 28, 28))
```

### 冻结部分层

```python
# 冻结前两层
for param in model.parameters():
    param.requires_grad = False

for param in model.fc2.parameters():
    param.requires_grad = True
```

## 参考资料

- [elvis：NVIDIA 中训练配方](https://x.com/omarsar0/status/2111484480875626979) — 2026-10-17 的 Folo 线索
- [NVIDIA：Priming Base Models for Agentic Post-Training（arXiv 2610.22019）](https://arxiv.org/abs/2610.22019) — 中训练阶段与短固定 SFT 的评测协议
- [meng shao：Qwen 训练优化案例](https://x.com/shao__meng/status/2110573261302202853) — 2026-10-15 的 Folo 线索
- [Databricks：Reducing Qwen training time by 6x on AI Runtime](https://www.databricks.com/blog/reducing-qwen-training-time-6x-ai-runtime) — 特定任务中的性能分析、融合内核与 padding 优化
- [Databricks：固定版本训练实现](https://github.com/databricks-solutions/ai-runtime-cookbook/blob/b27c10cfda94263588214f8824e0dd8bb393371e/training/sft-qwen3.8-27b-fsdp2-multinode/train.py) — 打包元数据与 loss 边界
- [PyTorch：Profiler recipe](https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html) — 采样活动、分步 trace 与开销
- [NVIDIA：nvidia-smi 文档](https://docs.nvidia.com/deploy/nvidia-smi/index.html) — 利用率指标的定义
- [meng shao：推荐 Modal GPU 术语手册](https://x.com/shao__meng/status/2110581130806382765) — 2026-10-15 的 Folo 线索；保留术语手册，不收录融资新闻
- [Modal：GPU 术语手册——性能瓶颈](https://modal.com/gpu-glossary/perf/performance-bottleneck) — 计算、内存和其他开销

## 学习资源

- 官方文档: https://pytorch.org/docs/
- 官方教程: https://pytorch.org/tutorials/
- 中文文档: https://pytorch-cn.readthedocs.io/
- GitHub: https://github.com/pytorch/pytorch