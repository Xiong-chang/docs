# Javascript 进阶

## Js运行机制

先编译 > 后执行

- 引擎：
  从头到尾负责整个JavaScript程序的编译与执行过程

- 编译器：
  配合引擎负责语法分析及代码生成等脏活累活

- 作用域：
  配合引擎负责收集维护由所有声明的标识符（变量）组成的一系列查
  询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限

举例：

```js
var a = 666;
```

1. 首先编译器会询问作用域是否有一个名称为 a 的变量存在当前作用域的集合中，如果存在编译器就会忽略 var a 的声明，继续编译，否则就会要求作用域在当前作用域集合中声明新的变量并给他命名为 a 。

2. 接下来编译器会为引擎生成运行所需的代码，用来处理 a = 666 这个赋值操作，引擎会询问当前作用域是否有 a 这个变量，没有就会继续查找该变量，如果最终找到了就会给这个 a 变量进行赋值，否则就会抛出一个异常

作用域是引擎的一部分，引擎是编译器的一部分，编译器是引擎的一部分，它们之间是包含关系，而不是并列关系，当代码复杂起来时就会有不同的作用域嵌套或者互相独立，所以就会有查找不到变量的情况。

## 堆栈

- 堆：
    1. 储存引用类型(对象，函数等)
    2. 当前堆内存释放销毁，那么这个引用值彻底没了
    3.堆内存的释放： 当堆内存没有被任何的变量或者其它东西所占用，浏览器会在空闲的时候，自主的进行内存回收，把所有不被占用的堆内存销毁掉（谷歌浏览器）（xxx= null,通过空对象指针null可以让原始变量（或者其它东西）谁都不指向，那么原有被占用的堆内存就没有被东西占用了，浏览器会销毁它）

- 栈:
    1. 提供一个供 js 自上而下的执行环境 （代码都是在栈中执行）
    2. 储存基本数据类型（字符串，数字，布尔，null，undefined）和一些执行环境（函数）
    3. 当栈内存被销毁，存储的那些基本值也都跟着被销毁了
    
记住：window全局作用域都是在栈内存里的，但内部的引用类型值是储存在堆内存里的，通过特定的值来引用从而使用，函数内部是私有制栈也就是私有作用域是被包裹着在全局里的，只有当函数被调用时才会生成，函数没有调用时，函数仅仅是个引用类型的变量其内部所有东西都不存在。

栈内存的销毁是浏览器自动进行的，而堆内存的销毁需要我们手动进行，或者等待浏览器空闲时自动进行。





### 变量提升

当栈内存（作用域）形成，js 自上到下执行之 **前** ，会进行变量提升，将带有 `var` 和 `function` 关键字的变量进行提前声明

如：
```js
 console.log('a的值为',a)  // undefined
// console.log('a2的值为',a2) // Cannot access 'a2'
var a = 666;
let a2 =555;
function nb (){
console.log('函数内的b值为:',b)
var b = 777; // 函数内部变量提升，只提升声明，不提升赋值，所以b的值为undefined
// console.log('函数内的c值为:',c)// Cannot access 'c'
let c = 888; // let const 没有变量提升
}
// console.log('函数外b的值为',b)// b is not defined 这是正常情况
nb() // 在函数内部的 var 变量 无论在调用前还是后都是无法网访问的
 // console.log('函数外b的值为',b)// b is not defined 这是正常情况
```

由上面可以看到，虽然 `var a` 在打印它之后才声明但仍可以寻找到它，这就是变量提升，`let` 声明的是没有提升的所以会报错,包括函数声明也会提升，你可以试试将 `nb()` 放在声明前运行，它仍然可以运行

当然函数的作用域里也会提升，但是如果你直接想在函数外访问 `b` 那是不行的，因为在当前函数的作用域不会再使用到 `b` 所以在运行后 `b` 就已经被销毁了，所以函数外面是访问不到的,无论是在函数调用前还是调用后。

不过也有一种情况：

