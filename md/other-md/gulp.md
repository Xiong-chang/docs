# gulp

基于流(stream)的自动化构建工具，常用来编译 Sass 或 Less 文件、压缩 JavaScript 和 CSS 文件、优化图像、运行测试等,Gulp 通过定义任务（tasks）来工作，这些任务可以串联起来形成一个工作流（pipeline）,不适合用来打包项目

## 安装

```sh
#开发依赖
npm install --save-dev gulp
#命令行工具
npm install --global gulp-cli
# 检查是否安装成功
gulp --version


# ts使用时还要装一些东西
npm install gulp-cli ts-node -D
# 旧版本把 ts-node 换成 gulp --require @esbuild-kit/cjs-loader
```

## 使用

在项目根目录创建一个 `gulpfile.js`

两个核心函数 ：
- `parallel` 并行任务 异步不可控
- `series` 串行任务 同步任务 按顺序执行


## sass编译压缩案例

这里做一个编译scss并压缩的例子

目录结构:

```
你随便取个项目名/
│
├── src/
│   ├── index.scss  (实现input，button全部引入)
│   ├── input.scss  (可按需求引入)
│   ├── button.scss (可按需求引入)
│   └── mixins/
│       └── bem.scss
├── gulpfile.ts
├── package.json
```

除上面还需要的其他依赖(插件):

```sh
# 打包用的编译器
npm i gulp-sass -D

# 编译器的声明文件
npm i @types/gulp-sass -D

# dartscss (sass有多个种类)
npm i sass -D 

# postcss
npm i postcss -D
# 压缩css （postcss的插件）
npm i cssnano -D

# 美化日志的
npm i consola -D
```

package.json(参考):
```json
{
  "name": "gulp",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "gulp watch",
    "build": "gulp"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@types/gulp": "^4.0.17",
    "@types/gulp-sass": "^5.0.4",
    "consola": "^3.2.3",
    "cssnano": "^7.0.4",
    "gulp": "^5.0.0",
    "gulp-cli": "^3.0.0",
    "gulp-sass": "^5.1.0",
    "postcss": "^8.4.40",
    "sass": "^1.77.8",
    "ts-node": "^10.9.2"
  }
}
```

bem.scss:
```scss
$namespace:'fs' !default;//命名空间
$block-prefix:'-' !default;//block前缀
$element-prefix:'__' !default;//element前缀
$modifier-prefix:'--' !default;//modifier前缀

// fs-button
// #时会变成 .fs-button{ 里面的样式会代替@content }
@mixin b($block){
    $B:$namespace + $block-prefix + $block; 
    .#{$B}{
        @content;
    }
}

// fs-button__icon
// $slector:&; 就是父级
@mixin e($element){
    $slector:&;
    @at-root{
        #{$slector + $element-prefix + $element}{
            @content;
        }
    }
}

// fs-button--primary
@mixin m($modifier){ 
    $slector:&;
    @at-root{
        #{$slector + $modifier-prefix + $modifier}{
            @content;
        }
    }
}
```

button.scss:
```scss
@use './mixins/bem.scss' as *;

@include b(button){
    @include e(inner){
        width: 200px;
        height: 50px;
        display: flex;
    }
    @include m(success){
        background-color: green;
    }
    @include m(error){
        background-color: red;
    }
    @include m(warning){
        background-color: yellow;
    }
}
```

input.scss:
```scss
@use './mixins/bem.scss' as *;

@include b(input){
    @include e(inner){
        width: 200px;
        height: 50px;
        display: flex;
    }
}
```

index.scss:
```scss
// 把所有样式放在一起不久实现了全部导入了(😂)
@use './button.scss';
@use './input.scss';
```

gulpfile.ts:
```ts
// 导入
import gulp, { src } from 'gulp';
import gulpsass from 'gulp-sass';
import type Vinyl from 'vinyl';
import path from 'node:path';
import postcss from 'postcss';
import consola from 'consola';// 美化日志的不用管
import dartSass from 'sass'; // dartscss
import { Transform } from 'stream';// 流
import cssnano from 'cssnano';// 压缩css 这玩意是postcss的插件

// 处理css的函数
const compressCss = () => {
  // 注册一下postcss插件
  const processer = postcss([
    cssnano({
      preset: ['default', {}],
    }),
  ]);

  // Transform 是一个流，可以处理数据流,输入流
  return new Transform({
    // chunk 每一个要处理的文件
    // encoding: 'utf-8' 编码
    // callback 回调函数
    objectMode: true, // 开启处理对象流
    transform(chunk, encoding, callback) {
      // 获取文件的原始内容
      const file = chunk as Vinyl;
      const cssString = file.contents!.toString();// ! 非空断言欺骗编辑器这玩意不是空的
      // 压缩
      processer.process(cssString, { from: file.path }).then((result) => { // result 就是压缩后的css内容了
        // 获取文件名称 button.scss
        const name = path.basename(file.path);
        // result.css 是压缩后的内容 把原来的文件的内容替换了
        file.contents = Buffer.from(result.css); // （二进制转换文字Ascii码值）
        consola.success( // 输出提示一下成功压缩后的大小
          `压缩成功: ${name}`,
          `${cssString.length / 1024}kb-->${result.css.length / 1024}kb`
        );
      });
      callback(null, chunk); // 把chunk传递回流系统
    },
  });
};

// 处理哪些文件
const buildThemeBundle = () => {
  // 初始化sass编译器 
  const sass = gulpsass(dartSass);
  //   批量处理src下的所有文件 返回sass的多个实例对象
  return (
    // 要处理文件的目录
    src(path.resolve(__dirname, './src/*.scss'))
    // 变成同步任务 一个文件接一个文件的进行处理
    .pipe(sass.sync())
    // 进行处理
    .pipe(compressCss())
    // 压缩完输出到dist
    .pipe(gulp.dest(path.resolve(__dirname, 'dist')))
  );
};

// 具体任务
gulp.task('sass', () => {
  return buildThemeBundle();
});

// watch 监听 对应了 运行命令的watch  npm run watch ,这个在package.json中配置自定义
gulp.task('watch', () => {
  // 监听 src 目录下的所有文件，当文件变化时触发同步任务 编译sass
  gulp.watch('./src/**/*', gulp.series('sass'));
});

export default buildThemeBundle;
```

运行`npm run build` ,如果你成功了那就会在根目录的 `dist` 文件看到压缩后的文件了，可以观察`index.css` 是不是同时有button和input的内容

当然了如果想要修改打包后的名称以及更好的提示可以这样修改:
```ts
// 在 const name = path.basename(file.path) 下面增加这几行代码
const newName = name.replace(/\.css$/, '.min.css');// 修改文件名
const newPath = path.join(path.dirname(file.path), newName); // 生成新的文件路径
file.path = newPath; //替换原来的路径

// 并修改打印提示
consola.success(
  `压缩成功: ${name}`,
  `${cssString.length / 1024}kb--> ${newName}: ${
    result.css.length / 1024
  }kb`
);
```