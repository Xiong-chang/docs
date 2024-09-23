# typescript 基础

## 类型

相比JavaScript，typescript拥有超级强大类型系统，包括但不限于：

- 基本类型：number、string、boolean、symbol、null、undefined、void
- 对象类型：object、array、tuple、enum、any、unknown、never
- 类型推断：自动推断类型
- 类型断言：手动指定类型
- 类型守卫：类型判断
- 类型别名：给类型起一个新名字
- 类型合并：多个类型合并成一个类型

## 基本类型

```ts
// 字符串类型
//普通声明
let a: string = '123'
//也可以使用es6的字符串模板
let str: string = `dddd${a}`

// 数字类型
let notANumber: number = NaN;//Nan
let num: number = 123;//普通数字
let infinityNumber: number = Infinity;//无穷大
let decimal: number = 6;//十进制
let hex: number = 0xf00d;//十六进制
let binary: number = 0b1010;//二进制
let octal: number = 0o744;//八进制s

// 布尔类型
let booleand: boolean = true //可以直接使用布尔值
let booleand2: boolean = Boolean(1) //也可以通过函数返回布尔值
// let createdBoolean: boolean = new Boolean(1)//报错 new Boolean() 返回的是一个 Boolean 对象 
let createdBoolean: Boolean = new Boolean(1) //这样就是正确的了

// 空值类型
// 代表该函数返回值为空
function voidFn(): void {
    console.log('test void')
}
// 也可以将 undefined 和 null 赋值给 void
let u: void = undefined
let n: void = null;

// null 和 undefined 与 void 的区别是 undefined 和 null 是所有类型的子类型
let u: undefined = undefined;//定义undefined
let n: null = null;//定义null
// undefined null 类型的变量，可以赋值给 string 类型的变量 void不可以
// !!! 注意严格模式下  null 不能 赋予 void 类型 （undefined可以）
// tsconfig.json
{
    "compilerOptions":{
        "strict": true // 开启严格模式
    }
}
```

## 任意类型

typescript 又名 anyscript 😏
，所以它允许我们声明任意类型的变量，但是这并不是一个好的实践，因为这样会失去typescript的类型检查功能

```ts
// any
let anys: any = '123'
// 声明变量的时候没有指定任意类型默认为any
let anys2;
anys = 123
anys2 = true

// unkown 比 any 更加严格 只能作为父类型， any 可以作为父类型和子类型
// 也就是不能把 unkown 类型的值赋值给其他类型的变量
let unkown: unknown = '123'
// let str: string = unkown // 报错

// 只能够赋值给 unknow 类型 和 any 类型
let unkown2: unknown = unkown // 不报错
let anys3: any = unkown // 不报错

// any 类型在在对象没有这个属性时去获取不会有报错提示
let anys4: any = { name: '123' }
console.log(anys4.age) // undefined

// unkown 类型在对象没有这个属性时去获取会有报错提示
let unkown5: unknown = { name: '123' }
console.log(unkown5.age) // 会在此处提示“unkown5”的类型为“未知”，打印结果为 undefined
```

## 接口和对象类型

接口就是关键字 `interface` ,用来给对象定义类型

```ts
// 定义的对象各个属性必须与接口定义的属性、类型保持一致
interface Person {
    a:string,
    b:string,
    d?:string, //?修饰符可以出现该属性也可以没有该属性
    readonly e:string, // readonly 设置只读属性
    f:()=>void, // 我是一个函数属性，并且没有返回值
    [key: string]: any; // 索引签名也就是 任意属性 定义的属性必须是这里属性的子集 也就是 any 的子集
}
const person:Person  = {
    a:"213",
    // b:"别把我落下", //不能少哦
    c:"我是新来的",
    d:"我可有可无", 
    e:"我只能被读取不可被修改",
    f:()=>{console.log('我是一个没有返回值的函数')},
    g1: "我是任意属性来的",
    g2: 123,
}

// 遇到重名的 interface 会自动合并
interface Person {
    c:string
}
```

## 数组类型

使用 `[]` 来定义数组

```ts
//类型加中括号
let arr:number[] = [123]; //数字类型的数组
//这样会报错定义了数字类型出现字符串是不允许的
// let arr:number[] = [1,2,3,'1']
//操作方法添加非指定类型的也是不允许的
// arr.unshift('1')

var arr2: string[] = ["1", "2"]; //字符串类型的数组
var arr3: any[] = [1, "2", true]; //任意类型的数组

// 数组泛型
let arr4: Array<number> = [1, 2, 3]

// 接口表示数组 一般用来描述类数组 
interface NumberArray {
    //只要索引的类型是数字时，那么值的类型必须是数字
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];

// 多维数组
let arr5: number[][] = [[1, 2], [3, 4]];

// arguments 数组
function Arr(...args:any): void {
    console.log(arguments) 
    //ts内置对象IArguments 定义
    let arr:IArguments = arguments //这里如果用 number[]会报错，arguments 是类数组不是真数组
}
Arr(111, 222, 333)
 
//其中 IArguments 是 TypeScript 中定义好了的类型，它实际上就是：
interface IArguments {
[index: number]: any;
length: number;
callee: Function;
}

// any[]
let list: any[] = [1, true, "free", false];//就很爽回归到js了属于是
```

## 元组

元组类型（变异数组）允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

```ts
let arr:[number,string] = [1,'string']
let arr2: readonly [number,boolean,string,undefined] = [1,
true,'sring',undefined]

// 当赋值或访问一个已知索引的元素时，会得到正确的类型
let arr: [number, string] = [1, 'string']
console.log(arr[0].length) // 类型“number”上不存在属性“length”
console.log(arr[1].length) //6

// 元组类型还可以支持自定义名称和变为可选的
let arr3:[x:number,y?:boolean] = [1]

// 越界元素 给上面 arr 添加没有声明的类型
arr.push(true) //类型“boolean”的参数不能赋给类型“string | number”的参数 可以看到变成了联合类型
```

## 函数扩展

```ts
// 参数传入时必须一致
//注意，参数不能多传，也不能少传 必须按照约定的类型来 
// ?可选参数 =默认值
const fn = (name: string, age:number=24,nb?:boolen,): string => {
    return name + age
}
fn('张三',18)

// 接口定义函数
interface Add {
    //定义参数 num 和 num2  ：后面定义返回值的类型
    (num:  number, num2: number): number
}
const fn: Add = (num: number, num2: number): number => {
    return num + num2
}
fn(5, 5)
 
//  定义形参的类型
interface User{
    name: string;
    age: number;
}
function getUserInfo(user: User): User { //返回值也是 User定义的
  return user
}
console.log(getUserInfo({name:'天才',age:18}))

// 定义剩余参数
const fn = (array:number[],...items:any[]):any[] => {
       console.log(array,items)
       return items
}
let a:number[] = [1,2,3]
fn(a,'4','5','6')

// 函数重载 函数名字相同但参数变了，返回的类型可以相同也可以不同
// 定义两个函数重载签名
function good(name: string): string
function good(age: number): number
// 此处实现函数 
function good(param: string | number): any { // 返回值类型不同可以定义成 any
  if (typeof param === 'string') {
    return `hello ${param}`
  } else {
    return param
  }
}
console.log(good('天才'));
console.log(good(24));
```

## 联合类型|交叉类型|类型断言

### 联合类型

实际上在上面的例子里已经有了联合类型，这里写个别的例子