```js
function nb (){
  var q = w = 999;
}
// console.log(q);// q is not defined
console.log(window.q); // undefined
// console.log(w);// w is not defined
console.log(window.w);
nb()
// console.log(q);// q is not defined
console.log(window.q); // undefined
console.log(w);// 999 
console.log(window.w);// 999
```

显然 q 无论如何也访问不到了（就是想访问q那就去看看闭包吧），但是 `w` 却在外层的 `window` 上，这个 `w` 就叫 **做暗示全局变量**

还有 `IIFE` 函数（立即执行函数）具备自己的作用域，所以全局下不会变量提升，但其内部存在正常的提升

#### 提升的坏处

污染全局变量，容易造成命名冲突，变量重名，变量覆盖等

所以最好使用 `let` 和 `const` 来声明变量和常量（常量就是用const声明的后且续不可更改其值）

## this 执行上下文 执行栈

三种：

- 全局执行上下文
- 函数执行上下文
- Eval 函数执行上下文（不常用不讨论）

### 全局执行上下文

默认的上下文，任何不在函数内部的代码都在全局执行上下文中，它会做两件事：创建一个全局的 window 对象，并且将 this 指向这个全局对象，一个程序中只会有一个全局的执行上下文

在全局执行上下文中，`this` 的值指向全局对象。(在浏览器中，this引用 Window 对象)

### 函数执行上下文

当函数被调用时，会为该函数创建一个新的上下文，每个函数都有自己的上下文，还可以有多个，会按照创建的顺序进行其他操作

在函数执行上下文中，`this` 的值取决于该函数是如何被调用的。如果它被一个引用对象调用，那么 `this` 会被设置成那个对象，否则 `this` 的值被设置为全局对象或者 `undefined`（在严格模式下）

有特例：

- 当函数被作为对象的方法调用时，`this` 的值会被设置为该对象。
- 箭头函数的 `this` 会绑定在离自己最近的作用域的 this 上，并且不会被调用改变。

#### 改变 this 指向

三个方法：

- `call()`：在调用函数时，指定函数内部 `this` 的值。
- `apply()`：在调用函数时，指定函数内部 `this` 的值。它接受一个数组作为参数。
- `bind()`：创建一个新的函数，该函数的 `this` 值被永久地绑定到指定的值,且不会立即调用。


```js
 // 建两个对象
let p1 = {
    name: '张三',
    hobby: 'game',
    play: function (sex, age) {
        console.log('我是' + this.name + ',性别:' + sex + ',今年:' + age + ',喜欢:' + this.hobby);
    }
}
let p2 = {
    name: '坤坤',
    hobby: '唱跳rap篮球'
}
// 调用play方法
p1.play('男', 19);// 我是张三性别男今年19喜欢game
p1.play.call(p2, '男', 20);// 我是坤坤,性别:男,今年:20,喜欢:唱跳rap篮球
p1.play.apply(p2, ['男', 20]);// 我是坤坤,性别:男,今年:20,喜欢:唱跳rap篮球
p1.play.bind(p2, '男', 20)();// 我是坤坤,性别:男,今年:20,喜欢:唱跳rap篮球
p1.play.bind(p2, '男', 20);//并没有调用函数
```

### 执行栈

执行栈，也就是在其它编程语言中所说的“调用栈”，是一种拥有 LIFO（后进先出）数据结构的栈，被用来存储代码运行时创建的所有执行上下文

当你的js运行时会创建一个全局执行上下文并压入当前的执行栈，遇到函数 **调用** 时，会为函数创建一个新的执行上下文并压入栈的 **顶部** ，优先执行顶部的函数，函数结束后会将该执行上下文弹出栈，继而进行下一个上下文的执行

```js
let nb = '我是天才';
function first(){
    console.log('第一个函数执行了');
    seconnd();
    console.log('天才是假的');
}
function seconnd(){
    console.log('第二个函数执行了');            
}
first();
console.log('天才如是说');

// 输出顺序如下
// 第一个函数执行了
// 第二个函数执行了
// 天才是假的
// 天才如是说
```




##  异步和单线程

### 单线程

