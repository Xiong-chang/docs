# vite 框架相关

## 打包发布插件

1. 初始化仓库，安装需要插件

```js
npm i init
npm i @vitejs/plugin-vue
```

2. 配置 vite.config.ts


- entry：指定要打包的入口文件。
- name：包的名称
- fileName：包文件的名称，默认是umd和es两个文件。
- sourcemap：是否生成 .map 文件，默认是不会生成的，如果需要的话需要设置为 true。
- rollupOptions：如果项目引用了第三方插件，那么需要在这里设置排除，如果不设置的话，第三方插件的源码也会被打包进来，这样打包文件就变大了。排除之后第三方的插件会单独存在。
- css: 引入公共样式

```js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
export default defineConfig({
    plugins:[vue()],
    build:{ // 打包配置
        lib:{
            entry:'./Card.vue', // 要打包的文件
            fileName:'Card', // 输出文件名
            name:'Card', // 包的名称 
            formats:['umd','es','cjs','iife'] //输出文件格式
        }
    },

    css:{}
})
```


3. 打包 

打包后默认在 `dist` 文件夹

```js
npv vite build
```

4. 登陆 npm 官网发布（注意要在npm源才行）

```js
// 注册账号
npm adduser
// 登录
npm login
// 发布
npm publish
```

package.json 里的 name 会作为包名发布
