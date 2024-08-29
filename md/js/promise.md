# 简版 Promise

## resolve 和 reject

```js
let p1 = new Promise((resolve, reject) => {
  resolve("success");
  reject("fail");
});
console.log("p1", p1);

let p2 = new Promise((resolve, reject) => {
  reject("success");
  resolve("fail");
});
console.log("p2", p2);

let p3 = new Promise((resolve, reject) => {
  throw "error";
});
console.log("p3", p3);
```

![这是图片](/image/promise1.png)

这里说明了 Promise 的四个特点：

1. 执行了 resolve，Promise 状态会变成 fulfilled；

2. 执行了 reject，Promise 状态会变成 rejected；

3. Promise 状态不可逆，第一次成功就永久为 fulfilled，第一次失败就永远状态为 rejected；

4. Promise 中有 throw 的话，就相当于执行了 reject；

## 实现 resolve 和 reject

1. Promise 的初始状态是 pending；

2. 需要对 resolve 和 reject 绑定 this：确保 resolve 和 reject 的 this 指向永远指向当前的 MyPromise 实例，防止随着函数执行环境的改变而改变；

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    // 执行传进来的函数
    executor(this.resolve, this.reject);
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
  }

  resolve(value) {
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
  }

  reject(reason) {
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
  }
}
```

测试如下：

```js
const test1 = new MyPromise((resolve, reject) => {
  resolve("success");
});
console.log(test1); // MyPromise { PromiseState: 'fulfilled', PromiseResult: 'success' }

const test2 = new MyPromise((resolve, reject) => {
  reject("fail");
});
console.log(test2); // MyPromise { PromiseState: 'rejected', PromiseResult: 'fail' }
```

## 状态不可变

```js
const test1 = new MyPromise((resolve, reject) => {
  resolve("success");
  reject("fail");
});
console.log(test1); // MyPromise { PromiseState: 'rejected', PromiseResult: 'fail' }
```

正确的应该是状态为 fulfilled，但这里状态又变成了 rejected。

Promise 有三种状态：

- pending：等待中，是初始状态；

- fulfilled：成功状态；

- rejected：失败状态；

一旦状态从 pending 变为 fulfilled 或者 rejected，那么此 Promise 实例的状态就不可以改变了。

![这是图片](/image/promise2.png)

这步只需要：

```js
    resolve(value) {
        // state是不可变的
+        if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
    }

    reject(reason) {
        // state是不可变的
+        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
    }
```

也就是：

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    // 执行传进来的函数
    executor(this.resolve, this.reject);
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
  }
}
```

结果如下：

```js
const test1 = new MyPromise((resolve, reject) => {
  // 只以第一次为准
  resolve("success");
  reject("fail");
});
console.log(test1); // MyPromise { PromiseState: 'fulfilled', PromiseResult: 'success' }
```

## throw

![这是图片](/image/promise3.png)

Promise 中有 throw 的话，就相当于执行了 reject。这就要使用 try catch 了

```js
+        try {
            // 执行传进来的函数
            executor(this.resolve, this.reject)
+        } catch (e) {
            // 捕捉到错误直接执行reject
+            this.reject(e)
+        }
```

完整代码为：

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
  }
}
```

测试代码：

```js
const test3 = new MyPromise((resolve, reject) => {
  throw "fail";
});
console.log(test3); // MyPromise { PromiseState: 'rejected', PromiseResult: 'fail' }
```

## then

平时业务中 then 的使用一般如下：

```js
// 马上输出 ”success“
const p1 = new Promise((resolve, reject) => {
  resolve("success");
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);

// 1秒后输出 ”fail“
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("fail");
  }, 1000);
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);

// 链式调用 输出 200
const p3 = new Promise((resolve, reject) => {
  resolve(100);
})
  .then(
    (res) => 2 * res,
    (err) => console.log(err)
  )
  .then(
    (res) => console.log(res),
    (err) => console.log(err)
  );
