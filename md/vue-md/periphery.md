# Vue周边生态


## vuex

vue2 推荐使用 (vuex3) 的状态管理模式，采用集中式存储管理应用的所有组件的状态。（原理：单例模式：使用过程中通过 Vue.use(Vuex) 安装了Vuex插件,而Vuex 插件是一个对象，它在内部实现了一个 install 方法，这个方法会在插件安装时被调用，从而把 Store 注入到Vue实例里去。也就是说每 install 一次，都会尝试给 Vue 实例注入一个 Store）

核心：

- `state`：单一状态树（存数据的仓库，数据是响应式的）
    如何使用：`this.$store.state` 或 `mapState` 辅助函数映射到组件
- `getter`：从基本数据 state 里派生的数据 （相当于计算属性） 
    如何使用：`store.getters` 或 `mapGetters` 辅助函数映射到组件
- `mutation`: 唯一能够修改 state 数据的方法（同步） （相当于方法）
    如何使用：`this.$store.commit('xxx')` 或 `mapMutations` 辅助函数映射到组件
- `action`: 提交 mutation 而不是直接变更状态（异步） （相当于方法）
    如何使用：`this.$store.dispatch('xxx')` 或 `mapActions` 辅助函数映射到组件

- `modules`: 模块化，每个模块拥有自己的 state、mutation、action、getter
    如何使用: 

```js
// 不同的两个文件存放不痛模块数据
// custom.js
const customs = {
    namespaced: true, // 创建命名空间
    state: { // 存储变量
        tc1：'你他两还真个天才'
    },
    mutations: {
    // ...此处省略
  },
  actions: {
    // ...此处省略
  },
  getters: {
    // ...此处省略
  }
}
export default customs


// profile.js
const profile = {
  namespaced: true,
  state: {
    tc2:'好好好你是天才'
  },
  mutations: {
    // ...此处省略
  },
  actions: {
    // ...此处省略
  },
  getters: {
    // ...此处省略
  }
}
export default common

// index.js 将两个文件挂载上
import Vue from 'vue'
import Vuex from 'vuex'
// 引入子store
import profile from './modules/profile'
import customs from './modules/customs'
// Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    profile,
    customs
  }
})
export default store // 导出store，以便于后续使用

// 组件使用
computed: {
    ...mapState('profile', ['tc2']),
    ...mapState('customs', ['tc1'])
  },
```

好处:

1. 能够在vuex中集中管理共享的数据,易于开发和后期的维护

2. 能够高效的实现组件间的数据共从而提高开发效率

3. 存储在vuex中的数据都是响应的能够实时保持数据页面的共享同



## Pinia

- 完全取代 vuex，完整的 ts 支持
- 轻量，去除 mutations，
- actions 支持同步异步
- 代码扁平化没有模块嵌套，只有 store 的概念，store 之间可以自由使用，每一个 store 都是独立的
- 无需手动添加 store，一点创建自动添加
- 支持 vue2 vue3

安装:

```js
yarn add pinia
# 或者使用 npm
npm install pinia
```

使用：

```js
// main.ts 
import {createPinia} from 'pinia'
const store = createPinia()
app.use(store)

// store-name.ts index.ts同级目录
export const enum Names{
    // 定义枚举值
    TEST='TEST'
}

// src 创建 store 文件夹 再创建 index.ts
import {defineStore} from 'pinia'
import {Names} from './store-name'
export const useTestStore =defineStore(Names.TEST, {
    state: () => ({
        // 定义变量
            current:'我去',
            name:'天才'
    }),
    getters: { // 具有缓存的特性
        // 定义getter
    },
    actions: {
        // 定义action
        setCurrent(val:string){
            this.current='我是action修改的:'+val
        }
    }
})

// 组件使用
import {useTestStore } from './store'
const Test = useTestStore() // Test. 即可拿到 state 里定义的属性

```

`state` 的值修改方法

