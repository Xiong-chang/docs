# Node 基础

## package.json

配置文件会声明项目的一些信息，以及管理依赖

主要看下这些：

```json
// 开发依赖 生产环境就不需要了
// 如 webpack vite rollup
{
  "devDependencies": {
    "vitepress": "^1.2.3"
  }
}

// 生产依赖
// 如 vue vuex vue-router
{
  "dependencies": {
    "vue": "^1.2.3"
  }
}

// 对等依赖 给编写插件或npm包的开发人员使用的
// 比如要开发一个vite插件 那就在这里装vite，因为插件要依赖vite
// 插件装在生产环境就行了 避免再次在生产环境装vite
{
    "dependencies": {
        "vite-plugin": "^1.2.3"
    },
    "peerDependencies": {
        "vite": "^1.2.3"
    }
}
```

## npm config list

查看当前配置，切换镜像什么的在我的博客里有这里就不赘述了

## npm install

安装依赖,所有依赖都会存放在`node_modules`目录下,
,默认采用**扁平化**的方式安装，排序规则：

.bin -> @xxx ->首字母排序

使用广度优先遍历依赖树，会首先处理根目录下的依赖，然后逐层处理每个依赖包的依赖，直到所有依赖处理完

处理依赖时还会检查版本是否符合依赖树中其他依赖的版本要求，不符合会尝试安装合适的依赖

当然扁平化是理想的状态下，如果在二级模块使用了相同的依赖但是不同版本，那就会重新搞一层 `node_modules` 目录，就是非扁平化了

运行`npm install` 时会首先读取 config 配置文件，其顺序如下：
npm config list -> 项目级.npmrc -> 用户级.npmrc （在 c 盘用用户目录） -> 全局的.npmrc （c 盘 AppData>npm）-> npm 内置.npmrc （nodejs 装在哪就在哪里）

随后检查是否存在 package-lock.json

- 有：
  1. 比较依赖版本，版本不同就根据 package.json 的版本去下载然后更新 package-lock.json 中的版本
  2. 版本相同就检查是否有缓存，有就使用缓存，没有就去下载
- 没有：

  1. 根据 package.json 获取包的信息构建依赖树与扁平化（同时进行）
  2. 检查缓存，有就使用缓存，没有就去下载


举例 .npmrc 文件：

```sh
registry=http://registry.npmjs.org/

定义 npm 的 registry，即 npm 的包下载源


proxy=http://proxy.example.com:8080/

定义 npm 的代理服务器，用于访问网络

https-proxy=http://proxy.example.com:8080/

定义 npm 的 https 代理服务器，用于访问网络

strict-ssl=true

是否在 SSL 证书验证错误时退出

cafile=/path/to/cafile.pem

定义自定义 CA 证书文件的路径

user-agent=npm/{npm-version} node/{node-version} {platform}

自定义请求头中的 User-Agent

save=true

安装包时是否自动保存到 package.json 的 dependencies 中

save-dev=true

安装包时是否自动保存到 package.json 的 devDependencies 中

save-exact=true

安装包时是否精确保存版本号

engine-strict=true

是否在安装时检查依赖的 node 和 npm 版本是否符合要求

scripts-prepend-node-path=true

是否在运行脚本时自动将 node 的路径添加到 PATH 环境变量中
```

## package-lock.json

喜闻乐见锁定依赖版本号，抛开 `package` 字段，

- `version` 该参数指定了当前包的版本号
- `resolved` 该参数指定了当前包的下载地址
- `integrity` 用于验证包的完整性
- `dev` 是否是一个开发依赖包
- `bin` 该参数指定了当前包中可执行文件的路径和名称
- `engines` 该参数指定了当前包所依赖的Node.js版本范围

缓存就是用依赖的 `integrity`、`version`和名字生成唯一key，在cache 里查找

可以使用 npm cofig list 查看 cache 路径


## npm run xxx

运行 `package.json` 中的 `scripts` 字段配置的命令