```

根据上述代码可以确定：

1. then 接收两个回调，一个是成功回调，一个是失败回调；

2. 当 Promise 状态为 fulfilled 执行成功回调，为 rejected 执行失败回调；

3. 如 resolve 或 reject 在定时器里，则定时器结束后再执行 then；

4. then 支持链式调用，下一次 then 执行受上一次 then 返回值的影响；

## 实现 then

```js
    then(onFulfilled, onRejected) {
        // 接收两个回调 onFulfilled, onRejected

        // 参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

        if (this.PromiseState === 'fulfilled') {
            // 如果当前为成功状态，执行第一个回调
            onFulfilled(this.PromiseResult)
        } else if (this.PromiseState === 'rejected') {
            // 如果当前为失败状态，执行第二哥回调
            onRejected(this.PromiseResult)
        }

    }
```

完整代码为：

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
  }

  then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected

    // 参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    if (this.PromiseState === "fulfilled") {
      // 如果当前为成功状态，执行第一个回调
      onFulfilled(this.PromiseResult);
    } else if (this.PromiseState === "rejected") {
      // 如果当前为失败状态，执行第二哥回调
      onRejected(this.PromiseResult);
    }
  }
}
```

测试 then 的结果为：

```js
// 输出 ”success“
const test = new MyPromise((resolve, reject) => {
  resolve("success");
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);
```

## 定时器

如何保证下述代码能够在 1s 后执行 then 的回调？

```js
// 1秒后输出 ”fail“
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("fail");
  }, 1000);
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);
```

我们不能确保 1 秒后才执行 then 函数，但是我们可以保证 1 秒后再执行 then 里的回调

![这是图片](/image/promise4.png)

在这 1 秒时间内，我们可以先把 then 里的两个回调保存起来，然后等到 1 秒过后，执行了 resolve 或者 reject，咱们再去判断状态，并且判断要去执行刚刚保存的两个回调中的哪一个回调。

那么问题来了，我们怎么知道当前 1 秒还没走完甚至还没开始走呢？其实很好判断，只要状态是 pending，那就证明定时器还没跑完，因为如果定时器跑完的话，那状态肯定就不是 pending，而是 fulfilled 或者 rejected

那是用什么来保存这些回调呢？建议使用数组，因为一个 promise 实例可能会多次 then，用数组就一个一个保存了

```js
    initValue() {
        // 初始化值
        this.PromiseResult = null // 终值
        this.PromiseState = 'pending' // 状态
+        this.onFulfilledCallbacks = [] // 保存成功回调
+        this.onRejectedCallbacks = [] // 保存失败回调
    }

    resolve(value) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行resolve，状态变为fulfilled
        this.PromiseState = 'fulfilled'
        // 终值为传进来的值
        this.PromiseResult = value
        // 执行保存的成功回调
+        while (this.onFulfilledCallbacks.length) {
+            this.onFulfilledCallbacks.shift()(this.PromiseResult)
+        }
    }

    reject(reason) {
        // state是不可变的
        if (this.PromiseState !== 'pending') return
        // 如果执行reject，状态变为rejected
        this.PromiseState = 'rejected'
        // 终值为传进来的reason
        this.PromiseResult = reason
        // 执行保存的失败回调
+        while (this.onRejectedCallbacks.length) {
+            this.onRejectedCallbacks.shift()(this.PromiseResult)
+        }
    }

    then(onFulfilled, onRejected) {
        // 接收两个回调 onFulfilled, onRejected

        // 参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

        if (this.PromiseState === 'fulfilled') {
            // 如果当前为成功状态，执行第一个回调
            onFulfilled(this.PromiseResult)
        } else if (this.PromiseState === 'rejected') {
            // 如果当前为失败状态，执行第二哥回调
            onRejected(this.PromiseResult)
+        } else if (this.PromiseState === 'pending') {
+            // 如果状态为待定状态，暂时保存两个回调
+            this.onFulfilledCallbacks.push(onFulfilled.bind(this))
+            this.onRejectedCallbacks.push(onRejected.bind(this))
+        }

    }

```

