---
title: "Rclone"
description: "Rclone is a command-line tool for managing files on 40+ cloud storage services with a unified interface, supporting rsync-like sync, copy, and mount operations."
icon: "cloud-arrow-up"
---

# Rclone

Rclone is a command-line tool for managing cloud storage files. It provides a unified interface for many providers, including object storage, enterprise and consumer file services, and standard transfer protocols. It follows Unix-style conventions and works well with common shell tools such as `rsync`, `cp`, `mv`, `mount`, `ls`, `ncdu`, `tree`, `rm`, and `cat`.

It is especially useful for tasks like synchronizing objects in a [CDN workflow](../env/CDN).

## Installation

Official download page: https://rclone.org/downloads/

Follow the official installation guide. On Windows, adding Rclone to your `PATH` makes it much easier to use.

## Basic commands

| Command | Description |
| ------------------ | -------------------------- |
| rclone config | Add, remove, or manage remotes |
| rclone config file | Show the path to the config file |
| rclone config show | Display the current config file contents |

```shell
rclone [功能Option] <Configurationname:路径> <Configurationname:路径> [parameters] [parameters]
```

## Common operations

| Command | Description |
| ------------- | ------------------------------------------------------------ |
| rclone copy | Copy files |
| rclone move | Move files; add `--delete-empty-src-dirs` if you also want to remove empty source directories afterward |
| rclone sync | Sync the source directory to the target directory; only the target side is modified |
| rclone size | Show the total size used by a remote path |
| rclone delete | Delete file contents under a path |
| rclone purge | Delete a path and everything inside it |
| rclone mkdir | Create a directory |
| rclone rmdir | Remove a directory |
| rclone rmdirs | Remove empty directories in the given path; with `--leave-root`, the root directory is preserved |
| rclone check | Verify whether source and target data match |
| rclone ls | List all files with size and path |
| rclone lsl | Same as above, but also shows upload time |
| rclone lsd | List directories |
| rclone lsf | List both directories and files |

## Useful flags

| Command | Description |
| ---------------------------------- | ------------------------------------------------------------ |
| -n = –dry-run | Dry run mode; preview what Rclone would do |
| -P = –progress | Show live transfer progress, refreshed every 500 ms instead of once per minute |
| –cache-chunk-size 5M | Chunk size; larger values usually upload faster but use more memory |
| –onedrive-chunk-size 100M | Increase OneDrive upload speed on high-bandwidth servers |
| –drive-chunk-size 64M | Increase Google Drive upload speed on high-bandwidth servers |
| –cache-chunk-total-size SizeSuffix | Total local disk space that chunks may use |
| –transfers=N | Number of parallel file transfers; default is 4 |
| –config string | Specify a custom config file path |
| –ignore-errors | Continue when errors occur |
| –size-only | Validate only by file size, not by hash |
| –drive-server-side-across-configs | Use server-side transfer across configs when supported |

## Logs

Rclone supports four log levels: `ERROR`, `NOTICE`, `INFO`, and `DEBUG`.

By default, Rclone emits `ERROR` and `NOTICE` logs.

| Command | Description |
| ---------------- | ----------------------------------------- |
| -q | Output only `ERROR` messages |
| -v | Output `ERROR`, `NOTICE`, and `INFO` messages |
| -vv | Output `ERROR`, `NOTICE`, `INFO`, and `DEBUG` messages |
| –log-level LEVEL | Set the log level explicitly |

## Filtering

| Command | Description |
| -------- | ------------------------------------------------------------ |
| –exclude | Exclude a file or directory |
| –include | Include a file or directory |
| –filter | Use filter rules; rules beginning with `+` include, and rules beginning with `-` exclude |

## Environment variables

Almost every `rclone` option can also be configured through environment variables. The variable name is derived from the long option name: remove the `--` prefix, replace `-` with `_`, convert to uppercase, and add the `RCLONE_` prefix.

Environment variables have lower priority than command-line flags. For example, if you set `RCLONE_MIN_SIZE=50` but run `rclone` with `--min-size 100`, the command-line value wins.

## Common environment variables

| Command | Description |
| ----------------------------- | ------------------------------------------------------------ |
| RCLONE_CONFIG | Custom config file path |
| RCLONE_CONFIG_PASS | Password used to decrypt an encrypted config file |
| RCLONE_RETRIES | Number of retries after upload failure; default is 3 |
| RCLONE_RETRIES_SLEEP | Delay between retries; suffixes `s`, `m`, and `h` mean seconds, minutes, and hours |
| CLONE_TRANSFERS | Number of parallel uploads |
| RCLONE_CACHE_CHUNK_SIZE | Chunk size |
| RCLONE_CACHE_CHUNK_TOTAL_SIZE | Total local space available for chunks |
| RCLONE_IGNORE_ERRORS=true | Skip errors |