```ts
//例如我们的手机号通常是13XXXXXXX 为数字类型 这时候产品说需要支持座机
//所以我们就可以使用联合类型支持座机字符串
let myPhone: number | string  = '010-820' //可以接收纯数字也可以接受字符串
myPhone = 12345646
console.log(myPhone);
//当然了你给它赋值其他类型就会报错了
// myPhone = true //报错
```

### 交叉类型

交叉类型就是将多个类型合并成一个类型，使用 `&` 符号

```ts
// 定义两个接口
interface A {
    name: string;
}
interface B {
    age: number;
}
// 合并类型
const obj: A & B = {
    name: "张三",
    age: 18
}
```

### 类型断言

类型断言可以用来告诉编译器变量的实际类型，可以绕过编译器的类型检查，但是它不会真的改变变量的类型,滥用类型断言可能会导致运行时错误

```ts
// 类型断言有两种写法 (只能断言成联合类型中的一种)
let someValue: any = "this is a string";
//第一种方式
let strLength: number = (someValue as string).length; 
//第二种方式
let strLength2: number = (<string>someValue).length; 


// as const 断言字面量
// 普通类型  效果相同
const nb = '蜗牛'
nb='牛蛙'//无法修改

let bnb = '瓜牛' as const
bnb = '牛蛙' //无法修改

// 引用类型 数组
let a1 = [10, 20] as const;
const a2 = [10, 20];
a1.unshift(30); // 错误，此时已经断言字面量为[10, 20],数据无法做任何修改
a2.unshift(30); // 通过，没有修改指针

// 对象
const obj = {
    name: '张三',
}
const obj2 = {...obj, age: 18} as const //这样 obj2 的类型就变成了 readonly {name: string, age: number}
console.log(obj2.name); //张三
// obj2.name = '李四' //无法为“name”赋值，因为它是只读属性
```

## 内置对象

- ECMAScript 的内置对象
Boolean、Number、string、RegExp、Date、Error
```ts
let b: Boolean = new Boolean(1)
console.log(b)
let n: Number = new Number(true)
console.log(n)
let s: String = new String('哔哩哔哩关注小满zs')
console.log(s)
let d: Date = new Date()
console.log(d)
let r: RegExp = /^1/
console.log(r)
let e: Error = new Error("error!")
console.log(e)
```

- DOM 和 BOM 的内置对象
Document、HTMLElement、Event、NodeList 等
```ts
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
//读取div 这种需要类型断言 或者加个判断应为读不到返回null
let div:HTMLElement = document.querySelector('div') as HTMLDivElement
document.addEventListener('click', function (e: MouseEvent) {
});
//dom元素的映射表
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "applet": HTMLAppletElement;
    "area": HTMLAreaElement;
    "article": HTMLElement;
    "aside": HTMLElement;
    "audio": HTMLAudioElement;
    "b": HTMLElement;
    "base": HTMLBaseElement;
    "bdi": HTMLElement;
    "bdo": HTMLElement;
    "blockquote": HTMLQuoteElement;
    "body": HTMLBodyElement;
    "br": HTMLBRElement;
    "button": HTMLButtonElement;
    "canvas": HTMLCanvasElement;
    "caption": HTMLTableCaptionElement;
    "cite": HTMLElement;
    "code": HTMLElement;
    "col": HTMLTableColElement;
    "colgroup": HTMLTableColElement;
    "data": HTMLDataElement;
    "datalist": HTMLDataListElement;
    "dd": HTMLElement;
    "del": HTMLModElement;
    "details": HTMLDetailsElement;
    "dfn": HTMLElement;
    "dialog": HTMLDialogElement;
    "dir": HTMLDirectoryElement;
    "div": HTMLDivElement;
    "dl": HTMLDListElement;
    "dt": HTMLElement;
    "em": HTMLElement;
    "embed": HTMLEmbedElement;
    "fieldset": HTMLFieldSetElement;
    "figcaption": HTMLElement;
    "figure": HTMLElement;
    "font": HTMLFontElement;
    "footer": HTMLElement;
    "form": HTMLFormElement;
    "frame": HTMLFrameElement;
    "frameset": HTMLFrameSetElement;
    "h1": HTMLHeadingElement;
    "h2": HTMLHeadingElement;
    "h3": HTMLHeadingElement;
    "h4": HTMLHeadingElement;
    "h5": HTMLHeadingElement;
    "h6": HTMLHeadingElement;
    "head": HTMLHeadElement;
    "header": HTMLElement;
    "hgroup": HTMLElement;
    "hr": HTMLHRElement;
    "html": HTMLHtmlElement;
    "i": HTMLElement;
    "iframe": HTMLIFrameElement;
    "img": HTMLImageElement;
    "input": HTMLInputElement;
    "ins": HTMLModElement;
    "kbd": HTMLElement;
    "label": HTMLLabelElement;
    "legend": HTMLLegendElement;
    "li": HTMLLIElement;
    "link": HTMLLinkElement;
    "main": HTMLElement;
    "map": HTMLMapElement;
    "mark": HTMLElement;
    "marquee": HTMLMarqueeElement;
    "menu": HTMLMenuElement;
    "meta": HTMLMetaElement;
    "meter": HTMLMeterElement;
    "nav": HTMLElement;
    "noscript": HTMLElement;
    "object": HTMLObjectElement;
    "ol": HTMLOListElement;
    "optgroup": HTMLOptGroupElement;
    "option": HTMLOptionElement;
    "output": HTMLOutputElement;
    "p": HTMLParagraphElement;
    "param": HTMLParamElement;
    "picture": HTMLPictureElement;
    "pre": HTMLPreElement;
    "progress": HTMLProgressElement;
    "q": HTMLQuoteElement;
    "rp": HTMLElement;
    "rt": HTMLElement;
    "ruby": HTMLElement;
    "s": HTMLElement;
    "samp": HTMLElement;
    "script": HTMLScriptElement;
    "section": HTMLElement;
    "select": HTMLSelectElement;
    "slot": HTMLSlotElement;
    "small": HTMLElement;
    "source": HTMLSourceElement;
    "span": HTMLSpanElement;
    "strong": HTMLElement;
    "style": HTMLStyleElement;
    "sub": HTMLElement;
    "summary": HTMLElement;
    "sup": HTMLElement;
    "table": HTMLTableElement;
    "tbody": HTMLTableSectionElement;
    "td": HTMLTableDataCellElement;
    "template": HTMLTemplateElement;
    "textarea": HTMLTextAreaElement;
    "tfoot": HTMLTableSectionElement;
    "th": HTMLTableHeaderCellElement;
    "thead": HTMLTableSectionElement;
    "time": HTMLTimeElement;
    "title": HTMLTitleElement;
    "tr": HTMLTableRowElement;
    "track": HTMLTrackElement;
    "u": HTMLElement;
    "ul": HTMLUListElement;
    "var": HTMLElement;
    "video": HTMLVideoElement;
    "wbr": HTMLElement;
}
```

- 定义Promise
不指定返回类型 TS 是无法推断出来的，所以需要手动指定类型

```ts
function promise():Promise<number> {
  return new Promise<number>((resolve, reject) => {
    resolve(1)
  })
}
```

## class类

### 普通定义