完整代码为：

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
    // 执行保存的失败回调
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected

    // 参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    if (this.PromiseState === "fulfilled") {
      // 如果当前为成功状态，执行第一个回调
      onFulfilled(this.PromiseResult);
    } else if (this.PromiseState === "rejected") {
      // 如果当前为失败状态，执行第二哥回调
      onRejected(this.PromiseResult);
    } else if (this.PromiseState === "pending") {
      // 如果状态为待定状态，暂时保存两个回调
      this.onFulfilledCallbacks.push(onFulfilled.bind(this));
      this.onRejectedCallbacks.push(onRejected.bind(this));
    }
  }
}
```

看下是否能够实现定时器的功能：

```js
const test2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("success"); // 1秒后输出 success
  }, 1000);
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);
```

## 链式调用

then 支持链式调用，下一次 then 执行受上一次 then 返回值的影响，给大家举个例子：

```js
// 链式调用 输出 200
const p3 = new Promise((resolve, reject) => {
  resolve(100);
})
  .then(
    (res) => 2 * res,
    (err) => console.log(err)
  )
  .then(
    (res) => console.log(res),
    (err) => console.log(err)
  );

// 链式调用 输出300
const p4 = new Promise((resolve, reject) => {
  resolve(100);
})
  .then(
    (res) => new Promise((resolve, reject) => resolve(3 * res)),
    (err) => console.log(err)
  )
  .then(
    (res) => console.log(res),
    (err) => console.log(err)
  );
```

根据上文，可以得到：

1. then 方法本身会返回一个新的 Promise 对象；

2. 如果返回值是 promise 对象，返回值为成功，新 promise 就是成功；

3. 如果返回值是 promise 对象，返回值为失败，新 promise 就是失败；

4. 如果返回值非 promise 对象，新 promise 对象就是成功，值为此返回值；

then 是 Promise 上的方法，那如何实现 then 完还能再 then 呢？

then 执行后返回一个 Promise 对象就行了，就能保证 then 完还能继续执行 then；

![这是图片](/image/promise5.png)

```js
    then(onFulfilled, onRejected) {
        // 接收两个回调 onFulfilled, onRejected

        // 参数校验，确保一定是函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }


        var thenPromise = new MyPromise((resolve, reject) => {

            const resolvePromise = cb => {
                try {
                    const x = cb(this.PromiseResult)
                    if (x === thenPromise && x) {
                        // 不能返回自身哦
                        throw new Error('不能返回自身。。。')
                    }
                    if (x instanceof MyPromise) {
                        // 如果返回值是Promise
                        // 如果返回值是promise对象，返回值为成功，新promise就是成功
                        // 如果返回值是promise对象，返回值为失败，新promise就是失败
                        // 谁知道返回的promise是失败成功？只有then知道
                        x.then(resolve, reject)
                    } else {
                        // 非Promise就直接成功
                        resolve(x)
                    }
                } catch (err) {
                    // 处理报错
                    reject(err)
                    throw new Error(err)
                }
            }

            if (this.PromiseState === 'fulfilled') {
                // 如果当前为成功状态，执行第一个回调
                resolvePromise(onFulfilled)
            } else if (this.PromiseState === 'rejected') {
                // 如果当前为失败状态，执行第二个回调
                resolvePromise(onRejected)
            } else if (this.PromiseState === 'pending') {
                // 如果状态为待定状态，暂时保存两个回调
                // 如果状态为待定状态，暂时保存两个回调
                this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
                this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
            }
        })

        // 返回这个包装的Promise
        return thenPromise

    }
```

完整代码为：

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
    // 执行保存的失败回调
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected

    // 参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    var thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        try {
          const x = cb(this.PromiseResult);
          if (x === thenPromise) {
            // 不能返回自身哦
            throw new Error("不能返回自身。。。");
          }
          if (x instanceof MyPromise) {
            // 如果返回值是Promise
            // 如果返回值是promise对象，返回值为成功，新promise就是成功
            // 如果返回值是promise对象，返回值为失败，新promise就是失败
            // 谁知道返回的promise是失败成功？只有then知道
            x.then(resolve, reject);
          } else {
            // 非Promise就直接成功
            resolve(x);
          }
        } catch (err) {
          // 处理报错
          reject(err);
          throw new Error(err);
        }
      };

      if (this.PromiseState === "fulfilled") {
        // 如果当前为成功状态，执行第一个回调
        resolvePromise(onFulfilled);
      } else if (this.PromiseState === "rejected") {
        // 如果当前为失败状态，执行第二个回调
        resolvePromise(onRejected);
      } else if (this.PromiseState === "pending") {
        // 如果状态为待定状态，暂时保存两个回调
        // 如果状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }
    });

    // 返回这个包装的Promise
    return thenPromise;
  }
}
```

