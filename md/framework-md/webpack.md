# webpack 框架相关

## 安装

webpack5版本必须要与 webpack-cli 一起安装，webpack-cli就是命令行工具

```bash
npm install webpack webpack-cli -D
```

## 调试打包

调试：需要使用webpack-dev-server，webpack-dev-server会启动一个本地服务器

```bash
npm install webpack-dev-server -D
```

配置命令在 package.json 中的 scripts

```js
{
    "scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
  },
}
```

这样使用 `npm run dev` 就可以启动项目了，`npm run build` 来打包项目

### 注意

webpack 天然支持 js 代码和 json (在使用 ts 时，同时要引入 json 需要在 ts 配置中打开 `resolveJsonModule` 选项)

webpack5 自带 `treeShaking` 树摇技术，申明的变量函数没有用到就不会打包进去 永远走不进去的 if 也会被摇掉

处理文件时需要在 loader 中配置，比如处理图片需要使用 `file-loader` 处理 css 需要使用 css-loader 等

增加功能会在 plugin 中配置，比如压缩代码需要使用 `TerserWebpackPlugin` 压缩图片需要使用 `image-webpack-loader` 等


## 识别 ts

安装 `npm i ts-loader typescript -D`

或 `npm i -D @swc/core swc-loader` (更快，力推)

后面会有完整配置案例

## base64 图片

使用 `url-loader`

安装 `npm i url-loader -D`

可以配置 limit 参数来自由的根据文件大小来选择参与打包的文件进行 base64 的转换，小图片使用较好大图片没必要转,`url-loader` 与 `file-loader` 区别就在于上面这个功能，

当然你可以选择其他压缩的 loader，比如 `image-webpack-loader`，可以与 `url-loader` 或`file-loader` 一起配合使用


## 处理 css

安装 `npm i css-loader style-loader -D`,`style-loader` 是将 css 注入到 html 中，`css-loader` 是解析 css 文件，注意：配置时他们是从右往左的进行的！

上面的注入并不优雅，所以推荐使用 `mini-css-extract-plugin` 插件，将 css 提取到单独的文件中用 link 标签进行引入，使用 `npm i mini-css-extract-plugin -D` 安装

sass 与 less 同理


## 使用 vue

安装: `npm i vue vue-loader vue-template-compiler -D`

`vue-loader`,是用来解决不支持 `<template>`标签的问题 使用 vue3 还要引入该插件的 `VueLoaderPlugin` 记得还要注册一下

`vue-template-compiler`,这个就是把模板 index.html 和 vue 创建的 app 去关联到一起的

如果出现 `Cannot find module './App.vue'` 就要写 `shim.d.ts` 声明文件官网有固定的

```ts
// shim.d.ts
// 声明一个模块，用于匹配所有以 ".vue" 结尾的文件
declare module "*.vue" {
    // 从 "vue" 中导入 DefineComponent 类型
    import { DefineComponent } from "vue";
  
    // 定义一个类型为 DefineComponent 的变量 component
    // 它具有三个泛型参数，分别表示组件的 props、组件的 data 和其他的类型。
    // 在这里，我们使用空对象（{}）表示没有 props，使用空对象（{}）表示没有 data，使用 any 表示其他类型可以是任意值。
    const component: DefineComponent<{}, {}, any>;
  
    // 导出 component 变量，这样其他地方在导入 ".vue" 文件时，TypeScript 编译器会将它识别为一个 Vue 组件
    export default component;
  }
  
```

## js 分包

默认情况下打包时会将 js 全部打包进一个文件里，这就会导致首屏加载非常缓慢，所以需要分包，使用 `optimization`的`splitChunks` 配置，可以根据自己的插件进行配置

也可以配置 `externals` 把一些框架用 cdn 引入来减少打包体积

## cache 优化

使用 `cache` 配置，可以缓存一些文件，这样在打包时就可以直接使用缓存，不用重新打包，可以大大提高打包速度，就两个选项 `filesystem`（文件存储） 和 `memory` （内存存储） 一般选 `filesystem`

缓存的文件会在 `node_modules/.cache/webpack` 目录里

## 配置案例

这是一个使用 vue3 与 ts 的配置案例供参考:

```js
// webpack.config.js

const { Configuration } = require('webpack'); //代码提示用无其他作用
const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // vue模板需要
const { VueLoaderPlugin } = require('vue-loader'); //vue 解析template需要
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css提取

// js docs 就可以有代码提示了
/**
 * @type {Configuration}
 */

const config = {
  cache: {
    // 可以提升打包速度
    type: 'filesystem', //会存到 node_modules/.cache/webpack
  },
  // 模式 development/production 开发模式/生产模式
  mode: 'development',
  // 入口文件
  entry: './src/main.ts',
  // 出口文件
  output: {
    // 打包后的文件名
    // filename:'bundle.js',
    // 分包后不能写死名称
    filename: '[chunkhash].js',

    // 打包后的路径 process.cwd()会返回当前工作目录也就是根目录(兼容cjs和esm规范的)
    path: path.resolve(process.cwd(), 'dist'),
    // 每次打包时都会清空dist文件夹
    clean: true,
  },
  // 模块
  module: {
    // 规则
    rules: [
      {
        // 匹配 ts 文件
        test: /\.ts$/,

        // 排除文件
        exclude: /node_modules/,

        // 使用ts-loader (比较慢)
        // use:{
        //     loader:'ts-loader',
        //     options:{
        //         appendTsSuffixTo: [/\.vue$/],// 支持.vue文件
        //     }
        // }

        // 使用 swc (很快)
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                // tsx:true, // 如果使用tsx语法需要开启
              },
            },
          },
        },
      },
      {
        // 匹配 vue 文件
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        // 图片（字体文件等）
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000, //10kb以下的才会进行转换
            // 不满足的可以指定目录去存放和命名 (hash可以防止缓存每次都是唯一的看需求情况调整)
            name: './static/[name].[hash].[ext]', //注意如果报错记得安装 file-loader
          },
        },
      },
      // {
      //     // 匹配 css 文件
      //     test:/\.css$/,
      //     //从右往左传递处理结果 css-loader会将css文件转换为js模块 style-loader会将js模块中的样式插入到html中
      //     use:['style-loader','css-loader']
      // },
      // {
      //     // 匹配 sass 文件
      //     test:/\.scss$/,
      //     use:['style-loader','css-loader','sass-loader']
      // }

      // 使用MiniCssExtractPlugin将样式提取到单独的文件中
      {
        // 匹配 css 文件
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        // 匹配 sass 文件
        // 使用MiniCssExtractPlugin将样式提取到单独的文件中
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  // webpack的所有插件都是类
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', //指定模板的路径
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    // 配置后缀名 引入文件时没有加后缀就会按这个挨个尝试
    extensions: ['.ts', '.js', '.vue', '.json'],
    // 配置别名 导入文件时可以用@代替src
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 代码分包
  optimization: {
    splitChunks: {
      chunks: 'all', // 静态模块 动态模块 共享模块全都拆分
      cacheGroups: {
        // 这里演示的是moment插件 其他插件也可以包括elementplus，vue等也可以
        moment: {
          name: 'moment',
          test: /[\\/]node_modules[\\/](moment|loadsh)[\\/]/, // 匹配node_modules中的moment文件
          priority: 1, //优先级
        },
      },
    },
  },
  // 做cdn的 减少打包体积
  // externals:{
  //     vue:"Vue",//打包时 vue 不会被打包进去，用script标签引入cdn 要自己手动引入昂
  // }
};

module.exports = config;
```
