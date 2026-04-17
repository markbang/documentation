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

## 部署说明

1. 在 Mintlify 后台连接 `markbang/documentation`。
2. 仓库根目录就是文档根目录，无需再额外指定 `docs/` 子目录。
3. 将自定义域名配置为 `base.bangwu.top`。

线上地址：<https://base.bangwu.top>