测试一下：

```js
const test3 = new MyPromise((resolve, reject) => {
  resolve(100); // 输出 状态：success 值： 200
})
  .then(
    (res) => 2 * res,
    (err) => 3 * err
  )
  .then(
    (res) => console.log("success", res),
    (err) => console.log("fail", err)
  );

const test4 = new MyPromise((resolve, reject) => {
  resolve(100); // 输出 状态：fail 值：200
})
  .then(
    (res) => new MyPromise((resolve, reject) => reject(2 * res)),
    (err) => new Promise((resolve, reject) => resolve(3 * err))
  )
  .then(
    (res) => console.log("success", res),
    (err) => console.log("fail", err)
  );
```

## 执行顺序

这里需要了解，then 方法是微任务

```js
const p = new Promise((resolve, reject) => {
    resolve(1)
}).then(res => console.log(res), err => console.log(err))

console.log(2)

输出顺序是 2 1
```

这里为了实现类似的功能，使用 setTimeout 代替（setTimeout 为宏任务，此处主要跟在全局上的 console 对比）

```js
const resolvePromise = (cb) => {
  setTimeout(() => {
    try {
      const x = cb(this.PromiseResult);
      if (x === thenPromise) {
        // 不能返回自身哦
        throw new Error("不能返回自身。。。");
      }
      if (x instanceof MyPromise) {
        // 如果返回值是Promise
        // 如果返回值是promise对象，返回值为成功，新promise就是成功
        // 如果返回值是promise对象，返回值为失败，新promise就是失败
        // 谁知道返回的promise是失败成功？只有then知道
        x.then(resolve, reject);
      } else {
        // 非Promise就直接成功
        resolve(x);
      }
    } catch (err) {
      // 处理报错
      reject(err);
      throw new Error(err);
    }
  });
};
```

