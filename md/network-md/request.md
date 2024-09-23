# 网络请求相关

## 请求类型

1. `GET`: 向特定的资源发出请求
2. `POST`:向指定资源提交数据进行处理请求例:提交表单或者上传文件数据被包含在请求体中
3. `HEAD`:向服务器索要与GET请求相一致的响应，只不过响应体将不会被返回
4. `PUT`:向指定资源位置上传其最新内容
5. `DELETE`:请求服务器删除Request-URI所标识的资源
6. `OPTIONS`：预检请求（跨域时会触发）
7. `TRACE`:回显服务器收到的请求，主要用于测试或诊断
8. `CONNET`:HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器

自定义请求头时也会触发 `OPTIONS` ，通常包含以下信息：
- `Origin` 请求来源的域名
- `Access-Control-Request-Method` 实际请求时要用的请求方法
- `Access-Control-Request-Headers` 实际请求时将携带哪些自定义头部
服务器需要在响应头中返回一些信息：
- `Access-Control-Allow-Origin` 哪些域名可以进行跨域访问
- `Access-Control-Allow-Methods` 允许使用哪些方法
- `Access-Control-Allow-Headers` 允许哪些头部字段


## Ajax

AJAX 不是 JavaScript 的规范，它只是一个哥们“发明”的缩写：Asynchronous JavaScript and XML，意思就是用JavaScript执行异步网络请求

### 原生Ajax

直接写一个例子

```html
<body>
    <button class="btn">点我起飞</button>
    <div id="progress"></div>
    <script>
        const btn =document.querySelector('.btn');
        const progress =document.querySelector('#progress');

        // ajax 请求
        // 1.先创建实例
        const xhr = new XMLHttpRequest();

        // 可以设置超时时间
        // xhr.timeout = 1000 // 单位毫秒

        // 2.设置参数
        // open方法写明要访问的 方法 地址 
        // 第三个参数是同步或者异步（默认异步一般不写第三个参数）
        xhr.open('GET','http://localhost:3000/txt')

        // 超时的回调
        xhr.ontimeout= function(){
            console.log('请求超时');
        }

        // 接收返回值的方法
        // onreadystatechange 有 0 1 2 3 4 种状态 一般会用 4 
        // 0-（未初始化） 还没调用 send方法
        // 1-（载入） 已经调用 send方法，正在发送请求
        // 2-（载入完成） 已经接收到全部响应内容
        // 3-（交互） 正在解析响应内容
        // 4-（完成） 响应内容解析完成，可以在客户端调用了

        // xhr.onreadystatechange=function(){
        //     // 这两合适了就代表成功了
        //     if(xhr.readyState === 4 && xhr.status === 200){
        //         // 因为我这里后端写的接口返回的是文本内容所以直接用 
                   // 如果后端返回是其他格式记得手动处理
        //         // console.log(xhr.responseText); // 打印返回的结果
        //     }
        // }

        // onload 和 onreadystatechange 选一个就行了
        // onload 直接到 4 再判断一下状态码就行了  （用的多）

        xhr.onload=function(){
            if(xhr.status === 200){
                // console.log(xhr.responseText);
            }
        }

        // 请求失败的回调
        xhr,onerror=function(){
            console.log('请求失败了');
        
        }
        // 中断请求的回调
        xhr.onabort=function(){
            console.log('请求被中断了');
        }

        // 监听进度 可以拿来做进度条
        xhr.onprogress=function(e){
            // e.total 当前进度 e.loaded 总进度
            progress.innerText = (e.loaded / e.total * 100 ).toFixed(2)+ '%'; //保留两位小数
        }

        // 3.给后端响应 到这里就一个请求就结束了
        xhr.send(null);
        
        btn.addEventListener('click',()=>{
            // 中断ajax请求
            xhr.abort(); //是的你没看错一行搞定
        })
    </script>
</body>
```

## fetch

fetch 是一个新的 api 它是一个原生 api 它基于 promise 它比 ajax 简单很多

默认下只支持 GET POST

默认不携带 cookie

默认没有超时时间的设置

默认无法中断

做进度条会非常麻烦

```js
// 一行搞定 默认 GET 请求
fetch('http://localhost:3000/txt')
.then(res=>res.text()) // 这里是数据返回格式 因为例子是 text 所以用 text() 常见有 json arrayBuffer blob formData 
.then(res=>console.log(res)) // 这里是返回值
// ndoe 18版本以上也可以使用 fetch
```

实现中断 和 超时：

```js
// 创建 abotr 实例
const abotr = new AbortController();
fetch('http://localhost:3000/txt',{
    signal:abotr.signal
})
.then(res=>res.text()) 
.then(res=>console.log(res))
.catch(err=>console.log(err,'请求有问题了捏'))
// 然后随便写个方法去调用 abotr.abort() 就可以了 

// 超时 直接这样写就行了 也是触发 abotr.abort() 方法
setTimeout(()=>{
    abotr.abort();
},3000)
```

实现进度条：