1. 可以直接修改 如上面例子 Test.curren='卧槽'
2. Test.$patch({ current:'牛逼',name:'小天才'})
3. Test.$path((state)=>{
    state.current='哈哈',
    state.name='笨蛋'
    })
4. Test.$state={current:'哈哈',name:'笨蛋'} 会修改整个state（不推荐）
5. Test.setCurrent('是的没错') 调用 action 里的方法

解构 store 中的 state 变量（结构后不具有响应式，可用 `storeToRefs` 变成响应式）

```js
import { storeToRefs} from 'pinia' // 引入 storeToRefs 方法
const {current,name} = storeToRefs(Test) // 解构后具有响应式
```
---

一些 api 的使用

 - `.$reset()` 将 state 恢复至初始状态
- `.$subscribe((args,state)=>{},{detached:true})` state 任何值变化后都会触发该函数，有两个参数(args,state) args可以看新旧值，state就是修改后的state对象，detached ，其他的详见官网文档
- `.$onAction((args)=>{},true)` 调用 action 时会触发  ture 代表 使用的组件被销毁后扔可继续监听 action 触发

---

持久化插件：

这里是写在 main.ts 里,下面是完整代码

```ts
import { createApp,toRaw } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia,PiniaPluginContext} from 'pinia'
  
type Options={
    key:string
}
// 一个默认key 如果用户没有设定自己的key就用这个
const __piniaKey__:string = 'pinia储存'
// 5. 用来实现存储的函数 key 用来区分不同的实例 value 都懂就是 state 的值
const setStorage= (key:string,value:any)=>{
    localStorage.setItem(key,JSON.stringify(value)) // value 要存到 localStorage 记得把值转换一下
}
// 6.用来读取 localStorage 里数据的函数
const getStorage=(key:string)=>{
    // 判断一下有没有当前 key 有的话拿出来 没有就返回空对象 as string 类型断言成string 因为存的就是string
    return localStorage.getItem(key)? JSON.parse(localStorage.getItem(key) as string):{};
}
// 1.定义插件函数
const piniaPlugin=(options:Options)=>{ //options 用户自定义配置
    // console.log('context',context); // 可以看到两个使用了的实例(这里看你自己调用过几个实例我这里是两个)
    // 用函数柯里化处理 pinia 的返回值 
    return (context:PiniaPluginContext)=>{
         // 3.解构store
    const {store} = context;
    // console.log(store);// 可以看到是两个 proxy 对象
    // 7. 读取存入的值
    const data =getStorage(`${options?.key ?? __piniaKey__}-${store.$id}`)
    // console.log(data);
    // 4. 利用 .$subscribe 在 state 数据变化时触发搞点事情
    store.$subscribe(()=>{
        console.log('检测到数据变化了');
        // 5.调用储存函数
        // options?.key ?? __piniaKey__ 这里判断用户设置的key可以有也可以不设置，不设置就会用上面写的默认的  
        // store.$id 取实例的 id 为了更好的区分不同实例 提高体验
        // store.$state 是个 proxy 对象不能直接用 用 toRaw 转成普通对象 toRaw 是vue的记得上面引入
        setStorage(`${options?.key ?? __piniaKey__}-${store.$id}`,toRaw(store.$state))
    })
    // 8. 把读到的值返回出去 否则页面刷新还是没有等于白写了半天
    return{
        ...data
    }
    }
}
const store = createPinia()
// 2.传递给 store 在内部会自己调用这个函数 会返回一些参数用 context 看看
store.use(piniaPlugin({ // 支持一个自定义对象防止和 localStorage 其他的冲突 也就是 函数要接受的options 这里定义对象了就要用柯里化处理了
    key:"pinia"
}))
createApp(App).use(store).mount('#app')
```

## vue-Router

vue3用router4，vue2用router3，这里用router4举例

### 安装配置

安装:

```js
//挑自己喜欢的
npm install vue-router@4

yarn add vue-router@4

pnpm add vue-router@4
```

配置：在 src 下新建 router 文件夹，新建 index.ts 文件，内容如下：

