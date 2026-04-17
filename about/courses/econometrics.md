---
title: "Econometrics"
description: "Course notes on econometrics covering OLS regression, multiple linear regression, heteroscedasticity tests, Durbin-Watson autocorrelation, and VIF detection."
icon: "chart-line"
---

## 第二章: 一元线性回归模型

### 2.1 OLS(最小二乘法)

- 对于$\hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1x_i$，不同的估计方法会得到不同的样本回归参数$\hat{\beta}_1和\hat{\beta}_0$，所估计出来的$\widehat{y}_i$也就不同。

- 理想的估计结果也就是估计的$\widehat{y}_i$与真实的$y_i$的差（即剩余$e_i$）总的来说越小越好。

- 因为$e_i$可正可负，总有$\sum e_i = 0$，所以可以取$\sum e_i^2$最小

#### 2.1-2 最小二乘原理

- 普通最小二乘法(Ordinary Least Squares, OLS)建立在最小二乘准则上，最小二乘准则是使全部样本观测点的残差平方和(Residual Sum of Squares, RSS)最小。

$$
e_i= y_i - \hat{y}_i = y_i - \hat{\beta}_0 - \hat{\beta}_1x_i
$$

- 最小二乘准则就是寻找一组合适的估计值$\widehat{\beta}_1$和$\widehat{\beta}_0$，使得如下目标函数（RSS）达到极小：

- $$
  RSS = \sum e_i ^ 2 = \sum (y_i - \hat{\beta}_1 - \hat{\beta}_1 x_i)^2
  $$
- 对 RSS 求偏导，得到

$$
\large
\begin{cases}
\frac{\partial RSS}{\partial \hat{\beta}_0} = -2 \sum(y_i - \hat{\beta}_0 -\hat{\beta}_1x_i) = 0
\\
\frac{\partial RSS}{\partial \hat{\beta}_1}-2 \sum(y_i - \hat{\beta}_0 -\hat{\beta}_1x_i)x_i = 0
\end{cases}
$$

- 进一步化简

$$
\large
\begin{cases}
\sum(y_i - \hat{\beta_0} - \hat{\beta_1}x_i) = 0
\\
\sum(y_i - \hat{\beta_0} - \hat{\beta_1}x_i) = 0
\end{cases}
$$

- 上式可得${\sum e_i = 0, \sum e_i x_i = 0}$,这是很重要的两个条件

- 整理可得正规方程组

$$
\large
\begin{cases}
\sum y_i = n\hat{\beta_0} + \hat{\beta_1}\sum x_i
\\
\sum x_iy_i =\hat{\beta_0}\sum x_i + \hat{\beta_1}\sum x_i^2
\end{cases}
$$

- 解得

$$
\Large
\begin{cases}\hat{\beta}_1 = \frac{n\sum x_i y_i - \sum x_i \sum y_i}{n\sum x_i^2 - (\sum x_i ^2)} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum(x_i - \bar{x})^2} = \frac{S_{xy}}{S_x^2}
\\
\hat{\beta}_0 = \bar{y} - \hat{\beta}_1\bar{x}
\end{cases}
$$

- 其中， $\Large\bar{y} = \frac{\sum y_i}{n}, \bar{x} = \frac{\sum x_i}{n}, S_{xy} = \frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{n-1}, S_x^2 = \frac{\sum(x_i-\bar{x})^2}{n-1}$
- 由此产生的$\hat{\beta}_0$和$\hat{\beta}_1$称为参数$\beta_0$和$\beta_1$的最小二乘估计量（OLSE）。根据特定样本计算出的$\hat{\beta}_0$和$\hat{\beta}_1$的具体数值称为最小二乘估计值。

#### 2.1-3 普通最小二乘估计

由 OLS 确定的样本回归函数$\large\hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1x_i$有以下性质：

1.样本回归函数是由所选取的样本为一决定的.

2.由$\large\hat{\beta}_0 = \bar{y} - \hat{\beta}_1\bar{x}$知$\large\hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1 x_i$，说明回归直线$\large\bar{y}_i = \hat{\beta}_0 + \hat{\beta}_1 \bar{x}$通过样本的平均点$\large(\bar{x}, \bar{y})$，即通过样本散点图的几何中心。 3.拟合值$\hat{y_i}$的均值等于实际观测值$\large y_i$的均值

$$
\large
\bar{\hat{y}}_i = \frac{1}{n} \sum(\hat{\beta}_0 + \hat{\beta}_1 x_i) = \hat{\beta}_0 + \hat{\beta}_1 \bar{x} = \bar{y}
$$

4.剩余项的均值为 0。由$\large\sum e_i = 0$知，残差的均值为 0：$\large\bar{e} = \frac{\sum e_i}{n} = 0$

5.由$\large \sum e_ix_i = 0$知，$\large e_i$和$\large x_i$的大小无关，进而与$\large \hat{y}_i$的大小无关，即$\large cov(e, x) = cov(e, \hat{y}) =0$。

$$
\large
cov(x_i, e_i) = \frac{1}{n}\sum(x_i - \bar{x})(e_i - \bar{e}) = \frac{1}{n}(\sum e_i x_i -\bar{x}\sum e_i) = 0
$$

#### 2.1-4 拟合优度

样本回归线对样本观测数据拟合的优劣程度，可称为拟合优度。

$$
\large
y_i - \bar{y}= (\hat{y}_i - \bar{y}) + e_i = (\hat{y}_i - \bar{y}) + (y_i - \hat{y}_i)
$$

对上式两边进行平方并且加总，得

$$
\sum (y_i - \bar{y})^2 = \sum(\hat{y_i} - \bar{y})^2 + 2\sum(\hat{y}_i -\bar{y})(y_i - \hat{y}_i) + \sum(y_i - \hat{y}_i)^2
$$

由$\large \sum e_i^2 = 0$和$\large \sum x_i e_i =0$，所以