js是单线程的，也就是说同一时间只能执行一个任务，不能同时执行多个任务，但是可以通过异步来模拟多线程的效果，比如使用 `setTimeout` 或者 `Promise` 来实现异步操作，从而达到多线程的效果。

顺序：

同步代码 > nextTick > 异步 > setImmediate

### 同步代码

同步代码指的是在执行过程中，如果当前任务没有完成，那么后续的任务将无法执行，直到当前任务完成。同步代码的执行顺序是按照代码的顺序依次执行的。

### 异步代码

异步代码指的是在执行过程中，当前任务不会阻塞后续任务的执行，而是通过回调函数或者事件来通知后续任务的执行。异步代码的执行顺序是不确定的，因为它的执行是依赖于事件或者回调函数的触发。

#### 宏任务与微任务

在异步代码中会有宏任务微任务之分，它们是有优先级的

新的文件本事就是执行一个宏任务 > 微任务（当前宏任务里的所有微任务执行完毕) >（浏览器可能会渲染） > 新的宏任务 > 新的微任务 > 新的宏任务...

宏任务：

- `script` 标签
- `setTimeout` 定时器
- `setInterval` 定时器
- `I/O` 操作（如读取文件）
- `UI` 交互事件（如点击事件)
- `setImmediate`（浏览器环境）(特殊)（当前事件循环结束后执行）


微任务：

- `process.nextTick`（Node.js 环境）（特殊）（在同步之后异步之前执行）
- `Promise` 的 `then` `catch` `finally` 方法 (注意不是 Promise 本身)
- `MutationObserver`（浏览器环境）（监视对DOM树所做更改，指定的DOM发生变化时被调用）
- `Object.observe` （实时监测js中对象的变化）

特殊：

- `requestIdleCallback` （浏览器环境）（浏览器空闲的时候调用）
- `queueMicrotask`（浏览器环境）(可将函数转成微任务)
- `requestAnimationFrame`（浏览器环境）（回调会在每一帧确认执行）

##  事件循环

三个东西：

- 运行栈
- 任务队列
- 事件循环（Eventloop）

同步代码在运行栈依次执行，遇到异步代码就会放入任务队列中等待，当运行栈为空时，事件循环会从任务队列中取出一个宏任务执行，执行完毕后，会检查是否有微任务，如果有，会依次执行微任务，执行完毕后，再从任务队列中取出下一个宏任务执行，以此类推，直到任务队列为空。

以下代码请在 node 环境运行

```js
setImmediate(()=>{
    console.log(1)
})
process.nextTick(()=>{
    console.log(2)
})
console.log(3)
setTimeout(()=>{console.log(4)},0)
setTimeout(()=>{console.log(5)},1000)
setTimeout(()=>{console.log(6)},0)
console.log(7)
// 输出顺序 3 > 7 > 2 > 4 > 6 > 1 > 5
````

小满顺口溜：

同步异步 先同步

异步任务 分微宏

优先执行 宏任务 (执行script程序本身就是一个宏任务)

宏任务内 微任务

清空宏内 微任务

开始下个 宏任务



## 作用域和闭包

### 作用域

- 全局作用域(Global)

    全局的作用域很好理解，即全局下的变量、函数在任何地方都能被访问到，可以使用window对象来访问 

- 函数作用域(Local)

    函数拥有自己的作用域，也就是说函数内声明的变量和函数，只在函数内有效

- 块级作用域(Block)

     被 {} 包裹，如if、while、for 等语句

- script作用域

    let const 声明全局变量时的特殊作用域，可以直接访问这个全局变量，但是却不能通过 window.xx 访问

- Catch Block 作用域

    Catch 语句也会生成一个特殊的作用域，Catch Block 作用域，特点是能访问错误对象

    ```js
    try{
        throw new Error("gg");
    } catch(err){
        debugger;
    }
    // 在控制台给 debugger断点 可以看到 Catch block > err > message:"gg"
    // finally 是块级
    ```

- Closure 作用域 (闭包核心)

    闭包是 JS 的常见概念，它是一个函数返回另一个函数的形式，返回的函数引用了外层函数的变量，就会以闭包的形式保存下来

- Eval 作用域

    eval 的代码里声明的变量都在Eval这个作用域里

    ```js
    function foo(str, a) { 
    eval( str ); // 欺骗！ 
    console.log( a, b ); 
    } 
    var b = 2; 
    foo( "var b = 3;", 1 ); // 1, 3

    ```

- With Block 作用域 （with语句已移除）
    `