```ts
class Person {
  name: string // 默认修饰符是 public 也就是可以自由访问
  age: number = 0 //在类中定义了不使用也会报错可以给个默认值来解决
  // private 修饰符 的变量只能在内部访问
  private sex: string
  //protected 修饰符 只能在内部和继承的子类中访问
  protected some: any
  // static 定义的不能用this访问 只能用类名访问
  static nb: string
  constructor(name: string, age: number, sex: string, some: any) {
    this.name = name,
      // this.age = age
      this.sex = sex
    this.some = some
    // this.nb=nb //static定义的
  }
  // 如果是两个 static 定义的函数互相可以通过this调用
  static fun() {
    return this.hh()
  }
  static hh() {
    return 'hh'
  }
}
class Man extends Person {
  constructor() {
    super('牢大', 24, '男', '牢大的some')
    console.log(this.some)
  }
  create() {
    console.log(this.some)
  }
}
let me = new Person('天才', 18, '男', '123')
let man = new Man()

console.log(me);
console.log(me.name);
// console.log(me.sex); //怪了虽然报错但仍然能打印出来
// console.log(me.nb)
console.log(Person.nb)// 只能用 Person来访问

console.log(man);
console.log(man.name);
// console.log(man.sex);
// console.log(man.some);
```

### 用 interface 定义类

interface 定义类 使用关键字 `implements` ,后面跟interface的名字多个用逗号隔开 继承还是用 `extends`



```ts
interface PersonClass {
    get(type: boolean): boolean
}
 
interface PersonClass2{
    set():void,
    asd:string
}
 
class A {
    name: string
    constructor() {
        this.name = "123"
    }
}
 
class Person extends A implements PersonClass,PersonClass2 {
    asd: string
    constructor() {
        super()
        this.asd = '123'
    }
    get(type:boolean) {
        return type
    }
    set () {
 
    }
}
```

### 抽象类

用 `abstract` 关键字,如果你写的类实例化之后毫无用处此时我可以把他定义为抽象类 额...

```ts
// 定义一个抽象类
abstract class Animal {
  // 抽象方法
  abstract makeSound(): void;

  // 具体方法
  move(): void {
    console.log("Moving...");
  }
}

// 定义一个继承自抽象类的子类
class Dog extends Animal {
  // 实现抽象方法 不实现会报错
  makeSound(): void {
    console.log("Bark");
  }
}

// 不能直接实例化抽象类
// const animal = new Animal(); // 错误: 无法创建抽象类的实例。

// 实例化子类
const dog = new Dog();

// 调用子类的方法
dog.makeSound(); // 输出: Bark
dog.move(); // 输出: Moving...
```

## 枚举类型

通过关键字 `enum` 定义枚举类

### 数字枚举

会自行默认从 0 开始增长

```ts
enum Types {
  a, b, c 
}
console.log(Types.a, Types.b, Types.c); // 0 1 2

enum Types {
  a, b = 3, c //如果设置了默认值 那么该值后面的会从改值自行增长
}
console.log(Types.a, Types.b, Types.c); // 0 3 4
```

### 字符串枚举

每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化

```ts
enum Types{
   Red = 'red',
   Green = 'green',
   BLue = 'blue'
}
```

### 异构枚举

混合字符串和数字

```ts
enum Types {
  NB = "NB",
  YES = 666,
}
```

### 接口枚举

遵循规则使用就行了，混合使用

```ts
enum Types {
  yyds,// 默认 0 自增
  fl = '佛了' // 字符串没有自增
}
interface A {
  red: Types.yyds
}

let obj: A = {
  red: Types.yyds // 和接口 A 保持类型一致
}

console.log(obj.red);// 0
```

### const 枚举

用 const 声明编译后会是个变量，普通枚举编译后会是个对象

```ts
const enum Types {
  NB = "NB",
  YES = 666,
}
```

### 反向映射

可以通过 key 读取 value，也可以通过 value 读取 key

```ts
enum Types {
  success // 默认值从 0 开始递增
}
let success: number = Types.success
let key = Types[success]
console.log(success);// 0
console.log(key);// success
```

## 类型推论

明了一个变量但是没有定义类型,TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论

```ts
// 申明不赋值 会推断成 any
let nb;

// 声明赋值没有类型 会根据值自己推断
let nb2 = 1;
let nb3 = '挺牛逼';
let nb4 = true;
let nb5 = [1, 2, 3];
let nb6 = { a: 1, b: 2 };
```

##  类型别名

就是给给定的类型起个别的名字

与 interface 的区别：
- interface 可以继承，type 只能通过 & 合并
- type 可以定义联合类型以及使用一些操作符，interface 不行
- interface 遇到重名会合并，type 不行

```ts
type nb = string | number | boolean
let a: nb = '123'
let b: nb = 123
let c: nb = true


// 左边值会作为右边类型的子集 属性由上到下
// 1. any unknow
// 2.Object
// 3.Number String Boolean
// 4.number string boolean
// 5. 1 'test' true
// 6.never
type a = 1 extends number ? 1 : 0 //1
type a = 1 extends Number ? 1 : 0 //1
type a = 1 extends Object ? 1 : 0 //1
type a = 1 extends any ? 1 : 0 //1
type a = 1 extends unknow ? 1 : 0 //1
type a = 1 extends never ? 1 : 0 //0
```

## never类型

表示的是那些永不存在的值的类型。例如，never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型

与 void 区别：
- void 本身不会出错只是没有返回值，never 会抛出异常也没有返回值
- never 是所有类型的子类型，可以赋值给任何类型，但是除了 never 本身
- 在联合类型中会被移除
```ts
// 鼠标悬浮在 A 可以看到 没有 never
type A = void | number | never

// 因为必定抛出异常，所以 error 将不会有返回值
function error(message: string): never {
    throw new Error(message);
}
 
// 因为存在死循环，所以 loop 将不会有返回值
function loop(): never {
    while (true) {
    }
```

应用场景：

```ts
// 逻辑兜底
function handleMessage(message: string | number | boolean) {
  switch (typeof message) {
    case 'string':
      break;
    case 'number':
      break;
    case
      'boolean':
      break;
    default: // 进入这种情况时就抛出异常
      const exhaustiveCheck: never = message;
      throw new Error(`Unknown message type: ${exhaustiveCheck}`);
  }
}
```

## symbol类型

可以传递参做为唯一标识 只支持 string 和 number类型的参数 （ES6的详见js基本数据类型）

```ts
// 传入的都是 a 但并不是同一个
let a: symbol = Symbol('a')
let b: symbol = Symbol('a')
console.log(a === b); // false

// 如何让两个 symbol 相等
// 使用 symbol.for
let a: symbol = Symbol.for('a')
let b: symbol = Symbol.for('a')
console.log(a === b); // true

// 使用symbol定义的属性，是不能通过如下方式遍历拿到的
const symbol1: symbol = Symbol('110')
const symbol2: symbol = Symbol('119')
const obj1 = {
  [symbol1]: 'z张三',
  [symbol2]: '李四',
  age: 24,
  sex: '男'
}

// 1. for in 遍历
for (const key in obj1) {
  console.log(key) // 没有读取到 symbol 类型的key
  console.log('-----');
}
// 2. Object.keys 遍历
Object.keys(obj1)
console.log(Object.keys(obj1))
// 3. getOwnPropertyNames
console.log(Object.getOwnPropertyNames(obj1))
// 4. JSON.stringfy
console.log(JSON.stringify(obj1))

// 下面方法可以读取到
// 1. 拿到具体的symbol 属性,对象中有几个就会拿到几个
Object.getOwnPropertySymbols(obj1)
console.log(Object.getOwnPropertySymbols(obj1))
// 2. es6 的 Reflect 拿到对象的所有属性
Reflect.ownKeys(obj1)
console.log(Reflect.ownKeys(obj1))
```

### Symbol.iterator

用法与生成器一样也有 `next` 方法