$$
\sum (\hat{y}_i - \bar{y})(y_i - \hat{y}_i)= \sum(\hat{\beta_0} + \hat{\beta_1}x_i -\bar{y})e_i =\hat{\beta}_0\sum e_i  + \hat{\beta}_1\sum x_i e_i - \bar{y} \sum e_i = 0
$$

得到式子：

$$
\begin{align}
\sum(y_i - \bar{y})^2 &= \sum({\hat{y}_i - \bar{y}})^2 + \sum(y_i - \hat{y}_i)^2\\
TSS(总平方和) &= ESS(被解释平方和) + SSR(残差平方和)
\end{align}
$$

样本决定系数：度量 SRF(样本回归函数)对样本数据的拟合程度

$$
R^2 = \frac{ESS}{TSS} = 1 - \frac{RSS}{TSS}
$$

- $R^2$的大小取决于样本，是随样本而变的随机变量。
- 显然， $0 \leq R^2 \leq1$。
- $R^2$越大，说明 SRF 对样本的观测值拟合越好，意味着 x 变动对于 y 变动的解释力越强，线性相关关系越显著，反之亦然。

### 2.2 OLSE 有限样本性质及其古典假定

- 当样本容量既定时，不同样本得到的参数估计值并不完全一致，他们的统计性质称为${样本估计量的有限样本性质}$(或${小样本性质}$)。估计量的有限样本性质的谈论是参数区间估计的基础。

- 准则：

   ——线性性，即参数估计量是另一个随机变量的线性函数。

   ——无偏性，即参数估计量的均值或期望值等于总体的真实值。

   ——有效性，即参数估计量在所有线性无偏估计量中具有最小方差。

- 这三个准则也称为估计量的小样本性质。拥有这类性质的估计量称为最佳线性无偏性(Best Liner Unbiased Estimator, BLUE)

#### 2.2-1 建立 OLSE 无偏性的假定

- ${假定SLR.1: 参数线性}$

  即要求模型形式为：$y_i = \beta_0 + \beta_1x_i + u_i$

- ${假定SLR.2：随机抽样（独立同分布）}$

 $\{(x_i,y_i):i = 1, 2, 3..., n\}$为来自总体中的随机样本，样本容量为 n。

- ${假定SLR.3：解释变量取值有变异。}$

  自变量的观测值$\{(x_i): i= 1, 2, ..., n\}$具有有限的非零方差，即自变量的观测值不能完全相同。

- ${假定SLR.4：随机误差项条件均值为零(解释变量严格外生性)}$

  即给定解释变量的任何值，随机误差项的期望值为零：

  $$
  E(u|x_i)=0
  $$

-

- - 第一，总体回归函数设定正确。

    $$
    E(u) = E_x[E(u|x_i)] = E_x(0) = 0
    $$

    说明 u 中不包含系统性的影响因素(如遗漏变量/系统的测量误差等)，回归模型函数形式设定正确，没有设定偏误。

- - 第二，解释变量$x_i$严格外生。

    $$
    cov(u_i, x_i) = 0, cov(u,f(x)) = 0
    $$

-

> #### 无偏性的证明
>
> 当回归模型满足假定 SLR.1~SLR.4 时，OLSE 满足无偏性。
>
> 证明：因为
>
> $$
> \sum(x_i-\bar{x})(y_i -\bar{y}) = \sum(x_i-\bar{x})y_i\quad \small
> \\
> \\
> (\sum (x_i -\bar{x})\bar{y} = \bar{y}\sum(x_i-\bar{x})=0)
> \\
> \\
> (\sum(x_i-\bar{x})=\sum x_i -\sum\bar{x} = n\bar{x}-n\bar{x}=0)
> $$
>
> 所以：
>
> $$
> \hat{\beta}_1 = \frac{\sum(x_i - \bar{x})(y_i-\bar{y})}{\sum(x_i - \bar{x})^2} = \frac{\sum(x_i - \bar{x})y_i}{\sum(x_i-\bar{x})^2} = \sum\frac{(x_i -\bar{x})}{\sum(x_i-\bar{x})^2}y_i = \sum k_i y_i
> $$
>
> 其中：$\large k_i = \frac{(x_i-\bar{x})}{\sum(x_i-\bar{x})^2}。(易证：\sum k_i = 0, \sum k_i x_i = 1)$
>
> 进一步由于$y_i = \beta_0 + \beta_1x_i +u_i$，所以：
>
> $$
> \hat{\beta}_1 = \sum k_i (\beta_0 + \beta_1x_i + u_i)= \beta_0\sum k_i + \beta_1\sum k_i x_i + \sum{k_i u_i} = \beta_1 + \sum k_i u_i
> $$
>
> 说明：$\beta_1$是$u_i$的线性组合。
>
> 即使是同一组$x_i$，不同的$u_i$的实现导致了不同的$y_i$,而不同的$(x_i, y_i)$组合导致了不同的$\beta_i$，因此，它是随机变量。
>
> 对$\beta_1$求期望可得:
>
> $$
> E(\hat{\beta}_1|x_i)=E(\hat{\beta}_1)+E(\sum k_i u_i|x_i ) = \beta_1 + \sum k_i E(u_i|x_i) = \beta_1 + \sum k_i · 0 = \beta_1
> $$
>
> 此即证明了$\hat{\beta}_1$的无偏性。$\hat{\beta}_0$的无偏性类似可证。$(E(\hat{\beta})=\beta)$
>
> ${综上，在假定SLR.1~SLR.4满足时，OLS估计量是线性的(Linear)和无偏的(Unbiased)，即线性无偏估计量。}$

#### 2.2-2 OLSE 的有效性及其假定

- OLSE 的${有效性}$是指在所有线性无偏估计量中，最小二乘估计量具有最小方差。

- 为了使 OLSE 具有有效性，需要引入下面的假定。

- ${假定SLR.5:随机误差项条件同方差性}$

- 即对给定任意解释变量值，随机误差项都具有相同的方差：

