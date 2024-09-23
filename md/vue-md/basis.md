# Vue 基础

## 父子传值

父 > 子

父组件用 `:`（v-bind）绑定一个变量在子组件上 如 `:title='我是天才'`

子组件 
vue3 用 `defineProps` 宏接收父组件绑定的变量名（接收title）,
vue2 用 `props` 接收父组件绑定的变量名（同上）

```js
// vue3 可以在模板直接使用 title
// 要在其他代码中使用titile 则需要将 defineProps 用变量接一下
const props =  defineProps({ 
    title: {
        type: String, // 类型校验，可选，不写默认any类型
        required: true, // 是否必传，可选，不写默认false
        default:'我是默认值'
    }
})
console.log(props.title)
// ts 特有的 定义默认值
withDefaults(defineProps<{
    title:string,
    nb:number[]
}>(),{
    title:'我是默认值' // 默认值
    // 复杂类型要用一个函数返回
    nb:()=>[666,999]
})


// vu2 则需要用 this.title 访问 props 变量，其他同上
props:{
    title:{
        type:String, 
        default:'我是默认值'
    }
}
```

子 > 父

子组件要一个事件来触发通知父组件，父组件要一个方法来接收子组件的通知，子组件触发事件时，将数据作为参数传递给父组件的方法。父组件的方法中，将数据绑定到父组件的变量上。

vu3 子组件触发事件时，用 `emit` 
vue2 子组件触发事件时，用 `$emit` 

```js
//vue3
// 子组件
<div @click="send">哈哈哈我要传值给老爹</div>

const emit = defineEmits(['on-click']) //这里相当一自定义的了事件名称，父组件需要用这个名称来接收事件
const send=()=>{
    emit('on-click','我是子组件传的值') // 触发事件，并传递参数给父组件
}
// 父组件
<child @on-click="childMsg"></child>
const childMsg=(val)=>{
        console.log('我是父组件拿到了:'val) 
}
// ts
const emit = defineEmits<{
    // 可以有多个不同的事件，每个事件可以有不同的参数类型
     (e: 'on-click', val: string): void 
     (e: 'nb', val: number): void 
     (e: 'hhh', val: number[]): void 
}>() // 这里定义了事件名称和参数类型，父组件需要用这个名称来接收事件，并且参数类型需要一致，否则会报错。

// vue2
// 子组件
<div @click="send">哈哈哈我要传值给老爹</div>

methods:{
    send(){ // 触发事件，并传递参数给父组件
        this.$emit('nb','我是子组件传的值') // 触发事件，并传递参数给父组件
    }
}
// 父组件
<child @nb="childMsg"></child>

methods:{
    childMsg(val){
        console.log(val) // 这个值你想拿来干啥就看你需求了
    }
}
```
---

其他手段（获取实例等）： 

**attrs** (子组件调用父组件):

vue2: 子组件使用 `this.$attrs` 可以获得父组件除了props传递的属性和特性绑定属性 (class和 style)之外的所有属性，子组件使用 `$listeners` 可以获得父组件(不含.native修饰器的)所有 `v-on` 事件监听器

vu3: 不仅可以获得父组件传来的属性也可以获得父组件v-on事件监听器 (无$listeners 已合并至 `attrs` 内)（Vue3中使用 attrs 调用父组件方法时，方法前需要加上on；如 parentFun -> onParentFun）(Attributes 继承详情参考官方文档)

```js
import { useAttrs } from "vue";
const attrs = useAttrs()
console.log(attrs)
```
---

**$parent,$children** （vue2特有）:

$parent: 子组件获取父组件Vue实例，可以获取父组件的属性方法等

$children: 父组件获取子组件Vue实例，是一个数组，是直接儿子的集合，但并不保证子组件的顺序

```js
import Child from './Child'
export default {
  components: {
    Child
  },
  created(){
    console.log(this.$children) //[Child实例]
    console.log(this.$parent)//父组件实例
  }
}
```

---

**provide/inject** （依赖注入）(跨辈分 如： 爷 > 孙):

provide：是一个对象，或者是一个返回对象的函数。里面包含要给子孙后代属性

inject：一个字符串数组，或者是一个对象。获取父组件或更高层次的组件provide的值，既在任何后代组件都可以通过inject获得


```js
// 选项式 api
// 父组件
data() {
    return {
      msg1: '子组件msg1',
      msg2: '子组件msg2'
    }
  },
  provide() { // 注入了 好爽
    return {
      msg1: this.msg1,
      msg2: this.msg2
    }
  }
// 子组件
export default {
inject: ['msg1', 'msg2'], // 获取父组件provide的值，既在任何后代组件都可以通过inject获得，这里获取到了父组件的msg1和msg2属性。
  created(){
    //获取高层级提供的属性
    console.log(this.msg1) //子组件msg1
    console.log(this.msg2) //子组件msg2
  }
}

// 组合式 api
// 父组件 
import { ref, defineComponent,provide } from "vue";
export default defineComponent({
  components:{
    Child
  },
  setup() {
    const msg1 = ref('子组件msg1')
    const msg2 = ref('子组件msg2')
    provide("msg1", msg1)
    provide("msg2", msg2)
    return {
      
    }
  },
});
// 子组件
export default defineComponent({
    setup() {
        console.log(inject('msg1').value) //子组件msg1
        console.log(inject('msg2').value) //子组件msg2
    },
});

// setup 语法糖
// 父组件
import { ref,provide } from "vue";
const msg1 = ref('子组件msg1')
const msg2 = ref('子组件msg2')
provide("msg1",msg1)
provide("msg2",msg2)
// 子组件
import { inject } from "vue";
console.log(inject('msg1').value) //子组件msg1
console.log(inject('msg2').value) //子组件msg2
```

---

**ref,defineExpose** (获取组件实例 , 父取子)

