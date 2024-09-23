# Monorepo

Monorepo（单体仓库）是一种软件开发策略，其中多个项目或库被存储在一个单一的版本控制仓库中。与传统的多仓库（multirepo）策略相比，monorepo 提供了一种集中管理和协作的方式，有助于提高开发效率和代码共享

## 谁在用

vue源码 elementplus源码 react源码 vite源码 都是monorepo

把多个项目放到一个仓库，用 pnpm 来安装管理依赖 （npm不行，yarn可以但不流行）


举个例子，假如两个项目同时要用到 babel 但是版本不一样，npm 在这种情况下就是非扁平化的就需要单独安装管理了，而pnpm 是扁平化的它会拥有一个全局仓库 `.pnpm-store` 会有所有安装过的依赖，如果项目用过某个依赖就可以共享给另一个项目(软链接)，没有用过就会去仓库取node_module（硬链接）（原理：软链接：理解为快捷方式图标和,硬链接：理解为引用类型共用着同一个内存地址）

## 案例

需要先安装 pnpm :
```sh
npm install pnpm -g
```

假设项目目录如下：

```
你随便取个项目名/
│
├── common (放一些共用的东西)
│   ├── index.ts (自己随便写东西)
│   └── package.json (pnpm init 初始化得到)
├── react（仅创建了项目未安装依赖）
├── vue3（仅创建了项目未安装依赖）
├── pnpm-workspace.yaml （核心）
├── package.json （根目录的）
```

我们会在 common 写一些公共的代码，react 和 vue3 会用到 common 中的代码，所以需要把 common 和 react、vue3 关联起来

pnpm-workspace.yaml：
```yaml
packages:
  - 'vue3'
  - 'react'
  - 'common'
```

这就把项目都关联在了一起，可以共享依赖，比如在common中安装了lodash，那么react和vue3中都可以使用

此时在 **根目录** 运行 `pnpm install` 安装依赖，此时会依次为项目安装依赖，能够复用的依赖会被提取到根目录的 node_modules 中，不能复用的依赖会被提取到各个项目的 node_modules 中

现在对各个项目的 `package.json` 进行修改，主要修改的是 `name` 属性,比如 vue3 中的原 name 值是 `vue3`，修改为 `@web/vue3` (其他两项 `@web/react`和 `@web/common`)，格式以 `@` 开头 `/` 结尾=,名字可以自己起(这样会被视作一个本地的依赖，引入时要用到

到这里我们就可以吧 common 视作一个依赖来添加到 react 和 vue3 中了，比如在 vue3 中安装 common （根目录下运行不是某个项目的根目录）：
```sh
# --filter @web/vue3 指定在 vue3 项目中安装
pnpm add @web/common --filter @web/vue3
# react 同理
pnpm add @web/common --filter @web/react
```
(如果命令报错请降级 pnpm 版来尝试修复)

可以看它们的 package.json 中已经安装了 common 依赖了
```json
 "dependencies": {
    "@web/common": "workspace:^",
}
```

这样他们就能 **实时的** 共享这个依赖了,很方便使用

`import 你在common的index.ts写的某个东西 from @web/common`

当然了如果要把依赖安装到全局的话加上 -w -D 就行了，如：`pnpm i xxx -w -D`