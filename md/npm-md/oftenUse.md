# 常见的npm包

## jsdom

模拟浏览器环境的库

```js
const { JSDOM } = require('jsdom')
const fs = require('node:fs')
const root = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
    <div id="app"></div>
</body>
</html>
`)
// 获取window 和 document
const window = root.window
const document = window.document
const app = document.querySelector('#app')
// fetch node 18 版本才有的
fetch('https://api.thecatapi.com/v1/images/search?limit=10&page=1')
.then((res)=>
    res.json()
).then((data)=>{
    data.forEach((item)=>{
        const img = document.createElement('img')
        img.src = item.url
        img.style = 'width: 200px; height: 200px; margin: 20px;'
        app.appendChild(img)
    })
    // 此时root还是个对象不能直接使用
    // 用 serialize() 转成字符串
    // fs模块写入文件
    fs.writeFileSync('./index.html', root.serialize())
})
```