至此，完整的代码为：

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseState = "pending"; // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
  }

  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = "fulfilled";
    // 终值为传进来的值
    this.PromiseResult = value;
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }

  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== "pending") return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = "rejected";
    // 终值为传进来的reason
    this.PromiseResult = reason;
    // 执行保存的失败回调
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected

    // 参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    var thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        setTimeout(() => {
          try {
            const x = cb(this.PromiseResult);
            if (x === thenPromise) {
              // 不能返回自身哦
              throw new Error("不能返回自身。。。");
            }
            if (x instanceof MyPromise) {
              // 如果返回值是Promise
              // 如果返回值是promise对象，返回值为成功，新promise就是成功
              // 如果返回值是promise对象，返回值为失败，新promise就是失败
              // 谁知道返回的promise是失败成功？只有then知道
              x.then(resolve, reject);
            } else {
              // 非Promise就直接成功
              resolve(x);
            }
          } catch (err) {
            // 处理报错
            reject(err);
            throw new Error(err);
          }
        });
      };

      if (this.PromiseState === "fulfilled") {
        // 如果当前为成功状态，执行第一个回调
        resolvePromise(onFulfilled);
      } else if (this.PromiseState === "rejected") {
        // 如果当前为失败状态，执行第二个回调
        resolvePromise(onRejected);
      } else if (this.PromiseState === "pending") {
        // 如果状态为待定状态，暂时保存两个回调
        // 如果状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }
    });

    // 返回这个包装的Promise
    return thenPromise;
  }
}
```

测试一下：

```js
const test4 = new MyPromise((resolve, reject) => {
  resolve(1);
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);

console.log(2);
```

## 其他方法

## all

1. 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功；

2. 如果所有 Promise 都成功，则返回成功结果数组；

3. 如果有一个 Promise 失败，则返回这个失败结果；

```js
static all(promises) {
    const result = []
    let count = 0
    return new MyPromise((resolve, reject) => {
        const addData = (index, value) => {
            result[index] = value
            count++
            if (count === promises.length) resolve(result)
        }
        promises.forEach((promise, index) => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                    addData(index, res)
                }, err => reject(err))
            } else {
                addData(index, promise)
            }
        })
    })
}
```

## race

1. 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功；

2. 哪个 Promise 最快得到结果，就返回那个结果，无论成功失败；

```js
static race(promises) {
    return new MyPromise((resolve, reject) => {
        promises.forEach(promise => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
            } else {
                resolve(promise)
            }
        })
    })
}
```

## allSettled

1. 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功；

2. 把每一个 Promise 的结果，集合成数组，返回这个数组；

```js
static allSettled(promises) {
    return new Promise((resolve, reject) => {
        const res = []
        let count = 0
        const addData = (status, value, i) => {
            res[i] = {
                status,
                value
            }
            count++
            if (count === promises.length) {
                resolve(res)
            }
        }
        promises.forEach((promise, i) => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                    addData('fulfilled', res, i)
                }, err => {
                    addData('rejected', err, i)
                })
            } else {
                addData('fulfilled', promise, i)
            }
        })
    })
}
```

## any

与 all 相反

1. 接收一个 Promise 数组，数组中如有非 Promise 项，则此项当做成功；

2. 如果有一个 Promise 成功，则返回这个成功结果；

3. 如果所有 Promise 都失败，则报错；

```js
static any(promises) {
    return new Promise((resolve, reject) => {
        let count = 0
        promises.forEach((promise) => {
            promise.then(val => {
                resolve(val)
            }, err => {
                count++
                if (count === promises.length) {
                    reject(new AggregateError('All promises were rejected'))
                }
            })
        })
    })
}
```

# Promise A+规范

上文我们实现了简版的 Promise，接下来看下标准的 Promise/A+的规范

- [官方地址](https://promisesaplus.com/)

- [github 地址](https://github.com/promises-aplus) 

对照的翻译如下：

一个开放、健全且通用的 JavaScript Promise 标准。由开发者制定，供开发者参考。

一个 promise 表示异步操作的最终结果。与 promise 进行交互的主要方式是通过它的方法 then。该方法通过注册回调来得到这个 promise 的最终 value ，或者为什么这个 promise 不能被 fulfilled 的 reason 。

该规范详细说明了 then 方法的行为，提供了一个可互操作的基础，因此所有符合 Promises/A+ 的 promise 实现都可以依赖该基础。尽管 Promises/A+ 组织可能偶尔会通过向后兼容的微小更改来修改此规范，以解决新发现的情况，但我们只有在仔细考虑、讨论和测试后才会进行大的或向后不兼容的更改。因此, 该规范应该被认为是十分稳定的 。

从历史上看, Promises/A+ 阐明了早期[Promises/A proposal](https://wiki.commonjs.org/wiki/Promises/A) 的条款，并将部分事实上已经实现的拓展涵盖其中，以及对某些未指定或者有问题的部分省略。

最后，Promises/A+ 规范的核心不包括：如何 create 、fulfill 或 reject promises。而是选择专注于提供可互操作的 then 方法。不过伴随规范的未来工作可能会涉及这些主题。

这里可以看到，Promises/A+ 规范目前的核心是规范 then 方法，并没有对如何实现 promise 以及如何改变 promise 的状态进行限制。

## 术语

1. "prmoise" 是一个拥有符合本规范的 then 方法的对象或者函数；

2. "thenable" 是一个定义了 then 方法的对象或者函数；

3. "value" 是 JavaScript 的任意合法值(包括 undefined, thenable, promise)；

4. "exception" 是一个用 throw 语句抛出的 value ；

5. "reason" 是一个表示 promise 被 rejected 的 value ；

## 要求

### promise 的状态

pormise 必须是以下三个状态之一: pending, fulfilled, rejected。

- 当 promise 处于 pending 状态时：

  - 可以转换到 fulfilled 或 rejected 状态；

- 当 promise 处于 fulfilled 状态时：

  - 不能转换到其他状态；

  - 必须有一个 value ，并且不能改变；

- 当 promise 处于 rejected 状态时：

  - 不能转换到其他状态；

  - 必须有 reason ，并且不能改变；

  ## then 方法

  promise 必须提供一个 then 方法，能由此去访问当前或最终的 value 或者 reason 。pormise 的 then 方法， 接受两个参数

  ```js
  promise.then(onFulfilled, onRejected);
  ```

  - onFulfilled 和 onRejected 都是可选参数：

  - 如果 onFulfilled 不是函数，则忽略；

  - 如果 onRejected 不是函数，则忽略；

- 如果 onFulfilled 是一个函数:

  - 它必须在 promise 被 fulfilled 后，以 promise 的 value 作为第一个参数调用；

  - 它不能在 promise 被 fulfilled 之前调用；

  - 它不能被调用多次；

- 如果 onRejected 是一个函数：

  - 它必须在 promise 被 rejected 后，以 promise 的 reason 作为第一个参数调用；

  - 它不能能在 promise 被 rejected 之前调用；

  - 它不能被调用多次；

  - 在 execution context 栈（执行上下文栈）只包含平台代码之前， onFulfilled 或者 onRejected 不能被调用 (译者注: 异步执行回调)；

- onFulfilled 或者 onRejected 必须以函数形式调用（即不能有 this 值）

- then 方法可以被同一个 promise 调用多次

  - 如果或者当 promise 处于 fulfilled 状态， 所有自己的 onFulfilled 回调函数，必须要按照 then 注册的顺序被调用；

  - 如果或者当 promise 处于 rejected 状态， 所有自己的 onRejected 回调函数，必须要按照 then 注册的顺序被调用；

- then 方法必须要返回 promise

  ```js
  promise2 = promise1.then(onFulfilled, onRejected);
  ```

- 如果 onFulfilled 或者 onRejected 返回一个值 x ，则执行 Promise Resolution Procedure：[[Resolve]](promise2, x)；

- 如果 onFulfilled 或者 onRejected 抛出异常 e ， promise2 必须以 e 作为 reason ，转到 rejected 状态；

- 如果 onFulfilled 不是函数，并且 promise1 处于 fulfilled 状态 ，则 promise2 必须以与 promise1 同样的 value 被 fulfilled；

- 如果 onRejected 不是函数，并且 promise1 处于 rejected 状态 ，则 promise2 必须以与 promise1 同样的 reason 被 rejected；

## Promise Resolution Procedure

Promise Resolution Procedure 是一个抽象操作。它以一个 promise 和一个 value 作为输入，记作：[[Resolve]](promise, x) 。 如果 x 是一个 thenable , 它会尝试让 promise 变成与 x 的一样状态 ，前提 x 是一个类似的 promise 对象。否则，它会让 promise 以 x 作为 value 转为 fulfilled 状态。

这种对 thenables 的处理允许不同的 promise 进行互操作，只要它们暴露一个符合 Promises/A+ 的 then 方法。它还允许 Promises/A+ 实现使用合理的 then 方法“同化”不一致的实现。
[[Resolve]](promise, x) 执行以下步骤：

- 如果 promise 和 x 引用的是同一个对象，则以一个 TypeError 作为 reason 让 promise 转为 rejeted 状态；

- 如果 x 也是一个 promise ，则让 promise 接受它的状态：

  - 如果 x 处于 pending 状态，promise 必须保持 pending 状态，直到 x 变成 fulfilled 或者 rejected 状态，promise 才同步改变；

  - 如果或者当 x 处于 fulfilled 状态， 以同样的 value 让 promise 也变成 fulfilled 状态；

  - 如果或者当 x 处于 rejected 状态， 以同样的 reason 让 promise 也变成 rejected 状态；

- 如果 x 是一个对象或者函数：
  - 令 then 等于 x.then；

  - 如果读取 x.then 抛出异常 e ， 以 e 作为 reason 让 promise 变成 rejected 状态；

  - 如果 then 是一个函数，以 x 作为 this 调用它，传入第一个参数 resolvePromise ， 第二个参数 rejectPromise ：

    - 如果 resolvePromise 被传入 y 调用， 则执行 [[Resolve]](promise, y)；

    - 如果 rejectedPromise 被传入 r 调用，则用，r 作为 reason 让 promise 变成 rejected 状态；

    - 如果 resolvePromise 和 rejectPromise 都被调用了，或者被调用多次了。只有第一次调用生效，其余会被忽略；

    - 如果调用 then 抛出异常 e：
      - 如果 resolvepromise 或 rejectPromise 已经被调用过了，则忽略它；

      - 否则, 以 e 作为 reason 让 promise 变成 rejected 状态；

    - 如果 then 不是一个函数，以 x 作为 value 让 promise 变成 fulfilled 状态；

- 如果 x 不是对象或函数， 以 x 作为 value 让 promise 变成 fulfilled 状态；

  如果一个 promise 被一个循环的 thenable 链中的对象 resolved，而 [[Resolve]](promise, thenable) 的递归性质又使得其被再次调用，根据上述的算法将会陷入无限递归之中。算法虽不强制要求，但也鼓励实现者检测这样的递归是否存在，并且以 TypeError 作为 reason 拒绝 promise；

# async/await

async 函数返回一个 promise 对象，可以使用 then 方法添加回调函数。当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。

async/await 的用处：用同步方式，执行异步操作

```js
function request(num) {
  // 模拟接口请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num * 2);
    }, 1000);
  });
}