```ts
import { createRouter, createWebHistory, createWebHashHistory,RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [ //静态路由表
  {
    path: "/",// 访问路径
    component: () => import("../components/HelloWorld.vue"),//组件
  },
];

const router = createRouter({
  history: createWebHistory(),//路由模式 哈希模式createWebHashHistory 历史模式createWebHistory
  routes,
});

export default router;
```

还要在 main.ts 引入:

```ts
// main.ts
import router from "./router"; // 引入路由
app.use(router); // 使用路由
```


### 使用 

需要 `<router-view>` 标签来展示匹配的路由,`<router-link to='/'>` 标签可以切换路由(可以理解为a标签)，to 指向的是你路由表里的访问路径

```vue
<!-- 不详细演示了很简单 -->
<template>
  <div>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view></router-view>
  </div>
</template>
```

### 路由模式

vue3 的 router4 有两种模式：`createWebHistory()` 和 `createWebHashHistory()`

vue2 的 router3 有两种模式：`history` 和 `hash`

就是hash和history只是名字变了

还有ssr渲染所用的 vue3是 `createMemoryHistry`,vue2是 `abstact`

#### hash模式

`hash`模式在url中会带有 `#` 号，原理是通过 `location.hash` 匹配,
常用作锚点在页面内进行导航，**改变url中的hash部分不会引起页面的刷新**

通过 hashchange 事件监听 url 的变化，改变 url 的方法只有这几种：
- 通过浏览器的前进后退
- a标签
- window.location


### history模式

`history`模式利用了 HTML5 History Interface 中新增的 `pushState()` （记录栈中添加一个新的条目,可以使用浏览器的后退） 和 `replaceState()`（不会添加新的条目） 方法
这两个方法应用于浏览器记录栈，在当前已有的 `back`、`forward`、`go` 的基础之上，它们提供了对浏览器记录栈直接的操作

如：history.pushState({state:1},'','/')（第一个参数是个对象，第二个参数是title一般空着就行，第三个参数是跳转路径） 会跳转到 `/` ,history.replaceState(stateObj, title, [url]);同理

可以监听 `popstate` 来获取相关信息，注意该方法监听不到上面的 `pushState`

`history` 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，**如果后端没有正确配置，当用户直接在浏览器中输入 `url`，就会返回 404，所以需要后端支持**。比如在 nginx 中，需要做如下配置：

```js
location / { try_files $uri $uri/ /index.html; }
```


### 编程式导航

除了下面两种通过标签的跳转，还能使用一些指定的方法在逻辑代码中来进行跳转
- 通过路由的 `name` 跳转
- 直接使用 `<a href="/">` 标签 (页面会刷新)

```ts
const routes: Array<RouteRecordRaw> = [ 
  {
    path: "/",// 访问路径
    name:"home",//路由名称 用name也可以跳转
    component: () => import("../components/HelloWorld.vue"),//组件
  },
]
```
link标签中to要传入对象
```vue
<router-link :to="{name:'home'}">Home</router-link>
```

- 使用 `useRouter` 的 `push`
> 注意区分 `useRouter` 与 `useRoute` ，前者是获取路由实例(可以调用一些方法)，后者是用来获取路由信息(能够获得路由来自哪，要去哪，当前在哪)

```ts
import {useRouter} from 'vue-router'
const router = useRouter() // 获取路由实例
router.push('/')//普通字符串形式
router.push({path:'/'})//对象形式 name也可以
```


### 历史记录

`replace` 替换当前的路由不会产生历史记录

标签写法：
```vue
<router-link replace :to="{name:'home'}">Home</router-link>
```

编程式写法：
```ts
router.replace('/')
```

`go` `back` 可以横跨历史记录

```ts
router.go(2)// 前进两个历史记录
router.back()// 后退一个历史记录
```

### 路由传参

三种：
- Query路由传参
- Params路由传参(4.1.4之后必须要用下面的动态路由匹配)
- 动态路由传参