命令会注入到 `node_modules` 的 `.bin` 目录下
- .sh 给 Unix Linux MacOS用
- .cmd .ps1 分别给 Windows用的 cmd 和 powershell用
（这就是为毛能跨平台）

优先在项目的`node_modules/.bin`找，找不到就去全局的`node_modules`找,还找不到就去环境变量找，再找不到就报错

### pre 与 post

相当于生命周期一样，执行顺序为：prexxx > xxx > postxxx

```json
{
  "scripts": {
    "predev": "node xxx.js",
    "dev": "node xxx.js",
    "postdev": "node xxx.js"
  }
}
```

## npx

命令行工具，npm 5.2.0 以上自带
低版本手动安装
```sh
npm install npx -g
```

在上面我们会在`script`配置命令来执行一些可执行文件或命令，npx则可以直接来执行

优势：
- 避免全局安装：npx允许你执行npm package，而不需要你先全局安装它
- 总是使用最新版本：如果你没有在本地安装相应的npm package， npx会从npm的package仓库中下载并使用最新版
- 执行任意npm包：npx不仅可以执行在package.json的scripts部分定义的命令，还可以执行任何npm package
- 执行GitHub gist：npx甚至可以执行GitHub gist或者其他公开的JavaScript文件

### npm与npx的区别

- npx 侧重于执行命令，虽然会自动安装模块（执行结束后自动删除掉下载的模块而且都是最新的）
- npm 侧重于安装卸载某个模块

> npm ls -g 可以查看全局安装了哪些可执行文件

## npm私服

使用 `verdaccio` 快速构建私服

安装：
```sh
npm install verdaccio -g
```

执行命令：
```sh
# 默认直接运行
verdaccio

#指定端口 (默认端口 4873)
verdaccio --listen 3000
```
指定端口后会有一个可以访问的页面，里面有注册的命令，登录的命令等，发包还是使用 `npm publish --registry 这里要本地的地址`

自己的npm私服，也可以使用`npm config set registry`指定私服地址后再进行`npm publish`，下载仍然是`npm install`

## 模块化