request(1).then((res1) => {
  console.log(res1); // 1秒后 输出 2

  request(2).then((res2) => {
    console.log(res2); // 2秒后 输出 4
  });
});
```

现在有一个新的要求：先请求完接口 1，再拿接口 1 返回的数据，去当做接口 2 的请求参数，那我们也可以这么做：

```js
request(5).then((res1) => {
  console.log(res1); // 1秒后 输出 10

  request(res1).then((res2) => {
    console.log(res2); // 2秒后 输出 20
  });
});
```

如果嵌套的多了，这个时候就可以用 async/await 来解决了：

```js
async function fn() {
  const res1 = await request(5);
  const res2 = await request(res1);
  console.log(res2); // 2秒后输出 20
}
fn();
```

使用 async/await 代替上述的内容：

```js
async function fn() {
  await request(1);
  await request(2);
  // 2秒后执行完
}
fn();
```

```js
async function fn() {
  const res1 = await request(5);
  const res2 = await request(res1);
  console.log(res2); // 2秒后输出 20
}
fn();
```

在 async 函数中，await 规定了异步操作只能一个一个排队执行，从而达到用同步方式，执行异步操作的效果。

注意：await 只能在 async 函数中使用

刚刚上面的例子 await 后面都是跟着异步操作 Promise，那如果不接 Promise？

```js
function request(num) {
  // 去掉Promise
  setTimeout(() => {
    console.log(num * 2);
  }, 1000);
}