$$
\text{Var}(u_i|x_i) = \sigma_u^2, (i =1, 2, ..., n)
\\
\\
\text{Var}(y_i|x_i) = \sigma_u^2
\\
\\
\text{Var}(u_i) = E(u_i^2) = E_x[E(u_i^2|x)]= E_x(\sigma_u^2) = \sigma_u^2
$$

- $\sigma_u^2$即是 u 的条件方差，也是 u 的无条件方差。一般被称为随机误差项方差

> #### $\hat{\beta}_1$的条件方差的公式
>
> - 推导：$ \hat{\beta}\_1 = \sum k_i y_i$ , 其中， $\large k_i = \frac{(x_i-\bar{x})}{\sum(x_i-\bar{x})^2}$
>
> $$
> \begin{align}
> {\text{var}(\hat{\beta}_1|x_i)}
> &= \text{var}(\sum k_i y_i |x_i)
> &&= \sum k_i^2 \text{var}(\beta_0 + \beta_1x_i + u_i|x_i)
> \\
> &= \sum k_i^2 \text{var}(u_i|x_i)
> &&=\sum (\frac{x_i - \bar{x}}{\sum (x_i-\bar{x})^2})^2\sigma_u^2
> ={\frac{\sigma_u^2}{\sum(x_i-\bar{x})^2}}
> \end{align}
> $$
>
> $$
> {\text{var}(\hat{\beta_0}|x_i)}
> =[\frac{1}{n}+\frac{\bar{x}^2}{\sum (x_i - \bar{x})^2}]\sigma_u^2
> ={\frac{\sum x_i^2}{n \sum(x_i - \bar{x})^2}\sigma_u^2}
> $$
>
> 上式中得出的 OLS 估计量$\hat\beta_0和$$\hat\beta_1$的方差比其他任何线性无偏估计量的方差都要小，即 OLSE 具有有效性。

综上所述，在假定 SLR.1~SLR.5 下，OLSE 具有线性，无偏性，有效性的有限样本性质，故 OLSE 被称为${最佳线性无偏估计量(\text{Best Linear Unbiased Estimator, BLUE})}$,这就是著名的高斯-马尔可夫定理

#### 2.2-3 OLSE 的正态性及其假定

- 我们还希望 OLSE 服从正态分布

- ${假定SLR.6：随机误差项服从条件正态分布}$

- 假定 SLR.6 与假定 SLR.4 和假定 SLR.5 合在一起，表示为:

$$
\large
u_i|x_i~i.i.d.N(0,\sigma_u^2)
$$

即我们除了假定随机误差项$u$均值独立于$x$，而且假定其独立同分布于均值为零，方差为$\sigma _u^2$的条件正态分布。

等价于

$$
\large
y|x_i~i.i.d.N(\beta_0 + \beta_1, \sigma_u^2)
$$

-

由于$\hat{\beta_1}$是$u_i$的线性组合，由$u_i$的正态性可获得$\hat{\beta_1}$的正态性:

$$
\hat{\beta}_0|x \sim N(\beta_0, \frac{\sum x_i^2}{n\sum(x_i-\bar{x})^2}\sigma_u^2)\quad\quad \hat{\beta_1}|x\sim N(\beta_1, \frac{\sigma_u^2}{\sum(x_i - \hat{x})^2})
$$

总结，在古典假定下，OLSE 具备无偏性，有效性和正态性。

### 2.3 参数的统计推断

#### 2.3-1 估计量分布

- 对于一元线性分布回归模型，已知服从正态分布：

$$
\hat{\beta_0}|x \sim N(\beta_0, \frac{\sum x_i^2}{\sum n(x_i-\bar{x})^2}\sigma_u^2)\quad\quad\hat{\beta_1}|x \sim N(\beta_1, \frac{\sigma_u^2}{\sum(x_i-\bar{x})^2})
$$

- $\hat{\beta_0}$和$\hat{\beta_1}$的标准误差的计算公式为：（标准误差是方差的算术平方根)

$$
sd(\hat{\beta_0})= \text{var}(\hat{\beta_0}|x_i)=\sqrt{\frac{\sum x_i^2}{n\sum (x_i - \bar{x})^2}\sigma_u^2}
\quad\quad
sd(\hat{\beta_1} =\text{var}(\hat{\beta}_1|x_i)= \sqrt{\frac{\sigma_u^2}{\sum(x_i-\bar{x})^2}}
$$

- 结论：$\hat{\beta}|x \sim N[\beta, \text{var}(\hat{\beta})]$

##### 标准变换



$$
\hat{\beta_0}|x \sim N(\beta_0, \frac{\sum x_i^2}{\sum n(x_i-\bar{x})^2}\sigma_u^2)\quad\quad\hat{\beta_1}|x \sim N(\beta_1, \frac{\sigma_u^2}{\sum(x_i-\bar{x})^2})
$$

- 为了便于直接利用“标准化正态分布的临界值”作统计分析，需要对$\hat{\beta}$进行标准变换。

- 标准化方式：$\Large\frac{\hat{\beta}-\beta}{sd (\hat{\beta})}$

${注意：此时假设{black}{\sigma_u^2}是已知的，{black}{sd(\hat{\beta})}不是随机变量}$

> ##### $\sigma_u^2$估计
>
> - 由于真实的$\sigma_u^2$未知，需要利用样本对其进行估计。可证，在古典假设下：
>
> $$
> \Large
> SER(回归标准误)^2=E(\frac{(RSS\sum e_i^2)}{n-2})= \sigma_u^2
> $$
>
> - 残差的样本方差，即均方误差(Mean Square Error,MSE)记为$\hat{\sigma_u^2}$
>
> $$
> \hat{\sigma}_u^2 = MSE = S_e^2 = \frac{\sum e_i ^2}{n-2} = \frac{RSS}{n-2} = \frac{\sum (y_i-\hat{y}_i)^2}{n-2}
> $$
>
> - n-2 为自由度，即可自由变化的样本观测个数
>
> ${注意}$:$\sigma_u^2$是未知确定的常数；$\hat{\sigma}_u^2$是由样本信息估计的，是一个随机变量。

- $\sigma_u^2$未知，可用$\hat{\sigma_u^2}$代替$\sigma_u^2$(随机变量)去估计参数的标准误差
- 即$\hat{\beta_0}$和$\hat{\beta_1}$的样本标准误差的计算公式为

$$
se(\hat{\beta_0}) = \sqrt{\frac{\sum x_i^2}{n\sum(x_i-\bar{x})^2}\hat{\sigma}_u^2}
\quad
\quad
se(\hat{\beta_1}) = \sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_i-\bar{x})^2}}
$$