`Symbol.iterator` 是一个内置的 Symbol 值，它是遍历器生成函数，也称为迭代器接口。在 数组、set、map、函数的arguments伪数组、querySelectorAll获取的伪数组上，都存在这个 `Symbol.iterator`

这里用 `map` 和 `set` 来举例:

```ts
// 创建一个set和一个map
let set: Set<number> = new Set([1, 2, 3]);// set能够去重只支持数字和字符串
let map: Map<string, number> = new Map([['a', 1], ['b', 2]]);

// 可以这样使用
console.log(set[Symbol.iterator]().next());// {value: 1, done: false}
console.log(map[Symbol.iterator]().next());// {value: Array(2), done: false}

// 写一个方法来遍历 set
// 方便演示使用any类型
const each = (value: any) => {
  let syIt: any = value[Symbol.iterator]();// 获取值 不要忘了 iterator 要调用一下
  let next: any = { done: false } // 是否迭代完毕
  while (!next.done) { // 没有迭代完就一直循环 直到 done:true
    next = syIt.next() // 当前迭代状态赋值给写死next来进行下一轮的判断
    if (!next.done) {
      console.log(next.value)
    }
  }
}
each(set) // 1 2 3
each(map)// ['a', 1] ['b', 2]

// 实际上 for of 方法就是这样的运行逻辑 cool 我们竟然实现了for of
for (const item of set) {
  console.log(item)
}

for (const item of map) {
  console.log(item)
}
// 但是对象 无法使用 for of
interface Person {
  name: string,
  title: string
}
let obj: Person = { name: '我焯', title: '天才' }
for (const item of obj) { //类型“Person”必须具有返回迭代器的 "[Symbol.iterator]()" 方法
  console.log(item)
}
```

---


对象如何使用 for of 

```ts
// 事实上数组的解构也是调用了 iterator 
let [a,b,c] = [1,2,3]
console.log(a,b,c) // 1 2 3

let a =[4,5,6]
let a1 = [...a]
console.log(a1) // [4,5,6]

// 所以可以用这样的思维来写一个骚操作
// 手动实现对象使用 for of
let obj = {
  max: 5,
  current: 0,
  [Symbol.iterator]() { // 手动给对象搓一个不就好了
    return {
      max: this.max,
      current: this.current,
      next() { // 需要返回一个 next 方法 来进行下一次调用
        if (this.current == this.max) {
          return {
            value: '迭代结束了',
            done: true
          }
        } else {
          return {
            value: this.current++, // 进行下一次迭代
            done: false
          }
        }
      }
    }
  }
}
for (const item of obj) {
  console.log(item); // 0 1 2 3 4  迭代了5次
}
// 给这对象用一下数组的解构
let nb = [...obj] // [0, 1, 2, 3, 4] 牛逼哇我靠
console.log(nb);

// ！！！对象解构并不会调用 iterator 所以这里解构出来的就是对象本身
let nb2 = { ...obj }
console.log(nb2);//{max: 5, current: 0, Symbol(Symbol.iterator): ƒ}
// 如果猜的不错的话 对象的解构就是浅拷贝
```

## 泛型

灵活的动态类型

```ts
// T 来表示传入值的类型
function nb<T>(a: T, b: T):Array<T> {
  return [a,b]
}
nb(1, 2) // 传入数字也可以用
nb('哈哈', '牛逼') // 传入字符串也可以用

// type
type A<T> = string | number | T
let a: A<number> = 1;
let a2: A<string> = '天才'
let a3: A<boolean> = true
let a4: A<object> = { title: 'nb' }
let a5: A<number[]> = [1, 2, 3]
let a6: A<undefined> = undefined
console.log(a, a2, a3, a4, a5, a6);


// interface
interface Nb<T> {
  name: T,
  age: T
}

let nb: Nb<string> = {
  name: '哈哈',
  age: '12'
}
console.log(nb);

let nb2: Nb<number> = {
  name: 666,
  age: 999
}
console.log(nb2);

// 可以有多个泛型 也可以有默认值 举一反三
function nb2<T, K = number>(a: T, b: K): Array<T | K> {
  return [a, b]
}
console.log(nb2(1, '哈哈')); // [1, '哈哈'] ts自己做了类型推断没有使用默认值
console.log(nb2('哈哈', 1)); // ['哈哈', 1]
```

常用在接口返回值:

```ts
// 封装一个get方法
const axios = {
  get<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      let xml: XMLHttpRequest = new XMLHttpRequest;
      xml.open('GET', url);
      xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
          // 这里用了类型断言欺骗一下不然一直报错
          resolve({ name: '牛逼成了', age: 24, wc: '666' } as T) 
        } 
      }
      xml.send(null)
    })
  }
}
// 假如我们有两个已知的类型和其他未知的数量的返回值
interface Data {
  name: string,
  age: number,
  [val: string]: any, // 用索引签名解决未知的
}
axios.get<Data>('666').then(res => {
  console.log(res.age);
  console.log(res.name);
})
```

### 泛型约束

如名 就是拿来约束的

```ts
function sum<T>(a:T,b:T) {
  return a+b //运算符“+”不能应用于类型“T”和“T”
}
// 是为了防止出现这样的情况
sum(undefined,undefined)

// 使用泛型约束
// 
function sum<T extends number>(a: T, b: T) {
  return a + b  //正常了
}
sum(1, 2)
// sum(undefined,undefined) // 类型“undefined”的参数不能赋给类型“number”的参数
// sum('1', '3')// 类型“string”的参数不能赋给类型“number”的参数

// 结合 insterface
interface Len {
   length:number
}
function getLegnth<T extends Len>(arg:T) {
  return arg.length
}
getLegnth<string>('123')
// getLegnth<number>(123) // 类型“number”不满足约束“Len” 数字没有length属性
```

### keyof

keyof 是一个关键字，用于获取一个类型的所有公共属性名组成的联合类型。它的主要用途是帮助你编写更安全和更灵活的代码，特别是在处理对象属性和类型检查时

```ts
let obj = {
  name: '天才',
  age: 24
}
// keyof 会把对象的key推断成联合类型
type  key =keyof typeof obj; // type key = "name" | "age"


// 把 K 通过 keyof 和 T 联合 解决下面，类型“K”无法用于索引类型“T”
// 好我们梳理一下，T是继承自object的所以 T就是对象类型
// 然后通过 keyof 把的对象的 key 提出来 组成了一个联合类型 在这里就是 name | age 
// 然后把这个联合类型继承给 形参 key
// 那么形参 key 也就能够安全的访问到 T 的属性了 而不会超出这个范围 
function nb<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
console.log(nb(obj, 'name'));// 天才
console.log(nb(obj, 'sb'));// 类型“"sb"”的参数不能赋给类型“"name" | "age"”的参数
```

利用这个方法可以实现一个工具

```ts
// 我要在这个接口里全部加上可选 ?
interface Data {
  name: string,
  age: number
  sex: string,
  hobby: string,
  addres: string
  phone: number | string
}

type Options<T extends object> = {
  // 利用keyof会遍历的特性 把每个属性都重写
  // 这里泛型马上回接收 Data 对象
  // 用 keyof 把 Data 的属性名剥离出来
  // 再用这个剥离的key访问T对象该key的值
  [key in keyof T]?: T[key] // 加个 ? 就实现了我们的需求
}

type B = Options<Data>
// 此时 B 就如下 undefined是类型推断自己加进去的
//   type B = {
//     name?: string | undefined;
//     age?: number | undefined;
//     sex?: string | undefined;
//     hobby?: string | undefined;
//     addres?: string | undefined;
//     phone?: string | number | undefined;
// }
let nb: Data = { //会提示缺少类型
  name: '天才'
}
let nb2: B = { // 因为 ? 所以不会有提示
  name: '天才'
}
```