vue2： `$refs` 可以直接获取元素属性，同时也可以直接获取子组件实例

vue3：expose&ref

```js
// 选项式 api
// 父组件
<Child ref="child" /> // 给子组件加上 ref 值 child 要和下面 $refs. 对上

 mounted(){ // dom 挂载完成后才能获取到
    //获取子组件属性
    console.log(this.$refs.child.msg) //子组件元素

    //调用子组件方法
    this.$refs.child.childFun('父组件信息') // $refs.child 就是子组件的实例，可以调用子组件的方法和属性。
  }
// 子组件
methods:{
    childFun(val){
      console.log(`子组件方法被调用,值${val}`)
    }
  }

// 组合式 api
// 父组件
<Child ref="child" />
import Child from './Child'
import { ref, defineComponent, onMounted } from "vue";
export default defineComponent({
  components: {
    Child
  },

  setup() {
    const child = ref() //注意命名需要和template中ref对应
    onMounted(() => {
      //获取子组件属性
      console.log(child.value.msg) //子组件元素
      //调用子组件方法
      child.value.childFun('父组件信息')
    })
    return {
      child //必须return出去 否则获取不到实例
    }
  },
});
// 子组件
import { defineComponent, ref } from "vue";
export default defineComponent({
    setup() {
        const msg = ref('子组件元素')
        const childFun = (val) => {
            console.log(`子组件方法被调用,值${val}`)
        }
        return {
            msg,
            childFun
        }
    },
});

// setup 语法糖
// 父组件
<Child ref="child" />
import { ref, onMounted } from "vue";
const child = ref() 
onMounted(() => {
  //获取子组件属性
  console.log(child.value.msg) //子组件元素
  //调用子组件方法
  child.value.childFun('父组件信息')
})
// 子组件
const msg = ref('子组件元素')
const childFun = (val) => {
    console.log(`子组件方法被调用,值${val}`)
}
//必须暴露出去父组件才会获取到 !!! defineExpose
defineExpose({
    childFun,
    msg
})
// ts
// 父组件
import Child from './Child'
const child = ref<InstanceType<typeof Child>>() // 类型判断 Child的
```




## 兄弟传值

有共同父组件的情况：

参考上文，兄弟一可以通过子向父的方式向父组件传递，然后这个共同父组件接收当做桥梁，向另一个兄弟二以父向子的方式传递即可。

没有共同父组件的情况：

**EventBus**  模式 （vue2），创建一个空的 Vue 实例作为事件调度中心，兄弟组件通过它来传递数据。（原理：利用发布订阅，事件调度中心实现）
什么你不知道发布事件时间调度中心，抱歉我也不知道现在帮不了你，等我搞明白再来救你
```js
// bus.js
import Vue from 'vue'
export const bus = new Vue()

// 某组件 发送数据
import {bus} from "./bus.js" // 记得导入bus
bus.$emit(参数1：'定义一个方法名', 参数2：'要发送的数据')

// 某组件 接受数据
import {bus} from "./bus.js" // 记得导入bus
bus.$on(参数1：'$emit的方法名', 参数2：'function(value){
    // value是接收到的数据
}')

// 用完还可以移除一下
eventBus.$off('方法名', {})
```

**mitt** (vue3,原理还是 EventBus)

安装:

```js
npm i mitt -S
```

使用：

```js
// mitt.js
import mitt from 'mitt'
const Mitt = mitt()
export default Mitt

// 某组件
<button @click="sendMsg">传值</button>

import Mitt from './mitt.js' // 别忘了引入
export default defineComponent({
    setup() {
        const sendMsg = () => {
            Mitt.emit('sendMsg','兄弟的值')
        }
        return {
           sendMsg
        }
    },
});

// 另一组件
import { defineComponent, onUnmounted } from "vue";
import Mitt from './mitt.js'
export default defineComponent({
  setup() {
    const getMsg = (val) => {
      console.log(val);//兄弟的值
    }
    Mitt.on('sendMsg', getMsg) // 见听到后触发自己的 getMsg 
    onUnmounted(() => {
      //组件销毁 移除监听
      Mitt.off('sendMsg', getMsg)
    })

  },
});

// setup语法糖
import Mitt from './mitt.js' // 下面两都要引入

// 某组件
const sendMsg = () => {
    Mitt.emit('sendMsg', '兄弟的值')
}

// 另一组件
const getMsg = (val) => {
  console.log(val);//兄弟的值
}
Mitt.on('sendMsg', getMsg)
onUnmounted(() => {
  //组件销毁 移除监听
  Mitt.off('sendMsg', getMsg)
})
```

## 什么是SPA

SPA（single-page application）仅在Web页面初始化时加载相应的HTML,Javascript，CSS。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转，转而代之的是利用路由机制实现HTML内容变换，UI 与用户的交互，避免页面重新加载

**优点**:
- 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染
- 对服务器压力较小
- 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理

**缺点**：
- 初次加载慢，需要优化按需加载
- 无法使用浏览器的前进后退
- SEO难度大


## v-if与v-show

`v-if` 是惰性的真正的条件渲染，如果初始渲染条件为假那他就不会渲染直到第一次变为真时，才会渲染

`v-show` 无论初始条件是什么都会渲染，只是利用 `display` 属性对齐进行了隐藏或显示

`v-if` 适合不频繁切换的场景使用，`v-show` 适合非常频繁切换时使用


## v-if与v-for

在 Vue 2 中，`v-for` 的优先级高于 `v-if`

在 Vue 3 中，`v-if` 的优先级高于 `v-for`

不要在同一级标签同时使用


## 动态绑定class与style

都可以使用对象语法或者数组语法进行绑定

```html
<div :class="{active:isActive,'nb':isNb}" :style="{color:activeColor}"></div>

<div :class="[isActive ? 'active':'',zdnb]" :style="[nbColor]"></div>

// js
data:{
  // 对象
  isActive:true,
  isNb:false,
  activeColor:'green',
  // 数组
  zdnb:'nb'
  nbColor:{
    color:'yellow'
  }
}
```

