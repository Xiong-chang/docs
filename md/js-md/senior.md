# Javascript高级（高不高级我也不知道能看就行）

## Web Components 组件化开发

### 原生js

- Custom elements：自定义元素
- Shadow DOM：影子DOM
- HTML templates：HTML模板

```js
// btn.js
class Btn extends HTMLElement{
    constructor(){
        super()
        // 样式隔离
        const shaDom = this.attachShadow({mode:'open'})

        // 创建元素
        this.p = this.h('p')
        this.p.innerText = '我是个p'
        this.p.setAttribute('style','width:200px;height:100px;border:1px solid black;')

        // template 写法 像写jsx一样写
        this.template = this.h('template')
        this.template.innerHTML = '<p>我是template</p><style>p{color:red;}</style>'

        // 把 p 元素添加进去
        shaDom.appendChild(this.p)
        shaDom.appendChild(this.template.content.cloneNode(true))
    }
     // h 函数
    h(el){
      return document.createElement(el) //创建元素
    }

    // 生命周期钩子
    // 第一次挂载触发 常用
    connectedCallback(){
        console.log('我挂载了')
    }
    // 卸载触发 常用
    disconnectedCallback(){
        console.log('我卸载了')
    }
    // 当自定义元素从一个文档被移动到另一个文档时 并不常用
    adoptedCallback(){
        console.log('我移动了')
    }
    // 属性改变触发
    attributeChangedCallback(name,oldValue,newValue){
        console.log(name,oldValue,newValue)
    }
}
window.customElements.define('my-btn',Btn) //挂载 使用就用这里的名字

// html
<body>
  <my-btn></my-btn>
  <p>我会受影响变色吗  哦当然不会</p>
</body>
```

### vue + Web Component

配置 `vite.config.ts`

```ts
vue({
  template:{
    compilerOptions:{
      //只要是my-开头的标签都认为是自定义组件
        isCustomElement:tag=>tag.includes('my-') 
    }
  }
})
```

创建组件：

```vue
<!-- 创建 my-button.ce.vue  命名必须加 .ce 来识别 -->
<template>
  <div>随便写点，你就当我是个button</div>
</template>
<script setup lang="ts">
defineProps<{
  obj:any
}>()
</script>

<!-- 其他组件使用 引入组件 引入 defineCustomElement -->
<template>
<!-- 没有类型提示，这种组件是跳过组件检测的 -->
    <my-btn :obj="JSON.stringify(obj)"></my-btn> 
</template>
<script setup lang="ts">
import { defineCustomElement } from 'vue'
import customButton from './my-button.ce.vue'
const btn = defineCustomElement(customButton)
window.customElements.define('my-btn',btn)
// 传参 普通类型可以直接传，引用值要用JSON.stringify
const obj ={name:1}
</script>
```

## 模块化

好处：

1. 提高了代码的复用性

2. 提高了代码的可维护性

3. 可以实现按需加载

### CommonJS （Nodejs环境）

- CommonJS 源自社区
- CommonJS 的出现早于 ES Module 规范
- CommonJS 被大量使用在 node.js 中
- 使用 module.exports 导出模块，使用 require 导入模块
- exports 也可以导出模块，它的本质还是引用了 module.exports
- CommonJS 是同步加载模块，这点与 ES Module 不同

导出：

可以导出任意类型

```js
// module.js
module.exports = {
    name:'banana',
    age:18,
    eat:function(){
        console.log('I like eating bananas')
    }
}
module.exports.userName = 'admin'
```

导入：

```js
// app.js
const obj = require('./module.js')
console.log(obj) // { name: 'banana', age: 18, eat: [Function: eat], userName: 'admin' }

// 如果只想导入某个属性，可以使用解构赋值
const { name } = require('./module')
console.log(name) // 'banana
```

Commonjs 不适用浏览器

因为 CommonJS 是同步加载模块，而加载模块就是去服务端获取模块，加载速度会受网络影响，假如一个模块加载很慢，后面的程序就无法执行，页面就会假死。而服务端能够使用 CommonJS 的原因是代码本身就存储于服务器，加载模块就是读取磁盘文件，这个过程会快很多，不用担心阻塞的问题。
所以浏览器加载模块只能使用异步加载，这就是 AMD 规范的诞生背景。

---

### AMD CMD UMD 

AMD （浏览器环境）(基本不用了):

reurireJs

```ts
// 定义
define("module", ["dep1", "dep2"], function(d1, d2) {...});
// 加载模块
require(["module", "../app"], function(module, app) {...});
```

CMD （浏览器环境）(基本不用了)（国产）:

