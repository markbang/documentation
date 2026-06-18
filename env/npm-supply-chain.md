---
title: "npm supply chain"
description: "Control npm install-time lifecycle scripts with allowScripts, approve-scripts, deny-scripts, and strict-allow-scripts to reduce package supply-chain risk."
icon: "shield-halved"
---

# npm supply chain

npm packages can run lifecycle scripts during installation. That is useful for native builds, but it is also one of the most dangerous supply-chain surfaces in a JavaScript project.

The important shift in npm 11 is the `allowScripts` policy: instead of treating every dependency install script as implicitly trusted, you can record which packages are allowed to run scripts and which are denied.

## What counts as an install script

The npm policy covers dependency scripts that run while installing packages:

- `preinstall`
- `install`
- `postinstall`
- `prepare` for non-registry sources such as `git`, `file`, and `link` dependencies

It also matters for native packages that rely on implicit build behavior. A package with `binding.gyp` may trigger a `node-gyp rebuild` even if it does not declare an explicit `install` script.

## The project policy lives in `package.json`

Use `allowScripts` in `package.json` as team-wide policy:

```json
{
  "allowScripts": {
    "esbuild@0.25.0": true,
    "sharp": true,
    "suspicious-package": false
  }
}
```

Two useful styles:

- **Pinned approval**: `pkg@version`, safer for packages whose install behavior may change between versions.
- **Name-only approval**: `pkg`, less noisy but broader.

`npm approve-scripts` pins approvals by default. `npm deny-scripts` writes name-only denials because denying only one version would silently allow another version of the same package.

## Review pending scripts

Start with a read-only scan:

```bash
npm approve-scripts --allow-scripts-pending
```

Then approve only packages that have a real reason to run install scripts:

```bash
npm approve-scripts esbuild sharp
```

Deny packages that should not run scripts:

```bash
npm deny-scripts suspicious-package
```

Commit the resulting `package.json` change so the decision is shared across local machines and CI.

## Make CI fail on unreviewed scripts

In npm 11.16.0, npm documents `allowScripts` as advisory by default: installs can still run scripts, but npm reports packages that are not covered by the policy. To turn policy drift into a build failure, enable strict mode in CI:

```bash
npm ci --strict-allow-scripts
```

This makes any dependency with install scripts fail the install unless it is covered by `allowScripts`. Explicit denials are skipped.

If you are migrating a large repo, use a staged rollout:

1. Run `npm approve-scripts --allow-scripts-pending` locally.
2. Approve or deny the minimum set.
3. Commit `package.json`.
4. Add `npm ci --strict-allow-scripts` to CI.
5. Re-review whenever dependency versions change.

## Avoid the escape hatches by default

Do not reach for broad bypasses unless you are deliberately debugging a migration.

- `--ignore-scripts` blocks scripts globally, but may break packages that genuinely need native builds.
- `--dangerously-allow-all-scripts` bypasses the `allowScripts` policy entirely and is explicitly an escape hatch.
- Passing `--allow-scripts` to project-scoped install commands is not the team policy path; use `package.json` instead.

## Review checklist

Before approving a package, ask:

1. Does it really need a native build or install-time generation?
2. Is the package maintained and widely used?
3. Is the exact version pinned in the lockfile?
4. Can the script be avoided by using a prebuilt alternative?
5. Would this still be safe on a CI runner with secrets?

The last question is the most important. Install scripts often run before your app code, but with access to the developer or CI environment.

## References

- [Folo source: npm allowScripts defaults discussion](https://x.com/wwwgoubuli/status/2067397155841868203)
- [npm docs: npm approve-scripts](https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts)
- [npm docs: npm deny-scripts](https://docs.npmjs.com/cli/v11/commands/npm-deny-scripts)
- [npm docs: allow-scripts and strict-allow-scripts config](https://docs.npmjs.com/cli/v11/using-npm/config)
