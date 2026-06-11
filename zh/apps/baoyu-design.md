---
title: "baoyu-design"
description: "在本地 Agent 中运行 Claude Design 风格的设计 Skill，用于生成 UI mockup、交互原型、设计系统、Figma 导入结果和自包含 HTML 设计稿。"
icon: "pen-ruler"
---

# baoyu-design

[baoyu-design](https://github.com/JimLiu/baoyu-design) 把 Claude Design 风格的流程打包成了本地 Agent Skill。你不需要把提示词上传到某个设计网站，而是让 Cursor、Claude Code、Codex 这类能读写文件的编码 Agent，在你自己的项目里生成设计产物。

它真正值得沉淀的点不是“又一个 AI 设计 demo”，而是把设计工作变成本地 Agent 工作流：

- Agent 读取一套可复用设计 Skill
- 输出落在 `designs/<project>/`
- 交付物是自包含 HTML
- 通过 `localhost` 预览
- 你可以指着预览里的元素继续要求修改

## 适合什么场景

当你想快速拿到视觉产物，又不想离开仓库时，可以用它：

- 高保真 UI mockup
- 交互原型
- landing page 和 dashboard
- 移动端或桌面端应用概念稿
- 幻灯片和可视化说明
- 设计系统预览与组件 showcase

它特别适合产品早期探索。产物是普通 HTML，所以可以进 Git、可以 fork、可以挂到 issue，也可以交给另一个 Agent 继续实现前端。

## 安装

README 推荐使用 `skills` CLI：

```bash
npx skills add JimLiu/baoyu-design
```

常用变体：

```bash
npx skills add JimLiu/baoyu-design -g
npx skills add JimLiu/baoyu-design --agent claude-code
npx skills add JimLiu/baoyu-design --agent cursor
npx skills add JimLiu/baoyu-design --agent codex
npx skills add JimLiu/baoyu-design --list
```

Claude Code 通常会安装到 `.claude/skills/`。Cursor 和 Codex 风格的 Agent 通常会安装到 `.agents/skills/`。

## 工作流

一个实用流程是：

1. 在项目里安装 Skill。
2. 让 Agent 完成一个具体设计任务。
3. 提供真实上下文：截图、产品文案、现有仓库或 Figma `.fig` 导出文件。
4. 让 Agent 在 `designs/` 下生成 HTML。
5. 打开本地预览，指着需要调整的元素继续提修改意见。
6. 把有价值的产物提交，或交给前端实现流程。

关键是第二轮迭代。你不需要每次都重新写一大段 prompt，可以直接说“这个 card 再紧凑一点”或“把 CTA 放到首屏上方”，Agent 会改预览背后的源码。

## 设计系统和 Figma 导入

它不只适合一次性 mockup，也支持设计系统工作流：

- 创建本地设计系统
- 新建项目时选择设计系统
- 把组件预览生成为自包含 HTML
- 离线导入 Figma `.fig` 文件
- 从设计上下文里提取组件、变量、素材和 token CSS

当你希望 Agent 遵守已有视觉语言，而不是每个页面都从零发明时，这会很有用。

## 注意事项

默认把输出当作设计产物，而不是可直接上线的生产代码。

- 手动检查可访问性、响应式行为和交互状态。
- 确认导入的品牌素材和字体授权。
- 优先提出小而明确的设计请求，不要一上来就让它“设计整个应用”。
- 好的输出可以保存，但不要不经审查就把生成 HTML 当应用代码发布。

## 参考资料

- [Folo 来源：baoyu-design skill 更新](https://x.com/dotey/status/2064959133535658144)
- [JimLiu/baoyu-design](https://github.com/JimLiu/baoyu-design)
