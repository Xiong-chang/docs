

# 原型&原型链

## 构造函数创建对象

我们先使用构造函数创建一个对象：

```js
function Person() {

}
var person = new Person();
person.name = 'chenghuai';
console.log(person.name) // chenghuai
```
在这个例子中，Person 就是一个构造函数，我们使用 new 创建了一个实例对象 person。

## prototype

每个函数都有一个 `prototype` 属性，比如：

```js
function Person() {

}
// 虽然写在注释里，但是你要注意：
// prototype是函数才会有的属性
Person.prototype.name = 'chenghuai';

var person1 = new Person();
var person2 = new Person();

console.log(person1.name) // chenghuai
console.log(person2.name) // chenghuai
```
那这个函数的 `prototype` 属性到底指向的是什么呢？是这个函数的原型吗？
其实，函数的 `prototype` 属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型，也就是这个例子中的 `person1` 和 `person2` 的原型。
那什么是原型呢？你可以这样理解：每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。
用一张图表示构造函数和实例原型之间的关系：
 ![这是图片](/image/prototype.png)
这里用 Object.prototype 表示实例原型。

那么该怎么表示实例与实例原型，也就是 `person` 和 Person.`prototype` 之间的关系呢？

## proto

这是每一个JavaScript对象(除了 null )都具有的一个属性，叫__proto__，这个属性会指向该对象的原型。

```js
function Person() {

}
var person = new Person();

console.log(person.__proto__ === Person.prototype); // true
```
![这是图片](/image/prototype2.png)

既然实例对象和构造函数都可以指向原型，那么原型是否有属性指向构造函数或者实例呢？

## constructor

指向实例倒是没有，因为一个构造函数可以生成多个实例，但是原型指向构造函数是有的：`constructor`，每个原型都有一个 `constructor` 属性指向关联的构造函数

```js
function Person() {

}
console.log(Person === Person.prototype.constructor); // true
```
![这是图片](/image/prototype3.png)

所以，这里可以得到：
```js
function Person() {

}

var person = new Person();

console.log(person.__proto__ == Person.prototype) // true

console.log(Person.prototype.constructor == Person) // true

console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```

## 实例与原型

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

举个例子：
```js
function Person() {

}

Person.prototype.name = 'chenghuai';

var person = new Person();

person.name = 'huaicheng';
console.log(person.name) // huaicheng

delete person.name;
console.log(person.name) // chenghuai
```

在这个例子中，我们给实例对象 person 添加了 name 属性，当我们打印 `person.name` 的时候，结果自然为 `huaicheng`。
但是当我们删除了 person 的 name 属性时，读取 `person.name`，从 person 对象中找不到 name 属性就会从 person 的原型也就是 `person.__proto__` ，也就是 Person.prototype中查找，结果为 `chenghuai`。


## 原型的原型

如果在原型上还没有找到呢？原型的原型又是什么呢？

```js
var obj = new Object();
obj.name = 'chenghuai'
console.log(obj.name) // chenghuai
```
其实原型对象就是通过 Object 构造函数生成的，结合之前所讲，实例的 proto 指向构造函数的 `prototype` ，所以我们再更新下关系图：

![这是图片](/image/prototype4.png)

## 原型链

那 `Object.prototype` 的原型呢？

null，我们可以打印：

```js
console.log(Object.prototype.__proto__ === null) // true
```

然而 null 究竟代表了什么呢？

null 表示“没有对象”，即该处不应该有值。

所以 Object.prototype.__proto__ 的值为 null 跟 Object.prototype 没有原型，其实表达了一个意思。

所以查找属性的时候查到 Object.prototype 就可以停止查找了。

最后一张关系图也可以更新为：

![这是图片](/image/prototype5.png)

其中，蓝色为原型链

# 词法作用域和动态作用域

## 作用域

作用域是指程序源代码中定义变量的区域。

作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

JavaScript 采用词法作用域(`lexical scoping`)，也就是静态作用域。

## 静态作用域和动态作用域

因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。

而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();

// 结果是 ???
```

假设JavaScript采用静态作用域，让我们分析下执行过程：

执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

假设JavaScript采用动态作用域，让我们分析下执行过程：

执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

前面我们已经说了，JavaScript采用的是静态作用域，所以这个例子的结果是 1。

## 动态作用域

什么语言是动态作用域？

bash 就是动态作用域，不信的话，把下面的脚本存成例如 scope.bash，然后进入相应的目录，用命令行执行 bash ./scope.bash，看看打印的值是多少。

```js
value=1
function foo () {
    echo $value;
}
function bar () {
    local value=2;
    foo;
}
bar
```

