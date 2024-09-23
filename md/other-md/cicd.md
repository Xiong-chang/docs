# CI/CD

是一种软件开发实践，旨在通过自动化流程来提高软件开发和交付的效率和质量


## 案例

这里演示把一个 `vite` 项目来提交、部署一条龙服务

主要流程就是写好目标项目和服务器必要的信息，通过命令行选择项目，进行自动打包，自动压缩，自动上传，自动解压，自动删除压缩包以及自动重命名解压后的文件夹名称，或者在项目进行`git`提交时自动进行上面的流程

### CI/CD 目录结构

该目录与 `vite` 项目无关，（当然你也可以直接集成在 `vite` 项目下只要你不嫌多）

```
你随便取名/
│
├── src/
│   ├── build.js            (打包)
│   ├── compressFile.js     (文件压缩)
│   ├── handleCommand.js    (执行ssh命令)
│   ├──helper.js            (命令行交互)
│   ├──ssh.js               (ssh连接)
│   └──uploadFile.js        (文件上传)
│
├── app.js                  (入口文件)
├── config.js               (配置文件)
├── package.json            (这个就不用介绍了吧...)
```

需要的依赖：
- node-ssh (ssh连接)    `npm i node-ssh`
- inquirer (命令行交互) `npm i inquirer`
- archiver (文件压缩)   `npm i archiver`

## config.js

该文件是将需要进行这一条龙服务的项目的描述，比如项目名称、ssh的地址秘钥、本地的目录、压缩后的名字、上传到服务器的目录、上传后的文件夹名称等

```js
const config = [
  {
    name: '项目1',
    value: '1',
    ssh: {
      host: 'xxx.xxx.xxx.xxx', // 你的服务器地址
      username: 'root', // 服务器登录要用的名称（默认root）
      port: 22,//默认端口
      password: '*********', // 登录要的密码
      passphrase: '', // 密钥没有给个空
    },
    // 本地目录
    targetDir: 'E:/code/vite/dist',
    // 压缩后的包名
    targetFile: 'dist.zip',
    // 上传到服务器的目录
    deployDir: '/home/node_test', // 在服务器找个空文件夹以免上传失败或上传后找不到
    // 上传后文件夹名称
    releaseDir: 'Web',
  },
  {
    name: '项目2',
    value: '2',
  },
];
// 为什么是个数组
// 因为可能是集群部署，有很多个项目自由选则
// 项目2稍后会成为一个选项 
export default config;
```


## helper.js

使用 `inquirer` 模块 编写命令行交互，让用户选择要执行的项目

```js
// 命令行交互个工具
import inquirer from 'inquirer'; // 靠这个实现的
import config from '../config.js';// 引入配置文件读取需要的数据
async function commanderLine() {
//   console.log(process.argv); //可以收到进程参数 配合husky 做git提交用的 返回值是个数组

    // 这里是 vite 项目设置后才在这里调用的可以先不管
  if (process.argv[2]) {
    // process.argv 会获取到进程参数
    // 代码提交后自动调用返回文件名，来 自动打包 部署到服务器
    // 取下标2能拿到项目名 对应这里的config的配置的项目名
    return config.find((v) => v.value === process.argv[2]);
  } else {
    // 手动调用
  }
  
    // 配置命令行选项 就像创建vite项目选择那些语言框架一样
  const res = await inquirer.prompt([
    {
      type: 'list',
      message: '请选择项目',
      name: 'project', // project 会成为返回对象res里的一个key 
      choices: config, //下拉选项 这里会吧 config 里的两个项目遍历出来,返回对象res的值
    },
    {
      type: 'confirm',
      message: '是否继续?',
    },
  ]);
   // res.project 就是选择的项目，project 上面的定义的
   // 通过它在 config 中 找到项目对象
  const opts = config.find((v) => v.value === res.project);
  return opts;
}

export default commanderLine;
```

## compressFile.js

使用 `archiver` 模块压缩，需要被压缩文件夹的目录路径,后面会在 `app.js` 写出

```js
// 压缩文件
import archiver from 'archiver';
import fs from 'node:fs';// filesystem 文件系统 node自带
/**
 *
 * @param {*} targetDir  需要压缩目录的位置 （项目文件一般在别的地方所以通过 config 文件声明再拿过来使用）
 * @param {*} loaclFile  压缩后文件存放的位置  （要把压缩后的压缩包放在这个项目目录里）
 */
function compressFile(targetDir, loaclFile) {
  // console.log(arguments);

  return new Promise((resolve) => {
    // 创建可写流
    const output = fs.createWriteStream(loaclFile);
    // 配置 archiver zip 是格式
    const archive = archiver('zip', {
      zlib: { level: 9 }, //1-9越高体积越小
    });
    // pipe 管道上一次执行的结果会交给下一个接着处理
    archive.pipe(output); //压缩完的流 交给可写流处理

    archive.directory(targetDir, 'dist'); //要压缩的目录 'dist'会在压缩文件里多一层dist目录

    archive.finalize(); //结束

     //监听close事件表示压缩结束了
    archive.on('close', () => {
      console.log((archive.pointer() / 1024 / 1024).toFixed(2), 'MB');
      resolve();
    });
  });
}

export default compressFile;
```