结合案例：

```ts
// 路由结构
  {
    path: "/product", // 要传值的
    name:"product",
    component: () => import("../components/Product.vue"),
  },
  {
    path: "/detail", // 接受值的
    name:"detail",
    component: () => import("../components/ProductDetails.vue"),
  },
```


```vue
<!-- 要传递值得组件 -->
<template>
    <div class="produtc">
        <table>
            <tr>
                <th>产品名称</th>
                <th>产品价格</th>
                <th>操作</th>
            </tr>

            <tr :key="item.id" v-for="item in items">
                <td>{{ item.name }}</td>
                <td>{{ item.price }}</td>
                <td><button @click="golook(item)">点击去看详情</button></td>
            </tr>
        </table>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

type Item = {
    name: string,
    describe: string
    price: number,
    id: number
}

const items: Item[] = [
    { name: '苹果', describe: '一天一苹果，医生远离我', price: 10, id: 1 },
    { name: '香蕉', describe: '大香蕉一只大香蕉', price: 20, id: 2 },
    { name: '橙子', describe: '橙留香的橙', price: 15, id: 3 }
]

// 1.Query路由传参 使用router push 或者 replace 的时候 改为对象形式新增query 必须传入一个对象
// 这种方法会将参数暴露在url中
const golook = (item: Item) => {
    router.push({
        path: '/detail',// 某个页面
        query: item  //也可以 query: { id: item.id }只传单个想要的
    })
}

// 2.Params路由传参 原理和上面一样但是 是通过 name 跳转，params传参
// const golook = (item: Item) => {
//     router.push({
//         name: 'detail',// 某个页面的 name 值
//         params: item // 4.1.4之后这种写法被移除不再适用 // 不会暴露在url中，但是刷新页面会丢失
//     })
// }
const golook2 = (item: Item) => {
    const data = JSON.stringify(item)
    router.push({
        name: 'detail',// 某个页面的 name 值
        params: { item: data } // 这样的话参数仍会在url中，但是刷新页面不会丢失 而且路由要对该参数匹配 :item
    })
}
// 路由要设置成这样
// {
//     path: "/detail/:item",
//     name: "detail",
//     component: () => import("../components/ProductDetails.vue"),
// },

// 3.动态路由传参 其实在第二个例子中就使用了
// 就是给路由一个用来匹配的字段，然后跳转时传递匹配的参数，这里就不演示了一模一样

</script>

------------------------------------

<!-- 获取值的组件 -->
<template>
    <div class="details">
        <div class="name">名称：{{ route.query.name }}</div>
        <div class="describe">描述：{{ route.query.describe }}</div>
        <div class="price">价格：{{ route.query.price }}</div>
        <div class="id">编号：{{ route.query.id }}</div>
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute() // useRoute 不是 useRouter

// 1.Query 路由传参 用query传递就用query接收
// 可以在上面直接用 route.query.xxx 获取

// 2. Params 路由传参 
// 接收的时候直接用route.params.xxx 
// 因为4.1.4之后必须要定义后传递 传递时做了转换 接收时也要转换回去
const data = JSON.parse(route.params.item as string) // 这里要和路由的匹配参数对应 item //相应的上面渲染用这里的data就行了这里不再写了

// 3. 动态路由传参 第二个例子用过了不演示了
// 若果数据比较敏感不能暴露在url，就用不敏感的字段传递过来，如id等，再使用传递过来的的id去发请求拿数据就行了
</script>
```

### 嵌套路由

就是路由还有子路由

```ts
[
  {
    path: "/",
    component: () => import("../components/HelloWorld.vue"),
    children:[
      {
        path:'/home',
        component: () => import("../components/Home.vue")
      },
      {
        path:'/nb',
        component: () => import("../components/nb.vue")
      }
    ]
  },
  {
    path: "/about",
    component: () => import("../components/about.vue"),
    children:[
      {
        path:'/about/hhh',
        component: () => import("../components/hhh.vue")
      }
    ]
  },
]
```

