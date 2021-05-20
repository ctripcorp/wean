<p align="center">
  <img src="https://i.loli.net/2021/03/11/69sRUvYhkGrInX2.png" alt="wean logo" width="180">
</p>

[![Build Status](https://github.com/ctripcorp/wean/workflows/ci/badge.svg?branch=master)](https://github.com/ctripcorp/wean/actions)

---

**:fire: Note this is early experimental! 实验阶段的主要工作是想办法让整体架构变稳定、简洁，不建议上生产。**

---

wean 是一个小程序构建工具，它负责将标准的微信小程序打包成 web 项目，这样做有很多好处——

- **小程序引擎** - 将打包产物跑到 APP webview 上，就可以成为专属小程序，如“携程小程序”
- **开箱即用** - 更现代的标准，更短的开发链路，从某种程度上缓解微信小程序的历史包袱
- **跨双端** - 以保住微信为前提，一套代码，支持微信和 h5 两个端

wean 借助 [fre](https://github.com/yisar/fre) 实现渲染，借助 [berial](https://github.com/berialjs/berial) 实现路由和沙箱，借助 [esbuild](https://github.com/evanw/esbuild) 实现 js 的打包，

### QQ group

<img src="https://i.loli.net/2021/03/24/wYdhGJuNzZXT1QW.jpg" alt="wean logo" width="250">

### Demo

- [图虫小程序 @ 飘香豆腐](https://github.com/yisar/wean-demo-tuchong)

- [TodoMVC](https://github.com/ctripcorp/wean/tree/master/demo)

### Run

```shell
$ npm install
$ npm link
$ wean
```

### Motivation

在 wean 之前，大量小程序工具使用 webpack 进行打包，各种 loader、plugin 导致整个开发链路变长

wean 旨在解决链路问题，它自研编译器和打包器，对于标准小程序项目，可以做到开箱即用

### Package

| Package                    | Description      | Version                                                                    |
| -------------------------- | :--------------- | :------------------------------------------------------------------------- |
| [wean](packages/core)      | 微信小程序打包器 | [![npm](https://img.shields.io/npm/v/wean.svg)](https://npm.im/@wean/core) |
| [wean/wxml](packages/wxml) | wxml 编译器      | [![npm](https://img.shields.io/npm/v/wean.svg)](https://npm.im/@wean/wxml) |

### Design

![wean](https://i.loli.net/2021/03/11/4fvJhZ2lbUgmsj1.png)

#### License

MIT @ctripcorp
