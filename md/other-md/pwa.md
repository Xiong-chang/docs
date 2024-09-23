# PWA

PWA 是一种渐进式 Web 应用程序，它借助 service workers 技术实现应用离线访问、推送通知等特性，同时能够具备类似原生应用的用户体验，PWA 可以在安装后离线使用，确保加载速度更快且用户交互更加顺畅。PWA 因为其能够缓存一些静态文件及所需数据在本地，实现了无网络时仍可访问网页的功能

## 离线缓存

可以将网站保存至桌面或者手机的 app（类似一个应用一样），并能够离线访问（在谷歌浏览器右上角会多一个小图标提示安装）

创建一个 `manifest.json`,写入以下配置：

```json
{
  "name": "MyWebNote",
  "short_name": "Note",
  "display": "standalone",
  "start_url": "./docs/index.html",
  "icons": [
    {
      "src": "./logo/logo.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
```

创建一个 index.html 引入 `manifest.json`：`<link rel="manifest" href="./manifest.json">`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>困境罢了</title>
    <!-- 引入配置 -->
    <link rel="manifest" href="./manifest.json" />
  </head>
  <body>
    <script>
      // 消息推送密钥转换成2进制 （这个是固定的）
      function urlB64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, "+")
          .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

      //订阅函数
      //   公钥需要申请 请访问 https://web-push-codelab.glitch.me/
      function subscrib(swgReg) {
        swgReg.pushManager
          .subscribe({
            userVisibleOnly: true,
            //公钥 他需要二进制格式 调用上面的 urlB64ToUint8Array 方法转换固定的不用管
            applicationServerKey: urlB64ToUint8Array("sadsadsdsd-sadsad"),
          })
          .then(function (subscription) {
            //一般都会把这个调接口发送给后台
            console.log("订阅成功", subscription);
          });
      }
      // 生命周期
      // 1.1 注册阶段 （引入sw.js）
      navigator.serviceWorker.register("./sw.js").then(function () {
        console.log("注册成功");

        // 消息推送
        // 2.1 检查是否订阅
        // 订阅消息 需要获取消息提示的权限才行
        registration.pushManager.getSubscription().then((subscription) => {
          //subscription这个就是权限
          if (subscription) {
            console.log("已经订阅了", subscription);
            console.log(JSON.stringify(subscription));
            //掉接口发送给后台
          } else {
            subscrib(registration); //调用订阅函数 把registration传过去
            console.log("没有订阅");
          }
        });
      });
    </script>
  </body>
</html>
```

创建一个 `sw.js`

```js
// 1.2 安装 阶段
self.addEventListener("install", (event) => {
  console.log("安装成功");
  // 这里面做作缓存逻辑
  // event.waitUntil() //可以继续往后传递
  // service worker 有个全局变量 caches
  event.waitUntil(
    // open 里面是缓存名字随便起一般写版本号
    caches.open("v1.2.0").then((cache) => {
      return cache.addAll([
        // 数组里写要缓存的文件，目录，图片等等资源
        "/docs",
        "/index.html",
      ]);
    })
  );
});

// 1.3 激活阶段 (更新缓存 删除缓存)
self.addEventListener("activate", function (event) {
  console.log("激活成功");

  // 默认情况下第二次进入才会离线缓存
  self.clients.claim(); // 这个方法会让其在第一次进入就可以离线缓存了

  // 这里做控制版本更新
  // 浏览器会默认存一份旧的这里对比后就可以进行更新
  event.waitUntil(
    Promise.all([
      caches.keys().then((keyList) => {
        keyList.map(function (name) {
          if (name != "1.2.0") {
            return caches.delete(name);
          }
        });
      }),
    ])
  );
});

// 1.4 拦截请求阶段 (拦截请求，返回缓存) 真正实现缓存
self.addEventListener("fetch", function (event) {
  console.log("拦截成功");

  event.respondWith(
    // 获取请求的文件名如果缓存有就读取缓存的没有就发起请求
    caches.match(event.request).then(function (response) {
      //如果发送的请求 跟cache 里面缓存的路径一样就返回
      return response || fetch(event.request);
    })
  );
});

// 接受消息推送
self.addEventListener("push", (event) => {
  //需要跟后端协调就是看后端发的是什么 发的是文本就text
  //发送的是json 就调用json()
  const data = event.data.text();
  self.registration.showNotification("妈的好复杂啊 凸(艹皿艹 )", {
    body: data,
    icon: "./logo/logo.png",
  });
});
```

离线推送的原理(上面使用的是封装过的 registration):

```js
// 获取权限
Notification.requestPermission().then(function (res) {
  if (res === "granted") {
    console.log("权限获取成功");
  } else {
    console.log("权限获取失败");
  }
});
const message = new Notification("牛逼");
```