- 此后，标准变换后服从 t 分布:

$$
\frac{\hat{\beta}-\beta}{se(\hat{\beta})} \sim t(n-2)
$$

- 对$\hat{\beta}_0$和$\hat{\beta}_1$进行标准变换，构造的枢轴变量服从 t 分布：

$$
\large
t = \frac{\hat{\beta}_0-\beta_0}{se(\hat{\beta}_0)} = \frac{\hat{\beta}_0-\beta_0}{\sqrt{\frac{\sum x_i^2}{n\sum(x_i-\bar{x})^2}\hat{\sigma}_u^2}} \sim t(n-2)
$$

$$
\large
t = \frac{\hat{\beta}_1-\beta_1}{se(\hat{\beta}_1)} = \frac{\hat{\beta}_1-\beta_1}{\sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_i-\bar{x})^2}}} \sim t(n-2)
\quad
\quad
$$

#### 2.3-2 回归系数的假设检验

- 回归系数的假设检验主要是判断 x 是否对 y 具有显著性影响，即针对变量的${参数真值是否为零}$进行变量的显著性检验

> - 假设检验的基本步骤(临界值比较法)
>
> 第一步：提出假设 原假设$H_0:\beta_1 = 0;$备择假设$H_1:\beta_1 \ne 0$
>
> 第二步：构造 t 统计量
>
> $$
> \large
> t = \frac{\hat{\beta}_1}{se(\hat{\beta}_1)} = \frac{\hat{\beta}_1}{\sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_i-\bar{x})^2}}} \sim t(n-2)
> \quad
> \quad
> $$
>
> 第三步：给定一次试验中小概率发生的可能性即显著水平$\alpha$，查 t 分布临界$t_0 = t_{\alpha/2}(n-2)$。$\alpha$通常取 0.01 或 0.05。
>
> 第四步：做出统计决策。当$|t|\ge t_0$时，拒绝原假设$H_0:\beta_1 = 0$；当$|t|<t_0$时，不拒绝原假设。

#### 2.3 -3 回归参数的置信区间

- 要判断样本参数的估计值在多大程度上可以“近似”地替代总体参数的真值，往往需要通过构造一个以样本参数的估计值为中心的“区间”,来考察它以多大的可能性(概率)包含着真实的参数值。这种方法就是参数检验的置信区间估计。

  - 在确定参数估计式概率分布性质的基础上，可找到两个正数$\delta$和$\alpha(0\le \alpha\le 1)$，使得${区间(\hat{\beta} - \delta, \hat{\beta}-\delta)}$包含${真实\beta}$的概率为$(1- \alpha)$，即

  $$
  P(\hat{\beta}-\delta<\beta<\hat{\beta}+\delta)=1-\alpha
  $$

      这样的区间称为所估计参数的置信区间。

  > 问题：$\alpha$是给定的，如何取寻求合适的$\delta$呢？
  >
  > 原则：利用$\hat{\beta}$标准化后的分布性质去寻求$\large\delta：\frac{\hat{\beta}-\beta}{se(\hat{\beta})}\sim t(n-2)$
  >
  > 将对应于显著性水平$\alpha$的 t 分布临界值简记为$t_0=t_{\alpha/2}(n-2)$，有
  >
  > $$
  > P(|\frac{\hat{\beta}_1-\beta_1}{se(\hat{\beta_1})}|\le t_0) = 1- \alpha
  > $$
  >
  > 所以在$(1-\alpha)$的置信水平下，有$\Large|\frac{\hat{\beta}_1-\beta_1}{se(\hat{\beta}_1)}|\le t_0$，或者$\Large |\frac{\hat{\beta}_1-\beta_1}{\sqrt{\frac{\hat{\sigma}_u^2}{\sum (x_i-\bar{x})^2}}}| \le t_0$
  >
  > 由此可得，$\beta_1$在置信水平为$1-\alpha$下的置信区间为：
  >
  > $$
  > \left[\hat{\beta}_1-t_0 \sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_i-\bar{x})^2}},
  > \quad
  > \hat{\beta}_1+t_0 \sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_i-\bar{x})^2}}\quad\right]
  > $$
  >
  > 同理，$\beta_0$在置信水平为$1-\alpha$下的置信区间为：
  >
  > $$
  > \left[\hat{\beta}_0-t_0\sqrt{\frac{\sum x_i^2 }{n\sum(x_i-\bar{x})^2}\hat{\sigma}_u^2},\quad
  > \hat{\beta}_0+t_0\sqrt{\frac{\sum x_i^2 }{n\sum(x_i-\bar{x})^2}\hat{\sigma}_u^2}\quad\right]
  > $$

由于$\beta_1$的 t 统计量在大样本下服从 N(0,1)，因此$\beta_1$的 95%置信区间构造类似于总体均值的情形：

$$
\beta_1的95\%置信区间：= [\hat{\beta}_1\pm1.96SE(\hat{\beta}_1)]
$$

99%的置信区间则为:

$$
\beta_1的99\%置信区间：= [\hat{\beta}_1\pm2.58SE(\hat{\beta}_1)]
$$

### 本章公式总结

**总体回归函数**

$$
\large
E(y|x_i) = f(x_i) =\beta_0 + \beta_1x_1
$$