```js
fetch('http://localhost:3000/txt')
.then(async res=>{
    // 先克隆一份流 补下面的坑
    const response = res.clone()
    // 获取文件总大小 在响应头里能看到
    const contentLength = res.headers.get('content-length')
    //响应体的流
    const reader = res.body.getReader()
    //  用来表示已加载了多少
    let current = 0
    while(true){
        // 读取流
        // await 后面跟的是一个 promise 对象
        // 这里返回的是一个对象 对象里有一个 done 属性 表示是否读取完毕
        // 还有一个 value 属性 表示读取到的内容
        const {done,value} = await reader.read()
        // 不断累积起来 效果就是xhr.onprogress 里的 e.loaded
        current += value.length
        // 这里可以写进度条的逻辑
        progress.innerText = (current / contentLength * 100).toFixed(2)+'%';
        if(done){ // 当文件已经加载完毕后这个 done 的值就会变成 true 这样就跳出 while循环
            break;
        }
    }
    return response.text() //这里把克隆的流 return给下一个 .then 就解决了
}) //这里有一个坑 就是这个流如果被使用了 那么下面的 .then就无法拿到返回的结果了 所以在上面储存一份
.then(res=>console.log(res)) 
```

其他参数：

```js
fetch('http://localhost:3000/txt',{
    // signal:abotr.signal // 设置中断
    method:'delete', // 默认是 GET
    // 请求头
    headers:{
        'Content-Type':'application/json'
    },
    // 请求体
    body:JSON.stringify({
        name:'张三',
        age:18
    }),
    // 默认不携带 cookie 这里设置为 include 表示携带
    credentials:'include', 
})
.then(res=>res.text()) 
.then(res=>console.log(res))
```

## sse (server-sent-ebents 服务器推送)

单工通讯,后端可以实时推送给前端东西,前端只能发送一次,大屏可视化大部分都是这个, chatGpt 也是

后端代码:

```js
app.get('/sse',(req,res)=>{
    res.writeHead(200,{
        'Content-Type':'text/event-stream', // 核心！！！！
        'Connection':'keep-alive', // 保持连接  可以断开自动重连
    })
    // 举例发送些数据 一秒发一次
    setInterval(()=>{
        // res.write('event:nb\n') // 这里修改成 nb 前端也要把 message 改成 nb
        res.write('data: '+new Date().toLocaleString()+'\n\n')
    },1000)
})
```

前端代码：

```js
// EventSource
const sse = new EventSource('http://localhost:3000/sse');
//message是默认写法 后端可以修改 修改后双方都要一致不然无效
sse.addEventListener('message',(e)=>{
    progress.innerText = e.data
})
// sse.addEventListener('nb',(e)=>{
//     progress.innerText = e.data
// })

```

## websocket (实时通讯)

先安装 ws 模块

```js
npm i ws
// 引入 ws 模块
import {WebSocketServer} from "ws";

```

使用 websocket 时要依附在服务上面

后端代码:

```js
const server = app.listen(3000,()=>{
    console.log('http://localhost:3000')
})

const wss = new WebSocket.Server({server}) // 核心！ 依附在服务上面

wss.on('connection',(ws)=>{
    console.log('有人连上了')
    // ws.on 接收前端发来的数据
     ws.on('message',(message)=>{
        console.log('收到消息了',message);
    })
    setInterval(()=>{
        ws.send('hello') // 给前端返回点东西
    },1000)
})
// 还有个心跳包的东西 socket.io 自带 后面在研究吧
```

前端代码：

注意给后端发送时不能发送对象! 只能字符串或者 buffer

当然你把对象转 json 就能发了 哈哈哈

```js
const ws = new WebSocket('ws://localhost:3000'); // 核心！ 连接服务上面创建的 ws 服务 不是 http服务
// 固定写法 message 也是固定 接收后端给的 hello
ws.addEventListener('message',(e)=>{ // 只要后端变化了就会推送给前端
    console.log(e.data)
})
ws.addEventListener('open',(e)=>{ // 连接成功后会执行一次 可以拿来调试
    console.log('连接成功我就会触发一次 就一次')
})
// 随便搞个按钮 给后端发点数据
btn.addEventListener('click',()=>{
// ws 给后端发送数据
 ws.send('我是前端来的')
})

```


##  跨域和预检请求

### 跨域

突破同源策略（ 同源策略是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。）

如：

同一域名，不同文件或路径是 允许

同一域名，不同端口 不允许

同一域名，不同协议	不允许

域名和域名对应相同ip	不允许

主域相同，子域不同	不允许

不同域名	不允许



#### 解决方法

1. JSONP 利用 `<script>`标签的 `src` 属性没有跨域限制  
    > 缺点：只能发送GET请求