`cjs`和`esm`，详情看这里：[模块化](../js-md/senior.md#模块化)

`esm`在node环境下天然不支持导入json,在高版本下可以使用 `assert {type:json}`强行支持

区别：
- cjs是基于运行时的同步加载，esm是基于编译时的异步加载
- cjs是可以修改值的，esm值并且不可修改（可读的）
- cjs不可以tree shaking，esm支持tree shaking
- commonjs中顶层的this指向这个模块本身，而ES6中顶层this指向undefined


## 全局变量

>node中没有DOM和BOM的API，但其他的ECMAscriptAPI基本都能用

使用`global`来定义全局变量(仅node环境)

```js
global.a = 1
```

使用`globalThis`来定义全局变量（会自己判断环境,浏览器环境window访问定义的变量，*ECMAScript 2020 引入globalThis*）

```js
globalThis.b = 1
```

### dirname 

dirname 获取文件所在目录的绝对路径

```js
//当前执行脚本的目录
console.log(__dirname);
```
### filename

filename 获取当前执行脚本的文件名

```js
//会带有当前执行脚本的目录及文件名
console.log(__filename);

const path = require('path')
console.log(path.basename(__filename))//文件名
```
### Buffer
Buffer是一个类似数组的对象，用来操作二进制数据

### process

process 进程信息

```js
// 比如 运行 node index.js --nb66
console.log(process.argv);//返回值是个数组里面有 nb66

// 也可获取路径
console.log(process.cwd());

// 退出进程
process.exit()
```

## CSR SSR SEO

### CSR

客户端渲染，不依赖服务器，vue，react SPA单页面应用

ToB 后台管理系统，大屏可视化

### SSR

服务端渲染，依赖服务器

ToC 内容密集型应用如新闻，博客，电子商务，门户网站

### SEO

搜索引擎优化，提升用户体验

TDK:`title` ,`description`, `keywords`

使用语义化标签


## path

path模块在不同操作系统有差异（windows和posix）

windows没有完全遵循posix的规范，如在windows中路径使用`\`，posix中使用`/`

### basename

返回给定路径的最后一部分

```js
const path = require('node:path')
// windows兼容正斜杠写法
console.log(path.basename('/hh/nb/index.html'));//index.html
console.log(path.basename('\\hh\\nb\\index.html'));//index.html

// 模拟linux反斜杠写法（无法处理）
console.log(path.posix.basename('\\hh\\nb\\index.html'));// \hh\nb\index.html

// 可以使用这种方式处理正反斜杠
console.log(path.win32.basename('\\hh\\nb\\index.html'));//index.html
```

### dirname

返回给定路径的目录与basename互补

```js
console.log(path.dirname('/hh/nb/index.html')); //hh/nb
```

### extname

```js
console.log(path.extname('/hh/nb/index.html'));//.html
// 没有 . 就会返回空字符串
console.log(path.extname('/hh/nb/index'));// 
// 多个 . 返回最后一个
console.log(path.extname('/hh/nb/index.gg.html'));// .html
```

### .join

讲给定的路径拼接成一个完整的路径

```js
console.log(path.join('/hh', 'nb', 'index.html'));//\hh\nb\index.html

// 支持操作符
console.log(path.join('/hh', 'nb', 'index.html','../'));//\hh\nb\
```

### reslove

也是拼接路径的，但返回的是绝对路径

```js
console.log(path.resolve('a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z/index.js'));
//E:\code\node\a\b\c\d\e\f\g\h\i\j\k\l\m\n\o\p\q\r\s\t\u\v\w\x\y\z\index.js

// 多个绝对路径就只返回最后一个
console.log(path.resolve('/a','/b','/c'));//E:\c

// 只有一个相对路径就会拼接当前工作目录的绝对路径
console.log(path.resolve('./index.js'));//E:\code\node\index.js (你的文件在哪就是哪)
console.log(path.resolve('index.js'));//E:\code\node\index.js
//也可以用__dirname （泛用）
console.log(path.resolve(__dirname, 'index.js'));//E:\code\node\index.js
```

### parse

解析路径返回一个对象

```js
console.log(path.parse('/hh/nb/b.js'));
/** { 
 *  root: '/', 根目录
    dir: '/hh/nb', 文件所在目录
    base: 'b.js', 文件名+后缀
    ext: '.js', 后缀名
    name: 'b' 文件名
} **/
```

### format

正好与parse相反，把对象再转成路径

```js
console.log(path.format({
    root: '/', 
    dir: '/hh/nb', 
    base: 'b.js', 
    ext: '.js', 
    name: 'b' 
}));
// /hh/nb\b.js
```

### sep

返回操作系统的路径分隔符,常在跨平台时使用

```js
// windos系统的分隔符是\
// ppsix系统的分隔符是/
console.log(path.sep);
```

## os

与操作系统交互的模块

### palatform

获取操作系统信息

常见的：
- windows win32
- darwin mac
- linux linux

```js
//我是windows
console.log(os.platform());//win32
```

例子，判断不同的操作系统执行：
```js
const os = require('node:os');
const { exec } = require('node:child_process'); //子进程
// exec 可以执行shell命令

const platform = os.platform();

const open = (url) => {
  if (platform === 'darwin') {
    exec(`open${url}`);
  } else if (platform === 'linux') {
    exec('xdg-open ${url}');
  } else {
    exec(`start ${url}`);
  }
};

open('https://www.okxdm.com');
```

### release

获取操作系统版本信息

```js
console.log(os.release());//10.0.19045

// 还有些别的
console.log(os.type());//Windows_NT
console.log(os.version());//Windows 10 Home
console.log(os.arch());//x64
```

### Homedir

获取用户目录，win底层是调用 `%userprofile%`,mac是 `$HOME`

```js
console.log(os.homedir());//这个我就不写了哈
```

### cpus

获取cpu信息

```js
console.log(os.cpus());
```


## process

process 进程相关信息，不需要引入直接使用

### arch、platform

和os的arch、platform相同

### argv

获取进程的参数，上面有用到过不赘述了

### cwd

获取当前命令执行时的目录，绝对路径，__driname是被执行的文件所在的目录，因为esm不能用__driname,可以用cwd代替一下

```js
console.log(process.cwd());//E:\code\node
console.log(__dirname);
```

### memoryUsage

获取内存信息，常在优化时用，返回值是个对象

```js
console.log(process.memoryUsage());
/**
 * {
  rss: 38055936,// 物理内存存量
  heapTotal: 4403200,// v8 分配的总内存
  heapUsed: 3458976,// 已经使用的内存
  external: 1130068,// 外部的内存 c c++
  arrayBuffers: 10515, // 二进制占的总量
}
 */
```

### exit

退出进程，前面用到过，不在赘述

### kill

杀死进程，需要一个进程参数pid

```js
console.log('等待杀死进程');

setTimeout(() => {
  process.kill(process.pid);
}, 2000);
```

### env （重要）

获取操作系统的所有环境变量,返回值是个对象

可以修改，但只在当前进程中生效，不影响真正的系统环境

```js
console.log(process.env);
```

例子：
区分开发环境和生产环境

安装一下`cross-env`

```sh
npm install cross-env 
```
在项目`package.json`的`scripts`字段写入：

```json
"dev": "cross-env NODE_ENV=development node index.js",
"build": "cross-env NODE_ENV=product node index.js"
```

这样就可以去读取做一个判断

```js
// index.js文件
console.log(process.env.NODE_ENV === 'development' ? '开发环境' : '生产环境');
```

运行一下 `npm run dev`就可以看到打印出开发环境了


## child_process



> nodeJs 中 所以带有Sync的都是同步方法，不带的都是异步方法，异步方法一般都会提供一个回调函数返回buffer

### exec、execSync

可以帮我们执行shell命令，或者与软件交互

有字节上限 200kb 超出就会报错，所以常用来执行一些较小的立马能拿到结果的shell命令

例子：
获取ndoe的版本
```js
// 
const { exec, execSync } = require('child_process');
// 要执行的命令 ，(失败信息，标准输出，错误输出这里的输出都输buffer)
exec('node -v', (err, stdout, stderr) => {
  if (err) {
    return err;
  }
  console.log(stdout.toString()); //v20.12.0
});

const nodeVersion = execSync('node -v').toString();
console.log(nodeVersion);//v20.12.0
// 同步用的更多一些
```

例子：
创建文件夹
```js
const { execSync } = require('child_process');
execSync('mkdir test');
```

软件交互例子：
```js
const { execSync } = require('child_process');

// 打开谷歌浏览器并打开一个网址
execSync('start chrome https://www.okxdm.com');

// 打开网抑云 (指定文件路径就行了，转义一下\)
execSync('E:\\CloudMusic\\cloudmusic.exe');
```

### spawn、spawnSync

无字节上限，返回的是流并且是实时返回的

spawnSync用的比较少

```js
// 第一个参数是命令
// 传参写在第二个参数里 第三个参数是options
const { stdout } = spawn('netstat', ['-a'],{});
// 监听data事件
stdout.on('data', (msg) => {
  console.log(msg.toString());
});
// 还会有个close事件，exec是没有的需要用他的buffer去判断实现
stdout.on('close', () => {
  console.log('结束了');
});
```

### exec与spawn都有一个options参数

包括：

- `cwd <string>` 子进程的当前工作目录
- `env <Object>` 环境变量键值对
- `encoding <string>` 默认为 'utf8'
- `shell <string>` 用于执行命令的 shell。 在 UNIX 上默认为 '/bin/sh'，在 Windows 上默认为 process.env.ComSpec 详见 Shell Requirements 与 Default Windows Shell
- `timeout <number>` 默认为 0
- `maxBuffer <number>` stdout 或 stderr 允许的最大字节数。 默认为 200*1024。 如果超过限制，则子进程会被终止。 查看警告： maxBuffer and Unicode
- `killSignal <string> | <integer>` 默认为 'SIGTERM'
- `uid <number>` 设置该进程的用户标识
- `gid <number>` 设置该进程的组标识


### execFile、execSync

执行可执行文件

execSync用的比较少

例子：

创建一个可执行文件 bat.cmd ,写入以下内容
```cmd
echo '开始执行'

mkdir test 

cd ./test

echo console.log('我被写入了test') >test.js

echo '执行结束'

node test.js
```

运行这个文件会创建一个 test 文件夹，然后在里面创建一个test.js文件，写入console.log('我被写入了test')，然后执行node test.js 会输出: '我被写入了test'

创建一个index.js，写入以下内容:

```js
const { execFile, execFileSync } = require('child_process');
const path = require('node:path');
// 执行当前目录下的bat.cmd，返回的是buffer
execFile(path.resolve(__dirname, './bat.cmd'), null, (err, stdout) => {
  console.log(stdout.toString());
});
```

此时运行 `node index.js` 就会去执行bat.cmd，就可以看到上述叙述的内容都被执行了

> 底层实现顺序 exec -> execFile -> spawn


### fork

只能接受 js 模块，会返回一个子进程

例子：

创建一个index.js，写入以下内容:

```js
const { fork } = require('child_process');

// 创建子进程
const processChild = fork('./child.js');

// 向子进程发送消息
processChild.send('hello,我是来自父进程的消息');

// 接受子进程消息
processChild.on('message', (msg) => {
  console.log(msg);
});

```

创建一个child.js，写入以下内容:

```js
// process 监听 message
process.on('message', (msg) => {
  console.log(msg);
});

// 也可以向父进程发送消息
process.send('我是子进程,over!');

```

运行 `node index.js` 就可以在控制台看到对应的内容了

> 通过 IPC 通讯的，IPC 基于 libuv ，调用不同操作系统的底层api，(windows named pipe)，(posix unix domain socket)

[子进程配合ffmpeg案例](./progress.md#ffmpeg)


## events

Node.js  API 都是采用异步事件驱动架构，简单来说就是通过有效的方法来监听事件状态的变化，并在变化的时候做出相应的动作（发布订阅模式）

```js
const eventEmitter = require('events');

//用法和 vue2 的eventBus 一样 第三方库 mitt 也是发布订阅
// on emit off once

const bus = new eventEmitter();

// 订阅事件 名称随便起
bus.on('test1', (msg) => {
  console.log(msg);
});

// 只触发一次
// bus.once('test1', (msg) => {
//   console.log(msg);
// });

// 发布事件 事件名称要和订阅的对应上，可以有多个

bus.emit('test1', '参数1');
bus.emit('test1', '参数2');
// ！坑点 nodejs 默认最多 10 个 可以通过下面的方法设置
// bus.setMaxListeners(20); // 设置最大监听数
// bus.getMaxListeners(); // 获取最大监听数

// off 需要吧函数提取出来
const fun1 = (msg) => {
  console.log(msg);
};

bus.on('test2', fun1);
// 会判断函数和订阅是不是的同一个
bus.off('test2', fun1); // 取消订阅
// 下面的代码不会触发
bus.emit('test2', 'test2的参数');
```

是不是发现 `process`上也有 `on` `emit` `off` 这些方法呢，没错

源码中使用 `ObjectGetPrototypeOf` 获取了 `process` 的原型对象，又用 `ObjectSetPrototypeOf`把 `events` 的对象原型设给他（process）也整了一份，并且重新绑定上下文所以就可以用了，而且 `process` 被挂载到了 `globalThis` （全局）对象上了所以不用导入就可以使用


## util

是nodejs内部提供的很多实用的工具类型api，方便我们快速开发，非常多这里写一些常用的


### util.promisify

在上面的例子中我们使用过`exec`不过是回调函数的形式，这里我们就用`Promise`的形式来使用:

```js
import util from 'node:util';
import { exec } from 'node:child_process';

const execPromise = util.promisify(exec); // 会返回一个新的函数

execPromise('node -v')
  .then((res) => {
    // 如果返回多个参数 res 就是个对象
    console.log(res); //{ stdout: 'v20.12.0\r\n', stderr: '' }
  })
  .catch((err) => {
    console.log(err);
  });

```

手写一个 `promisify` 来实现

```js
import util from 'node:util';
import { exec } from 'node:child_process';

const promisify = (fn) => {
  // 可能有多个参数所以解构出来
  return (...args) => {
    return new Promise((resolve, reject) => {
      // 调用传入的函数
      fn(...args, (err, ...values) => {
        if (err) {
          reject(err);
        }
        if (values && values.length > 1) {
          // 大于一就是个对象了
          let obj = {};
          for (let key in values) {
            obj[key] = values[key];
          }
          resolve(obj);
        } else {
          // 只有一个参数
          resolve(values[0]);
        }
      });
    });
  };
};

const execPromise = promisify(exec); // 会返回一个新的函数

execPromise('node -v')
  .then((res) => {
    // 如果返回多个参数 res 就是个对象
    console.log(res); //{ '0': 'v20.12.0\r\n', '1': '' }
    // 不过我们是拿不到key的 stdout/stderr
    // 源码中使用 kCustomPromisifyArgsSymbol 获取没有对外开放
    // 这里只是个实现的思路
  })
  .catch((err) => {
    console.log(err);
  });

```


### util.callbackify

把函数变成回调函数的形式

```js
import util from 'node:util';

// 原函数
const fn = (type) => {
  if (type == 1) {
    return Promise.resolve('success');
  } else {
    return Promise.reject('fail');
  }
};

const callback = util.callbackify(fn);

// 新函数里把原函数做成了回调函数的形式
callback(1, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
```

手写实现一下 `callbackify`

```js
import util from 'node:util';

// 原函数
const fn = (type) => {
  if (type == 1) {
    return Promise.resolve('success');
  } else {
    return Promise.reject('fail');
  }
};

const callbackify = (fn) => {
  return (...args) => {
    // 回调函数在最后一个参数所以用pop读取一下
    let callback = args.pop();
    // 调用传入的函数
    fn(...args)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        callback(err);
      });
  };
};

