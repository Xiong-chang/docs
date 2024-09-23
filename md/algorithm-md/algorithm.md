# 常见算法

## LRU 算法

是一种缓存淘汰策略，用于在缓存空间不足时决定哪些缓存项应该被移除,该算法基于最近最少使用的原则，即在缓存满时，移除最近最少被访问的缓存项

```ts
class LRUcache {
  capacity: number; //缓存的容量
  cache: Map<any, any>; // 缓存的策略 任意类型的Map
  order: any[]; // 记录访问顺序

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.order = [];
  }
  // 读取
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.update(key); // 更新访问顺序 放到最后去因为读取过是活跃的
      return value;
    } else {
      return null;
    }
  }

  // 插入
  set(key, value) {
    //判断有没有被保存过
    if (this.cache.has(key)) {
      this.cache.set(key, value); // 更新
      this.update(key); // 更新访问顺序 放到最后去因为读取过是活跃的
    } else {
      // 第一次存
      this.cache.set(key, value);
      this.order.push(key); // 记录访问顺序
      //   判断是否超出容量
      if (this.order.length > this.capacity) {
        // 超出就把最不活跃的第一项删掉
        const oldkey = this.order.shift();
        this.cache.delete(oldkey);
      }
    }
    console.log(this.cache);
  }

  //   更新
  update(key) {
    // 1.找到索引
    const index = this.order.indexOf(key);
    // 2.删除掉
    this.order.splice(index, 1);
    // 3.添加到末尾
    this.order.push(key);
  }
}

const lru = new LRUcache(3); //最多存3个

// 举例：
// 缓存 1 2 3  //读取过的放到最后

lru.set(1, 1);
lru.set(2, 2);
lru.set(3, 3);
lru.set(4, 4); //此时，1被淘汰了

// Map(1) { 1 => 1 }
// Map(2) { 1 => 1, 2 => 2 }
// Map(3) { 1 => 1, 2 => 2, 3 => 3 }
// Map(3) { 2 => 2, 3 => 3, 4 => 4 }
```
