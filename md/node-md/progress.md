# Node 进阶案例


## ffmpeg

格式转换，音视频处理，流媒体传输，而且跨平台

[官网点击此处](https://ffmpeg.p2hp.com/download.html#build-windows)


[下载](https://www.gyan.dev/ffmpeg/builds/)：windows找到release下的zip下载，解压后配置一下环境变量

安装并配置环境变量后运行`ffmpeg -version`输出一大坨就代表成功了

此时我门就可以去调用他的api了

随便准备一个小视频`.mp4`的

1. 格式转换

```js
// 转成gif, -i 输入的视频文件
execSync('ffmpeg -i test.mp4 test.gif', { stdio: 'inherit' });

// 转成avi
execSync('ffmpeg -i test.mp4 test.avi', { stdio: 'inherit' });

// 提取音频
execSync('ffmpeg -i test.mp4 test.mp3', { stdio: 'inherit' });
```

2. 视频裁剪

> ss写在 -i的前面可能会导致精度问题，因为视频还没解析就跳转到了相关位置，但是解析速度快

> ss写在 -i后面精度没问题，但是解析速度会变慢

```js
// -ss 开始的时间 -to 结束的时间
execSync('ffmpeg -ss 01 -to 05 -i test.mp4 test2.mp4', { stdio: 'inherit' });
```

3. 加水印

注意指定的字体文件要在当前目录下存在，不指定字体使用默认字体可能会报错...

```js
// -i是指定要原视频 -y 是指定输出文件名
// x,y 是指定位置从左上角0,0开始
execSync('ffmpeg -i test2.mp4 -vf drawtext=fontfile=number.ttf:text="666":fontsize=30:fontcolor=red:x=10:y=10 -y test3.mp4', { stdio: 'inherit' });
```

4. 去除水印

主要吧水印范围描述到位就行,

```js
// w 宽 h 高 x y 位置 字体大小30 写了3个字那宽就是3*30=90
execSync('ffmpeg -i test3.mp4 -vf delogo=w=90:h=30:x=10:y=10 -y test4.mp4', { stdio: 'inherit' });
```


## pngquant

上面是处理音视频，这个就是处理图片的，可以压缩图片的大小，调整透明度等

[官网](http://pngquant.com/)，找到 Command-line 根据你的系统下载，然后配置下环境变量

检查版本`pngquant --version` 输出版本号就成功了

> 注意！！！只能处理 .png 格式的图片

```js
import { exec } from 'child_process';
// speed 速度 1-10 越高越快 质量越拉
// quality 质量 0-100 高质量速度会慢一点
exec('pngquant test.png --speed=1 --quality=60-82 --output test2.png');
```





## 大文件上传

### 切片上传 （带 node 后端）

将大文件切成较小的片段（通常分为片或块），然后逐个上传这些分片。
这种方法可以提高上传的稳定性，因为如果某个分片上传失败，
只需要重新上传该分片而不需要重新上传整个文件。同时，分片上传还可以利用多个网络连接并行上传多个分片，提高上传速度

一. 随便找个地方创建一个文件夹使用 npm init 进行初始化 得到 package.json 文件

```
npm init

运行后会有以下选项：
package name:   你的项目名字叫啥
version:        版本号
description:    对项目的描述（可空）
entry point:    项目的入口文件（一般你要用那个js文件作为node服务，就填写那个文件）
test command:   项目启动的时候要用什么命令来执行脚本文件（默认为node app.js）
git repository: 如果你要将项目上传到git中的话，那么就需要填写git的仓库地址（可空）
keywirds：      项目关键字（可空）
author:         作者的名字（随你）
license:        发行项目需要的证书（可空）

```

再安装以下模块

```
npm i express   // express框架
npm i multer    // 处理上传文件
npm i cors      // 跨域
```
二. 创建一个 index.html 名字随意

```html
<!-- 用来上传的input -->
<input type="file" id="file"> 

```

以下内容都写在一个 `<script>` 里

1. 获取 dom 元素

```js
// 获取dom元素
const fileInput = document.getElementById('file');
```

核心是使用 Blob 对象的 `slice` 方法,你通过 `<input>` 选中的文件就会成为一个二进制类型的大对象，通常是影像、声音或多媒体文件，通过 slice 方法将他切片存放在一个数组中，再利用循环将每个切片发送到后端就可以了，当然上传完毕后还要通过后端给定的接口将切片文件进行合并，这个就放在所有的请求结束后再发起单独的请求就可以了。

```js
// start 开始的字节的索引 end 结束的字节索引 contentType赋予一个新的内容类型
slice(start, end, contentType)
 // 返回值是一个新的Blob对象，包含了源Blob对象中指定范围内的数据。
```

2. 创建切割文件函数 chunksFun  ！！！核心file.slice进行切割

```js
  const chunksFun = (file,size=1024*1024*1)=>{ // size设置每次切的大小
            const chunks = [] // 存放切割后的文件是个数组 如 1-2mb 2-3mb 3-4mb 依次存放
            // file.slice进行切割 再循环加到上面数组里去
            for(let i=0;i<file.size;i += size){
                chunks.push(file.slice(i,i+size))
            }
            return chunks // 一定要返回切割后的文件
        }
```

3. 上传后端的函数 uploadFiles

核心在于 `FormData.append()` 方法，向 FormData 中添加新的属性值，FormData 对应的属性值存在也不会覆盖原值，而是新增一个值，如果属性不存在则新增一项属性值

```js
const uploadFiles = (chunks)=>{
    // 因为上传的碎片多所以 要使用 promise.all 
    // 写一个数组来包裹所有请求 [请求,请求,请求,请求]
    const list = [];
    // 使用循环处理每一个碎片
    for(let i = 0;i < chunks.length;i++){
        // 这里比较重要 要使用 FormDate实例对象的append方法来添加数据
        const formdata = new FormData();
        // 为了区分文件还要添加 index 或者 hash 这里用 index
        formData.append('index',i) // i就是循环的i当做值直接用给index
        // 文件名字
        formData.append('filename','nb') // 第一个值要和后端一致 第二个自己随便
        // 文件碎片 这个必须写在上面两个之后否者后端可能无法读取文件名称导致报错
        formData.append('file',chunks[i])
        // 添加请求到数组里
        list.push(
            fetch('http://localhost:3000/upload',{ // 接口稍后会写 或者写你自己的
                method:'post',
                body:formData
            })
        )
    }
    // 使用 promise.all 处理所有请求 
    Promise.all(list).then(res=>{
        // 当所有请求成功后才会触发
        // 这里可以写上传成功后的逻辑
        console.log('上传成功');
        // 上传完毕后还要通知后端合并文件
        fetch('http://localhost:3000/merge',{ // 接口后面也会写
            method:'POST'，
            headers:{ // 请求头
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                filename:'nb' // 文件名和上面对应哦 不然后端检索时找不到
            })
        })
    }).catch(err=>{
        // 这里可以写上传失败后的逻辑
        console.log(err);
    })
}
```

4. 监听change事件 当input选好文件后触发


```js
file.addEventListener('change',(e)=>{
    // 这里是单个文件上传 所以取 0
    let file = e.target.files[0];
    // 调用切割函数来 切割文件
    let chunks = chunksFun(file);
    // 调用上传函数
    uploadFiles(chunks)
})
```

启动这个页面时不要使用vscode的live server, 安装 npm install http-server -g ,用 http-serve启动 如 http-server -p 9999(这里9999是端口号)

到这里前端的事就做完了，下面来实现后端

三. 后端实现

都在当前同级目录创建

创建一个 app.js 文件

创建一个 uploads 文件夹 用来存放切片

创建一个 video 文件夹 存放合并后的文件（随便你起名字这里用视频做实验所以用video，看你个人）

下面开始编写 app.js 文件

1. 引入要用到的库

```js
import express from "express";// express框架
import multer from "multer"; // 处理上传文件
import cors from "cors"; // 解决跨域
import fs from 'node:fs';// 文件操作
import path from 'node:path'; // 路径操作

// 如果遇到 import 语法错误无法使用 请在 package.json 在 "main" 选项下方 添加 "type":"module" 解决该问题

```

2. 初始化 multer

```js
const storage = multer.diskStorage({
    // 设置上传的文件存储位置
    destination:function(req,file,cb){
        cb(null,'uploads/')// 第一个参数是错误对象 null 就是没有 后面是文件夹路径
    },
    // 文件名
    filename(req.file,cb){
        // 设置切片文件索引和名字
        cb(null,`${req.body.index}-${req.body.filename}`)
    }
})
const upload = multer({storage})
```

3. 创建服务端以及接口路由

```js
// 创建服务端
const app = express();

// 设置跨域
app.use(cors());
app.use(express.json())

// 上传接口  这里 'file' 要和上传时对应上
app.post('/upload',upload.single('file'),(req,res)=>{
    res.send('ojbk')
})

// 合并接口
app.post('/merge',(req,res)=>{
    // 1. 读取文件
    const uploadDir = path.join(process.cwd(),'uploads')
    // 2.获取所有的切片  返回值是个数组 但顺序是乱的 所以要排序
    const dirs= fs.readdirSync(uploadDir)
    // 排序 因为上传时切片名字 是 1-nb 2-nb 3-nb 所以用 -分割取前面的数字来排序
    dirs.sort((a,b)=>a.split('-')[0]-b.split('-')[0])
    // 3. 写入合并文件
    const video = path.join(process.cwd(),'video',`${req.body.filename}.mp3`)
    // 4. fs.appendFileSync 合并文件
    dirs.forEach((item)=>{
        fs.appendFileSync(video,fs.readFileSync(path.join(uploadDir,item)))
        fs.unlinkSync(path.join(uploadDir,item))//合并完后删除切片文件夹里的内容
    })
    res.send('合并成功')
})
app.listen(3000,()=>{
    console.log('服务器启动成功 http://localhost:3000')
})
```

到这里就结束了,可以试着上传文件试试了


## HTTP 缓存

### 缓存分类

- 强缓存
- 协商缓存

### 强缓存

- 强缓存是浏览器直接从本地缓存中获取资源，不会向服务器发送请求
- 强缓存可以通过设置两种 HTTP Header 实现
  - Expires
  - Cache-Control

在本地缓存中又分为(小拓展)：

- 内存缓存 (memory cache) 一般在浏览器内存中,一般刷新网页时会发现很多内存缓存,关闭网页后就会释放
- 硬盘缓存 (disk cache) 在计算机硬盘中 空间大 但读取效率比内存慢

静态资源缓存：

```js
// 如 css js png html 等静态的资源 可以直接用 express.static
app.use(express.static('你的静态资源目录'),{
    maxAge:1000*60*60*24*7 // 设置缓存时间 单位是毫秒 这里设置的是7天 默认是强缓存
    // 也可以在下面配置成协商缓存
    lastModified:true, // 设置协商缓存 
})
```

#### Expires （不推荐）

- Expires 是 HTTP1.0 时的规范，指响应的到期时间,即资源不再被视为有效的日期和时间

判断机制：当客户端请求资源时，会获取本地时间戳，然后将本地时间戳与 expires 设置的时间进行比较，对比成功后就会走强缓存，对比失效，就会对服务器发起请求

```js
// 动态资源缓存 接口
// Expires 强缓存
app.get('/api',(req,res)=>{
    // seHeader 设置响应头  后面时间 用toUTCString() 转成 UTC格式即可
    res.setHeader('Expires',new Date('2024-6-xx-xx:xx:xx').toUTCString()
    res.send('ojbk了去调试看看')
})
// 第一次请求会经过服务器 
// 第二次开始 只要在设置的时间内请求 就可以在Network（网络）页查看请求的 Size 选项有 disk cache 字样
// 如果无效注意关闭 调试工具上面的 停用缓存 (Disable cache)的选项
```

#### Cache-Control (推荐)

- Cache-Control 是 HTTP1.1 时的规范，优先级比 Expires 高
- Cache-Control 表示资源会在什么时间内过期，需要和服务器时间配合使用

Cache-Control 的值有:
- `max-age` 浏览器资源缓存的时间(秒)
- ` no-cache` 不走强缓存，走协商缓存
- `no-store` 禁止任何缓存策略
- `public` 资源可以被浏览器缓存也可以被代理服务器缓存（CDN）
- `private` 资源只能被客户端缓存

```js
// Expires Cache-Control 同时出现时 Cache-Control 的 max-age 优先级更高
app.get('/api2',(req,res)=>{
    // seHeader 设置响应头 max-age 缓存时间 (单位：秒)
    res.setHeader('Cache-Control','public,max-age=60')
    res.send('Cache-Control设置ojbk了去调试看看')
})
```

### 协商缓存

在缓存机制里，强缓存优先于协商缓存。当强缓存资源生效时，客户端不会向服务器发送请求，而是直接使用本地缓存。

协商缓存是强缓存失效后如(max-age过期)或者服务器响应中设置了(Cache-Control:no-cache)，客户端就会向服务器发起协商缓存的请求。
再协商缓存中，客户端会发送带有缓存数据标识的请求头部字段，以向服务器验证资源的有效性。

以下两种都是：
- Last-Modified
- Etag

他们都是需要配套使用的

#### Last-Modified (最后修改时间判断)

`Last-Modified` 表示资源最后被修改的时间,配合 `if-modified-since` 使用，第一次请求时不会携带 if-modified-since 字段，服务器会返回资源，并在响应头中设置 Last-Modified 字段，表示资源最后被修改的时间。

第二次请求时，浏览器会携带 if-modified-since 字段，表示上一次请求的资源最后被修改的时间。服务器会根据 if-modified-since 字段判断资源是否发生变化，如果资源未发生变化，服务器会返回状态码 304 （Not Modified），通知客户端可以使用缓存的版本。如果资源已经发生变化，服务器将返回最新的资源，状态码为200。

只要文件没有变化就会一直用缓存的文件

```js
// 因为强缓存优先于协商缓存同时出现时要使用协商缓存如何解决
// 两种方法 no-cache（推荐） 或者 no-store 它们是互斥的
// 设置 Last-Modified 文件最后的修改时间
const getFileModifyTime = ()=>{
    // statSync 选好文件 mtime读取文件的修改时间  toUTCString转换时间格式
    return fs.statSync('./index.js').mtime.toUTCString()
}
app.get('/api3',(req,res)=>{
    // seHeader 设置响应头 max-age 缓存时间 (单位：秒)
    res.setHeader('Cache-Control','no-cache') //不走强缓存
    const ifModifiedSine = req.headers['if-modified-since'] //获取浏览器发来的资源的修改时间
    const modifyTime = getFileModifyTime() //调用一下获得时间
    // 对比判断文件时间是否变化了
    if(ifModifiedSine === modifyTime){ //时间上没有变化就执行
        console.log('缓存了');
        res.statusCode=304 // 设置状态码为304
        res.end() // 停止
        return
    }
    // 时间变化了
    console.log('没有缓存');
    res.setHeader('Last-Modified',modifyTime)
    res.send('协商缓存已设置')
})
```

#### Etag （文件标识判断）

Etag 表示资源在服务器的唯一标识,服务器在第一次请求时会返回一个 etag 字段，配合 `if-none-match` 使用，和上面一样第二次请求就会携带然后去验证。

原理同上，但是他是对文件生成 Hash 标识，当文件变化后 Hash 也会变化，这样对比客户端和服务器该资源的 Hash 是否一致来判断是否使用缓存的文件

*ETag 优先级比 Last-Modified 高*

```js
import crypto from 'node:crypto' //这个模块记得引入

// 给 index.js 文件生成一个 Hash 的方法
const getFileHash = () => {
    return crypto.createHash('sha256').update(fs.readFileSync('index.js')).digest('hex')
}
// 接口
app.get('/api4', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, max-age=2592000')//表示走协商缓存
    const etag = getFileHash() // 获得标识
    const ifNoneMatch = req.headers['if-none-match'] //获得客户端发来的标识
    if(ifNoneMatch === etag) {
        console.log('Etag缓存了');
        res.sendStatus(304)
        return
    }
    console.log('Etag没有缓存');
    res.setHeader('ETag', etag)
    res.send('Etag')
    
})
```

只要文件没有变化就会一直用缓存的文件


## WebRTC 音视频通话

难点：点对点通讯 

假如 A->B 通讯:
- A首先生成一个offer（offer就是对网络连接媒体对象的一个描述）发送给B
- B收到offer后生成一个answer（响应端的对象描述）发送给A
- A-B要互相发送 candidate ，这玩意会在发送offer和answer的同时发送给对方（候选者，里面是TCP 网络的描述，谷歌浏览器会自定选择最佳网络去通讯）
- A-B 通讯建立成功

核心：
-  navigator.mediaDevices.getUserMedia() 读取用户的媒体设备
- new RTCPeerConnection() 负责在两个端点之间建立和维护实时音视频通信会话
- socket.io 中转两端的数据来建立连接

下面是演示代码：

前端：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <video autoplay controls class="localvideo" src=""></video>
        <video autoplay controls class="remotevideo" src=""></video>

        <button class="call">打电话</button>
        <!-- 引入socket.io后会暴露出一个全局变量io等会要用来建立连接 -->
        <script src="./node_modules/socket.io/client-dist/socket.io.js"></script>
        <script src="index.js"></script>
    </div>
</body>
</html>
```

```js
// index.js
const call = document.querySelector(".call");
const localVideo = document.querySelector(".localvideo");
const remoteVideo = document.querySelector(".remotevideo");

// 写死一个房间号
const room =122

let peer;//本地和远端的点
let socket;//全局的socket

// 读取本地媒体 如摄像头麦克风
const getUserMedia = async()=>{
    //  navigator.mediaDevices.getUserMedia可以获取本地媒体
    const stream = await navigator.mediaDevices.getUserMedia({//返回值是Promise 所以弄成异步的函数，流文件
        video:true, //摄像头（还可以是前置摄像头等等需要自己配置）
        audio:true,//麦克风
    }) 
    // 将流文件赋值给本地的video标签
    localVideo.srcObject = stream; // srcObject媒体标签的src属性
    return stream; // 把流返回出去
}

// 创建本地连接 !!!（本地）
const  createPeerLocalConnection = async(stream)=>{
    // 创建点对点通讯服务
    peer = new RTCPeerConnection() // RTCPeerConnection是WebRTC的API
    // 添加本地流
    peer.addStream(stream)

    // 传递 candidate (两端都要互相传)
    peer.onicecandidate=(event)=>{
        if(event.candidate){
            socket.emit("sendCandidate",{candidate:event.candidate,room}) // 发送candidate给信令服务器
        }
    } 

    // 3.1 远端流
    peer.onaddstream = (event) => { 
        remoteVideo.srcObject = event.stream; // 把远端流赋值给远端video标签
    } 

    // 1.1 生成offer
    const offer = await peer.createOffer({
        offerToReceiveAudio:true, // 表示建立连接时是否愿意接受音频
        offerToReceiveVideo:true, // 表示建立连接时是否愿意接受视频
    })

    // 1.2本地存一份 因为发送给另一端后还要用来确认不存一份就莫得了 (异步的) 
    await peer.setLocalDescription(offer)

    // 1.3 发送给另一端B  (这里用了webSocket)
    socket.emit("sendOffer",{offer,room}) // 发送offer给信令服务器
}

// 创建远端连接 !!!（远端）(电话接收方)
const createPeerRemoteConnection = async (offer)=>{
    // 创建点对点通讯服务
    peer = new RTCPeerConnection() 

    // 打开远端摄像头
    const stream = await getUserMedia()

    // 把流添加进去
    peer.addStream(stream)

    // 传递 candidate (两端都要互相传)
    peer.onicecandidate=(event)=>{
        if(event.candidate){
            socket.emit("sendCandidate",{candidate:event.candidate,room}) // 发送candidate给信令服务器
        }
    }

    // 3.1 传输本地的流 （在远端视角该流就是本地的流）
    peer.onaddstream = (event) => { 
        remoteVideo.srcObject = event.stream; // 把远端流赋值给远端video标签
    } 

    // 1.7 把A的offer添加要给 A发送回去了 到此处A向B发送结束
    await peer.setRemoteDescription(offer)

    // 开始B向A发送回应
    // 2.1生成 answer
    const answer = await peer.createAnswer() // 生成回应

    // 本地也存一份
    await peer.setLocalDescription(answer) // 存一份

    // 2.2 B-->A answer 服务器来中转
    socket.emit("sendAnswer",{answer,room}) // 发送answer给信令服务器
}

// 与后端 io建立连接
const socketConnect = ()=>{
    socket = io("http://localhost:3001") // 连接信令服务器

    // 1.4加入到同一个房间
    socket.emit("joinRoom",room) // 发送房间号给信令服务器

    // 1.5 B 接收 A的offer 名字对应服务端的名字receiveOffer
    socket.on('receiveOffer', ({ offer }) => {
        // 1.6 调用远端连接
        createPeerRemoteConnection(offer)
    })

    // 2.3 A 接收 B的answer
    socket.on('receiveAnswer', ({ answer }) => { 
        peer.setRemoteDescription(answer) // A拿到B的answer
        // 到此B发送到A结束
    })

    // 接收 candidate
    socket.on('receiveCandidate', ({ candidate }) => { // A拿到B的candidate
        peer.addIceCandidate(candidate) 
        // 互相发送结束 
    }) 
}

const domEvent = ()=>{
    call.addEventListener("click",async()=>{
        console.log('已拨电话');
        // 按下打电话就 调用信令服务器
        const stream = await getUserMedia()
        createPeerLocalConnection(stream)
    })
}

// 初始化
const init =()=>{
    // 需要信令服务器 这里用webSoceket
    // 初始化事件
    socketConnect()
    domEvent()
}

init()
```

后端：

记得安装 socket.io (这玩意可以跨语言)

```js
npm install socket.io
```

```js
import {Server} from'socket.io'

const io = new Server(3000, {
    // 允许跨域
    cors: {
        origin: '*'
    }
})

// 架构师发布订阅模式
io.on('connection', socket => {
    console.log('有人连接上了')

    // 加入房间
    socket.on('joinRoom', (room)=>{
        console.log('加入房间', room)
        socket.join(room) //join 加入就行了
    })

    // 接收前端发送的消息 offer要和前端emit的对应
    socket.on('sendOffer', ({offer,room})=>{
        console.log('收到offer');
        // console.log(offer); //sdp对象
        socket.to(room).emit('receiveOffer', {offer}) // 把offer发过去 (A的offer发到B)
    })
    
    // 接收 前端发送的answer
    socket.on('sendAnswer', ({answer,room})=>{
        console.log('收到answer');
        socket.to(room).emit('receiveAnswer', {answer}) // 把answer发过去 (A的answer发到B)
    })

       // 传递 candidate 
    socket.on('sendCandidate',({candidate,room})=>{
        socket.to(room).emit("receiveCandidate",{candidate}) // 发送给信令服务器   
    })
})

// 开启服务
io.listen(3001, () => console.log('listening on *:3001'))
```