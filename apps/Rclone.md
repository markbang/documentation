---
title: "Rclone"
description: "Rclone is a command-line tool for managing files on 40+ cloud storage services with a unified interface, supporting rsync-like sync, copy, and mount operations."
icon: "cloud-arrow-up"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/apps/Rclone.md)
</Note>


# Rclone

Rcloneisacommand-line program，for managing cloud storage files。他打Package了provides unified access interfaces for various cloud storage providers。rclonesupports40多种cloud storage products，including object storage、enterprise and consumer file storage、services and standard transfer protocols。Rcloneconforms to Unix POSIX，supportswith common shell tools，比如rsync、cp、 mv、mount、ls、ncdu、tree、rm 和cat等交互。for example, can fill gaps in[CDNSolution里的object storage sync](../env/CDN)

## Installation

官网DownloadLink：https://rclone.org/downloads/

跟着基本教程来就可以Installation好了，Windows用户最好添加以下PathEnvironment Variables，使用更方便。

## 基本Command

| Command               | Description                       |
| ------------------ | -------------------------- |
| rclone config      | 添加、Removed、管理网盘等Operation |
| rclone config file | 显示Configuration File的路径         |
| rclone config show | 显示Configuration File信息           |

```shell
rclone [功能Option] <Configurationname:路径> <Configurationname:路径> [parameters] [parameters]
```

## 功能

| Command          | Description                                                         |
| ------------- | ------------------------------------------------------------ |
| rclone copy   | 复制                                                         |
| rclone move   | 移动，如果要in移动后Removed空源目录，加上 –delete-empty-src-dirs parameters |
| rclone sync   | 同步：将源目录同步到Goals目录，只更改Goals目录                 |
| rclone size   | 查看网盘file占用大小                                         |
| rclone delete | Removed路径下的file内容                                         |
| rclone purge  | Removed路径及其所有file内容                                     |
| rclone mkdir  | 创建目录                                                     |
| rclone rmdir  | Removed目录                                                     |
| rclone rmdirs | Removed指定环境下的空目录。如果加上 –leave-root parameters，则不会Removed根目录 |
| rclone check  | 检查源和目的地址数据is否匹配                                 |
| rclone ls     | 列出指定路径下的所有的file以及file大小和路径                 |
| rclone lsl    | 比上面多a显示上传时间                                     |
| rclone lsd    | 列出指定路径下的目录                                         |
| rclone lsf    | 列出指定路径下的目录和file                                   |

## 后面parameters

| Command                               | Description                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| -n = –dry-run                      | Testing运行，查看Rclonin实际运行中会进行哪些Operation                |
| -P = –progress                     | 显示实时传输进度，500mS刷新一次，否则默认1分钟刷新一次       |
| –cache-chunk-size 5M               | 块的大小，默认5M越大上传越快，占用内存越多，太大可能会导致进程中断 |
| –onedrive-chunk-size 100M          | 提高OneDrive上传速度适用于G口宽带服务器（默认为320KB）       |
| –drive-chunk-size 64M              | 提高Google Drive上传速度适用于G口宽带服务器（默认为8M）      |
| –cache-chunk-total-size SizeSuffix | 块可以in本地磁盘上占用的总大小，默认10G                      |
| –transfers=N                       | 并行file数，默认为4                                          |
| –config string                     | 指定Configuration File路径，string为Configuration File路径                       |
| –ignore-errors                     | 跳过Error                                                     |
| –size-only                         | 根据file大小校验，不校验hash                                 |
| –drive-server-side-across-configs  | 服务端对服务端传输                                           |

## Log

有4个级别的Log记录：`ERROR` `NOTICE` `INFO` `DEBUG`
默认情况下`Rclon`将generates`ERROR` `NOTICE`Log

| Command             | Description                                      |
| ---------------- | ----------------------------------------- |
| -q               | rclone将仅generatesERRORMessage                   |
| -v               | rclone将generatesERROR NOTICE INFO Message        |
| -vv              | rclone 将generatesERROR NOTICE INFO DEBUG Message |
| –log-level LEVEL | 标志控制Log级别                          |

## Filtering

| Command     | Description                                                         |
| -------- | ------------------------------------------------------------ |
| –exclude | 排除file或目录                                               |
| –include | Package含file或目录                                               |
| –filter  | fileFiltering规则，相当于上面两个Option的其它Usage。Package含规则以+开头，排除规则以-开头 |

## Environment Variables

`rclone`中的每个Option都可以通过Environment Variables设置。Environment Variables的name可以通过长Optionname进行Transformation，Removed`--`prefix，更改`-`为`_`大写并添加prefix`RCLONE_`Environment Variables的优先级会低于Command行Option，即通过Command行追加相应的Option时会OverridingEnvironment Variables设定的值。
比如设置最小上传大小`--min-size 50`使用Environment Variablesis`RCLONE_MIN_SIZE=50`当Environment Variables设置后，inCommand行中使用`--min-size 100`那么此时Environment Variables的值就会被Overriding

## 常用Environment Variables

| Command                          | Description                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| RCLONE_CONFIG                 | 自DefinitionConfiguration File路径                                           |
| RCLONE_CONFIG_PASS            | 若 rclone 进行了加密设置，把此Environment Variables设置为密码，可自动解密Configuration File |
| RCLONE_RETRIES                | 上传失败重试次数，默认 3 次                                  |
| RCLONE_RETRIES_SLEEP          | 上传失败重试等待时间，默认禁用，单位s、m、h分别代表秒、分钟、小时 |
| CLONE_TRANSFERS               | 并行上传file数                                               |
| RCLONE_CACHE_CHUNK_SIZE       | 块的大小，默认5M                                             |
| RCLONE_CACHE_CHUNK_TOTAL_SIZE | 块可以in本地磁盘上占用的总大小，默认10G                      |
| RCLONE_IGNORE_ERRORS=true     | 跳过Error                                                     |