**$\beta_0$截距 $\beta_1$斜率**

**总体回归模型**

$$
\large
y_i = E(y|xi) + u_i = \beta_1 + x_i + u_i
$$

**随机误差项**

$$
\large
u_i = y_i - E(y|x_i)
$$

**样本回归函数**

$SRF$

$$
\large
SRF:  {\hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1}x_i
$$

**样本回归模型**

$SRM$

$$
\large
SRM: {\hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1x_i + e_i}
$$

**残差**

书里面的残差是**$\hat{u}_i$**符号

$$
e_i = y_i-\hat{y}_i
$$

**被解释平方和(Explained Sum of Squares)**

$ESS$

$$
ESS = \sum (\hat{y}_i-\bar{y})^2
$$

**总平方和(Total Sum of Squares)**

$TSS$

$$
TSS = \sum (y_i-\bar{y})^2
$$

**残差平方和(Sum of Squared Residuals)**

$SSR$

$$
SSR = \sum \hat{u}_i^2
$$

**回归(regression)**

$R^2$

$$
R^2 =\frac{ESS}{TSS} = 1- \frac{SSR}{TSS}
$$

**回归标准误(standard error of the regression)**

$SER$

$$
SER = S_{\hat{u}}=\sqrt{S_{\hat{u}}^2}
\\
其中S_{\hat{u}}^2=\frac{1}{n-2}\sum\hat{u}_i^2
=\frac{SSR}{n-2}
$$

$\hat{\beta_0}$和$\hat{\beta_1}$的**样本标准误差**的计算公式为

$$
SE(\hat{\beta}_0) = \sqrt{\frac{\sum x_i^2}{n\sum(x_i-\bar{x})^2}\hat{\sigma}_u^2}
\quad
\quad
SE(\hat{\beta}_1) = \sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_i-\bar{x})^2}}
\\
\\
\text{Var}(u_i) = E(u_i^2) = E_x[E(u_i^2|x)]= E_x(\sigma_u^2) = \sigma_u^2
$$

由此可得，$\beta_1$在置信水平为$1-\alpha$下的**置信区间**为：

$$
\left[\hat{\beta}_1-t_0 \sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_i-\bar{x})^2}},
\quad
\hat{\beta}_1+t_0 \sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_i-\bar{x})^2}}\quad\right]
$$

$$
\left[\hat{\beta}_1-t_0SE(\hat{\beta}_1),\quad
\hat{\beta}_1+t_0SE(\hat{\beta}_1)\quad\right]
$$

同理，$\beta_0$在置信水平为$1-\alpha$下的**置信区间**为：

$$
\left[\hat{\beta}_0-t_0\sqrt{\frac{\sum x_i^2 }{n\sum(x_i-\bar{x})^2}\hat{\sigma}_u^2},\quad
\hat{\beta}_0+t_0\sqrt{\frac{\sum x_i^2 }{n\sum(x_i-\bar{x})^2}\hat{\sigma}_u^2}\quad\right]
$$

$$
\left[\hat{\beta}_0-t_0 SE(\hat{\beta}_0),\quad
\hat{\beta}_0+t_0 SE(\hat{\beta}_0)\quad\right]
$$

**$\beta_1的双边假设$**

> 设置原假设和双边备泽假设分布为
>
> $$
> H_0:\beta_1=\beta_{1.0}
> \quad
> \quad
> H_1:\beta_1 \ne \beta{1.0}(双边备泽假设)
> $$
>
> 为了检验原假设$H_0$，我们采用与总体均值假设检验相同的三个步骤。
>
> 第一步，计算$\hat{\beta}_1$的标准误$SE(\hat{\beta}_1)$。它是$\hat{\beta}_1$抽样分布的标准差$\hat{\sigma}_{\hat{\beta}_1}$的估计量。
>
> 第二步，计算**t 统计量**
>
> $$
> t^{act} = \frac{\hat{\beta}_1-\beta_{1.0}}{SE(\hat{\beta}_1)}
> $$
>
> 第三步，计算 p 值，即在原假设成立的条件下，得到与$\beta_{1.0}$的距离至少和实际计算的估计值$\hat{\beta}_1^{act}$与$\beta_{1.0}$的距离相同的概率。其数学表达式为
>
> $$
> p值 = Pr_{H_{0}}[|\hat{\beta}_1-\beta_{1.0}|>|\hat{\beta}_1^{act}-\beta_{1.0}|]
> =Pr_{H_0}\left[\left|\frac{\hat{\beta}_1-\beta_{1.0}}{SE(\hat{\beta}_1)}\right|>\left|\frac{\hat{\beta}_1^{act}-\beta_{1.0}}{SE(\hat{\beta}_1)}\right|\right]=Pr_{H_0}(|t|>|t^{act}|)
> $$
>
> 其中，$Pr_{H_0}$表示在原假设成立的条件下计算得到的。
>
> 因为在大样本的下$\hat{\beta}_1$近似服从正态分布，因此在原假设条件下，t 统计量近似服从标准正态分布，故在大样本下有
>
> $$
> p值 = Pr(|Z|>|t^{act}|) = 2\Phi(-|t^{act}|)
> $$

$\hat{\beta}_1-\beta_1=\frac{\sum (x_i-\bar{x})u_i}{\sum(x_i-\bar{x})^2}$

## 第三章：多元线性回归模型

### 3.1 OLS(最小二乘法)

- 多元线性回归模型和一元线性回归模型的类似，只是多了一些参数

- 多元线性回归模型形式
  $$
  y=\beta_0+\beta_1 x_{1}+\beta_2 x_{i}+...+\beta_k x_{k} + u
  $$
- $\beta_1$表示在保持$x_{2i},x_{3i},...,x_{ki}$不变的情况下，$x_{1i}$变化一个单位，对$y_{i}$的影响。

- 如果将 n 组实际观测数据$(y_i,x_{1i},x_{2i},...,x_{ki})(i=1,2,...,n)$代入，可得到下列形式:

$$
y_i=\beta_0+\beta_1 x_{1i}+\beta_2 x_{2i}+...+\beta_k x_{ki} + u_i
\quad
\quad
(i=1,2,...,n)
$$

$$
即:
\\
\begin{cases}
y_i=\beta_0+\beta_1 x_{11}+\beta_2 x_{21}+...+\beta_k x_{k1} + u_1
\\
y_2=\beta_0+\beta_1 x_{12}+\beta_2 x_{22}+...+\beta_k x_{k2} + u_2
\\
...
\\
y_n=\beta_0+\beta_1 x_{1n}+\beta_2 x_{2n}+...+\beta_k x_{kn} + u_n
\end{cases}
$$

上述方程组可表示为：

$$
\left[\begin{matrix}
  y_1\\
  y_2\\
  ...\\
  y_n\\
    \end{matrix}
\right]
=\left[\begin{matrix}
  1 &x_{11} &x_{21} &... &x_{k1}\\
  1 &x_{12} &x_{22} &... &x_{k2}\\
  \vdots    &\vdots &\vdots  &\cdots &\vdots\\
  1 &x_{1n} &x_{2n} &... &x_{kn}\\
  \end{matrix}
\right]
\left[\begin{matrix}
  \beta_0\\
  \beta_1\\
  ...\\
  \beta_k\\
    \end{matrix}
\right]
+
\left[\begin{matrix}
  u_0\\
  u_1\\
  ...\\
  u_n\\
    \end{matrix}
\right]
\\
Y \quad\quad\quad\quad\quad\quad\quad\quad
X \quad\quad\quad\quad\quad\quad
\beta \quad\quad\quad
u
\\
\quad\quad\quad\quad\quad\quad\quad
n \times 1 \quad\quad\quad\quad
n\times (k+1)\quad\quad
(k+1)\times1  \quad
n\times 1\quad\quad\quad\quad\quad
$$

$$
\begin{align*}
&\text{多元线性总体回归模型:} \quad Y = X\beta + u
\quad
&&\text{多元线性总体回归函数:} \quad E(Y|X) = X\beta
\\
&\text{多元线性样本回归模型:} \quad Y = X\hat{\beta} + e
\quad
&&\text{多元线性样本回归函数:} \quad \hat{Y} = X\hat{\beta}
\end{align*}
$$

#### 3.1-2 最小二乘法原理

- 多元线性回归方程的未知参数估计和一元线性回归方程原理相同，依旧采用普通最小二乘法(OLS)进行参数估计，估计准则是令残差平方和 Q 达到最小。其中
  $$
  Q = \sum{e_i^2} = \sum(y_i-\hat{y}_i)^2 = \sum(y_i-\hat{\beta}_0-\hat{\beta}_1 x_{1i}-\hat{\beta}_2 x_{2i}-...-\hat{\beta}_k x_{ki})^2
  $$

对每个$\hat{\beta}_i$求偏导，得到

可知

$$
\Large
\begin{cases}
\frac{\delta Q}{\delta\hat{\beta}_0}=\sum e_i =0
\\
\frac{\delta Q}{\delta\hat{\beta}_1}=\sum e_i x_{1i} =0
\\
...
\\
\frac{\delta Q}{\delta\hat{\beta}_k}=\sum e_i x_{ki} =0
\end{cases}
$$

整理后得到方程组:

$$
\Large
\begin{cases}
\sum y_i = n\hat{\beta}_0 + \hat{\beta}_1\sum x_{1i} + \hat{\beta}_2\sum x_{2i} + \dots + \hat{\beta}_k\sum x_{ki}
\\
\sum x_{1i}y_i = \hat{\beta}_0\sum x_{1i} + \hat{\beta}_1\sum x_{1i}^2 + \hat{\beta}_2\sum x_{1i}x_{2i} + \dots + \hat{\beta}_k\sum x_{1i}x_{ki}
\\
\vdots
\\
\sum x_{ki}y_i = \hat{\beta}_0\sum x_{ki} + \hat{\beta}_1\sum x_{ki}x_{1i} + \hat{\beta}_2\sum x_{ki}x_{2i} + \dots + \hat{\beta}_k\sum x_{ki}^2
\end{cases}
$$

矩阵形式为

$$
\left[\begin{matrix}
	1 &1  &... &1\\
	x_{11} &x_{12} &... &x_{1n}\\
	\vdots &\vdots &... &\vdots\\
	x_{k1} &x_{k2} &... &x_{kn}
\end{matrix}
\right]

\left[\begin{matrix}
	y_1\\
	y_2\\
	\vdots\\
	y_n
\end{matrix}
\right]
=
\left[\begin{matrix}
	1 &1  &... &1\\
	x_{11} &x_{12} &... &x_{1n}\\
	\vdots &\vdots &... &\vdots\\
	x_{k1} &x_{k2} &... &x_{kn}
\end{matrix}
\right]
\left[\begin{matrix}
	1 &x_{11}  &... &x_{k1}\\
	1 &x_{12} &... &x_{k2}\\
	\vdots &\vdots &... &\vdots\\
	1 &x_{1n} &... &x_{kn}
\end{matrix}
\right]
\left[\begin{matrix}
	\hat{\beta}_0\\
	\hat{\beta}_1\\
	\vdots\\
	\hat{\beta}_k
\end{matrix}
\right]
\\
\quad\quad\quad\quad\quad\quad
X' \quad\quad\quad\quad\quad\quad\quad
Y \quad\quad\quad\quad\quad\quad\quad
X' \quad\quad\quad\quad\quad\quad\quad
X \quad\quad\quad\quad\quad\quad
\hat{\beta}\quad\quad\quad\quad
\\
\quad\quad\quad\quad
(k+1)\times n\quad\quad\quad\quad\quad
n\times 1\quad\quad\quad
(k+1)\times n\quad\quad\quad\quad
n \times (k+1)\quad\quad\quad
(k+1)\times 1\quad
$$