const callback = callbackify(fn);

// 新函数里把原函数做成了回调函数的形式
callback(1, (err, data) => {
  if (err) {
    console.log(err, data);
  } else {
    console.log(data);
  }
});
```

### util.format

类似于 `C` 语言中的 `printf` 函数，用于格式化字符串

```js
import util from 'node:util';

console.log(util.format('%s---%s', '你可真是个', '天才')); //你可真是个---天才
console.log(util.format('%d---%s', 666, '天才')); //666---天才
```

对照表：

- `%s`: String 将用于转换除 BigInt、Object 和 -0 之外的所有值。 BigInt 值将用 n 表示，没有用户定义的 toString 函数的对象使用具有选项 { depth: 0, colors: false, compact: 3 } 的 util.inspect() 进行检查
- `%d`: Number 将用于转换除 BigInt 和 Symbol 之外的所有值。
- `%i`: parseInt(value, 10) 用于除 BigInt 和 Symbol 之外的所有值。
- `%f`: parseFloat(value) 用于除 Symbol 之外的所有值
- `%j`: JSON。 如果参数包含循环引用，则替换为字符串 '[Circular]'
- `%o`: Object. 具有通用 JavaScript 对象格式的对象的字符串表示形式。 类似于具有选项 { showHidden: true, showProxy: true } 的 util.inspect()。 这将显示完整的对象，包括不可枚举的属性和代理
- `%O`: Object. 具有通用 JavaScript 对象格式的对象的字符串表示形式。 类似于没有选项的 util.inspect()。 这将显示完整的对象，但不包括不可枚举的属性和代理
- `%c`: CSS. 此说明符被忽略，将跳过任何传入的 CSS
- `%%`: 单个百分号 ('%')。 这不消费参数

## fs

文件系统模块，用的非常之频繁，提供了与文件系统交互的各种功能，如：读、写文件、更改文件权限，创建目录等

### 读取文件

同步 异步 promise 三种