### 闭包

红宝书上对于闭包的定义：闭包是指有权访问另外一个函数作用域中的变量的函数

MDN 对闭包的定义为：闭包是指那些能够访问自由变量的函数

说白了就是我可以在一个函数访问到另一个函数的变量

```js
    var a = 1;
    function foo(){
        var a = 2;
        function baz(){
            console.log(a);
        }
        bar(baz);
    }
    function bar(fn){
        fn();
    }
    foo(); // 输出2，而不是1
```

闭包会造成内存泄漏的问题，可以通过手动给闭包变量赋值 `null` 来解决

## 防抖与节流

- 防抖：
    
    设置一个时间，触发函数时会开始计时，如果在时间还未结束时再次触发了函数那么就会清除上一次的时间并重新开始计时，参考 王者荣耀回城
    
    ```js
    function debounce(func, wait) {
    let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
    ```

- 节流：
    
    设置一个时间,触发函数时开始计时，一但进入计时阶段函授就无法再次触发直到计时结束,参考 王者荣耀英雄技能冷却

    ```js
    function throttle(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            if (!timeout) {
            timeout = setTimeout(function() {
                timeout = null;
                func.apply(context, args);
            }, wait);
            }
        };
    }
    ```


## 原型和原型链

### 原型

在 JavaScript 中函数也是对象

`__proto__`、 `constructor` 属性是对象所独有的

`prototype` 属性是函数独有的

上面说过js中函数也是对象的一种，那么函数同样也有属性 `__proto__`、 `constructor`

看下面例子

```js
// 一个普通函数
function Father(){

};
// = 左边是实例化后的对象， = 右边就是构造函数，从左到右的过程就是实例化
let father = new Father();

// 左边对象有两个属性，constructor和__ proto __
// 右边的构造函数有prototype 
//  constructor 属性用于记录实例是由哪个构造函数创建
    console.log(father.__proto__);// 存在
    console.log(father.constructor);// Father()函数
    console.log(father.prototype);// undefined

    console.log(Father.prototype);// 存在
    console.log(Father.prototype.constructor);// Father()函数
    console.log(Father.__proto__);// 存在

    console.log(father.__proto__ === Father.prototype);// true
```

这样你就可以看到 这个 `constructor` 其实是构造函数 `Father` 的 `prototype` 的一个属性

 `father` 的原型对象就是指 `Father.prototype` ,(`Father.prototype`又称为显式原型, `father` 的 `__proto__` 又称为隐式原型)

 `father` 的对象原型就是指 `Father.prototype.constructor` 的值，它指向了 `Father()` 函数

 `constructor` 仅供于记录实例是由哪个构造函数创建，而 `prototype` 才是用来记录属性和方法的地方



### 原型链

你可以把 `Father` 的 `prototype` 理解成为一个仓库，当 `father` 对象需要某些属性而自身也没有的时候，就会通过自己的 `__proto__` 上去寻找 也就是去 `Father` 的 `prototype` 中寻找，如果也没有找到就会去 `Object.protitype` 上寻找，因为 `Father.prototype` 本身也是一个对象，而它是通过 `Object` 构造函数创建的，所以 `Father.prototype.__proto__` 就是 `Object.prototype`，同理 `Object.prototype.__proto__` 就是 `null`,就这样一层层寻找形成的链路就叫原型链，最终找不到就会返回 `null`

```js
    console.log(father.__proto__ === Father.prototype);// true
    console.log(Father.prototype.__proto__ === Object.prototype);// true
    console.log(Object.prototype.__proto__ === null);// true
```





##  Promise

Promise是JavaScript中用于处理异步操作的一个关键概念。它代表了一个尚未完成但预期在将来完成的操作。使用Promise，可以避免所谓的“回调地狱”，即多层嵌套的回调函数，从而使代码更加清晰和易

