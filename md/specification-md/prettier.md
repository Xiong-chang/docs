# Prettier

一个代码格式化工具,确保代码风格的一致性，避免团队成员之间因为代码格式问题产生分歧,配合 `Eslint` 使用，可以更方便的进行代码格式化

## 安装


本地安装：
```sh
npm install prettier --save-dev

# 或者
yarn add prettier --dev
```

全局安装：

```sh
npm install -g prettier

# 或者
yarn global add prettier

```

## 初始化

新建一个 `.prettierrc.js`

```js
module.exports = {
    //直接写规则
    printWidth: 80, //单行长度
    tabWidth: 4, //缩进长度
    useTabs: false, //使用空格代替tab缩进
    semi: true, //句末使用分号
    singleQuote: true, //使用单引号
    quoteProps: 'as-needed', //仅在必需时为对象的key添加引号
    jsxSingleQuote: true, // jsx中使用单引号
    trailingComma: 'all', //多行时尽可能打印尾随逗号
    bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
    jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
    arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
    requirePragma: false, //无需顶部注释即可格式化
    insertPragma: false, //在已被preitter格式化的文件顶部加上标注
    proseWrap: 'preserve', //不知道怎么翻译
    htmlWhitespaceSensitivity: 'ignore', //对HTML全局空白不敏感
    vueIndentScriptAndStyle: false, //不对vue中的script及style标签缩进
    endOfLine: 'lf', //结束行形式
    embeddedLanguageFormatting: 'auto', //对引用代码进行格式化
};
```

## 使用

```sh
npx prettier --write .

# 或
yarn prettier --write .

# 或 在package.json 的 scrpits 里配置自定义
```