## 命名空间

通过 `namespace` 关键字，在其内部的变量方法在没有进行导出时，外部是无法访问的,支持多层嵌套（常在跨端时使用）

```ts
namespace Test {
  let a = '牛逼'
  export let b = '不牛逼'

  export namespace Test2 {
    let c = '哇靠'
    export let d = '太帅了'
  }
}

console.log(Test.a); // 访问不到
console.log(Test.b); // 可以访问
console.log(Test.Test2.c);// 访问不到
console.log(Test.Test2.d);// 可以访问

// 如果将 Test 导出，其他文件支持将它的引入
import { Test } from './xxx文件'
// 也可以赋值给其他变量
let test = Test.a
console.log(Test.b); // 可以访问
console.log(test); // 同上
```

## 声明文件 declare  

使用第三方库会经常遇到无法找到 xxx的声明文件的错误，官方提供了声明文件，可以通过 `npm install @types/node -D` 进行下载，但如果没有提供，就需要手动创建一个 d.ts 文件

```ts
declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明（含有子属性的）全局对象
interface 和 type 声明全局类型
/// <reference /> 三斜线指令
```

按照上面的规则我们来试着写一个 express 的声明文件

```ts
// index.ts

import express from './express' //引入express

const app = express()

const router = express.Router()

app.use('/api', router)
 
router.get('/list', (req, res) => {
    res.json({
        code: 200
    })
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})

// express.d.ts
declare module 'express' {
  // Router里的方法如get
  interface Router{
    get(path:string,callback:(req:any,res:any)=>void):void
  }
  // app的
  interface App{
    use(path:string,router:any):void
    listen(port:number,callback?:()=>void)
  }
  // express()
  interface Express {
    ():App //
    Router():Router
  }
  const express:Express 
  export default express
}
// 这样就可以正常使用了
// 也可以扩展一些别的东西，这样就会有提示
declare var a:number
declare var b:string
declare function name(params:any){
}
```

## Mixins 混入

合并，把两个类合并成一个类，可以理解为类的继承，但与继承不同的是，混入可以混入多个类

```ts
// 对象混入
interface Name {
  name: string
}
interface Age {
  age: number
}
interface Sex {
  sex: string
}
let people1: Name = { name: '天才' }
let people2: Age = { age: 18 }
let people3: Sex = { sex: '男' }

// 1.扩展运算符合并 （浅拷贝）
let people = { ...people1, ...people2, ...people3 }
console.log(people)

// 2.Object.assign (ES6的) （浅拷贝）
let people4 = Object.assign(people1, people2, people3)
console.log(people4)

// 3.structureClone() （需要node18以上谷歌浏览器90以上） （深拷贝）
console.log(structuredClone(people));


// 类混入
// 像插件一样将类混入进去
class Logger { // 待注入的对象
  log(msg: string) {
    console.log(msg)
  }
}
class HTML { // 待注入的对象
  render() {
    console.log('render');
  }
}
class App { // 主对象
  run() {
    console.log('run');
  }
}
// 构造函数类型
type Custructor<T> = new (...args: any[]) => T
//需要写一个函数来实现
function pluginMinxins<T extends Custructor<App>>(Base: T) {
  return class extends Base {
    // 注入其他方法
    private Logger = new Logger()
    private HTML = new HTML()

    constructor(...args: any[]) {
      super(...args)
      // 在这里声明注入的方法
      this.Logger = new Logger()
      this.HTML = new HTML()

    }
    // 原来的run方法，如果想调用其他类里的方法就要注入进来
    run() {
      // 这里就能调用这些注入的方法了
      this.Logger.log('run')
      this.HTML.render()
    }
    // 也可以提供新的方法并且内部也可以代用上面注入的方法
    add() {
      this.Logger.log('add')
    }
  }
}
// 使用 pluginMinxins 函数
const EnhancedApp = pluginMinxins(App);
const app = new EnhancedApp();
app.run(); // 输出: run, render
app.add(); // 输出: add
```

## 装饰器 Decorater

是一种特殊类型的声明，可以附加到类声明、方法、访问器、属性或参数上。装饰器使用 @expression 的形式，其中 expression 必须是一个函数，该函数在运行时被调用，并带有关于被装饰的声明的信息

必须在 tsconfig.json 文件中进行配置

```ts
// 将这两项打开
"experimentalDecorators": true,
"emitDecoratorMetadata":true
```

### 类装饰器 ClassDecorator

类装饰器应用于类构造函数，可以用来监视、修改或替换类定义

```ts
// 装饰器函数
const sealed: ClassDecorator = (constructor: Function) => {
  // 可以在不破坏类的源码情况下增加属性和方法
  // 在实例化的时候会自动调用这里面的内容
  constructor.prototype.nb = '我是牛逼我是新添加的'
  constructor.prototype.fn = () => {
    console.log('我是憨憨');
  }
  // 下面两项会密封对象 精致添加属性和方法到construct和prototype上
  // Object.seal(constructor);
  // Object.seal(constructor.prototype);
}

@sealed // 用@声明装饰器函数
class Greeter {
  // ...... 
}

const hh = new Greeter() as any //为了方便演示用断言成any
// sealed(Greeter) // @语法不支持可以这样写 要在声明 class 后书写

console.log(hh.constructor.prototype);
hh.fn()
console.log(hh.nb);
```

### 装饰器工厂

它返回一个函数，这个函数才是真正的装饰器。装饰器工厂的主要用途是允许你在应用装饰器时传递参数，从而使装饰器更加灵活和可配置

```ts
// 装饰器工厂传参
const sealed = (name: string) => { // 这里参数是 @sealed 传递的
  const fn: ClassDecorator = (constructor: Function) => {
    constructor.prototype.nb = name
    constructor.prototype.fn = () => {
      console.log('我是憨憨');
    }
  }
  return fn // 用闭包来保证 name 能被获取到
}

@sealed('你是天才')
class Greeter {
  // ...... 
}

const hh = new Greeter() as any
// sealed(Greeter) // @语法不支持可以这样写 要在声明 class 后书写

console.log(hh.constructor.prototype);
hh.fn()
console.log(hh.nb);
```

### 方法装饰器 MethodDecorator

方法装饰器可以用来监视、修改或替换方法定义，在类的方法声明之前声明，并且可以访问和修改方法的属性描述符

```ts
// 这里就是方法装饰器函数
const Get = (url: string): Function => {
  const fn: MethodDecorator = (target:Object, propertyKey:string | symbol, descriptor: PropertyDescriptor) => { //三个参数 目标对象、属性键和属性描述符
    console.log(target, propertyKey, descriptor);

    fetch(url).then(res => res.json()).then(res => {
      descriptor.value(res)
    })
  }
  return fn
}

class Greeter {
  @Get('https://v1.hitokoto.cn') //方法装饰器在这里
  getList(data: any) { //接口请求的返回值会在在这里接收
    console.log(data);
  }
}

const hh = new Greeter() as any
```

### 参数装饰器 ParameterDecorator 

顾名思义就是参数的装饰器... 

