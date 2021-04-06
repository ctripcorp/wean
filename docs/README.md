<p align="left">
  <img src="https://i.loli.net/2021/03/11/69sRUvYhkGrInX2.png" alt="wean logo" width="180">
</p>

[![Build Status](https://github.com/ctripcorp/wean/workflows/ci/badge.svg?branch=master)](https://github.com/ctripcorp/wean/actions)

wean 是一个小程序构建工具，它负责将标准的微信小程序打包成 web 项目，这样做有很多好处——

- **小程序引擎** - 将打包产物跑到 APP webview 上，就可以成为专属小程序，如“携程小程序”
- **开箱即用** - 更现代的标准，更短的开发链路，从某种程度上缓解微信小程序的历史包袱
- **跨双端** - 以保住微信为前提，一套代码，支持微信和 h5 两个端

wean 借助 [fre](https://github.com/yisar/fre) 实现渲染，借助 [berial](https://github.com/berialjs/berial) 实现路由和沙箱，不需要 webpack 等

除了基本的编译打包，wean 实现了一些先进特性：**Tree shaking**、**Module federation**、**Hot reload**，做更现代，更精简的小程序子集

## Quick start

### Install

暂时实验阶段还没有发版，可以直接跑源码，往下看

### Run

```shell
$ npm install
$ npm link
$ wean
```

剩下的只需要按照 [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/) 开发即可

值得注意的是，并非所有的微信小程序的特性都被支持，简单地说，wean 只支持“现代特性”，比如只支持 esm 格式，其他格式的文件请从 [esbuild-cdn]](https://esbuild.vercel.app/fre@2.0.4/dist/fre.umd.js) 下载

### Demo

- [图虫小程序 @ 飘香豆腐](https://github.com/yisar/wean-demo-tuchong)

- [TodoMVC](https://github.com/ctripcorp/wean/tree/master/demo)

## Motivation

在 wean 之前，大量小程序工具使用 webpack 进行打包，各种 loader、plugin 导致整个开发链路变长

wean 旨在解决链路问题，它自研编译器和打包器，对于标准小程序项目，可以做到开箱即用

## Communication

### QQ group

<img src="https://i.loli.net/2021/03/24/wYdhGJuNzZXT1QW.jpg" alt="wean logo" width="250">

### Trippal

<img src="https://i.loli.net/2021/04/06/I6EQr3xUeXhDJ47.jpg" >

## Package

| Package                    | Description      | Version                                                                    |
| -------------------------- | :--------------- | :------------------------------------------------------------------------- |
| [wean](packages/core)      | 微信小程序打包器 | [![npm](https://img.shields.io/npm/v/wean.svg)](https://npm.im/@wean/core) |
| [wean/wxml](packages/wxml) | wxml 编译器      | [![npm](https://img.shields.io/npm/v/wean.svg)](https://npm.im/@wean/wxml) |

## Design

![wean](https://i.loli.net/2021/03/11/4fvJhZ2lbUgmsj1.png)

## FAQ

1. 和 taro 等有什么区别？



#### License

MIT @ctripcorp
