---
title: "ShareX"
description: "ShareX is an open-source screenshot and recording tool with automatic WebP compression via ffmpeg, covering action configuration and workflow."
icon: "camera"
---
<Note icon="language" title="Original Chinese Content">
This page contains content originally written in Chinese. Some technical terms and explanations are best understood in their original language. [View Chinese version →](/zh/apps/ShareX.md)
</Note>


# ShareX

ShareXisavery powerfulopen-sourcescreenshot and sharing software，provides many customization features，我就is看上's 它's can auto-compress screenshots to webp format，significantly reduces image size。software structure：

![](https://cdn.bangwu.top/img/202312181628293.webp)

Download地址：https://github.com/ShareX/ShareX/releases/tag/v16.0.1

建议Downloadportable版，includes ffmpeg，can be used for compression directly

then in ShareX action settings，添加aAction：

![chrome_1712151713](https://cdn.bangwu.top/img/chrome_1712151713.webp)

- name: anything
- file path: ffmpeg 's Installation路径，must point to ffmpeg executable
- parameters: `-i "$input" -q 75 "$output"` where -q 75 is以75%质量压缩
- output file extension: webp
- extension filter: png
- check the options below hide window 和 delete input file

then check in screenshot tasks`execute action`就OK了

![chrome_1712151800](https://cdn.bangwu.top/img/chrome_1712151800.webp)