```js
let nba = new Promise((resolve, reject) => {
    // 异步操作代码
    setTimeout(() => {
        resolve("操作成功");
    }, 1000);
    // reject('失败')
})
// .then 对应 resolve，.catch 对应 reject 还有个 .finally 无论成功失败都会执行 （根据情况加）
nba.then(res => console.log(res))
.catch(err => console.log(err)) // 成功
.finally(console.log('宝贝不管成功还是失败我都会调用'))

```

优势：解决了回调地狱，链式调用，更优雅的错误处理

```js
new Promise((resolve, reject) => {
    setTimeout(() => resolve(1), 1000);
})
.then(result => {
    console.log(result); // 输出 1
    return result * 2;
})
.then(result => {
    console.log(result); // 输出 2
    return result * 3;
})
.then(result => {
    console.log(result); // 输出 6
    return result * 4;
})
.catch(error => {
    console.log('捕获到错误：', error);
});
```

##  async/await

`async` 和 `await` 是建立在 Promise 之上的高级抽象，使得异步代码的编写和阅读更加接近于同步代码的风格

### Async 函数

```js
async function asyncFunction() {
  return "异步操作完成";
}
asyncFunction().then(value => console.log(value)); // 输出：异步操作完成
```

### Await 关键字

`await` 关键字只能在 `async` 函数内部使用,它可以暂停async函数的执行，等待 Promise 的解决（resolve），然后以 Promise 的值继续执行函数

```js
async function asyncFunction() {
let promise = new Promise((resolve, reject) => {
    console.log('promise开始执行');
    setTimeout(() => resolve("完成"), 1000)
    console.log('promise执行结束');
  });

  let result = await promise; // 等待，直到promise解决 (resolve)
  console.log('等待 await');// 这里要等上面完成才会执行 await 错误的话这里就不会继续执行了
  console.log(result); // "完成"
}
asyncFunction();
```


##  Generator
 
generator也是解决异步的一种方式，只要给一个函数关键字后面添加一个星号*，那么这个函数就被称之为生成器 `generator` 函数

```js
function* foo () {
    yield 'a'
    yield 'b'
    yield 'c'
    return 'ending'
}
let gen = foo() // 非执行，相当于new了一个实例对象，这就是*作用
console.log(gen.next());  // { value: 'a', done: false }
console.log(gen.next());  // { value: 'b', done: false }
console.log(gen.next());  // { value: 'c', done: false }
console.log(gen.next());  // { value: 'ending', done: true }
console.log(gen.next());  // { value: undefined, done: true }
```

### thunk

看个异步代码：

```js
function a (next) {
    setTimeout(() => {
        console.log('a');
        next()
    }, 1000)
}

function b (next) {
    setTimeout(() => {
        console.log('b');
        next()
    }, 500)
}

function c (next) {
    console.log('c');
    next()
}

function* g () {
    yield a
    yield c
    yield b
}

function run (fn) {
    let gen = fn()// gen.next 时就要开始调用上面函数了

    function next(err, data) {
        let result = gen.next(data) // yield a 在最前面最先执行 （这里讨论第一次运行时，下同）
        if (result.done) return  // yield a 时必然是 false
        result.value(next) // vale 的值 a 函数整体！！！ 随后又把自己传进行进行递归了 ！！！
    }

    next() // 执行 next 函数
}

run(g) // a c b
```

阮一峰结合 promise 版：

```js
function a () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('a');
            resolve()
        }, 1000)
    })
}

function b () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('b');
            resolve()
        }, 500)
    })
}

function* g () {
    yield a()
    yield b()
}

let gen = g()
let result = gen.next()

result.value.then(value => {
    gen.next()
})
```

### co （别人的模块）（node端）

```js
npm i co 

// 写法
var co = require('co')

function a () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('a');
            resolve()
        }, 1000)
    })
}

function b () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('b');
            resolve()
        }, 500)
    })
}

function* g () {
    yield a()
    yield b()
}

co(g).then(() => {
    console.log('generator执行完毕');
})

```