## 单项数据流

`prop` 数据都是单向下行绑定的，父级更新会向下流动到子组件中，如果直接在子组件中进行修改会发出警告，可以防止子组件意外改变父组件的状态导致数据流难以理解，子组件想要修改通过 `prop` 传递来的值则可以使用 `emit` 来派发自定义事件，通知父组件并由父组件来修改,每次父组件发生更新时，子组件所有的 `prop` 都会刷新为最新的值

- 传递的初始值，子组件希望当做本地的数据来使用，最好在本地定义新的变量并将值赋给它
```js
props:['wcnb'],
data:function(){
  return{
    nb:this.wcnb // 使用时 用nb就行了
  }
}
```

- 对传入值要进行一些转换操作等，最好使用计算属性处理
```js
props:['zdnb'],
computed:{
  nb:function(){
    return this.zdnb.trim()
  }
}
```


## computed 和 watch 

`computed` 是计算属性，值具有缓存，只有当其依赖的值改变时，下一次获取的值才会重新计算。

`watch` 观察某值，每当其发生改变时就会触发，类似对数据的监听回调，值无缓存

运用场景：

- 当进行数值计算时，并依赖于其他数据时用 `computed` 可以利用其缓存的特性，避免每次获取都要重新计算

- 当在数据变化时执行异步操作或其他开销较大的操作时，使用 `watch` ，允许在执行异步操作，限制执行该操作的频率，并在得道最终结果前，设置中间状态，这些计算属性无法做到


## 修改vue数组

vue2 无法检测以下变动：

- 利用索引设置数组项时 如：vm.items[indexOfItem] = newValue
- 修改长度时 如：vm.items.length = newLength

解决办法：

```js
Vue.set(vm.items,indexOfItem,newValue)
vm.$set(vm.items,indexOfItem,newValue)
vm.items.splice(indexOfItem,1,newValue)// 既可以修改值也可以解决修改长度
```

Vue支持的其他数组方法:
- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()

> 理由是受到JavaScript的限制无法实现，但修改vue源码可以发现实际上是可以实现的，不过 `尤大` 认为这样做影响性能得不偿失，所以重写了数组的原型，并支持上面列出的方法来修改仍能保持响应式

JavaScript里:

```js
let arr =  [1,2,3];
arr.forEach((item,index)=>{
    Object.defineProperty(arr,index,{
        get(){
            console.log('获取了值:',item);
            return item
        },
        set(newValue){
            console.log('新的值为:',newValue)
            item=newValue
        }
    })
})
// arr[1] // 触发
// arr[1]=3 // 触发
// console.log(arr);
arr.length=4 // 没有触发
// console.log(arr)
arr.push(5);  //没有触发监听
// console.log('arr[3]：',arr[3]);
// console.log('arr[4]：',arr[4]);
```

vue2源码：

```js
// 保留 自己未修改成功
```

该问题在vue3 使用 `proxy` 实现响应式后已解决


## 生命周期

就是从一个Vue实例开始创建、初始化数据、模板编译、挂载Dom->渲染、更新->渲染、卸载等一系列过程，就是Vue的生命周期

| 生命周期 | 描述 |
|---      |---    |
| beforeCreate | 实例创建之初，组件属性生效之前 |
| created | 组件实例已创建，属性也绑定，DOM还未生成，$el不可用 |
| beforeMount | 在挂载开始前调用，相关 `render` 首次被调用 |
| mounted | dom已挂载 |
| beforeUpdate | 组件数据更新前调用，在虚拟DOM打补丁前 |
| updated | 组件数据更新后 |
| beforeDestory | 组件销毁前调用 |
| destoryed | 组件销毁后调用 |
| actived | `keep-alive` 专属，组件被激活时调用|
| deactived | `keep-alive` 专属,组件被销毁时调用|

### 父组件和子组件生命周期钩子函数执行顺序

- 加载渲染过程

父 beforeCreate > 父 create > 父 beforeMount > 子 beforeCreate > 子 create > 子 beforeMount > 子 mounted > 父 mounted

- 子组件更新

父 beforeUpdate > 子 beforeUpdate > 子 updated > 父 updated 

- 父组件跟新

父 beforeUpdate > 父 updated 

- 销毁过程

父 beforeDestory > 子 beforeDestory > 子 destoryed > 父 destoryed 


### 哪个生命周期用异步请求

created、beforeMount、mounted 都可以，因为 `data` 已创建，最推荐created，可以减少loading时间，ssr 不支持 beforeMount、mounted 所以在 created 中可以确保统一性

### 什么阶段能访问DOM

mounted

### 父组件监听子组件生命周期

- 子组件的 mounted 回调中使用 $emit 派发自定义事件给父组件
- @hook （其他生命周期也可以监听）

```js
<Child @hook:mounted="do"></Child>

do(){
  console.log('父组件见听到子组件mounted触发')
}

// 子组件
mounted(){
  console.log('子组件mounted触发')
}

// 触发顺序
// 子组件mounted触发 > 父组件见听到子组件mounted触发
```

## keep-alive

是Vue的内置组件，可以使被包含的组件保留状态，避免重新渲染，有以下特性：
- 一般结合路由和动态组件使用，缓存组件
- 提供 include 和 exclude 属性，都支持正则表达式，include 只要名称匹配才会被缓存，exclude 任何名称匹配的组件都不会缓存且优先级比 include 高
- 会触发两个钩子函数 actived、deactived

## data为什么是一个函数

在 new Vue 实例是对象，组件中是函数，组件要被重复使用，所以需要将 data 的属性值隔离防止互相影响


## v-model 原理

语法糖，用于表单 input、textarea、select等元素上创建双向数据绑定