用的时候和普通路由一样，写好对应的路径就行了

### 命名视图

一个视图里可以一次定义多个组件然后根据情况去渲染某个组件（有点具名插槽的味道）

定义路由：
```ts
[
  path:'/nb'
  components:{ // 注意这里是 components 不是 component
    // default 是默认的时候这个名字是死的
    default: () => import ('../components/nb.vue'),
    // hhh xxx 都是自己起的 后面要在渲染的地方一一对应
    hhh:() => import ('../components/hhh.vue'),
    xxx:() => import ('../components/xxx.vue'),
  }
]
```

使用：
```vue
<template>
  <div>
    <!-- default -->
   <router-view></router-view> 
   <!-- 自定义的 -->
   <router-view name="hhh"></router-view>
   <router-view name="xxx"></router-view>
  </div>
</template>
```

### 重定向

访问某个带有重定向的路由时会将访问目标转移到重定向的路由

#### redirect

```ts
// 定义路由
[
  {
    path:'/wc',
    component:()=>import ('../components/wc.vue'),
    // 1.字符串写法
    redirect:'/wc/wcnb' // 重定向到 wcnb 其他路由也可不一定是子路由
    // 2.对象写法
    redirect:{name:'wcnb'} //path也可以不演示了
    // 3.函数写法
    redirect:to=>{
      // to 是一个对象，里面有path name等属性
      console.log(to)
      // 可以字符串，也可以对象，还可以传参
      // return '/wc/wcnb'
      return {
        path:'/wc/wcnb',
        query:{
          name:'哈哈'
        }
      }
    }
    children:[
      {
        path:'/wc/wcnb',
        name:'wcnb'
        component:()=>import ('../components/wcnb.vue')
      }
      {
        path:'/wc/wcsb',
        component:()=>import ('../components/wcsb.vue')
      }
    ]
  }
]
```

### alias 别名 

就是给这个路由起个别的名字，访问别名时仍会跳转到这个路由

例：

```ts
[
  {
    path:'/user'
    component:()=>import ('../components/user.vue')
    // alias:'/user1' // 访问user1时仍会跳转到user
    // 可以起多个
    alias:['/user2','/user3','/hhh','/znb'] // 访问user2或user3时仍会跳转到user
  }
]
```

### 路由守卫

全局守卫有三种：

- 全局前置守卫 导航触发时调用，可用来阻止跳转
- 全局解析守卫 导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后调用
- 全局后置守卫 导航完成之后调用，不会改变导航本身

```ts
// 全局守卫都在定义路由的同时进行定义 (同一个文件里如：index.ts 或 )
// 结合一个登陆的案例 没有登录时无法访问主页home,只有登录后存储了token才可以访问且登录后就不能访问登录页

import { createVNode, render } from "vue";//这里是为了挂载进度条组件导入的方法

// 路由配置
[
  {
    path: "/",
    component: () => import("../components/HelloWorld.vue"),
    alias: ["/home"],
  },
  {
    path: "/login",
    component: () => import("../components/login.vue"),
  },
]

// 进度条 在守卫之前挂载到dom上
const Vnode = createVNode(loadingBar);//将组件转成虚拟dom
render(Vnode, document.body);//挂载

// 定义一个 白名单 或者说不需要登录就能访问页面
const whileList: string[] = ["/login"];

// 全局前置守卫 
// 这里做拦截未登录的访问案例
router.beforeEach((to, form, next) => {

  // 调用进度条开始的方法
  Vnode.component?.exposed?.startLoading();

  // 获取token
  const token: string | null = localStorage.getItem("token");
  // 判断 token 是否存在或者访问的路由是否需要登录
  if (whileList.includes(to.path) || token) {
    // 如果 token 存在且访问的是 login 
    if (token && to.path === "/login") { 
      next(from.path); // 从哪来回哪去 或者中断掉 next(false)
    } else {
      next(); // 正常放行
    }
  } else {
    // token 不存在或访问了非白名单的路由直接返回登录页
    next("/login");
  }
});

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  // 在这里执行你的逻辑
  console.log("我是解析守卫");
  next();
});


// 全局后置守卫 
router.afterEach((to, from) => {
  // 调用进度条结束的方法
  Vnode.component?.exposed?.endLoading();
});
```

