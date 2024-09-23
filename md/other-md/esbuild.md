# esbuild

go语言编写的 并发无敌的存在（多线程打包（JavaScript）工具，代码直接编译成机器码）

## 使用

核心功能 ：
- 转换 transform  （天然支持ts 天然 tree shaking（树摇技术）自动转es5(不需要babel)， 缺点不支持vue）
- 打包 build

jsx也支持

## 案例

随便写一个要拿去转换成js的带导入其他模块的ts文件

```ts
// test.ts
import xxx from 'xxx' //在插件里实现注入
export const a:number = 1;
export const b:number = 2;
export const c:number = 3;
```

认真写一个打包要用的js配置文件

```js
// index.js 随便起能跑就行
// 导入一下
import esbuild from 'esbuild';
import fs from 'node:fs'

// 读取一下ts文件
const code = fs.readFileSync('./index.ts','utf-8')

// 转换
// transformSync 同步转换
const content = esbuild.transformSync(code,{
    target:'es2015',//转换成es2015
    loader:'ts',//ts文件

})
console.log(content.code);// 打印转换后的代码，当然也可以直接写入文件


// 插件
// vite esbuild rollup postcss babel 插件规范全部统一是个对象
// 只有 webpack 是个类需要new 里面还有apply 钩子
const plugin ={
    name:"env",
    setup:(build)=>{ //setup会自己调用
        // 文件解析时触发
        build.onResolve({filter: /^env$/ },args=>{ //env 匹配 index.ts 导入的模块
            return {
                path:args.path,//文件路径 必要的返回值
                namespace:'env',//命名空间 必要的返回值

            }
        })
        // 加载文件时触发
        build.onLoad({filter: /.*/ ,namespace:'env'},args=>{//env和上面对应上 这个例子这里不关注filter
            return {
                contents:`${JSON.stringify(process.env)}`,//返回内容
                loader:'json'//返回内容类型
            }
        }) 
    }
}

// 打包
esbuild.build({
    entryPoints:['./index.ts'],//要打包的文件入口
    bundle:true,// 打包成模块
    outfile:'./dist/bundle.js',//导出路径及文件名
    target:'node14',//目标环境
    format:'iife',//规范 支持 cjs esm iife 
    platform:'node',//平台 只有浏览器browser和node
    minify:true,//压缩
    plugins:[plugin],//插件
})
```

`node index.js` 运行即可