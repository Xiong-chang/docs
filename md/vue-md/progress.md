# Vue进阶

## 指令实现权限鉴别

使用自定义指令,命名规范 v开头 如：vFocus 

自定义指令也可以使用vue生命周期的钩子回调

思路：
- 1.获取到后端给的数据
- 2.利用指令绑定的值与后端给的数据进行对比，判断是否有权限，如果没有权限，则将按钮隐藏

```vue
<template>
  <div class="btns">
    <button v-has-show="'shop:create'">创建</button>

    <button v-has-show="'shop:edit'">编辑</button>

    <button v-has-show="'shop:delete'">删除</button>
  </div>
</template>
<script setup lang="ts">
import type { Directive } from 'vue' //引入指令的类型

// 模拟后台给的数据并储存本地
const permission = [
  'znb:shop:edit', // 用户id : 当前页面 : 当前权限
  'znb:shop:create',
  // 'znb:shop:delete' // 没有这个权限 那么页面也就不会渲染
]
localStorage.setItem('userId', 'znb')

const userId = localStorage.getItem('userId') as string //as 类型断言
const vHasShow: Directive<HTMLElement, string> = (el, bingding) => { //el元素 bingding可以读取一下详细信息
  console.log(el, bingding);
  // 判断是否有权限
  if (!permission.includes(userId + ':' + bingding.value)) { //bindging.value就是上面绑定时的值 create 或 edit 或 delete
    el.style.display = 'none'
  }
}
</script>
<style scoped lang="scss">
.btns {
  button {
    margin: 10px;
  }
}
</style>

```


## 实现拖拽指令

思路：
- 1.获取dom元素，并给元素添加鼠标按下事件，记录鼠标按下时的位置。
- 2.鼠标移动事件，记录鼠标移动时的位置，并计算出鼠标移动的距离。
- 3.鼠标抬起事件，取消鼠标按下事件，并记录鼠标抬起时的位置。
- 4.判断是否超出边界，如果超出边界，则将元素的位置设置为边界位置。
- 5.判断是否开启超出边界，如果开启超出边界，则将元素的位置设置为边界位置。

```vue
<template>
    <div v-move="'exceed:false'" class="box">
        <div class="header">此处拖拽</div>
        <div>我是内容</div>
    </div>
</template>
<script setup lang="ts">
import { Directive, DirectiveBinding } from 'vue'
const vMove: Directive<any, string> = (el: HTMLElement, bingding: DirectiveBinding) => {
    // 1.获取dom元素
    let moveElement: HTMLDivElement = el.firstChild as HTMLDivElement
    let isExceed = bingding.value // 获取是否开启了超出边界
    // 2. 鼠标按下
    const mouseDown = (e: MouseEvent) => {
        let X = e.clientX - el.offsetLeft;
        let Y = e.clientY - el.offsetTop;
        // 3.鼠标移动
        const move = (e: MouseEvent) => {
            // 判读是否开启超出边界
            if (isExceed === 'exceed:true') { // 开了
                el.style.left = e.clientX - X + 'px'
                el.style.top = e.clientY - Y + 'px'
            } else {
                // 判断是否到达边界
                if (e.clientX - X < 0) {
                    el.style.left = 0 + 'px'
                } else if (e.clientX - X > document.documentElement.clientWidth - el.offsetWidth) {
                    el.style.left = document.documentElement.clientWidth - el.offsetWidth + 'px'
                } else {
                    el.style.left = e.clientX - X + 'px'
                }
                // 判断是否到达边界
                if (e.clientY - Y < 0) {
                    el.style.top = 0 + 'px'
                } else if (e.clientY - Y > document.documentElement.clientHeight - el.offsetHeight) {
                    el.style.top = document.documentElement.clientHeight - el.offsetHeight + 'px'
                } else {
                    el.style.top = e.clientY - Y + 'px'
                }
            }
        }
        document.addEventListener('mousemove', move)
        // 4.鼠标抬起
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', move)
        })
    }
    moveElement.addEventListener('mousedown', mouseDown)
}
</script>
<style scoped lang="scss">
.box {
    position: absolute;
    width: 300px;
    min-height: 300px;
    border: 1px solid #000;

    .header {
        width: 100%;
        height: 30px;
        color: #fff;
        background-color: #000;
    }
}
</style>
```

## 指令实现懒加载
使用 `IntersectionObserver` 这个原生 api，做一个监视器 observer 去监听每一个图片是否进入可视区域，如果进入可视区域，那么就加载图片，如果未进入可视区域，那么就不加载图片

（这个api也可以拿来做虚拟列表，等我搞出来再上传出来）


`IntersectionObserver` 实例对象会有一个 `observe` 的方法，把监听的元素传进去，监听元素进入可视区域时，会触发 `observer` 的回调函数，回调函数形参`entries`是个数组代表监听到的元素，这里因为只有一个元素所以取第0项，然后拿到的对象里面有一个 `intersectionRatio` 的属性，这个属性表示元素进入可视区域的比例，如果 `intersectionRatio` 的值 > 0 时就代表已经进入可视区域了，= 1 时就是完全可视了，> 0 时就可以去替换路径让它渲染了