- text 和 textarea 元素使用 value 属性和 input 事件
- checkbox 和 radio 使用 checked 属性和 change 事件
- select 字段将 value 作为 prop 并将 change 作为事件

```html
<input v-model="some"></input>
<!-- 相当于 -->
<input v-bind:value="some" v-on:input="some=$event.target.value"></input>

```

在自定义组件中会默认利用名为 value 的 prop 和名为 input 的事件

```html
<!-- 父组件中使用 -->
<child v-model="cool"></child>

<!-- 子组件 -->
<div>{{value}}</div>
props:{
  value:string
},
method:{
  test(){
    this.$emit('input','我是天才') // 能够派发input事件给父组件
  }
}
```

## 使用过Vue SSR 吗

SSR 就是服务端将渲染后的 html 直接返回给客户端

优点：
- 更好的 SEO ，因为 SPA 页面内容是通过 ajax获取的，而搜索引擎工具不会等待 ajax 完成后再抓取页面内容，而 SSR 由服务端直接返回渲染完的页面，所以搜索引擎爬取工具可以抓取渲染好的页面
- 首屏加载会更快

缺点：
- 更多的开发条件限制，需要在 nodejs 环境运行，只支持 beforeCreate 和 created 两个钩子函数
- 更高的服务器负载


## vue-router 路由模式

- hash url中带有#，当哈希值发生变化时，不会向服务器发起请求，通过监听hashchange事件来进行路由导航
- history 正常的url地址，url变化时会向浏览器发送请求，服务器要配置路由规则，否则会出现刷新404的情况
- abstract 用于非浏览器环境，如 SSR 时，在该模式下，vue-router不会对url进行任何处理，而是将路由信息保存在内存中，通过编程方式进行导航

### 实现原理

hash：
- 基于 `loaction.hash` 实现，loaction.hash 的值就是 # 后面的内容
- hash  值改变都会在浏览器中增加一个记录，可以使用浏览器的前进回退来切换
- 可以通过标签 a 设置 href 属性，当用户点击这个标签后，hash 值就会变化，或者对 loaction.hash 来进行赋值来改变 hash 的值
- 可以通过 hashchange事件来监听 hash 的变化，从而进行跳转

history：
- H5提供 History API 来实现 URL 的变化，主要使用 history.pushState() 和 history.replaceState(),可以在浏览器不刷新的情况下操作历史记录
```js
window.history.pushState(state,'',path) // 新增一个记录
window.history.replaceState(state,'',path) // 直接替换当前记录
```
- 使用 pushState ， replaceState 实现 URL 变化
- 使用 popstate 浏览器前进后退时触发，可以用来监听 url 变化
- pushState，replaceState 不会触发 popstate，当调用 history.back 与 history.go 时会触发（也就是上面的前进后退）


## 什么是 MVVM

Model view view-Model，数据变化会更新视图，视图变化也会更新数据，是双向的绑定

## Vue如何实现的双向绑定

- 实现一个监听器 `Observer`：对数据进行遍历，包括子属性对象的属性，利用 `Object.defineProperty()` （vue2）对属性都加上 `getter` `setter` ，这样给某个值赋值就会触发 `setter` 就实现了监听数据变化

- 实现一个解析器 `Compile`：解析 Vue 模板指令，将模板中的变量都换成数据，然后初始化页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数对数据进行更新

- 实现一个订阅者 `Watcher`：watcher 是 Observer 和 Compile 之间通信的桥梁，用来订阅 Observer 中的属性值变化消息，收到变化消息后，触发 对应的更新函数

- 实现一个订阅器 `Dep`:订阅器采用 发布-订阅模式，用来收集订阅者 Watcher，对监听器 Observer 和 Watcher 进行统一管理

Compile 编译模板并绑定更新函数到 Wather ，Watcher添加订阅者到 Dep，
Observer 劫持监听所有属性，属性变化时通知 Dep，Dep通知Watcher ，Watcher调用更新函数实现更新（此处理解存疑打上该标记）


## Proxy与Object.defineProperty

Proxy优势：
- 可以直接监听整个对象而不是单一属性
- 可以直接监听数组变化
- 更多的拦截方法，如apply，ownKeys，deleteProperty，has等
- 返回的是一个新的对象，可以操作新的对象去完成一些操作，Object.defineProperty只能遍历的去直接修改属性
- 新标准会受到浏览器厂商重点持续的性能优化

Object.defineProperty优势：
- 兼容性更好，支持IE9，Proxy无法用polyfill

##虚拟DOM实现原理及优缺点

虚拟DOM就是对真实DOM的抽象描述版，模拟真实DOM树，通过 `diff` 算法来比较两个虚拟DOM树的差异，通过 `pach` 算法将两个虚拟DOM对象的差异应用到真正的DOM树

优点：
- 无需手动操作DOM，写好 View-Model的代码逻辑框架会更加虚拟DOM和数据进行双向绑定，极大提高开发效率
- 实现跨平台，虚拟DOM本质上是JavaScript对象，而DOM与平台强相关，相比之下能够更方便跨平台，如服务端渲染，weex开发等等
- 保证性能下限

缺点：
- 无法进行针对性的极致优化


## v-for的key有什么用

主要作用是为了高效的更新虚拟DOM，提高渲染性能，key可以避免数据混乱的情况出现

key只能是字符串或者数字利息，必须具有唯一性，使用index做key值没有意义


## Vue项目进行过哪些优化

SEO:TDK（title，description keywords）爬虫会抓取这三个值所以必须要写

## 自定义Hooks

这个东西可以理解为vue3 的 `mixin`,什么你不知道vue2 的 `mixin`

vue2的混入minxin：

```vue
// mixin.js 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  }
  methods: {
    ...
  }
  data:{
    ...
  }
}
export default myMixin // 导出混入对象，供组件使用

// 其他组件使用
import myMixin from './mixin.js' // 引入混入对象
mixins:[myMixin] // 这样就可以在组件里使用了
```