自己随便写个登录页就行:

```vue
<!-- login.vue -->
<template>
    <div class="box">
        <form>
            <input v-model="data.name" type="text" placeholder="用户名" autocomplete="username">
            <input v-model="data.password" type="password" placeholder="密码" autocomplete="current-password">
            <button @click="login" type="button">登录</button>
        </form>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
type Data = {
    name: string,
    password: string
}
const data: Data = reactive({
    name: '',
    password: ''
})
const login = () => {
    console.log(data)
    if (data.name == '123' && data.password == '123') {
        localStorage.setItem('token', '123')
        router.push('/home')
    } else {
        alert('用户名或密码错误')
    }
}
</script>
```

进度条组件:

```vue
<template>
    <div class="wraps">
        <div ref="bar" class="bar"></div>
    </div>
</template>
<script setup lang="ts">
import { ref,  defineComponent } from 'vue'

let speed = ref<number>(1)
let bar = ref<HTMLDivElement>()
let timer = ref<number>(0) // 接受 cancelAnimationFrame 返回的id方便清除或调用
// 进度条开始
const startLoading = () => {
    let dom = bar.value as HTMLDivElement
    speed.value = 1
    // 不用定时器因为会引起大量会的回流重绘
    // requestAnimationFrame 类似定时器 但以60帧帧率进行绘制，性能也更好
    timer.value =  window.requestAnimationFrame(function fn() { // 这里不用箭头函数是为了方便下面来递归
        if (speed.value < 90) { //到90就不动等着结束函数直接变成100 欺骗眼睛来达到进度条的效果
            speed.value += 3 //可以控制进度条速度
            dom.style.width = `${speed.value}%` // 原理就是改变宽度
            timer.value = window.requestAnimationFrame(fn) //递归调用自己 每次+3
        } else {
            speed.value = 1
            window.cancelAnimationFrame(timer.value) //清除掉 cancelAnimationFrame 和计时器一样会返回一个id
        }
    })
}
// // 进度条结束
const endLoading = () => {
    let dom = bar.value as HTMLDivElement
    setTimeout(() => {
        window.requestAnimationFrame(() => {
            speed.value = 100
            dom.style.width = `${speed.value}%`
        })
    }, 200);
}
defineComponent({
    name: 'loadingBar'
})
// 把方法暴露出去以便调用
defineExpose({
    startLoading,
    endLoading
})
</script>
<style scoped lang="scss">
.wraps {
    position: fixed;
    top: 0;
    width: 100%;
    height: 3px;

    .bar {
        height: inherit;
        width: 0;
        background: #e0f804;
    }
}
</style>
```

> 当然了嫌麻烦有现成的插件 npm install nprogress 

下面是局部守卫：

在路由中定义：
- `beforeEnter` 

在组件里定义：
- `beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave` 选项式api
- `onBeforeRouteUpdate`、`onBeforeRouteLeave` 组合式api

```ts
// beforeEnter
const routes = [
  {
    path: '/about',
    component: About,
    beforeEnter: (to, from, next) => {
      // 在这里添加你的逻辑
      next();
    }
  }
];

// 组件内守卫 (选项式api)
beforeRouteEnter(to, from, next) {
  // 在导航到该组件之前调用
  next();
},
beforeRouteUpdate(to, from, next) {
  // 在当前路由改变，但是该组件被复用时调用
  next();
},
beforeRouteLeave(to, from, next) {
  // 在导航离开该组件时调用
  next();
}

// 组合式api
import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';
onBeforeRouteUpdate((to, from, next) => {
    console.log('当前路由改变但组件被复用时触发，如路由参数变化组件实例保持不变时');
    next();
});
onBeforeRouteLeave((to, from, next) => {
    console.log('离开该路由时触发');
    next();
});
```

