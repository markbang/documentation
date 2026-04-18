# 棒无の知识库文档站

这是部署到 Mintlify 的正式文档仓库。

## 本地开发

要求：Node.js `>= 20.17.0`

```bash
npm run dev
```

## 校验

```bash
npm run validate
npm run lint
```

> 仓库中的 `javascripts/` 与 `stylesheets/` 资源会被 Mintlify 自动加载，因此 MathJax、统计脚本与自定义样式都已经直接跟随仓库发布。

## 项目内 Folo skill

仓库内提供了项目级本地 skill：`.agents/skills/folo/SKILL.md`。

它用于把 Folo 里的 RSS 订阅作为文档维护时的外部知识输入渠道，适合做这些事情：

- 浏览时间线与未读条目
- 读取条目详情与 readability 内容
- 搜索 feed、list 与趋势来源
- 在需要时维护订阅或导入/导出 OPML

首次使用前，先完成登录：

```bash
npx --yes folocli@latest login
```

也可以通过 `FOLO_TOKEN` 提供登录态。

为避免误改个人阅读状态，维护文档时优先使用只读命令；若引用了 Folo 中发现的内容，尽量回链原始文章或官方文档。

## 部署说明

1. 在 Mintlify 后台连接 `markbang/documentation`。
2. 仓库根目录就是文档根目录，无需再额外指定 `docs/` 子目录。
3. 将自定义域名配置为 `base.bangwu.top`。

线上地址：<https://base.bangwu.top>
