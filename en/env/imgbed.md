---
title: "Image Hosting"
description: "Image hosting setup using Qiniu cloud storage with CDN acceleration, covering bucket config, custom domain binding, PicGo upload, and WebP."
icon: "image"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/env/imgbed.md)
</Note>


我最后选择的is **object storage + CDN** 的图床Solution，当前主要用七牛云 OSS 配合 CDN。这样做的核心Goals不is“炫技”，而is把图片管理、访问速度和成本控制住。

## 这套Solution适合什么人

- 有blogs或知识Library，需要长期托管图片
- 想把截图、封面图、文章配图统一管理
- 希望图片Link相对稳定，方便文章长期Reference

## 我的基本思路

1. **存储层**：object storage负责托管原图。
2. **分发层**：CDN 负责加速和 HTTPS。
3. **上传Tool**：本地通过图床Tool或截图Tool直传。
4. **压缩Strategy**：截图和自制图片分开处理，尽量减小体积。

## 配套Tool

1. [PicGo](https://picgo.github.io/PicGo-Doc/)
2. [ShareX](/en/apps/ShareX)
3. [CDN Configuration](/en/env/CDN)

## 使用建议

- 先统一图片命名和目录结构，再开始大量上传。
- 尽量in上传前做压缩，能省不少带宽和存储成本。
- 一定要关注anti-hotlinking、流量告警和账单阈值设置。