```vue
<template>
    <div class="pic-box">
        <div class="pic-item">
            <img v-lazy-pic="item" v-for="(item, index) in arr" :key="index">
        </div>
    </div>
</template>
<script setup lang="ts">
// 导入图片
// globeEager 已弃用不写了
// 使用 glob 懒加载模式  原理类似下面这种加载
// let modules = { //glob 形式
//     'xxx':()=>import('@/assets/xxx.jpg')
// }
let imageList = import.meta.glob('../assets/images/*.png', { eager: true })
console.log(imageList);
// 处理成数组
let arr = Object.values(imageList).map(v => v.default)
// console.log(arr);

// 实现指令
const vLazyPic = async (el, bindging) => {
    // console.log(el);

    // 默认显示的图片
    const def = await import('../assets/vue.svg')
    // console.log(def);
    el.src = def.default

    // 使用 IntersectionObserver 实现懒加载
    // 创建观察器
    const observer = new IntersectionObserver((entries) => {
        // 这里面有个叫 intersectionRatio 的东西 如果是1 那就是能够完全展示在可视区域
        console.log(entries[0]);
        console.log(bindging.value);
        // 当 intersectionRatio > 0 的时候就可以给它渲染了
        if (entries[0].intersectionRatio > 0) {
            // 给个计时模拟网络延迟
            setTimeout(() => {
                // 替换图片路径让其开始渲染
                el.src = bindging.value
                // 对这个元素停止观察
                observer.unobserve(el)
            }, 2000)
        }
    })
    // 上面的 observer 对象会有一个叫 observe 的方法
    observer.observe(el)
}

</script>
<style scoped lang="scss">
.pic-box {
    width: 100%;
    height: 150px;
    overflow-y: auto;
    border: 1px solid #000;

    .pic-item {
        width: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
            width: 100px;
            height: auto;
            margin-bottom: 15px;
        }
    }
}
</style>
```

## hook实现图片base64转换

思路：
- 1.先创建一个hook函数，获取传入的el元素（也就是img标签），在img加载（img.onload）完成后调用下面的转换函数
- 2.创建一个转换的函数，拿到hook传入的el元素，用canvas绘制，然后用canvas.toDataURL() 方法转换成base64,把值返回出去
- 3.把hook函数包装成promise，组件使用的时候方便then获取base64值，并且可以处理异常情况，比如图片加载失败等，然后把promise返回出去，组件使用时调用then方法获取base64值，catch方法处理异常情况

```ts
// index.ts
import { onMounted } from "vue";

type Options = {
  el: string;
};
export default function (options: Options): Promise<{ baseUrl: string }> {
  //   套一个promise方便调用
  return new Promise((resolve) => {
    onMounted(() => {
      // 读取传递进来的元素
      let img: HTMLImageElement = document.querySelector(
        options.el
      ) as HTMLImageElement;
      // console.log(img);
      // 在img加载完成后执行
      img.onload = () => {
        // 把base64传出去
        resolve(base64(img));
      };
    });
    //   转换成base64的方法
    const base64 = (el: HTMLImageElement) => {
      // 用canvas转换
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = el.width;
      canvas.height = el.height;
      ctx?.drawImage(el, 0, 0, el.width, el.height);
      // 转换成base64
      let base64Img = canvas.toDataURL("image/png");
      return base64Img;
    };
  });
}


// 组件使用
<img id="img" src="../assets/1.jpg" width="300" alt="哼，啊啊啊啊啊">
// 引入 名字自己取（index.ts写的时候使用的匿名函数，如果你自己起了名那就用自己的）
import useBase64 from '../hooks'
useBase64({
    el: '#img' // 用这个id值在后面获取元素
}).then(res => {
    console.log(res) // 这里就能拿到这个图片的base64了
})
```

## 监听DOM宽高变化并支持hook与指令

扩展概念：八何分析法（5WH），用于分析问题
- 产品背景、需求由来
- 在什么时间完成、目标用户是谁
- 作用在什么位置和场景、为什么要做这个需求
- 打算怎么去解决

思路：

- 1.先实现hook，创建一个函数用来并使用 `ResizeObserver` ,监听元素高度变化
- 2.利用directive去实现一个指令，在指令内部调用hook函数，并把hook函数返回的值传递给指令的回调函数，这样就可以在组件中使用指令监听元素高度变化了


```ts
// index.ts 写hook和指令的文件
import type { App } from "vue";

// 实现hook
// 监听宽高变化的函数
function useResize(el: HTMLElement, callback: Function) {
  // 创建 ResizeObserver 的实例对象
  let resize = new ResizeObserver((entries) => {
    // 调用 callback 函数
    callback(entries[0].contentRect); // 把宽高信息作为参数传递给 callback 函数 contentRect变化后的宽高
  });
  // 调用实例的 observe 方法，监听目标元素
  resize.observe(el);
}

// 实现指令 利用 vue3 的自定义指令
// 使用install可以注册到全局
const install = (app: App) => {
  app.directive("resize", {
    mounted(el, binding) {
      useResize(el, binding.value);
    },
  });
};
useResize.install = install;// 
export default useResize;

// hook使用
<div id="resize">我是内容</div>

import useResize from '../hooks';
onMounted(() => {
    useResize(document.querySelector('#resize') as HTMLElement, (e: any) => {
        console.log('resize', e)//可以监听到大小变化了
    })
})

// 指令使用
// main.ts 注册全局组件
import useResize from './hooks';
app.use(useResize)

<div v-resize="nb" id="resize">我是内容</div>

const nb =(e)=>{
    console.log(e) //和hook效果一样
}
```