seaJs,类似AMD和commonJs的合体

```ts
// 也是define定义 多了一个require参数
define(function(require, exports, module) {
  var a = require('./a'); //模块的路径
  a.doSomething();
  
  var b = require('./b');
  b.doSomething();
});
```

UMD （通用环境）:

兼容AMD和CommonJS规范，真正的把它们糅合在了一起

```ts
(function (window, factory) {
    // 检测是不是 Nodejs 环境
	if (typeof module === 'object' && typeof module.exports === "objects") {
        module.exports = factory();
    } 
	// 检测是不是 AMD 规范
	else if (typeof define === 'function' && define.amd) {
        define(factory);
    } 
	// 使用浏览器环境
	else {
        window.eventUtil = factory();
    }
})(this, function () {
    //module ...
});
```



### ES Module (主流通用)

- ES Module 是 ES6 之后新增的模块化规范，它从 Javascript 本身的语言层面，实现了模块化
- ES Module 想要完成浏览器端、服务端的模块化大一统，成为通用解决方案
- 使用 export 导出模块，使用 import 导入模块
- 通过 as 关键词，对导出对象重命名，也可以通过 as 对导入对象重命名


导出：

可以导出任意类型

```js
// module.js
const obj = {
    name:'banana',
    age:18,
    eat:()=>{
        console.log('I like eating bananas')
    }
}
const userName = 'admin'

export { obj,userName }
```

导入：

```js
// app.js
import { obj,userName } from './module.js'
```

通过 as 重命名导出:

```js
// module.js
const userName = 'admin'
const passWorld = '密码是我生日'

export { 
    userName as name,
    passWorld as pass
}

// app.js
import { name,pass } from './module.js'
```

default 默认导出:

```js
//默认导出一个成员
// module.js
const name = 'nz'
export default name

// app.js
import newName from './module.js' // 此时可以用新的变量名接收

// 默认导出多个

// module.js
export default {
    name:'nz',
    age:18,
    eat:()=>{
        console.log('喜欢手冲，wc，拦不住的')
    }
}

// app.js
import handle from './module.js'
console.log(handle.name) // nz
handle.eat() // 喜欢手冲，wc，拦不住的
```

注意点:

当我们只想运行模块，而不是获取其中变量时，可以这么写 import './module.js'

需要导出大量成员时，可以用一个变量来接收

```js
export { name,age,address,tel,gender,...... } // 导出了很多的成员
import * as obj from './module.js' // 使用 obj 来接收
```

同时导出命名成员和默认成员

```js
const name='banana',age=18;
export { name,age }
export default 'default value'

import { name, age, default as title } from './module.js' // 此时默认成员需要用 default as 来接收
import title, { name, age } from './module.js' // 简写的方式，将默认成员放在最前面
```

动态引入：

```ts
// 当在某方法执行后或者某些逻辑里 需要引入时
// import 只能在最上层使用，所以要动态导入
if(true){
  // import xxx from './xxx' 这样不行
  import('./xxx').then(res=>{ // 这样无敌了
    console.log(res)// 拿想用的东西就行了
  })
}
```


使用 ES Module 执行 JS 代码:

通过给 script 标签添加 type="module" 属性，可以用 ES Module 的标准来执行 JS 代码
使用 ES Module 的 JS,会延迟执行，有点类似于 defer 属性

```html
<!-- 默认使用严格模式 -->
<script type="module">
  console.log(this) //undefined
</script>

<!-- 每个 ES Modules 都是一个私有作用域 -->
<script type="module">
  const name = 'banana'
</script>
<script type="module">
  console.log(name) //undefined
</script>

<!-- 外部文件是通过 CORS 的方式请求的，需要后端加请求头，否则无法加载 js -->
<script type="module" src="http://www.baidu.com" /> // 报错

<!-- ESM 的 script 标签会延迟执行，当 html 加载完毕后，再执行 script，相当于添加了 defer 属性 -->
<script>
  // 阻塞下面的 p 标签显示
  alert('hello')
</script>
<p>内容1</p>
<script type="module">
  // 不会阻塞下面的 p 标签显示
  alert('hello')
</script>
<p>内容2</p>
```

node 对 ES Module 的支持:

node@8.0 之前的版本还不支持 ES Module，不过可以通过 babel 来解决

8.0之后可用在 `package.json` 加入 `"type":"module "` （版本存疑未，但方法没问题）


```js
// 安装 babel 插件
yarn add @babel/node @babel/core @babel/preset-env -D

// 运行babel
yarn babel-node

// 运行文件和插件
yarn babel-node index.js --persets=@babel/preset-env
```