```ts
import 'reflect-metadata'

// 通过参数选择器将上面接口返回值的 hitokoto 给剥离出来 配合 reflect-metadata 库
const Get = (url: string): Function => {
  const fn: MethodDecorator = (target, propertyresult: any, descriptor: PropertyDecorator) => { //三个参数 目标对象、属性键和属性描述符
    const key = Reflect.getMetadata('nb', target)
    console.log(key);

    fetch(url).then(res => res.json()).then(res => {
      descriptor.value(res ? res[key] : '')
    })
  }
  return fn
}
const Resault = (): Function => {
  const fn: ParameterDecorator = (constructor, key, index) => { // index是 该参数在函数参数列表中的索引，前两个和方法装饰器的形参一样
    // 使用 Reflect 库的defineMetadata 保存一下
    Reflect.defineMetadata('nb', 'hitokoto', constructor)
  }
  return fn
}

class Greeter {
  @Get('https://v1.hitokoto.cn')
  getList(@Resault() data: any) { //接口请求的返回值会在在这里接收
    console.log(data);
  }
}

const hh = new Greeter() as any
```

### 属性装饰器 PropertyDecorator

用的不多

```ts
const Name: PropertyDecorator = (target: Object, propertyKey: string | symbol) => {
  console.log(target, propertyKey);
}

class Greeter {
  @Name
  nb: string
  constructor() {
    this.nb = '逆时针牛逼'
  }
}

const hh = new Greeter() as any
```

## 发布订阅模式

vue2的eventbus，electron的ipcMain和ipcRenderer，node的eventemitter，DOM2事件模型等等都是基于发布订阅模式实现的如 addEventListener removeEventListener


```ts
// 自定义事件 （订阅中心）
const e = new Event('add')
const add = () => {
  console.log('add触发了')
}
// 监听器
document.addEventListener('add', add, {
  once: true // 开启这个就只会触发一次
})
// 派发器
document.dispatchEvent(e)
document.dispatchEvent(e)
document.dispatchEvent(e)
// 当然了也可以移除
document.removeEventListener('add', add)
```

### 手写实现发布订阅

```ts
// 实现 once on emit off 订阅中心Map<事件名称,[Function]订阅者合集>

interface NB{
    events:Map<string,Function[]>,// 事件中心
    once:(event:string,callback:Function)=>void, // 只触发一次
    on:(event:string,callback:Function)=>void, // 监听事件
    emit:(event:string,...args:any[])=>void, // 派发事件
    off:(event:string,callback:Function)=>void // 删除监听器
}

class Emitter implements NB{
    // 初始化结构
    events:Map<string,Function[]>
    constructor(){
        this.events=new Map()
    }
    // 初始化方法
    // 只触发一次
    once(event:string,callback:Function){
        // 创建一个自定义函数 通过on触发 触发之后立马用off回收掉
        const onceCallback = (...args:any[])=>{
            callback(...args)
            this.off(event,onceCallback) //核心逻辑
        }
        // 通过on来收集 自定义的函数
        this.on(event,onceCallback)
    }
    // 监听
    on(event:string,callback:Function){
        // 判断是否收集过
        if(this.events.has(event)){ // 用map的.has 返回值是布尔值
            // 收集过就添加
            const callbackList = this.events.get(event)
            callbackList && callbackList.push(callback)
        }else{
            // 没有收集过就创建
            this.events.set(event,[callback])
        }
    }  
    // 派发
    emit(event:string,...args:any[]){
        const callbackList = this.events.get(event) //注意 即使事件并没有订阅者 也会返回一个空数组 
        console.log(callbackList); 
        if(callbackList){
            callbackList.forEach((fn)=>{
                fn(...args)
            })
        }
    }
    // 删除
    off(event:string,callback:Function){
        const callbackList = this.events.get(event)
        if(callbackList){
            // 根据callback的索引来删除
            callbackList.splice(callbackList.indexOf(callback),1)
        }
    }
}
// 使用时要先实例化
const bus = new Emitter()

const fn =()=>{
    console.log('我是fn')
}

bus.on('message',(b:boolean,n:number)=>{ // 回调函数可以正常传递参数
       console.log('我是第一个message',b,n)
})
// bus.on('message',fn) // 将 message事件收集
// bus.off('message',fn) // 将message事件移除


bus.once('nb',fn) // 只允许 fn 触发一次

// console.log(bus);

bus.emit('nb',fn) // 只触发一次 虽然下面的也会进行派发 但数组是空的所以不会触发fn
bus.emit('nb',fn)
bus.emit('nb',fn)
```

## set map WeakSet WeakMap 

### set

set是es6新增的数据结构，类似于数组，但是成员的值都是唯一的，没有重复的值,set本身是一个构造函数，用来生成set数据结构

```ts
let set: Set<any> = new Set([1, '2', false, { name: '天才' }])
let set2: Set<number> = new Set([1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5]) //天然去重除引用类型
// console.log(set2);

// 方法
// add
set2.add(999)
// delect
set2.delete(1)
// has
set2.has(999) // 返回值是布尔值
// clear
set2.clear() //全部清空

// 支持遍历
set.forEach((v => {
  console.log(v);
}))
for (let a of set) {
  console.log(a);

}
```

### map

map数据结构，它类似于对象，也是键值对的集合，但是键的范围不限于字符串，各种类型的值（包括对象）都可以当作键,也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现,如果你需要“键值对”的数据结构，Map 比 Object 更合适

```ts
// map 的key可以是任意类型
let map: Map<object, any> = new Map()

let arr = [1, 2, 3]
map.set(arr, 1) // 添加 除了.set方法其他方法与map一致map中的添加方法是add
console.log(map);
console.log(map.get(arr));
```

### weakmap weakset 弱引用

WeakMap结构与Map结构类似，也是用于生成键值对的集合。但是，它与Map有两个区别:
- WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名
- WeakMap的键名所指向的对象，不计入垃圾回收机制


WeakSet 结构与 Set 类似，也是不重复的值的集合，但是，它与 Set 有两个区别:
- WeakSet 的成员只能是对象，而不能是其他类型的值。
- WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中

```ts
// weakmap
let obj: any = { name: '牛逼' } // 该对象第一次引用
let hh: any = obj // 第二次
let weakmap: WeakMap<object, any> = new WeakMap()

// 键必须是引用类型
weakmap.set(obj, '这也行啊我靠') // 仍是第二次 weakmap 的引用不会计入垃圾回收 
// obj = null // -1次
// hh = null  // -1次 两次都没了 obj被回收 weakmap就拿不到obj了
console.log(weakmap.get(obj)) // 这也行啊我靠 如果在这之前obj被回收了那就拿不到值了

// 不允许遍历 不允许取键
// let keys = weakmap.keys() // 报错

// weakset
let obj2 = { name: '对唔住' }
let obj3 = { name: '我系差人' }
let weakset = new WeakSet([obj2, obj3]); //只能存引用类型 其他机制与weakmap一致
console.log(weakset);
```

## proxy Reflect

### proxy

es6的东西，拦截器，vue3响应式用的这玩意，

### Reflect

es6的东西，反射，proxy的辅助函数

### 使用

