# Eslint

开源的 JavaScript 代码检查工具,一般配合 `prettier` 使用

## 安装

本地安装：
```sh
npm install eslint --save-dev

# 或者
yarn add eslint --dev
```

全局安装：

```sh
npm install -g eslint

# 或者
yarn global add eslint
```



记得在vscode也装一个eslint的插件

## 初始化

```sh
npx eslint --init

# 或者
yarn eslint --init
```

然后会有一些选项:
- To check syntax and find problems 检查并找到问题
- What type of moudles does your project use? 模块化规范
- Which framework does your project use? 是否应用到框架
- ues TypeScript? 是否使用 TypeScript
- code run? 浏览器还是node环境
- install them now? 现在就安装？
- 安装方式用哪个 npm?


安装结束后会生成一个配置文件 eslint.config.mjs

> eslint 只有三个数字 0（off 忽略）,1（warn 警告，不会阻塞代码）,2（error 报错，会阻塞代码） 

```mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
        quotes:2 //字符串必须双引号
        semi:1 //没有用分号就警告
        //'no-console':2 // 不能出现 console.log
        'no-console': process.env.NODEENV === 'dev' ? '0' :'2' //开发模式忽略，生产模式不能出现 console.log
    }
  }
];
```

详细对照表：[此处前往](https://eslint.cn/docs/rules/)

## 使用

```sh
# 检查文件
npx eslint .

# 检查文件并且自动修复(简单小问题可以修)
npx eslint . --fix

# 或 在package.json 的 scrpits 里配置自定义
```


## Eslint备用对照表：

```js

'rules': {
  // 禁止在正则表达式中使用控制字符 ：new RegExp("\x1f")
  "no-control-regex": 2,
  // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
  // always-multiline：多行模式必须带逗号，单行模式不能带逗号
  "comma-dangle": [1, "always-multiline"],
  // 禁止空语句块
  "no-empty": 2,
  // 禁止在正则表达式中使用空字符集 (/^abc[]/)
  "no-empty-character-class": 2,
  // 禁止不必要的括号 //(a * b) + c;//报错
  "no-extra-parens": 0,
  // 禁止不必要的分号
  "no-extra-semi": 2,
  // 禁止 RegExp 构造函数中无效的正则表达式字符串
  "no-invalid-regexp": 2,
  // 禁止在字符串和注释之外不规则的空白
  "no-irregular-whitespace": 2,
  // 禁止在 in 表达式中出现否定的左操作数
  "no-negated-in-lhs": 2,
  // 禁止把全局对象 (Math 和 JSON) 作为函数调用 错误：var math = Math();
  "no-obj-calls": 2,
  // 禁止直接使用 Object.prototypes 的内置属性
  "no-prototype-builtins": 0,
  // 禁止正则表达式字面量中出现多个空格
  "no-regex-spaces": 2,
  // 禁止在return、throw、continue 和 break语句之后出现不可达代码(不能有无法执行的代码)
  "no-unreachable": 2,
  // 强制使用有效的 JSDoc 注释
  "valid-jsdoc": 1,
  //
  // 最佳实践 //
  //
  // 定义对象的set存取器属性时，强制定义get
  "accessor-pairs": 2,
  // 强制数组方法的回调函数中有 return 语句
  "array-callback-return": 0,
  // 强制把变量的使用限制在其定义的作用域范围内
  "block-scoped-var": 0,
  // 限制圈复杂度（循环复杂度），也就是类似if else能连续接多少个
  "complexity": [2, 9],
  // 要求 return 语句要么总是指定返回的值，要么不指定，TypeScript强类型，不配置
  "consistent-return": 0,
  // switch语句最后必须有default，也可添加 // no default 注释取消此次警告
  "default-case": 2,
  // 强制object.key 中 . 的位置，参数:
  // property，'.'号应与属性在同一行
  // object, '.' 号应与对象名在同一行
  "dot-location": [2, "property"],
  // 强制使用.号取属性
  // 参数： allowKeywords：true 使用保留字做属性名时，只能使用.方式取属性
  // false 使用保留字做属性名时, 只能使用[]方式取属性 e.g [2, {"allowKeywords": false}]
  // allowPattern: 当属性名匹配提供的正则表达式时，允许使用[]方式取值,否则只能用.号取值 e.g [2, {"allowPattern": "^[a-z]+(_[a-z]+)+$"}]
  "dot-notation": [2, {"allowKeywords": false}],
  // 必须使用全等，使用 === 替代 == allow-null允许null和undefined==
  "eqeqeq": [2, "allow-null"],
  // 要求 for-in 循环中有一个 if 语句
  "guard-for-in": 2,
  // 禁用 alert、confirm 和 prompt
  "no-alert": 0,
  // 禁用 arguments.caller 或 arguments.callee
  "no-caller": 2,
  // 不允许在 case 子句中使用词法声明
  "no-case-declarations": 2,
  // 禁止除法操作符显式的出现在正则表达式开始的位置
  "no-div-regex": 2,
  // 禁止出现空函数.如果一个函数包含了一条注释，它将不会被认为有问题。
  "no-empty-function": 2,
  // 禁止使用空解构模式no-empty-pattern
  "no-empty-pattern": 2,
  // 禁止不必要的 .bind() 调用
  "no-extra-bind": 2,
  // 禁用不必要的标签
  "no-extra-label:": 0,
  // 禁止数字字面量中使用前导和末尾小数点
  "no-floating-decimal": 2,
  // 禁止在全局范围内使用 var 和命名的 function 声明
  "no-implicit-globals": 1,
  // 禁用标签语句
  "no-labels": 2,
  // 禁用不必要的嵌套块
  "no-lone-blocks": 2,
  // 禁用魔术数字(3.14什么的用常量代替)
  "no-magic-numbers":[1, {"ignore": [0, -1, 1] }],
  // 禁止使用多行字符串，在 JavaScript 中，可以在新行之前使用斜线创建多行字符串
  "no-multi-str": 2,
  // 禁止在字符串中使用八进制转义序列
  "no-octal-escape": 2,
  // 不允许对 function 的参数进行重新赋值
  "no-param-reassign": 0,
  // 禁止使用 javascript: url
  "no-script-url": 0,
  // 禁止自我赋值
  "no-self-assign": 2,
  // 禁用一成不变的循环条件
  "no-unmodified-loop-condition": 2,
  // 禁止出现未使用过的表达式
  "no-unused-expressions": 0,
  // 禁用未使用过的标签
  "no-unused-labels": 2,
  // 禁止不必要的 .call() 和 .apply()
  "no-useless-call": 2,
  // 禁止不必要的字符串字面量或模板字面量的连接
  "no-useless-concat": 2,
  // 禁用不必要的转义字符
  "no-useless-escape": 0,
  // 禁止在注释中使用特定的警告术语
  "no-warning-comments": 0,
  // 禁用 with 语句
  "no-with": 2,
  // 要求所有的 var 声明出现在它们所在的作用域顶部
  "vars-on-top": 0,
  // 要求或禁止 “Yoda” 条件
  "yoda": [2, "never"],
  // 要求或禁止使用严格模式指令
  "strict": 0,
  //
  // 变量声明 //
  //
  // 不允许 catch 子句的参数与外层作用域中的变量同名
  "no-catch-shadow": 0,
  // 不允许标签与变量同名
  "no-label-var": 2,
  // 禁用特定的全局变量
  "no-restricted-globals": 0,
  // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
  "no-undef": 2,
  // 禁止将变量初始化为 undefined
  "no-undef-init": 2,
  //
  // Node.js and CommonJS //
  //
  // 要求 require() 出现在顶层模块作用域中
  "global-require": 1,
  // 要求回调函数中有容错处理
  "handle-callback-err": [2, "^(err|error)$"],
  // 禁止对 __dirname 和 __filename进行字符串连接
  "no-path-concat": 0,
  // 禁用同步方法
  "no-sync": 0,
  //
  // 风格指南 //
  //
  // 指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
  "array-bracket-spacing": [2, "never"],
  // 禁止或强制在单行代码块中使用空格(禁用)
  "block-spacing":[1, "never"],
  //强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
  // if while function 后面的{必须与if在同一行，java风格。
  "brace-style": [2, "1tbs", {"allowSingleLine": true}],
  // 控制逗号前后的空格
  "comma-spacing": [2, {"before": false, "after": true}],
  // 控制逗号在行尾出现还是在行首出现 (默认行尾)
  // http://eslint.org/docs/rules/comma-style
  "comma-style": [2, "last"],
  //"SwitchCase" (默认：0) 强制 switch 语句中的 case 子句的缩进水平
  // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
  "computed-property-spacing": [2, "never"],
  // this别名，用于指统一在回调函数中指向this的变量名，箭头函数中的this已经可以指向外层调用者，应该没卵用了
  // e.g [0,"that"] 指定只能 var that = this. that不能指向其他任何值，this也不能赋值给that以外的其他值
  "consistent-this": [1, "that"],
  // 文件末尾强制换行
  "eol-last": 2,
  // 强制使用一致的换行风格
  "linebreak-style": [1, "unix"],
  // 要求在注释周围有空行 ( 要求在块级注释之前有一空行)
  "lines-around-comment": [1, {"beforeBlockComment": true}],
  // 强制一致地使用函数声明或函数表达式，方法定义风格，参数：
  // declaration: 强制使用方法声明的方式，function f(){} e.g [2, "declaration"]
  // expression：强制使用方法表达式的方式，var f = function() {} e.g [2, "expression"]
  // allowArrowFunctions: declaration风格中允许箭头函数。 e.g [2, "declaration", { "allowArrowFunctions": true }]
  "func-style": 0,
  // 强制回调函数最大嵌套深度 5层
  "max-nested-callbacks": [1, 5],
  // 禁止使用指定的标识符
  "id-blacklist": 0,
  // 强制在 JSX 属性中一致地使用双引号或单引号
  "jsx-quotes": 0,
  // 强制在关键字前后使用一致的空格 (前后腰需要)
  "keyword-spacing": 2,
  // 强制一行的最大长度
  "max-len":[1, 200],
  // 强制最大行数
  "max-lines": 0,
  // 强制 function 块最多允许的的语句数量
  "max-statements":[1, 200],
  // 强制每一行中所允许的最大语句数量
  "max-statements-per-line": 0,
  // 要求构造函数首字母大写 （要求调用 new 操作符时有首字母大小的函数，允许调用首字母大写的函数时没有 new 操作符。）
  "new-cap": [2, {"newIsCap": true, "capIsNew": false}],
  // 要求调用无参构造函数时有圆括号
  "new-parens": 2,
  // 禁止使用 Array数组 构造函数
  "no-array-constructor": 2,
  // 禁用按位运算符
  "no-bitwise": 0,
  // 要求 return 语句之前有一空行
  "newline-before-return": 0,
  // 要求方法链中每个调用都有一个换行符
  "newline-per-chained-call": 1,
  // 禁用 continue 语句
  "no-continue": 0,
  // 禁止在代码行后使用内联注释
  "no-inline-comments": 0,
  // 禁止混合使用不同的操作符
  "no-mixed-operators": 0,
  // 不允许否定的表达式
  "no-negated-condition": 0,
  // 禁止使用特定的语法
  "no-restricted-syntax": 0,
  // 禁止可以在有更简单的可替代的表达式时使用三元操作符
  "no-unneeded-ternary": 2,
  // 禁止属性前有空白
  "no-whitespace-before-property": 0,
  // 强制花括号内换行符的一致性
  "object-curly-newline": 0,
  // 强制将对象的属性放在不同的行上
  "object-property-newline": 0,
  // 强制函数中的变量要么一起声明要么分开声明
  "one-var": [2, {"initialized": "never"}],
  // 要求或禁止在 var 声明周围换行
  "one-var-declaration-per-line": 0,
  // 要求使用 JSDoc 注释
  "require-jsdoc": 1,
  // 要求同一个声明块中的变量按顺序排列
  "sort-vars": 0,
  // 要求操作符周围有空格
  "space-infix-ops": 2,
  // 强制在注释中 // 或 /* 使用一致的空格
  "spaced-comment": [2, "always", {"markers": ["global", "globals", "eslint", "eslint-disable", "*package","!"] }],
  // 要求或禁止 Unicode BOM
  "unicode-bom": 0,
  // 要求正则表达式被括号括起来
  "wrap-regex": 0,
  //
  // ES6.相关 //
  //
  // 要求箭头函数体使用大括号
  "arrow-body-style": 2,
  // 非派生类不能调用super，派生类必须调用super，强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示
  "constructor-super": 0,
  // 强制 generator 函数中 * 号前后使用一致的空格
  "generator-star-spacing": [2, {"before": true, "after": true}],
  // 禁止修改类声明的变量，禁止给类赋值
  "no-class-assign": 2,
  // 不允许箭头功能，在那里他们可以混淆的比较
  "no-confusing-arrow": 0,
  // 禁止修改 const 声明的变量
  "no-const-assign": 2,
  // 禁止类成员中出现重复的名称
  "no-dupe-class-members": 2,
  // 不允许复制模块的进口
  "no-duplicate-imports": 0,
  // 禁止 Symbol 的构造函数
  "no-new-symbol": 2,
  // 允许指定模块加载时的进口
  "no-restricted-imports": 0,
  // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
  "no-this-before-super": 2,
  // 禁止不必要的计算性能键对象的文字
  "no-useless-computed-key": 0,
  // 要求或禁止对象字面量中方法和属性使用简写语法
  "object-shorthand": 0,
  // 要求使用箭头函数作为回调
  "prefer-arrow-callback": 0,
  // 要求使用模板字面量而非字符串连接
  "prefer-template": 0,
  // Suggest using the rest parameters instead of arguments
  "prefer-rest-params": 0,
  // 要求generator 函数内有 yield
  "require-yield": 0,
  // enforce spacing between rest and spread operators and their expressions
  "rest-spread-spacing": 0,
  // 强制模块内的 import 排序
  "sort-imports": 0,
  // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
  "template-curly-spacing": 1,
  // 强制在 yield* 表达式中 * 周围使用空格
  "yield-star-spacing": 2,
  "curly": [2, "all"],
  "no-cond-assign": 2,//禁止在条件表达式中使用赋值语句
  "no-console": 2,//禁止使用console
  "no-constant-condition": 2,//禁止在条件中使用常量表达式 if(true) if(1)
  "no-debugger": 2,//禁止使用debugger
  "no-delete-var": 2,//不能对var声明的变量使用delete操作符
  "no-dupe-keys": 2,//在创建对象字面量时不允许键重复 {a:1,a:1}
  "no-dupe-args": 2,//函数参数不能重复
  "no-duplicate-case": 2,//switch中的case标签不能重复
  "no-else-return": 2,//如果if语句里面有return,后面不能跟else语句
  "no-empty-label": 2,//禁止使用空label
  "no-eq-null": 2,//禁止对null使用==或!=运算符(禁止在没有类型检查操作符的情况下与 null 进行比较)
  "no-eval": 1,//禁止使用eval()
  "no-ex-assign": 2,//禁止给catch语句中的异常参数重新赋值
  "no-extend-native": 2,//禁止扩展native对象(原生类型)
  "no-extra-boolean-cast": 2,//禁止不必要的bool转换
  "no-fallthrough": 1,//禁止switch穿透
  "no-func-assign": 2,//禁止重复的函数声明
  "no-implicit-coercion": 1,//禁止隐式转换
  "no-implied-eval": 2,//禁止使用隐式eval()
  "no-inner-declarations": [2, "functions"],//禁止在块语句中使用声明（变量或函数）
  "no-invalid-this": 2,//禁止无效的this，只能用在构造器，类，对象字面量
  "no-iterator": 2,//禁止使用__iterator__ 属性
  "no-lonely-if": 2,//禁止else语句内只有if语句
  "no-loop-func": 1,//禁止在循环中出现 function 声明和表达式（如果没有引用外部变量不形成闭包就可以）
  "no-mixed-requires": [0, false],//声明时不能混用声明类型（不能混合常规 var 声明和 require 调用）
  "no-mixed-spaces-and-tabs": [2, false],//禁止混用tab和空格
  "no-multi-spaces": 1,//不能用多余的空格
  "no-multiple-empty-lines": [1, {"max": 2}],//空行最多不能超过2行（不能出现多行空行）
  "no-native-reassign": 2,//不能重写native对象（不能对原生对象赋值）
  "no-nested-ternary": 0,//禁止使用嵌套的三目运算
  "no-new": 1,//禁止在使用new构造一个实例后不赋值(禁止在非赋值或条件语句中使用 new 操作符)
  "no-new-func": 1,//禁止使用new Function(禁止对 Function 对象使用 new 操作符)
  "no-new-object": 2,//禁止使用new Object()  (禁止使用 Object 的构造函数)
  "no-new-require": 2,//禁止使用new require (禁止调用 require 时使用 new 操作符)
  "no-new-wrappers": 2,//禁止使用new创建包装实例，new String new Boolean new Number  (禁止对 String，Number 和 Boolean 使用 new 操作符)
  "no-octal": 2,//禁止使用八进制数字
  "no-plusplus": 0,//禁止使用++，--
  "no-process-env": 0,//禁止使用process.env
  "no-process-exit": 0,//禁止使用process.exit()
  "no-proto": 2,//禁止使用__proto__属性
  "no-redeclare": 2,//禁止重复声明变量
  "no-restricted-modules": 0,//如果禁用了指定模块，使用就会报错
  "no-return-assign": 1,//return 语句中不能有赋值表达式
  "no-self-compare": 2,//不能比较自身
  "no-sequences": 0,//禁止使用逗号运算符
  "no-shadow": 2,//外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
  "no-shadow-restricted-names": 2,//严格模式中规定的限制标识符不能作为声明时的变量名使用
  "no-spaced-func": 2,//函数调用时 函数名与()之间不能有空格
  "no-sparse-arrays": 2,//禁止稀疏数组， [1,,2]
  "no-ternary": 0,//禁止使用三目运算符
  "no-trailing-spaces": 1,//一行结束后面不要有空格
  "no-throw-literal": 2,//禁止抛出字面量错误 throw "error";
  "no-undefined": 2,//不能使用undefined
  "no-unexpected-multiline": 2,//避免多行表达式
  "no-underscore-dangle": 1,//标识符不能以_开头或结尾
  "no-unused-vars": [2, {"vars": "all", "args": "after-used"}],//不能有声明后未被使用的变量或参数
  "no-use-before-define": 2,//未定义前不能使用
  "no-void": 2,//禁用void操作符
  "no-var": 0,//禁用var，用let和const代替
  "arrow-parens": 0,//箭头函数用小括号括起来
  "arrow-spacing": [2, {"before": true, "after": true}],// => 的前/后括号
  "callback-return": 1,//避免多次调用回调什么的
  "camelcase": 2,//强制驼峰法命名
  "func-names": 0,//函数表达式必须有名字
  "id-length": 0,//变量名长度
  "indent": [2, 4],//缩进风格
  "init-declarations": 0,//声明时必须赋初值
  "key-spacing": [0, { "beforeColon": false, "afterColon": true }],//对象字面量中冒号的前后空格
  "max-depth": [0, 4],//嵌套块深度
  "max-params": [0, 3],//函数最多只能有3个参数
  "newline-after-var": 2,//变量声明后是否需要空一行
  "object-curly-spacing": [0, "never"],//大括号内是否允许不必要的空格
  "operator-assignment": [0, "always"],//赋值运算符 += -=什么的（要求或禁止在可能的情况下要求使用简化的赋值操作符）
  "operator-linebreak": [2, "after"],//换行时运算符在行尾还是行首
  "padded-blocks": 0,//块语句内行首行尾是否要空行
  "prefer-const": 0,//首选const
  "prefer-spread": 0,//首选展开运算而非 .apply()
  "prefer-reflect": 0,//首选Reflect的方法
  "quotes": [1, "single"],//引号类型 `` "" ''
  "quote-props":[2, "always"],//对象字面量中的属性名是否强制双引号
  "radix": 2,//parseInt必须指定第二个参数
  "id-match": 0,//命名检测
  "semi": [2, "always"],//语句强制分号结尾
  "semi-spacing": [0, {"before": false, "after": true}],//分号前后空格
  "space-after-keywords": [0, "always"],//关键字后面是否要空一格
  "space-before-blocks": [0, "always"],//不以新行开始的块{前面要不要有空格
  "space-before-function-paren": [0, "always"],//函数定义时括号前面要不要有空格
  "space-in-parens": [0, "never"],//小括号里面要不要有空格
  "space-return-throw-case": 2,//return throw case后面要不要加空格
  "space-unary-ops": [0, { "words": true, "nonwords": false }],//一元运算符的前/后要不要加空格
  "use-isnan": 2,//禁止比较时使用NaN，只能用isNaN()
  "valid-typeof": 2,//必须使用合法的typeof的值
  "wrap-iife": [2, "inside"],//立即执行函数表达式的小括号风格
}
```