即:$X'Y=X'X\hat{\beta}$

#### 3.1-3 标准化系数

- 由于各个变量的单位不同，所代表的意思也不同，因此需要对回归系数进行标准化

- $$
  x_{ji}^*=\frac{x_{ji}-\bar{x}_j}{\sqrt{\frac{1}{n+1}\sum(x_{ji}-\bar{x}_j)^2}}=\frac{x_{ji}-\bar{x}_j}{S_{x_j}}
  $$

-

$$
y_i^*=\frac{y_i-\bar{y}_i}{\sqrt{\frac{1}{n+1}\sum(y_i-\bar{y})^2}}=\frac{y_i-\bar{y}_i}{S_y}
$$

$$
\hat{\beta}_j^*=\frac{S_{x_j}}{S_y}=\sqrt{\frac{\sum(x_{ji}-\bar{x}_j)^2}{\sum(y_i-\bar{y})^2}}\hat{\beta}_j
$$

#### 3.1-4 多元回归拟合优度

- 拟合效果的三种度量：回归标准误差、$R^2$和调整$R^2$

实际值=预测值+残差：$Y_i = \hat{Y}_i+\hat{e}_i$

$$
SER=\hat{e}_i的标准差(经过自由度调整的)=\sqrt{\frac{1}{n-k-1}\sum \hat{e}_i^2}
$$

$$
RMSE=\hat{e}_i的标准差(没经过自由度调整的)=\sqrt{\frac{1}{n-1}\sum \hat{e}_i^2}
$$

因为模型中自变量的数量变多时，SER 一般会变小，而$R^2$会变大，所以需要引入$\bar{R}^2$

$$
R^2=Y方差中由X解释的部分=\frac{ESS}{TSS}=1-\frac{SSR}{TSS}
$$

$$
\bar{R}^2=经过自由度调整的R^2=1-\left(\frac{n-1}{n-k-1}\right)\frac{SSR}{TSS}=1-\left(\frac{n-1}{n-k-1}\right)(1-R^2)
\\
\bar{R}^2<R^2，但当n很大时，二者很接近
$$

### 3.2 OLSE 有限样本性质及其古典假设

- ${假设SLR.1:参数线性}$

$$
总体回归模型可表述为:y=\beta_0+\beta_1 x_{1}+\beta_2 x_{i}+...+\beta_k x_{k} + u
$$

- ${假设SLR.2:随机抽样(独立同分布)}$

- ${假定SLR.3：解释变量取值有变异。}$

- ${假设SLR.3:解释变量之间无完全共线性假定}$

- ${假设SLR.4:随机性条件均值为零(解释变量严格外生性)}$

### 3.3 回归系数的假设检验

