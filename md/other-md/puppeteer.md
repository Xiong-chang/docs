# Puppeteer

谷歌的框架（无头浏览器）headLess 没有界面但在后台运行

## 安装

```sh
npm install puppeter
# 内含 chromium 所以包比较大
# 谷歌浏览器有热更新  chromium 没有
```

## 使用

常用来：
- 生成页面截图 生成pdf
- 自动化ui测试、自动化工具编写
- 爬虫

主要流程:

1. 创建浏览器
2. 打开页面
3. 跳转指定网站
4. 获取元素
5. 然后尝试做点什么...

```js
import puppeteer from 'puppeteer'
// 创建浏览器 返回是个promise
// puppeteer.launch().then()
// 用 async await 更方便
// 顶层await 语法
// node 18版本以上 
// 浏览器需要 86版本以上 属于es7
const browser = await puppeteer.launch({
    // 默认是 true 不会有前台的页面 在后台运行
    // false 做调试很方便
    headless:false ,
    defaultViewport:{
        width:1920,
        height:1080,
    },
     // 2.小坑 要关闭沙盒 否则会pdf生成经常超时
     args:[
        '--nosandbox',
        '--disable-setuid-sandbox'
    ]
})

// 打开一个页面
const page =await browser.newPage()

// 跳转页面
await page.goto('https://tieba.baidu.com/',{
    // 这里也可以设置超时时间等
    timeout: 60000,
    waitUntil: 'load',
})

// 等待网页加载完毕
await page.waitForNavigation({timeout:600000}) // 不推荐使用 因为经常超时 默认 30s,可以设置超时时间
page.on('load',()=>{}) // 同样可以等待加载完毕

// 等待某元素加载完成 比起等待整个网页更快
await page.waitForSelector('div') 

// 获取元素,多个元素
// $、$$ 原理就是document.querySelector、document.querySelectorAll
// 是 devtools 提供的
const inputUser =await page.$('input')
const divs =await page.$$('xxx')

// 也可以触发事件
const btn =await page.$('button')
await btn.click()

// 在 evaluate 里可以获取元素的信息
// 或者执行别的js代码
await inputUser.evaluate(el=>el.value='123')

// 关闭页面或浏览器
await page.close()
await browser.close()
```

## 截图

调用`screenshot()`

```js
// 可以用上面的流程获取元素后在进行截图
// 小坑 如果出现截图白屏就是没有加载完就提前截图了
await page.screenshot({// 这里是截取整个page页
    path:'screen.png',// 生成图片的名字 默认存在根目录
    fullPage:true,// 是否全屏
})

```

## 生成pdf

与上面同理,调用`pdf()`

```js
// pdf 小坑：只能是无头模式（headless：true）
await page.pdf({
    path:'example.pdf',
    format:'a4',
    printBackground:true,// 打印背景
    width:'1000px',
    height:'2000px',
    margin:{
        top:'0px'
    },
   
})
```

## 爬虫

综合能力的考验,记得查看目标网站`robots.txt`文件会写明爬取的权限(SEO必要的),直接在域名后访问

例: [https://www.bilibili.com/robots.txt](https://www.bilibili.com/robots.txt)

```js
import puppeteer from 'puppeteer';
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'path';

// 定时
const sleep = (time) => new Promise((reslove) => setTimeout(reslove, time * 1000));

// 创建浏览器
const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});

// 打开一个页面
const page = await browser.newPage();

// 前往指定网址
await page.goto('https://www.fabiaoqing.com/',{
    waitUntil: 'networkidle2',
    timeout: 60000,
    referer: 'https://www.fabiaoqing.com/'
  });

// 等待元素加载出来
await page.waitForSelector('.bqba');
const imgs = await page.$$('.bqppdiv img');
sleep(5);
console.log('收集链接ing');

for (let i = 0; i < imgs.length; i++) {
  const el = imgs[i];
  const src = await page.evaluate((src) => src.getAttribute('src'), el);
  console.log('下载中', src);
   
// 不同协议切换
//   if (src.startsWith('https')) {
//     request = https;
//   } else {
//     request = http;
//   }

  // 下载
  https.get(src, (res) => {
    let imgData = [];

    // 也可以对防盗链进行一些相应的处理
    // res.setHeader('Content-Type', 'image/jpeg');
    res.referer = 'https://www.fabiaoqing.com/';

    res.on('data', (chunk) => {
      imgData.push(chunk);
    });

    res.on('end', () => {
    // 流
      const buffer = Buffer.concat(imgData);
    // 写入
      fs.writeFileSync(path.join(process.cwd(), 'images', `${i}.jpg`), buffer);
    });
  });
}

await browser.close();
```

还有很多值得探索的地方，当然了短时间里请求过多一些网站可能会触发保护机制屏蔽你的ip一段时间...




## 定时任务

### 拓展

安装：`npm i node-schedule`


`'*/2 * * * * *'`  corn 表达式

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59) 
└───────────────────────── second (0 - 59, OPTIONAL) 每秒执行
```

`'0 0 12 * * *'` 就会在每晚半夜十二点执行一次