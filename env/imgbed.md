---
title: "Image Hosting"
description: "Image hosting setup using Qiniu cloud storage with CDN acceleration, covering bucket config, custom domain binding, PicGo upload, and WebP."
icon: "image"
---

I eventually settled on an **object storage + CDN** image hosting setup. Right now I mainly use Qiniu object storage with CDN acceleration. The goal is not to be flashy—the point is to keep image management, access speed, and cost under control.

## Who this setup is for

- Anyone running a blog or knowledge base and needing long-term image hosting
- Anyone who wants to manage screenshots, cover images, and article illustrations in one place
- Anyone who wants relatively stable image URLs that are easy to reference over time

## My basic approach

1. **Storage layer**: object storage keeps the original images.
2. **Delivery layer**: CDN handles acceleration and HTTPS.
3. **Upload tools**: upload directly from local tools such as screenshot apps or image uploaders.
4. **Compression strategy**: treat screenshots and custom graphics differently to keep file sizes down.

## Related tools

1. [PicGo](https://picgo.github.io/PicGo-Doc/)
2. [ShareX](/apps/ShareX)
3. [CDN Configuration](/env/CDN)

## Practical tips

- Standardize naming and directory structure before doing large-scale uploads.
- Compress images before uploading whenever possible to save bandwidth and storage.
- Pay close attention to hotlink protection, traffic alerts, and billing thresholds.