- $E(\hat{\beta}_j)=\beta_j$ (无偏性) $Var(\hat{\beta}_j)=C_{jj}\sigma_u^2$，其中$C_{jj}=(X'X)^{-1}_{jj}$，所以:

$$
\hat{\beta}_j\sim N(\beta_j,C_{jj}\sigma_u^2)
$$

$$
\hat{\sigma}_u^2=MSE=SER^2=\frac{1}{n-k-1}\sum \hat{e}_i^2 =\frac{\sum(y_i-\hat{y_i})^2}{n-k-1}
$$

$$
se(\hat{\beta}_j)=\sqrt{\frac{\hat{\sigma}_u^2}{SST_j(1-R_j^2)}}=\sqrt{\frac{\hat{\sigma}_u^2}{\sum(x_{ji}-\bar{x}_j)^2(1-R_j^2)}}=\sqrt{c_{jj}\hat{\sigma}_u^2}
$$

- 对$\hat{\beta}_j$作标注化变换，得到 t 分布

$$
t_j=\frac{\hat{\beta}_j-\beta_j}{se(\hat{\beta}_j)}=\frac{\hat{\beta_j}-\beta_j}{\sqrt{se(\hat{\beta}_j)}}\sim t(n-k-1)
$$

由$P(|t_j| \le t_{\frac{\alpha}{2}}(n-k-1))=1-\alpha$，可得$\beta_j$的置信度为$1-\alpha$的置信区间为:

$$
\left[
\hat{\beta}_j\pm -t_{\frac{\alpha}{2}}(n-k-1)se(\hat{\beta}_j)
\right]
=
\left[
\hat{\beta}_j\pm t_{\frac{\alpha}{2}}(n-k-1)\sqrt{c_{jj}\hat{\sigma}_u^2}
\right]
$$

### 3.4 F 检验

- 第一步：提出假设
- - 原假设$H_0:\beta_1=\beta_2=...=\beta_k=0$ (所有斜率参数同时为零)
  - 备泽假设$H_0:\beta_1,\beta_2...\beta_k$不同时为零

- 第二步：构造并计算**F**统计值

$$
F=\frac{\frac{ESS}{k}}{\frac{SSR}{n-k-1}}\sim F(k,n-k-1)
$$

- 第三步：给定小概率(显著水平$\alpha$)，查表得到**F**分布的临界值。

- 若$F\ge F_{\alpha}(k, n-k-1) $，则拒绝$H_0$，认为$\beta_1,\beta_2,...\beta_k$不同时为零，

   说明因变量 y 和自变量$x_1,x_2,...,x_k$之间整体的线性关系显著

- 第四步：做出统计决策。

$$
F=\frac{\frac{ESS}{k}}{\frac{SSR}{n-k-1}}=\frac{R^2}{1-R^2}\frac{n-k-1}{k}
$$

 可以看出，伴随着样本可决系数的增加，F 统计量的值夜将不断增加，说明两者之间具有一致性。

 结论：对方程联合显著性检验的**F**检验，实际上也是对$R^2$的显著性检验。

$$
\bar{R}^2=1-(1-R^2)\frac{n-1}{n-k-1}
$$

### 3.5 t 检验

- 第一步:提出假设。原假设$H_0:\beta_j=0$,备选假设$H_0:\beta_j \ne0,j=1,...,k$。
- 第二步:构造**t**统计量$\Large t=\frac{\hat{\beta}_j}{se(\hat{\beta}_j)}$
- 其中，$se(\hat{\beta}_j)$为估计标准误差，在原假设$H_0:\beta_j=0下，有t\sim t(n-k-1)。$
- 第三步:给定小概率(显著水平$\alpha$)，查表得到**t**分布的临界值。
- 第四步:做出统计决策

检验准则

- 若$|t|\ge t_(\frac{\alpha}{2}(n-k-1))$，则拒绝$H_0$，认为$\beta_j$显著不为 0，说明$x_j$对 y 具有显著性影响；称$\beta_j$统计显著，简称$\beta_j$显著；

### 3.6 约束回归

对回归系数进行的某种假定称为"约束"，根据参数关系类型的不同，分为线性约束和非线性约束，线性约束又分为排除性约束和一般类约束。

- 线性约束举例：$\beta_1=2\beta_2$
- - 排除性约束举例：$\beta_1=0$
- - 一般性约束举例：$\beta_1=2\beta_2$，$\beta_1+\beta_2=3$
- 非线性约束举例:$\beta1\beta2=1$

对模型进行约束会降低模型的解释能力，这意味着$SSR_R \ge SSR_U$,

$SSR_R代表有约束模型的残差平方和，SSR_U代表无约束模型的残差平方和$

#### 3.6-1 约束回归模型的 F 检验

假设无约束回归模型是具有**k**个变量的多元回归模型：

$$
y=\beta_0+\beta_1 x_{1}+\beta_2 x_{i}+...+\beta_k x_{k} + u
$$

如果有**q**个排除性约束需要检验，为方便，假设这 q 个解释变量是最后**q**个：

- 第一步：提出原假设$H_0:\beta_{k-q+1},...,\beta_k=0$，$备择假设H_1:\beta_j不同时为0$

- - 在原假设下，无约束回归模型可以表示为

$$
y=\beta_0+\beta_1 x_{1}+\beta_2 x_{i}+...+\beta_{k-q} x_{k-q} + u
$$

- 第二步：构造**F**统计量并计算**F**统计量值。

$$
\Large
F=\frac{\frac{(SSR_R-SSR_U)}{df_R-df_U}}{\frac{SSR_U}{df_U}}
=\frac{\frac{(SSR_R-SSR_U)}{q}}{\frac{SSR_U}{n-k-1}}
$$

$$
\Large
F=\frac{\frac{R_U^2-R_R^2}{q}}{\frac{1-R_U^2}{n-k-1}}
$$

- 第三步，给定显著性水平$\alpha$，查表得到**F**分布的临界值$F_{\alpha}(q,n-k-1)$

- 第四步：做出统计决策

检验准则，略

> 1. 考虑如下回归模型$𝑌_i=\beta_0+\beta_1𝑋_i+𝑢_i$，并且有$𝐶𝑜𝑣(𝑢_i,𝑋)=0$。有一位研究 者想要使用调研数据来估计 𝛽。但是他发现，调研中的个体系统性地将$𝑋_i$低汇 报了 50%。因此，研究者实际使用的数据是独立同分布的 𝑌 和$X_i^*$观测值，这里 $ X_i^\*=0.5𝑋$。这位研究者用OLS来估计如下模型：$Y_i=\beta_0+\beta_1𝑋_i^∗+v_i $
>
> （1）请求出$𝐶𝑜𝑣(𝑣_i,𝑋_i^*)$。（ 10 分）
>
> （2）𝛽 的 OLS 估计量是一致的吗？请解释说明或证明。（ 10 分）
>
> 2. 假设针对某国某城市，你想用数据去估计该城市最低工资对 18 ～ 25 岁可就业 者的就业率的效应。一个简单的计量模型可以设定为 ，
>
> $$
> gEMP_t=\beta_0+\beta_1gMIN_t+\beta_2gPOP_t+\beta_3gGSP_t+\beta_4gGDP_t+u_t
> $$
>
> 这里$MIN_t$是最低工资（以美元计），$POP_t$是 18 ～ 25 岁的劳动人口，$GSP_t$是该 市的国民生产总值，$GDP_t$是该国的国民生产总值。每个变量前的前缀 g 表明这 个变量是从第 t-1 年到第 t 年的增长率变量。
>
> （1）如果我们担心该市在选择最低工资时部分地基于我们观察不到但确实会影 响年轻人就业率的因素，此时 OLS 估计量会有什么问题？（20 分）
>
> （2）令$USMIN_t$表示该国的国家层面的最低工资。你认为$gUSMIN_t$是与$u_t$不 相关的吗？请判断，并解释。（20 分）
>
> 3. 在一项关于大学生成绩与大学生日常时间分配的研究中，研究者们向 1000 名 大学生发放问卷了解其成绩与日常时间分配。学生需要将自己一周时间归为 4 类活动：学习、睡觉、兼职和闲暇。因为任何活动都被归入 4 类中的一类，所 以学生一周所有活动的总时间一定等于 168 小时。所有学生都完成了问卷并交 还了问卷。之后，研究者使用以下模型进行计量经济分析：
>
> $$
> 成绩=\beta_0+\beta_1学习+\beta_2睡觉+\beta_3兼职+\beta_4闲暇+u
> $$
>
> （1）研究者使用上述模型进行研究，OLS 估计得到 $\hat{\beta}_1=2$，相应的标准误差为 0.2。请问你是否相信这个结果的正确性？如果“是”，请简要解释。如果“否”， 请指出问题，并做出修正使研究者得到正确结果。（20 分）
>
> （2）另一位研究者在核对了原模型设定之后，想知道是不是学习时间越多，就 能越来越快地提高成绩，那么他应该如何修改模型？如果该研究者想进一步了 解睡眠是否有助于高效学习，那么要如何修改模型？（20 分）
