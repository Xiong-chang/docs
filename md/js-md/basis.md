# Javascript 基础

## 数据类型

### 基础类型

- `string` 字符串
- `number` 数字
- `boolean` 布尔值
- `null`
- `undefined`
- `symbol` 唯一值接收字符串为参数
- `bigint` 大整数


### 复杂类型

- `Objec` 对象
- `Array` 数组
- `Function` 函数
- `RegExp` 正则表达式
- `Date` 日期
- `Set` 集合 类似数组成员唯一，允许你储存任何类型的唯一值，不会有隐式转换
- `Map` 映射 类似对象，键值可以是任意类型，具有极快的查找速度


## 变量

### 声明

let 与 const 有独立块级作用域

- `var` 变量会提升 值可修改 申明不赋值可访问(undefined)
- `let` 不会提升 值可修改 申明不赋值可访问(undefined)(无提升所以在输出后进行定义也会报错 ReferenceError)
- `const` 不会提升 值不可修改 暂时性死区直接报错 ReferenceError *这个声明为常量*



### 作用域

- 全局作用域
- 函数作用域
- 块级作用域

## == 和 ===有什么区别

== 只比较值，不比较类型，会有隐式转换发生

- 两边的类型是否相同，相同的话就比较值的大小，例如1==2，返回false
- 判断的是否是null和undefined，是的话就返回true
- 判断的类型是否是String和Number，是的话，把String类型转换成Number，再进行比较
- 判断其中一方是否是Boolean，是的话就把Boolean转换成Number，再进行比较
- 如果其中一方为Object，且另一方为String、Number或者Symbol，会将Object转换成字符串，再进行比较,例：

```js
    console.log({a: 1} == true);//false
    console.log({a: 1} == "[object Object]");//true
```

=== 叫做严格相等，是指：左右两边不仅值要相等，类型也要相等

## Math.floor和parseInt

Math.floor() 向下取整，返回小于或等于一个给定数字的最大整数

parseInt() 负数会向上取整，正数会向下取整，会忽略数字后面的非数字字符串

```js
console.log(Math.floor(4.66))//4
console.log(parseInt(4.66));//4

console.log(Math.floor(-4.66))//-5
console.log(parseInt(-4.66));//-4
```