## ssh.js

使用 `node-ssh` 模块，配置 `ssh`连接

```js
//  连接ssh服务
import * as ssh from 'node-ssh';

const sshClient = new ssh.NodeSSH();//实例化一下啊

async function sshConnect(sshConfig) {// sshConfig 接受 config 里声明的服务器数据 地址、用户名、密码等
  return new Promise((resolve) => {
    sshClient.connect(sshConfig).then(() => {
      console.log('连接成功');
      resolve();
    });
  });
}

export default {
  sshConnect,
  ssh: sshClient,// 实例对象也导出有些方法后面会用到
};
```

## uploadFile.js

`ssh.putFile` 上传文件

```js
// 上传远端服务器的代码

function uploadFile(ssh, config, local) {
    // ssh 上面导出的实例, config 项目信息, local 本地待上传的文件

  return new Promise((resolve) => {
    //local本地地址 remote远端地址
    ssh.putFile(local, config.deployDir + config.releaseDir);// 把本地的文件发送到 服务器的 config.deployDir + config.releaseDir 的位置
    console.log('发送成功');
    resolve();
  });
}

export default uploadFile;
```

## handleCommand.js

主要用来执行 `linux` 服务器的命令

```js
// commad 是要执行的命令

function runCommander(ssh, commad, path) {
  return new Promise((resolve) => {
    // ssh 的 execCommand 来执行命令
    ssh
      .execCommand(commad, {
        // 在哪个目录下执行
        cwd: path,
      })
      .then((res) => {
        resolve();
      });
  });
}
export default runCommander;

```

## build.js

用 ndoe 自带的 `child_process` 的 `execSync` 执行 `shell` 命令,这里是 vite 项目 所以会执行 `npm run build`

```js
// 打包一下vite项目
import { execSync } from 'child_process';

// execSync 可以帮忙执行 shell 命令
function runBuild(path) {
  return new Promise((resolve) => {
    execSync('npm run build', {
      //这里源项目是 vite 项目所以打包是 npm run build
      cwd: path, // 传入的路径
      stdio: 'inherit', //输出日志
    });
    resolve();
  });
}
export default runBuild;

```

## app.js (铠甲合体！)

注意顺序

```js
import path from 'path';
import commanderLine from './src/helper.js'; //引入命令行工具
import compressFile from './src/compressFile.js'; // 压缩文件
import service from './src/ssh.js'; // ssh
import uploadFile from './src/uploadFile.js'; // 上传文件
import runCommander from './src/handleCommand.js'; // 服务器执行命令
import runBuild from './src/build.js'; // 运行打包命令
async function main() {
  const config = await commanderLine();

  //获取根目录路径 压缩后的文件 这里join直接拼接就会创建这个文件夹 把前面压缩文件要用到的坑填上
  const local = path.join(process.cwd(), config.targetFile);

  await runBuild(config.targetDir);//源文件打包
  
  await compressFile(config.targetDir, local);// 压缩

  await service.sshConnect(config.ssh);// 连接ssh

  // 再上传文件之前执行删除目录的命令
  await runCommander(service.ssh, `rm -rf ${config.releaseDir}`, config.deployDir); //删除旧的目录

  await uploadFile(service.ssh, config, local);

  // 解压
  await runCommander(service.ssh, `unzip -rf ${config.releaseDir}`, config.deployDir);

  // 再删除一次文件夹
  await runCommander(service.ssh, `rm -rf ${config.releaseDir}`, config.deployDir);

  // 重命名
  await runCommander(service.ssh, `mv dist ${config.releaseDir}`, config.deployDir); //删除旧的目录

  // 断开连接
  service.ssh.dispose();
}

main();

```

到这里选择指定项目就可以自动打包部署了，如果要在 git 提交时进行那就需要下面的 vite 配置


## vite项目

`vite`项目随便搞一个就行，能打包就行会用到打包后的 `dist` 目录,用作本地待上传的文件

需要安装 `npm i husky`,如果最新版本有 bug 就用 8.0 的

1. 初始化一下 git 仓库 `git init`
2. 运行 `npx husky install` 会创建一个 husky 目录
3. 运行 `npx husky add .husky/pre-commit` 添加 commit钩子，会在提交前调用该钩子，（当然还有其他的如  pre-push 等）
4. 在第三步生成的文件里写 shell 命令

```sh
cd 你的/CICD项目路径
node app.js 项目1 (也就是你的config项目名)
```
此时 `helper.js` 里预留的 `process.argv[2]` 就生效了，它会得到一个数组[node,app.js,项目名],我们取最后一个值就行，这样就完成了提交时同时进行打包部署