```js
// 前端
const jsonp = (name)=>{
    let script = document.createElement('script')
    script.src = 'http://localhost:3000/api/jsonp?callback'+name
    document.body.appendChild(script)
    return new Promise((resolve,reject)=>{ // 用promise更好用
        window[name]=(data)=>{
            resolve(data)
        }
    })
    
}
jsonp(`callback${new Date().getTime()}`).then(res=>{
    console.log(res); // hello jsonp
})

// 后端 node
// 安装三个依赖 （记得初始化package文件）
// npm i express , npm i @type/express , npm i @types/node
// 这里用的 ts 文件

import express from 'express'

const app = express()

app.get('/api/jsonp',(req,res)=>{
    const {callback} = req.query // 这个 .query 获取 ? 后的参数 也就是前端返回来的函数名
    res.send(`${callback}('hello jsonp')`)
})

app.listen(3000,()=>{
    console.log('server is running')
})

```

--- 

2. 前端代理（纯前端,仅在开发时期有效，上线后需要 nginx 配置）

```js
// 给上面的后端例子先加一个接口
app.get('/api/json',(req,res)=>{
    res.send({name:'使用代理获取的'})
})

// 前端 这里用 vite 框架演示 其他框架都差不多
// vite 起了一个服务段 所以服务端对服务端时就没有跨域问题了
// vite.config.ts 中配置
server:{
    proxy:{
        'api':{ // 这里是前端发送请求时用的
            target:'http://localhost:3000', // 这里就是真正请求地址
            changeOrigin:true, //开启跨域
            rewrite:(payh)=>path.replace(/^\/api/,'') // 重写 把 'api' 换成了 ''  空字符串  
            // 例如，前端请求 /api/users，但后端服务实际的路径是 /users，你可以通过 rewrite 将 /api/users 重写为 /use
        }
    }
}

// 前端某文件的请求
// fetch('http://localhost:3000/api/json') // 代理前写法
fetch('/api/json') //代理后
.then(res=>res.json())
.then(res=>{
    console.log(res)
})


```

---

3. 利用 CORS 需要后端设置请求头（下面为node端）

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源 `Access-Control-Allow-Origin:*`。

通用简单设置：

```js
import cors from "cors"; // 解决跨域
app.use(cors());
```

  > 简单请求（浏览器会直接发起请求）

满足以下条件就是简单请求

1. 满足`GET`,`HEAD`,`POST`方法的其中一个，

2. 满足 `Header` 是 `Accept` 或 `Accept-Language` 或 `Content-Language` 或 `Content-Type`的值为 `text/plain
`,`multipart/form-data`,`application/x-www-form-urlencoded`的其中之一

发起请求时在头信息之中，增加一个Origin字段。

 >  复杂请求 （浏览器会先发起预检请求）

会在正式通信之前，增加一次 `HTTP查询请求`，称为 `预检请求`,该请求是 `options` 方法，通过该请求来知道服务端是否允许跨域请求。

 下面是一个完整例子：

```js
// index.html
let xhr = new XMLHttpRequest()
document.cookie = 'name=xiamen' // cookie不能跨域
xhr.withCredentials = true // 前端设置是否带cookie
xhr.open('PUT', 'http://localhost:4000/getData', true)
xhr.setRequestHeader('name', 'xiamen')
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      console.log(xhr.response)
      //得到响应头，后台需设置Access-Control-Expose-Headers
      console.log(xhr.getResponseHeader('name'))
    }
  }
}
xhr.send()
```

```js
//server1.js
let express = require('express');
let app = express();
app.use(express.static(__dirname));
app.listen(3000);
```

```js
//server2.js
let express = require('express')
let app = express()
let whitList = ['http://localhost:3000'] //设置白名单
app.use(function(req, res, next) {
  let origin = req.headers.origin
  if (whitList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin)
    // 允许携带哪个头访问我
    res.setHeader('Access-Control-Allow-Headers', 'name')
    // 允许哪个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'PUT')
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true)
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6)
    // 允许返回的头
    res.setHeader('Access-Control-Expose-Headers', 'name')
    if (req.method === 'OPTIONS') {
      res.end() // OPTIONS请求不做任何处理
    }
  }
  next()
})
app.put('/getData', function(req, res) {
  console.log(req.headers)
  res.setHeader('name', 'jw') //返回一个响应头，后台需设置
  res.end('我不爱你')
})
app.get('/getData', function(req, res) {
  console.log(req.headers)
  res.end('我不爱你')
})
app.use(express.static(__dirname))
app.listen(4000)
```

上述代码由 `http://localhost:3000/index.html` 向 `http://localhost:4000/` 跨域请求，正如我们上面所说的，后端是实现 CORS 通信的关键。

---

4. nginx代理（一般在部署上线后配置）

两种方式，直接官网下载 `nginx` ，配置 `conf` 目录下 `nginx.config` 文件，然后双击运行 nginx.exe 就行了

第二种微软商店搜 wsl 下载 Ubuntu , apt-get install nginx 安装

按 win+e 在 Linux 下找 ect > nginx > sites-available > default ，打开该 default 文件

找到 server，写入以下配置：
```js
location /api {
    // http://主机的IP地址:你开启的端口号;
    proxy_pass http://172.24.177.26:3000; // 配置完成
    // 可用 cat /etc/resolv.conf 命令获取 ip
    // 可以直接使用 curl 接口地址 来访问试试
}
```

详见 Nginx章节,[此处前往](../server-md/nginx.md)