async function fn() {
  await request(1); // 2
  await request(2); // 4
  // 1秒后执行完  同时输出
}
fn();
```

Q：什么是 async？async 是一个位于 function 之前的前缀，只有 async 函数中，才能使用 await。那 async 执行完是返回是什么？

```js
async function fn() {}
console.log(fn); // [AsyncFunction: fn]
console.log(fn()); // Promise {<fulfilled>: undefined}
```

可以看出，async 函数执行完会自动返回一个状态为 fulfilled 的 Promise，也就是成功状态，但是值却是 undefined，那要怎么才能使值不是 undefined 呢？只要函数有 return 返回值就行了。

```js
async function fn(num) {
  return num;
}
console.log(fn); // [AsyncFunction: fn]
console.log(fn(10)); // Promise {<fulfilled>: 10}
fn(10).then((res) => console.log(res)); // 10
```

### 总结

1. await 只能在 async 函数中使用，不然会报错；

2. async 函数返回的是一个 Promise 对象，有无值看有无 return 值；

3. await 后面最好是接 Promise，虽然接其他值也能达到排队效；

4. async/await 作用是用同步方式，执行异步操作

### 5.1.2 语法糖

Q：async/await 是一种语法糖，那么什么是语法糖呢？

A：语法糖是简化代码的一种方式，用其他方式也能达到同样的效果，但写法可能没有这么便利。

ES6 的 class 也是语法糖，因为其实用普通 function 也能实现同样效果

回归正题，async/await 是一种语法糖，用到的是 ES6 里的迭代函数——generator 函数