```ts
// proxy 支持对象 数组 函数 set map
// 下面演示常用的api

interface Person {
  name: string; // 必需的属性
  age?: number; // 可选的属性
  [ageame: string]: any; // 索引签名
}

let person: Person = {
  name: '张三',
  age: 24,
  getName() {
    return this.name
  }
}

// 用Reflect操作对象能够保证上下文正确所以下面会使用到

console.log(person.name);
console.log(Reflect.get(person, 'name', person))// 与上面一致但最后一个参数能够保证上下文不出错 .set能够赋值返回值是布尔值


let personProxy = new Proxy(person, {
  // 取值触发
  get(target, key, receiver) {
    if (target.age && target.age <= 18) {
      return Reflect.get(target, key, receiver) // 使用es6的 Reflect 操作对象 他们参数一致配合使用最佳
    } else {
      return '成年人'
    }
  },
  // 修改值触发  target就是传递进来的对象 key 这个对象的key value新的值 
  // receiver 用来保证上下文正确
  set(target, key, value, receiver) {
    console.log('我靠值被修改了');
    return Reflect.set(target, key, value, receiver)
  },
  // 拦截函数调用
  apply() {
    console.log('我靠函数被调用了');
    return true
  },
  // 拦截 in 操作符 
  has() {
    console.log('大哥有人in了');
    return true
  },
  // 拦截 Object.getOwnPropertyNames  Object.getOwnPropertySymbols 
  ownKeys(target) { //使用 Reflect.ownKeys 或 Object.keys 等方法触发 ownKeys 
    console.log('我是ownKeys');
    return Object.keys(target).filter(key => !key.startsWith('_'));//过滤掉以_开头的私有属性
  },
  // 拦截 new 操作符 （类构造时生效）
  construct(target, argArry, newTarget) {
    console.log(argArry);
    console.log(newTarget)
    console.log('靠北new了个新的');
    return target
  },
  // 拦截 delete 操作符
  deleteProperty(target, prop: string) {
    console.log(target);
    // console.log(prop);
    console.log(`靠北${prop}被delete了`);
    return true
  }
})

personProxy.name = '李四'
console.log(personProxy.name) //张三
console.log('name' in personProxy)//大哥有人in了
personProxy.getName //成年人
Object.getOwnPropertyNames(personProxy); // 我是ownKeys
delete personProxy.age //靠北age被delete了
for (const key in personProxy) {  // 我是ownKeys
  console.log(key);
}
```

### 迷你版观察者模式

```ts
// 收集订阅的函数
const list: Set<Function> = new Set()
// 订阅函数
const autorun = (cb: Function) => {
  if (!list.has(cb)) { //不存在就添加进去
    list.add(cb)
  }
}
// 将数据代理
const observable = <T extends object>(params: T) => {
  return new Proxy(params, {
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      // 数据有变化了就通知订阅者 执行订阅的函数
      list.forEach(fn => fn())
      return result
    }
  })
}
// 提供可观测的数据
const state = observable({
  name: '张三',
  age: 18
})
// 订阅了一个箭头函数
autorun(() => {
  console.log('我被执行了')
})
console.log(list); //会看到箭头函数被收集进set了

// 修改值会触发收集的箭头函数
state.name = '牛逼'
```

## 类型守卫

### 类型收缩|类型收窄

`typeof`检查基本类型 ,`instanceof`检查非基本类型

```ts
// 比如要在any中筛选出string类型 (typeof 无法在数组 对象 null 正常筛选 都会返回object 函数会返回Function)
const isString = (str: any) => typeof str === 'string';
let a = isString('250') //返回值是布尔值
console.log(a);

// 这里举例数组
const isArray = (arr: any) => arr instanceof Array
let b = isArray([1, 2, 3]) //返回值是布尔值
console.log(b);
```

### 类型谓词|自定义守卫

`is`来检查, 语法：参数 is 类型 (返回值是布尔值)

```ts
// 实现一个函数可以传入任何类型
// 但如果是object就检车里面的属性，如果里面的属性是number就取两位
// 如果是string就去除左右空格
// 如果是函数就执行

// 判断是不是对象 ({}) 是Object.prototype的语法糖
const isObject = (arg: any) => ({}).toString.call(arg) === '[object Object]'
// 判断number
const isNum = (num: any):num is number => typeof num === 'number' // num is number 需要的返回值是布尔值，而后面的判断返回值就是布尔值 所以很完美
// 判断string
const isString = (str: any):str is string => typeof str === 'string'
// 判断函数
const isFn = (fn: any):fn is Function => fn instanceof Function

const fn = (params: any) => {
  if (isObject(params)) {
    let val;
    // 不能用for in 会遍历原型上的属性所以用 object.keys最好
    Object.keys(params).forEach((key) => {
      val = params[key]
      if (isNum(val)) {
        params[key] = val.toFixed(2) //在这几个逻辑里会发现没有代码提示 就需要定义在上面 自定义守卫了
      } else if (isString(val)) {
        params[key] = val.trim()
      } else if (isFn(val)) {
        // val()// 这样独立调用this会错乱
        params[key]() //这样更安全
      }

    })
  }
}

let obj = {
  a: 123.45674,
  b: '  牛 逼  ',
  c: function () {
    console.log('你挺秀');
    console.log(this);

  }
}
fn(obj)
console.log(obj);
```

## 类型兼容 协变 逆变 双向协变

指一个类型是否可以被视为另一个类型的子类型或等价类型

又名鸭子类型

```ts
interface A{
    name:string,
    age:number,
}
interface B{
    name:string,
    age:number,
    sex:string
}
let a:A ={
    name:"张三",
    age:18
}
let b:B={
    name:'李四',
    age:19,
    sex:'男'
}

// 协变
// AB都有相同的属性
a=b //并不会报错,只要能遵循A的属性完整那么B多出来的属性无所谓


// 逆变 通常发身在函数参数中
let test=(params:A)=>{
}
let test2=(params:B)=>{
}
// test = test2 // 会报错
test2 = test // 不会报错 因为最终执行的还是 test函数而不是test2 
// A仍是主类型 所以有多余的参数也无所谓


// 双向协变  就是即允许了面的 test = test2  也允许 test2 = test
// 2.0版本之前 之后需要使用类型断言
// 配置tsconfig.json 里的 "strictFunctionTypes": false 即可
```

## 泛型工具

typescript 内置的工具

```ts
interface User{
    name:string
    age:number
    email:string
}

// Partia 属性 会把所有属性变为可选属性
type PartialUser = Partial<User>
// 原理:
// type customPartial<T> = {
//     [P in keyof T]?: T[P] //keyof里有提到过
// }


// Required 将所有属性变为必选属性
type RequiredUser = Required<User>
// 原理:
// type customPartial<T> = {
//     [P in keyof T]-?: T[P] // -? 表示去掉?
// }


// Readonly 将所有属性变为只读属性
type ReadonlyUser = Readonly<User>
// 原理:
// type customReadonly<T> = {
//     readonly [P in keyof T]: T[P]
// }


// Pick 从一个类型中取出一些属性
type PickUser = Pick<User,'name'|'age'> //提取出来了name和age属性
// 原理：
// type customPick<T, K extends keyof T> = {
//     [P in K]: T[P]
// }


// Omit 从一个 ~对象类型~ 中去除一些属性 与pick相反
type OmitUser = Omit<User,'name'|'age'> //会排除掉name和age属性 只剩下email属性
// 原理：
// type customOmit<T, K extends keyof T> = Pick <T,Exculd<keyof T,K>> // 用 excluded 来排除掉K中的属性 再用 pick 把剩下的拿到


// Exclude 从一个 ~联合类型~ 中去除另指定类型
type ExcludeUser = Exclude<'name'|'age'|'email','name'|'age'> //会排除掉name和age属性 剩下email属性
// 原理：
// type customExclude<T, U> = T extends U ? never : T  //只能是never 因为联合类中会排除never 而unknow不会被排除

---

// Record 将一个类型的所有属性值转化为另一个类型 约束对象的key以及value类型
type key = 'name'|'age'|'email'
type value = 'hh'|'你真是天才'|'不你疯子'|'sad'|'sadada' // 
let person:Record<key,value> = { // key一个都不能少 
    name:'hh',
    age:'你真是天才',
    email:'不你疯子'
    // email:'是的' // 值没有在范围内会报错
    // ah:'ada'  // key不能多也不能少
}
// 支持嵌套
let person2:Record<key,Record<'a'|'b'|'c',value>> = {
    name:{
        a:'sad',
        b:'sadada',
        c:'sad'
    },
    age:{
        a:'sad',
        b:'sadada',
        c:'sad'
    },
    email:{
        a:'sad',
        b:'sadada',
        c:'sad'
    }
}
// 原理:
// type customRecord<K extends keyof any, T> = { //keyof any是 extends string|number|symbol的语法糖
//     [P in K]: T //遍历
// }


// ReturnType 获取一个函数的返回值类型
const fn =()=>[1,2,3,'sad',false,{name:'ad',age:666}]
type arrNum = ReturnType<typeof fn> // (string | number | boolean | { name: string; age: number;})[]
// 原理:
 // 左侧约束只能传入函数，右侧 传入的args类型 用infer R 用来推断类型 
// type customReturnType<T extends Function> => T extends (...args: any[]) => infer R ? R : never
```