### 路由元信息

通过路由记录的 `meata` 属性，可以用来定义路由的元信息，比如路由的标题、是否需要登录等。
如：
- 权限检验标识
- 路由组件过渡名称
- 路由组件是否缓存
- 标题名称

```ts
// 路由定义
[
   {
    path: "/login",
    meta:{ // 这里就是元信息
      title:"登录"
    },
    component: () => import("../components/login.vue"),
  },
]

// 解决赋值报错
declare module 'vue-router'{ //declare module 可以在不破坏原始代码的情况下添加你的东西
  interface RouteMeta{  // 路由元祖信息的接口
    title:string  // 手动给它一个类型
  }
}

// 可以在守卫中读取到
router.beforeEach((to, form, next) => {
  // console.log("我是前置守卫");
  console.log(to.meta.title);
  // 当我们将meta的值赋值给document.title时 会报错 --不能将类型“unknown”分配给类型“string”-- 
  // 参考上面解决
  document.title = to.meta.title;
  next();
});
```

### 路由过渡动效

这使用 `animate.css` 演示，利用上面的元信息来实现

安装v引入：
```ts
npm install animate.css

// main.ts
import 'animate.css' //animate动画库引入
```

使用:

定义路由:
```ts
//  (还是上面的例子拿来用)
// 别忘了在里面吧 动画属性也加上
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    transitionName?: string;
  }
}
// 路由
[
    {
    path: "/",
    component: () => import("../components/HelloWorld.vue"),
    alias: ["/home"],
    meta: {
      title: "主页",
      transitionName: "animate__fadeInDown", //这里定义好动画名
    },
  },
  {
    path: "/login",
    meta: {
      title: "登录",
      transitionName: "animate__fadeInLeft",
    },
    component: () => import("../components/login.vue"),
  },
  {
    path: "/about",
    component: () => import("../components/about.vue"),
    meta: {
      title: "关于",
      transitionName: "animate__fadeInUp",
    },
  },
]
```

组件使用:

```vue
<!-- route路由信息 Component 组件的vnode -->
<router-view #default="{ route, Component }">
  <!-- transition vue的过渡动画用的标签  animate__animated是使用该动画库的前缀-->
  <transition :enter-active-class="` animate__animated ${route.meta.transitionName}`">
    <!-- 动态组件把要显示的组件绑定进去这样才能触发动画 否则transition内部是空的就报错了 -->
    <component :is="Component"></component>
  </transition>
</router-view>
```

### 滚动行为

就是实现路由切换后还能浏览上次浏览的地方

```ts
// 路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由滚动
  scrollBehavior: (to, from, savedPosition) => {
    console.log(savedPosition); //{left: 0, top: 0}
    // return {
    //   // 返回值是个对象
    //   top: 0,
    //   left: 0,
    // };

    // 支持异步
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({ left: 0, top: 1500 });
    //   }, 1000);
    // });

    // 原来浏览到哪里就返回哪里
    if (savedPosition) { // 注意这个只有使用浏览器的前进后退时才有效
      return savedPosition;
    } else {
      return { left: 0, top: 0 }; // 插一嘴 vue2的router3是 x，y
    }
  },
});
```

### 动态路由

主要使用 `addRoute` 来添加路由,一般带有权限的路由后端都会返回一个数组，然后前端根据这个数组动态添加路由

删除路由：
- 添加一个名称冲突的路由，如果添加与现有途径名称相同的途径，会先删除路由，再添加路由根据 name 来判断

```ts
router.addRoute({ path: '/about', name: 'about', component: About })
// 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
router.addRoute({ path: '/other', name: 'about', component: Other })
```
- 通过调用 router.addRoute() 返回的回调 (当路由没有名称时，这很有用)

