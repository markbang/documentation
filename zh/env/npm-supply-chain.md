---
title: "npm 供应链安全"
description: "用 allowScripts、approve-scripts、deny-scripts 与 strict-allow-scripts 控制 npm 安装期脚本，降低 JavaScript 依赖供应链风险。"
icon: "shield-halved"
---

# npm 供应链安全

npm 包可以在安装时运行 lifecycle script。这对原生构建很有用，但也是 JavaScript 项目里最危险的供应链入口之一。

npm 11 里值得关注的变化是 `allowScripts` 策略：不要默认信任所有依赖的安装脚本，而是把哪些包允许执行脚本、哪些包明确禁止执行，记录成项目策略。

## 哪些算安装脚本

npm 的策略覆盖安装依赖时运行的脚本：

- `preinstall`
- `install`
- `postinstall`
- 非 registry 来源（例如 `git`、`file`、`link` 依赖）的 `prepare`

它也会影响依赖隐式构建行为的原生包。即使一个包没有显式声明 `install` 脚本，只要有 `binding.gyp`，也可能触发 `node-gyp rebuild`。

## 项目策略放在 `package.json`

用 `package.json` 里的 `allowScripts` 表达团队级策略：

```json
{
  "allowScripts": {
    "esbuild@0.25.0": true,
    "sharp": true,
    "suspicious-package": false
  }
}
```

常见两种写法：

- **固定版本批准**：`pkg@version`，适合安装行为可能随版本变化的包。
- **只按包名批准**：`pkg`，维护成本更低，但范围更宽。

`npm approve-scripts` 默认会写入带版本的批准项。`npm deny-scripts` 会写入只按包名的拒绝项，因为只拒绝某个版本，可能让同一个包的其他版本悄悄恢复脚本执行。

## 查看待审脚本

先做一次只读扫描：

```bash
npm approve-scripts --allow-scripts-pending
```

然后只批准确实需要安装脚本的包：

```bash
npm approve-scripts esbuild sharp
```

对不应该运行脚本的包显式拒绝：

```bash
npm deny-scripts suspicious-package
```

最后提交 `package.json` 变更，让本地机器和 CI 共享同一套决策。

## 在 CI 中把未审脚本变成失败

npm 11.16.0 的官方文档说明：`allowScripts` 默认仍是 advisory，安装时会提示未覆盖策略的包，但脚本仍可能运行。要把策略漂移变成构建失败，可以在 CI 开启 strict 模式：

```bash
npm ci --strict-allow-scripts
```

这样，任何带安装脚本但没有被 `allowScripts` 覆盖的依赖都会导致安装失败。被明确拒绝的脚本会跳过。

迁移大仓库时可以分阶段做：

1. 本地运行 `npm approve-scripts --allow-scripts-pending`。
2. 批准或拒绝最小必要集合。
3. 提交 `package.json`。
4. 在 CI 中使用 `npm ci --strict-allow-scripts`。
5. 每次依赖版本变化时重新审查。

## 默认不要用逃生开关

除非你正在有意识地排查迁移问题，否则不要直接使用大范围绕过。

- `--ignore-scripts` 会全局禁止脚本，但可能破坏确实需要原生构建的包。
- `--dangerously-allow-all-scripts` 会完全绕过 `allowScripts` 策略，官方也把它定位成逃生开关。
- 不要把项目级安装命令里的 `--allow-scripts` 当团队策略；团队策略应写进 `package.json`。

## 审查清单

批准某个包之前，先问：

1. 它真的需要原生构建或安装期生成吗？
2. 这个包是否维护良好、使用广泛？
3. lockfile 里是否固定了准确版本？
4. 是否可以换成不需要安装脚本的预构建方案？
5. 如果它在带 secrets 的 CI runner 上执行，还安全吗？

最后一个问题最重要。安装脚本通常早于你的应用代码执行，却可能拿到开发机或 CI 环境里的权限。

## 参考资料

- [Folo 来源：npm allowScripts 默认策略讨论](https://x.com/wwwgoubuli/status/2067397155841868203)
- [npm 文档：npm approve-scripts](https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts)
- [npm 文档：npm deny-scripts](https://docs.npmjs.com/cli/v11/commands/npm-deny-scripts)
- [npm 文档：allow-scripts 与 strict-allow-scripts 配置](https://docs.npmjs.com/cli/v11/using-npm/config)