## infer 类型推断

只能出现在 `extends` 语句中

```ts
// 获取promise返回的参数
interface User{
    name:string,
    age:number
}

type PromiseType = Promise<User>
type getPromiseType<T>= T extends Promise<infer U> ? U : T
type T = getPromiseType<PromiseType> // 拿到了 User

// 如果有多层的promise嵌套 那就递归调用一下
type PromiseType2 =Promise< Promise<User>>
type getPromiseType2<T> = T extends Promise<infer U> ? getPromiseType2<U> : T
type T2 = getPromiseType2<PromiseType> // 拿到了 User


// intefer 协变 一般出现在对象上
// 返回的是联合类型
let obj={
    name:'123',
    age:18
}
type getObjType<T> = T extends {name:infer U,age :infer U} ? T : never 
type T3 = getObjType<typeof obj> // 拿到了 {name:string,age:number}


// intefer 逆变 一般出现在函数参数上
// 返回的是交叉类型
type getFnType<T> = T extends {
    // a函数
    a:(x:infer U)=>void,
    // b函数
    b:(x:infer U)=>void
} ? U : never
// 给他传两个试试
type T4 = getFnType<{a:(x:string)=>void,b:(x:number)=>void}> // 拿到了 never 因为 string&&number是不可能的
type T5 = getFnType<{a:(x:number)=>void,b:(x:number)=>void}> // 拿到了 number 两个参数都是number类型所以交叉类型也是number
```

## infer 类型提取

实现 提取元素

```ts
type Arr =['a','b','c']

// 获取定义的按顺序来
type one<T extends any[]> = T extends [infer R,infer R,...any[]] ? R : [] 
type a = one<Arr> //'a' | 'b' 可以拿多个亦可以拿一个

// 拿最后一个
type last<T extends any[]> = T extends [...any[],infer last] ? last : never //只需要把解构的放在前面就行了
type b = last<Arr> //'c'

// 不要最后一个要其他的
// 方法一
type rest<T extends any[]> = T extends [] ? [] : T extends [...infer R,any] ? R : []
type c = rest<Arr> //['a','b']
// 方法二 unkonw这个地方也可写其他的东西 如 infer xxx 只要最后返回的是 Rest就行了
type rest2 <T extends any[]> = T extends [...infer Rest,unknown] ? Rest : []
type d = rest2<Arr> //['a','b']

// 不要 第一个要其他的
type rest3 <T extends any[]> = T extends [unknown, ...infer Rest] ? Rest : []
type e = rest3<Arr> //['b','c']
```

## infer 递归

```ts
// 实现颠倒数组
type Arr = [1,2,3,4]
// 思路 将第一个提取放到最后一个，递归调用剩下的数组
type ReverArr<T extends any[]> = T extends [infer First,...infer Rest] ? [...ReverArr<Rest> , First] : T

type Result = ReverArr<Arr> // [4,3,2,1]
```

---

## 案例：实现localStorage支持过期时间

思路:储存的时候顺便带一个时间期限，读取时获取当前时间来对比时间期限判断是否过期，过期就给删除没过期就正常返回

配置tsconfig.json

```json
"module": "ESNext",// 指定模块语法
"moduleResolution": "Node",// node环境解析
"strict":"false" //关闭严格魔术
```


三个主要文件

index.ts

```ts
// 主要逻辑
import { Dictionaries } from "./enum/index";
import { Expire, StorageCls, Key, Data, Result } from "./type/index";

export class Storage implements StorageCls {
  // 储存
  set<T>(key: Key, value: T, expire: Expire = Dictionaries.expire) {
    //默认永久
    // 数据格式
    const data = {
      value, //用户的值
      [Dictionaries.expire]: expire, //储存的时间期限
    };
    // 进行储存
    localStorage.setItem(key, JSON.stringify(data));
  }
  // 获取
  get<T>(key: Key): Result<T> {
    const value = localStorage.getItem(key);
    // 判断是否存在
    if (value) {
      const data: Data<T> = JSON.parse(value);
      const time = new Date().getTime();
      // 判断是否过期  是number那就需要对比 否则就是永久的
      if (
        typeof data[Dictionaries.expire] == "number" &&
        data[Dictionaries.expire] < time
      ) {
        this.remove(key);//过期了就调用定义的remove方法给删除掉
        return {
          message: `抱歉您的${key}已过期`,
          value: null,
        };
      } else {
        return {
          message: "获取成功",
          value: data.value,
        };
      }
    } else {
      return {
        message: "抱歉不存在",
        value: null,
      };
    }
  }
  // 删除
  remove(key: Key) {
    localStorage.removeItem(key);
  }
  // 清除所有
  clear() {
    localStorage.clear();
  }
}
```

type/index.ts

```ts
// 类型文件
import { Dictionaries } from "../enum/index";

export type Key = string;// key类型就是存的时候必要的那个字段
export type Expire = Dictionaries.expire | number; //过期时间
export interface Data<T> { // 储存的数据类型
  value: T;
  [Dictionaries.expire]: Expire;
}
export interface Result<T> { // 返回值的类型
  message: string;
  value: T | null;
}
export interface StorageCls { //主类 下面是主要方法
  set: <T>(key: Key, value: T, expire: Expire) => void;
  get<T>(key: string): Result<T>;
  remove(key: string): void;
  clear(): void;
}
```

enum/index.ts 
```ts
// 定义字典 Dictionaries expire过期时间key permanent永久不过期
export enum Dictionaries{
    expire= '__expire__',
    permanent= 'permanent'
}
```

使用 Rollup.js 打包,所用到的依赖 rollup、rollup-plugin-typescript2、typescript

```
//记得先安装下
npm install rollup rollup-plugin-typescript2 typescript
```

rollup.config.js 打包配置文件

```js
import ts from 'rollup-plugin-typescript2'
import path from 'path'
import {fileURLToPath} from 'url'
const metaUrl = fileURLToPath(import.meta.url)
const dirName = path.dirname(metaUrl)
export default {
     input:'./index.ts', //入口文件
     output:{
         file:path.resolve(dirName,'./dist/index.js') //打包出口
     },
     plugins:[
        ts()
     ]
}
```

随便写一个html引入打包后的js测试一下

```html
 <script type="module">
    import { Storage } from './dist/index.js'
    const storage = new Storage()
    storage.set('天才', '就是你', new Date().getTime() + 5000)
    setInterval(() => {
    let a = storage.get('天才')
       console.log(a);
    }, 500)
</script>
```