缺点：
- 可能出现命名冲突，因为多个mixin可以混入同一个组件，如果多个mixin中出现相同的属性或方法，可能会导致冲突，需要手动解决冲突，比较麻烦
- 数据来源不清晰，多个mixin混入同一个组件，数据来源不清晰，需要查找多个mixin才能找到数据来源，比较麻烦
- 复杂性增加：当项目中使用多个Mixin时，可能会增加代码的复杂性。因为每个Mixin都有自己的属性和方法，可能会导致组件的逻辑变得难以理解和维护。此外，多个Mixin的使用还可能导致代码冗余和重复
- 增加代码耦合度：使用Mixin会增加组件与Mixin之间的耦合度。因为Mixin中的代码会被注入到组件中，所以组件和Mixin之间存在一种紧密的联系。这可能会使组件的可复用性和可维护性降低，因为对Mixin的修改可能会影响到使用它的多个组件

---

vue3的 hook：

```ts
// index.ts 建个hooks文件夹再创建这个文件
export default function (){
  const data = ref(0) // 定义一个响应式数据，这里用ref，也可以用reactive，具体看情况
  const methods = { // 定义一些方法，比如计算属性，事件处理等

  return { // 返回这个hook，这样其他组件就可以使用这个hook了，其他组件使用方法看下面
  data, // 响应式数据，可以直接在组件里使用，比如 <template>{{data}}</template> 或者 methods.xxx 方法等
  }
}

// 其他组件使用
import myHook from '../hooks' // 引入混入对象

myHook() // 这样就可以在组件里使用了，组件里可以直接使用 myHook().data 或者 myHook().methods.xxx 方法等，具体看hook返回的内容
```