总结：

generator可以分段执行，可以暂停可以控制每个阶段的返回值
可以知道是否执行完毕可以借助 Thunk 和 co 处理异步
但是写法复杂

所以generator函数的意义就是为了打造async，await

## 生成器 

function* g(){} 生成器函数，调用后返回一个生成器对象

生成器函数执行后不会立即执行，而是返回一个生成器对象，通过调用生成器对象的next方法，可以执行生成器函数，直到遇到yield关键字，yield后面的值会作为next方法的返回值，yield关键字后面的代码会暂停执行，直到再次调用next方法

```js
function* nb() {
  yield Promise.resolve('真的牛逼')
  yield 1
  yield '2'
  yield [1, 2]
  yield { name: '天才' }
  yield () => { return '天才的诞生' }
  yield function () { return '疯子的诞生' }
}
// 实例化
let g = nb()
// 调用后返回值是个对象 value 就是定义到的东西 done 表示是否生成完毕所有
console.log(g.next()) // {value: Promise, done: false}
console.log(g.next())// {value: 1, done: false}
console.log(g.next())// {value: '2', done: false}
console.log(g.next())// {value: Array(2), done: false}
console.log(g.next().value)// {value: ..., done: false} value值是定义的对象可通过.value访问该对象
console.log(g.next().value())// {done: false, value: ƒ} 可以看到箭头函数 
console.log(g.next().value())// {done: false, value: ƒ} 尝试用.value调用定义的函数
console.log(g.next())// {value: undefined, done: true} done:true 时代表生成器所有东西都
```


## 迭代器

移步至 ts symbol类型篇
[此处前往](../ts-md/basis.md#symbol类型)




## 双层for循环内层中断外层

循环也是可以有名称的，如下

```js
loop:
for(let i = 0;i < 10; i++){
    for(let j = 0; j <5; j++){
        if(j == 3){
            console.log(j)
            break loop;
        }
        console.log('当前j是：',j)
    }
}
```


## 柯里化

将使用多个参数的函数转换成一系列使用一个参数的函数

思路：
- 1. 如果参数打到lenghth，直接计算结果
- 2. 如果参数没有达到length，就返回一个新的函数

```js
function sum(a,b,c){
    conslole.log(a+b+c)
}
function curry(fn){
    return function curried(...args){
        if(args.length >= fn.length){
            return fn.apply(this,args)
        }else{
            return function(...args2){
                return curried.apply(this,args.concat(args2))
            }
        }
    }
}

let _sum = curry(sum)
let functionA=_sum(1)
let functionB=functionA(2)
functionB(3) //6
_sum(1)(2)(3) //6
```

## 数组扁平化

就是将嵌套的数组变为一维数组

```js
let arr = [1, [2, [3, [4, 5]]]];

// 方法一：flat
const newArr = arr.flat(Infinity);
console.log(newArr); // [1, 2, 3, 4, 5]

// 手搓一个flat方法
Array.prototype.myFlat = function (n) { //必须是普通函数
    let flat =[]
    for(let item of this){ //this会指向当前的数组
        if(Array.isArray(item)){
            flat = flat.concat(item.myFlat()) //递归调用并将结果通过 concat 拼接
        }else{
            flat.push(item)
        }

    }
    return flat
}
console.log(arr.myFlat()) // [1, 2, 3, 4, 5]

// 方法二：toString + split (不推荐)
console.log(arr.toString().split(',')) // [ '1', '2', '3', '4', '5' ]

// 方法三：reduce()
function flatten(arr){
    return arr.reduce((pre,item)=>{
        return pre.concat(Array.isArray(item)? flatten(item):item);
    },[])
}
const newArr2 = flatten(arr);
console.log(newArr2);//[1, 2, 3, 4, 5]

// 方法四：解构
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
      arr = [].concat(...arr)  // [].concat(1, 2, [3, 4, [5]])  // [1, 2, 3, 4, [5]]
    }
    return arr
  }
const newArr3 = flatten(arr);
console.log(newArr3);
```