```ts
const removeRoute = router.addRoute(routeRecord)
removeRoute() // 删除路由如果存在的话
```

- 通过使用 router.removeRoute() 按名称删除路由

```ts
router.addRoute({ path: '/about', name: 'about', component: About })
// 删除路由
router.removeRoute('about')
```

查看现有路由:
- router.hasRoute()：检查路由是否存在。
- router.getRoutes()：获取一个包含所有路由记录的数组

---

这里写个案例 登录后动态添加路由：

前端：

路由:

```ts
// 这是公共的路由谁都能访问 
// 后面会在后端传递 /product 与 /detail/:item 进行动态添加供管理员使用
[
  {
    path: "/",
    name: "home",
    component: () => import("../components/HelloWorld.vue"),
    alias: ["/home"],
    meta: {
      title: "主页",
      transitionName: "animate__fadeInDown",
    },
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
    },
    component: () => import("../components/login.vue"),
  },
  {
    path: "/about", 
    name: "about",
    component: () => import("../components/about.vue"),
    meta: {
      title: "关于",
      transitionName: "animate__fadeInUp",
    },
  },
]
```

登录页：

```ts   
// 组件我就不放上来了主要逻辑拿上来 自己写个表单提交就行了

// 这里最好是后端返回数据后存在 pinia 或本地 然后再去路由守卫读取动态添加
// （为了方便就直接在登录这里写了）

import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // 记得装axios 用fetch也行随你
const router = useRouter()
type Data = {
    name: string,
    password: string
}
// 用户名密码
const data: Data = reactive({
    name: '',
    password: ''
})
// 登录
const login = async () => {
    const result = await axios.get('http://localhost:3000/api/permission', { params: data })
    if (result.data != '账号或密码错误') {
        initRouter(result.data.route)
    } else {
        alert('用户名或密码错误')
    }
}
// 动态添加路由
const initRouter = (res: []) => {
    res.forEach((r: any) => {
      // 路由在已知的路由不存在就添加（因为一些路由是公共的路由谁都可以访问）
        if (!router.hasRoute(r)) {
            router.addRoute({ //添加路由
                path: r.path,
                name: r.name,
                //这里本来是 import(`../components/${r.component}`) 但是不能正常使用所以配合后端修改了传送来的component字段 
                component: () => import(`../components/${r.component}.vue`), 
            })
        } else {
            return
        }
    });
    localStorage.setItem('token', '123') //你可以不写 我这里路由守卫做了处理所以要写
    router.push('/')
}
```

后端：

```js
import express from "express";
import cors from "cors";

const app = express();

// 允许跨域
app.use(cors());

// 路由权限模拟接口
app.get('/api/permission',(req,res)=>{
    console.log(req.query);
    if(req.query.name=='admin'&& req.query.password=='123'){ //管理员用户
        res.json({
            route:[
                {
                    path:'/',
                    name:'home',
                    // 这里配合前端修改后的 少了.vue ，让前端自己拼接不然前端老报错找不到别的方法解决只好这样了
                    component:'HelloWorld' 
                },
                {
                    path:'/about',
                    name:'about',
                    component:'about'
                },
                {
                    path:'/product',
                    name:'product',
                    component:'Product'
                },
                {
                    path: "/detail/:item",
                    name: "detail",
                    component: 'ProductDetails',
                }
            ]
        })
    }else if(req.query.name=='123'&& req.query.password=='123'){ //普通用户
        res.json({
            route:[
                {
                    path:'/',
                    name:'home',
                    component:'HelloWorld.vue' // 这是原来准备传的
                },
                {
                    // 为什么和公共重复了，因为这里只是用户所具有的能够访问的路由的列表
                    // 前端在未登录时也可以约束一些路由不给访问
                    path:'/about', 
                    name:'about',
                    component:'about.vue'
                },
            ]
        })
    }else{
        res.send('账号或密码错误')
    }
})
// 启动服务
app.listen(3000,()=>{
    console.log('服务器启动成功 http://localhost:3000')
})
```