[前往hook实现base64转换](./progress.md#hook实现图片base64转换)


## vue3的css新特性

- 如插槽选择器 :slotted(xx元素)、全局选择器 :global(div){} //全局的div都会生效
- 动态css 在vue中可以使用v-bind直接在css绑定变量值
- module 看下面例子 一般写tsx或render时用
```vue
<template>
<!-- 如果下面module没有设置名字那就用 $style 来访问 -->
<div :class="[nb.div,nb.border]">牛逼的很</div>
</template>

<script>
  import {useCssModule} from 'vue'
  const css = useCssModule('nb')
  console.log(css) // 可以读取到这两个类名
</script>

<style module="nb"> //这里的nb和上面要对应
  .div{
    color:green
  }
  .border{
    border:1px solid #ccc;
  }
</style>
```

## H5适配

先设置meta标签

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
使用淘宝的 flexible.js 来换算px

使用postCss（vite已内置），下面实现一个转换的postcss插件

1. 根目录（不是src里）创建 plugins ，然后创建 postcss-px-to-viewport.ts 文件，

在tsconfig.node.json里 inclued 配置一下该目录 "plugins/**/*",

在 compilerOptions 中允许隐式any， "noImplicitAny":false 
```ts
// postcss-px-to-viewport.ts

import { Plugin } from "postcss";
// 像素稿的默认值 一般是375
const Options = {
  viewportWidth: 375, //看UI给的素材是多少
};
interface Options {
  viewportWidth?: number;
}
export const postcssPxToViewport = (options: Options = Options): Plugin => {
  // Object.assign() 静态方法将一个或者多个源对象中所有可枚举的自有属性复制到目标对象，并返回修改后的目标对象
  const opt = Object.assign({}, Options, options);
  return {
    // postcss的配置
    postcssPlugin: "postcss-px-to-viewport",
    // 钩子函数 使用Declaration可以吧css节点返回来
    Declaration(node) {
      // node.prop 获取css属性名
      // node.value 获取css属性值
      //   console.log(node.prop, node.value);
      // 判断是否为px单位
      if (node.value.includes("px")) {
        // 把px单位转换成vw单位
        const num = parseInt(node.value); //考虑到有小数就用parseInt
        node.value = `${((num / opt.viewportWidth) * 100).toFixed(2)}vw`; // 当前值/375*100
        // 判断是否需要加上单位
      }
      // 高级玩法
      //   if (node.value.includes("nb")) {
      // 这里写的nb 就只会读取到你开发洗的nb 可以拿来区分哪些要转换那些不用转换
      // 比如 fontsize=18nb  那就会拿到这,而不会拿到 fontsize=18px 的节点了
      //   }
    },
  };
};

```

2. vite.config.ts中引用一下就ojbk了再不用管了

```ts
//看你自己导出用的什么名字就导入什么
import { postcssPxToViewport } from "./plugins/postcss-px-to-viewport"; 

// 这里是写在css里，不是plugins
 css: {
    postcss: {
      plugins: [postcssPxToViewport()],
    },
  },
```

## 主题切换

使用 vueUse（一个hooks库） 的 useCssVar 
 
```vue
<!-- 随便写个按钮 -->
<button @click="changeThem">切换主题色</button>

<!-- 安装vueuse  -->
<!-- npm i @vueuse/core  -->
<!-- 引入 -->
<script>
import { useCssVar } from '@vueuse/core'
const changeThem = () => {
  // 定义要改变的变量名
  const themeColor = useCssVar('--background-color')//要改变的变量名
  // 改变变量的值
  themeColor.value = themeColor.value === '#fff' ? '#000' : '#fff'
}
</script>
<style>
/* 写个背景色变量 */
:root{
  --background-color: #fff;
}

body {
  position: relative;
  background-color: var(--background-color);// 原理就是改变这里
}
</style>
```

不使用vueuse库，原理上就是使用 `setProperty` 去设置，`getPropertyValue` 去读取

```js
document.documentElement.style.getPropertyValue('--background-color')
document.documentElement.style.setProperty('--background-color', '#000')
```

## css原子化

可以用现成的框架：[tailwindcss](https://www.tailwindcss.cn/docs/flex)、[windcss](https://cn.windicss.org/guide/)

这里用 unocss 来自己自定义编写（最好配合vite，webpack有阉割）

安装：

```npm
npm i -D unocss
```

配置：

```ts
// vite.config.ts
import unoCss from 'unocss/vite' // 引入unocss插件

plugins:[
  unoCss({
    // 配置规则
    rules:[
      ['flex',{display:'flex'}], // 这样就能直接在标签引入flex来当做 display:flex 使用了
      ['nb',{color:'red'}],
      // 正则动态玩法
      [/^fn-(\d+)$/, ([, d]) => ({ "font-size": `${d}px` })], //  如 fn-10 就会变成 fontsize: 10px
    ],
    // 组合类名玩法
      shortcuts: {
        cike: ["flex", "nb"], // 写 cike 就相当于把 flex nb 都使用了
      },
  })
]

// main.ts 引入
import 'uno.css' // 引入生成的css文件 这里uno.css是unocss默认生成的文件名，你可以自定义，在配置里写上

// 组件使用 直接在class里写就行了
<ul class="flex nb fn-55">
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
// 组合玩法 使用上面定义的 cike
<ul class="cike fn-55"> 
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```

unoCss的其他预设引入

[icones官网](https://icones.js.org/)

```ts
// 图标库需要安装一下
npm i -D @iconify-json/你官网找的图标库的名字

import {presetIcons,presetAttributify,presetUno} from 'unocss'  //引入

// 配置时和 rules 同级
presets:[presetIcons(),presetAttributify(),presetUno()] // 引入预设 这里引入了 icon图标 属性化 原子化 三个预设

// presetAttributify 装了这个就不用写在class里了如 
<ul cike fn="55"> 
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>

// presetUno 集成了tailwindcss里的的类名可以直接使用
```

## h函数

代码有三种风格：
- template 模板 编译过程：parser -> sat -> transform ->js api -> generate ->render
- tsx 写法
- 函数式组件 h函数

用h函数就是创建了一个虚拟节点，可以跳过编译阶段直接到render

vue3使用较少，一般封装弹窗，按钮使用

```ts
// h(节点，属性，内容（也可以直接写新的h来渲染子节点）)
// 引入h函数
import { h } from 'vue'

// 简单渲染一个按钮
interface Props  {
  type: 'success' | 'error'
}
const btn2 = (props: Props, ctx: any) => {
  return h('button', {
    // 写属性 可以读取props
    style: {
      color: props.type === 'success' ? 'green' : 'red'
    },
    // 绑定事件
    onClick: () => {
      console.log('按钮被点击了')
      console.log(ctx) //有很多东西 attrs，emit等
      // 也可以直接写逻辑
      if (props.type === 'success') {
        console.log('success')
      } else {
        console.log('error')
      }
    }
  }, ctx.slots.default ? ctx.slots.default() : '按钮')//还能读取插槽 只要有第二个形参在
}

// 组件里直接使用
<btn2 type="success">success按钮</btn2>
<btn2 type="error">error按钮</btn2>
```

## vue3编译宏

### defineProps 

父子传参用

```vue
<!-- 父组件 -->
 <Child name="xiaoman"></Child>
<!-- 子组件 -->
 <div>{{ name }}</div>
 <script>
  defineProps({
     name: String
 })
 </script>
<!-- 解决泛型问题 -->
 <script lang='ts' setup>
import type { PropType } from 'vue'
 defineProps({
  type: Array as PropType<string[]>, //父组件传string类型的数组
 })
</script>


<!-- 使用TS字面量模式 不会有上面方式的泛型问题-->
<script lang='ts' setup>
  defineProps<{ name: string }>()
</script>

<!-- vue3.3新增接受泛型 -->
<Child :name="['xiaoman']"></Child>
<script generic="T"  lang='ts' setup>
 defineProps<{
    name:T[] // 这样无论是字符串类型的数组还是数字类型的都可以直接写不必在手动修改
 }>()
</script>
```

### defineEmits

派发自定义事件

```vue
<!-- 父组件 -->
<Child @send="getName"></Child>
 <script lang='ts' setup>
  const getName = (name: string) => {
     console.log(name)
 }
</script>
<!-- 子组件 -->
<button @click="send">派发事件</button>
<script  lang='ts' setup>
const emit = defineEmits(['send'])
const send = () => {
    // 通过派发事件，将数据传递给父组件
    emit('send', '子组件也是天才')
}
</script>

<!-- 子组件TS字面量模式派发 -->
<script  lang='ts' setup>
const emit = defineEmits<{
    (event: 'send', name: string): void
}>()
const send = () => {
  // 通过派发事件，将数据传递给父组件
  emit('send', '我是子组件的数据')
}
</script>


<!-- Vue3.3 简短写法 -->
<script  lang='ts' setup>
const emit = defineEmits<{
    'send':[name:string]
}>()
const send = () => {
    // 通过派发事件，将数据传递给父组件
    emit('send', '我是子组件的数据')
}
</script>
```

### defineExpose 

把组件的属性暴露出去(3.3无变化)

```vue
<!-- 子组件 -->
<script  lang='ts' setup>
const xsb = ref<string>('我是傻逼')
const not = (): string => {
    return '不!你不是,你是天才！'
}
defineExpose({
    xsb,
    not
})
</script>

<!-- 父组件 -->
<div>
  <p>我是父组件</p>
  <p>子组件说我是：{{ data }}</p>
  <p>真的吗：{{ data2 }}</p>
  <child ref="childRef"></child>
</div>
<script setup lang="ts">
const data = ref<string>('')
const data2 = ref<string>('')
const childRef = ref<any>(null) //（类型存疑）
onMounted(() => {
  console.log(childRef.value.xsb)
  data.value = childRef.value.xsb;
  data2.value = childRef.value.not();
})
</script>
```

### defineOptions

一般拿来定义组件名

```ts
defineOptions({
  name:'nb',
  inheritAttrs: false // 默认true 继承属性 一般写组件时设置为false 防止一些属性继承到根元素上导致一些问题
})
```


### defineSlots

约束插槽类型，只能用来声明，没有任何参数，只能接受ts的类型

```vue
<!-- 子组件 -->
<template>
 <div>
     <ul>
        <li v-for="(item,index) in data">
            <slot :index="index" :item="item"></slot>
        </li>
     </ul>
 </div>
</template>
 <script generic="T"  lang='ts' setup>
defineProps<{
    data: T[]
}>()
defineSlots<{
   default(props:{item:T,index:number}):void // slot写属性时必须要和这里能对应上否则会有报错提示
}>()
</script>

<!-- 父组件 -->
<template>
    <div>
        <Child :data="list">
            <template #default="{item}">
                   <div>{{ item.name }}</div>
            </template>
        </Child>
    </div>
</template>
<script lang='ts' setup>
import Child from './views/child.vue'
const list = [
    {
        name: "张三"
    },
    {
        name: "李四"
    },
    {
        name: "王五"
    }
]
</script>
```

### defineModel

双向绑定 3.4版本

defineModel() 返回的值是一个 ref，它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用

```vue
<!-- 父组件 -->
<child v-model="inputValue" />

<script setup lang="ts">
import { ref } from "vue";
const inputValue = ref();
</script>

<!-- 子组件 -->
<input v-model="model" />

<script setup lang="ts">
const model = defineModel();
model.value = "xxx";
</script>
```
有种打破单项数据流的错觉，不过只是语法糖，实际上还是接收modelValue的prop和触发update：modelValue事件

## 环境变量（使用vite）

让开发者区分不同的运行环境，实现兼容开发和生产

[戳这里看官方文档](https://cn.vitejs.dev/guide/env-and-mode.html)

```ts
import.meta.env // 在该对象上暴漏环境变量 

//BASE_URL:"/"
// DEV:true
// MODE:"development"
// PROD:false
// SSR:false

// 不要用动态的方式去更改环境变量
```

根目录创建 .env.[name]文件

```ts
// 如下创建一个开发环境的
//.env.development 
VITE_HTTP = http://www.baidu.com

// 生产环境的
// .env.production
VITE_HTTP = https://www.jd.com
```

生产环境会自动读取 production 文件不用配置，开发环境的如果没有自己读取那就在 package.json 中配置

```ts
// 开发环境读取.env.development文件 这里名字和自己创建的命名对上
"dev":"vite --mode development" 
```

### 在vite.config.ts中配置环境变量

因为 node 是环境使用 process.env 来获取

```ts
import { loadEnv } from 'vite' // 导入 loadEnv 函数，用于加载环境变量

// 改变写法 
export default({mode}:any)=>{
  console.log(loadEnv(mode, process.cwd())) // 返回一个对象，对象上挂载了所有环境变量
  return defineConfig({
      plugins: [vue(),]
  })
}
```

## 性能优化 

### 打包优化

打包前的分析：

使用谷歌浏览器自带的 Dev Tools 进行性能分析 LightHouse 可以看到下面跑风：

- First Contentful Paint 首屏加载速度
- Speed Index 页面各个可见部分的平均时间
- Largest Contentful Paint 最大内容的绘制时间
- Time to Interactive 可交互时间,也就是用户可交互的事件渲染完成
- Total Blocking Time 主进程阻塞时间，此时用户不可交互
- Cumulative Layout Shift 累积布局偏移，也就是页面布局突然改变


打包后的分析（vite）：

安装 rollup-plugin-visualizer

```npm
npm install rollup-plugin-visualizer
```

打包后可以看到每个文件的大小，可以把一些三方库按需引入或者 CND 引入

---

vite.config.ts 配置 build

- chunkSizeLimit：2000 限制打包后的文件大小
- sourcemap：false 是否生成 sourceMap 文件，方便调试
- minify：false 是否压缩代码 esbuild 打包速度最快 terser打包体积最小
- cssCodeSplit：true css拆分
- assetInlineLimit：4000 小于该值的图片打包成base64

---

### PWA 离线缓存


PWA 技术的出现就是让web网页无限接近于Native 应用

- 可以添加到主屏幕，利用manifest实现
- 可以实现离线缓存，利用service worker实现
- 可以发送通知，利用service worker实现

[官网戳这里](https://vite-pwa-org.netlify.app/)

vite 配置 PWA

```ts
// 安装
npm install vite-plugin-pwa -D

// 配置 vite.config.ts
plugins:[
  VitePWA({
    // 配置选项
  })
]

```

### 图片懒加载

用第三三方库，指令的方式

```ts
import lazyPlugin from 'vue3-lazy'

// 使用
// <img v-lazy="xxx"></img>
```

[前往封装懒加载指令](./progress.md#指令实现懒加载)


### 虚拟列表

原理：只渲染可视区域内的元素，可视区域外就删除掉

参考elementplus 虚拟列表组件 [此处前往](https://element-plus.org/zh-CN/component/table-v2.html#virtualized-table-%E8%99%9A%E6%8B%9F%E5%8C%96%E8%A1%A8%E6%A0%BC)

*等我自己实现一个再补到进阶里*

### 多线程

使用  new Worker 创建,worker脚本与主进程的脚本必须遵守同源限制。他们所在的路径协议、域名、端口号三者需要相同

```
const myWorker1 = new Worker("./calcBox.js");
```

都使用postMessage发送消息:

```
worker.postMessage(arrayBuffer, [arrayBuffer]);
```

都使用onmessage接收消息:

```
self.onmessage = function (e) {
 // xxx这里是worker脚本的内容
};
```

关闭：

```
worker.terminate();
```

vueUse 有现成的 [戳这里](https://vueuse.org/core/useWebWorker/#usewebworker)


### 使用防抖节流

vueUse 有现成的

[防抖](https://vueuse.org/shared/useDebounceFn/#usedebouncefn)

[节流](https://vueuse.org/shared/useThrottleFn/#usethrottlefn)

自己写 [戳这里](../js-md/progress.md#防抖与节流)


## 虚拟DOM与diff算法

### 虚拟DOM

虚拟DOM就是一个普通的js对象，用来描述真实DOM的，虚拟DOM可以减少直接操作真实DOM的次数(真实dom属性非常多)，提高性能，通过 js 生成 AST(抽象语法树) 节点树,(ts转js，es6转es5都会经过AST，v8转字节码时也会进行AST)


### diff算法

diff算法就是用来比较新旧虚拟DOM的差异，然后只更新差异部分，提高性能

vue2：

敬请期待

vue3：

- 有key

  - 1.前序对比
  - 2.尾序对比
  - 3.新节点如果多出来就是挂载
  - 4.旧节点如果多出来就是卸载
  - 5.乱序：
        5.1 构建新节点映射关系
        5.2 记录新节点在旧节点的位置数组，如果有多余就删掉，新节点不包含旧节点也删除，节点出现交叉就是移动要去求最长递增子序列
        5.3 计算最长递增子序列 （贪心+二分查找），如果当前遍历的节点不在子序列说明要进行移动，在序列就跳过


- 无key

新增、替换、 删除三步走，新的虚拟dom会按照顺序对旧的虚拟dom进行替换，如果多出来了就做新增，如果少了就做删除


## 响应式原理

我靠看懵了，暂缓......


## ref全家桶

### ref

包裹后数据变成响应式,支持所有类型,取值、赋值都需要通过 .value

```ts
import { ref, Ref } from 'vue' //Ref 是 ref 的 interface
// 可以接收泛型，也可以不写自己进行推导
type M = {
  title: string
}
let my: Ref<M> = ref({ title: '天才本人' })
console.log(my.value.title);
```

### isRef

判断是不是ref对象

```ts
import { isRef } from 'vue'
console.log(isRef(my)); // true
```

### shallowRef

浅层响应式，只对对象的第一层进行响应式处理

```ts
import { shallowRef } from 'vue'
let my = shallowRef({ title: '天才本人' ,nb:{title:'真的牛逼'}})
// 取值时到 .value 都是响应式 .value.title ，.value.nb.title 就不是响应式了
```

> 不可以将 ref 和 shallowRef 混合使用，会影响 shallowRef 造成视图更新（原因是下面的triggerRef引起的）

### triggerRef

能够手动触发 shallowRef 的更新 

```ts
setTimeout(() => {
  my2.value.title = '我被修改了'
  my2.value.nb.title = '我被修改了'
  // triggerRef(my2) 
  //可以观察到不做强制更新时值是变化的视图是没有更新的
  //做强制更新后视图也会变化了，ref底层会自动调用triggerRef
  console.log(my2.value.title);
  console.log(my2.value.nb.title)
}, 2000);
```

### customRef

自定义ref，可以传入一个get和set函数，get函数在取值时调用，set函数在赋值时调用（这byd好像也是浅层修改，试了一下）

```ts
function myRef<T>(value: T) {
  return customRef((track, trigger) => {
    return {
      get() {
        track() //收集依赖
        return value
      },
      set(newValue) {
        value = newValue
        trigger()//触发依赖
      }
    }
  })
}
let my3 = myRef({ title: '天才三号', nb: { title: '牛逼的飞起' } })
setTimeout(() => {
  // 没有触发视图更新
  my3.value.title = '三号天才被修改了'
  my3.value.nb.title = '三号天才被修改了'
  console.log(my3.value.title);
  console.log(my3.value.nb.title)
}, 2000);

let my4 = myRef('小母牛撅屁股，挺牛逼')
setTimeout(() => {
  // my4.value = '小母牛不敢牛逼了' //能欧触发视图更新
}, 3000)
```

## reactive全家桶

### reactive

将对象变成响应式，只接受引用类型的参数如: Object、Array、Map、Set,取值、赋值不用通过 .value

```ts
import { reactive } from 'vue'
// 可以接收泛型，也可以不写自己进行推导
type M = {
  title: string
}
let my = reactive<M>({ title: '天才本人' })

// 注意直接修改会丢失响应性
let my5 = reactive<string[]>([])
const add = () => {
  // my5.push('我是新来的') //正常能够渲染视图
  let nb = ['我真牛逼直接修改', '哈哈哈']
  // my5 = nb; // 直接赋值会丢失响应性，无法渲染视图
  my5.push(...nb) //不会丢失

  setTimeout(() => {
    // my5.push('我是异步来的') //正常能够渲染视图
    let nb2 = ['异步牛逼哥', '我tm改改改']
    // my5 = nb2; //一样会丢失
    my5.push(...nb2) //不会丢失
    console.log('异步的:', my5);
  }, 2000)
  console.log(my5);
}

// 当然可以把数组包裹给对象就可以实现直接修改了
let my6 = reactive<{ nb: string[] }>({ nb: [] })
let nb2 = ['翅膀硬了', '我直接修改']
my6.nb = nb2 //不会丢失响应性
```

### readonly

将对象变成只读的，不能修改，修改会报错

```ts
import { reactive, readonly } from 'vue'
let my = reactive({ title: '天才本人' })
let my2 = readonly(my)
// my2.title = '你敢改我试试' // 报错 
my.title='我是天才直接该原对象'//（但如果直接修改了原始对象那么也会受到影响）
console.log(my,my2);// 都会变
```

### shallowReactive

浅层响应式，只对对象的第一层进行响应式处理,到第一个属性（参考shallowRef 是到 .value,问题也一样不要同时与 reactive 一起使用）

