# CSS 基础相关

## 元素水平、垂直居中

### 水平居中

 行内元素：

-  text-align: center;

块级元素：

- 确定宽度的：

    1. margin: 0 auto;
    2. 父元素position: relative,子元素绝对定位并设置 margin-left: -width/2

- 不确定宽度的：
    1. display:table，margin：0 auto
    2. display：inline-block，text-align:center
    3. display：flex，justify-content:center
    4. display：grid，justify-content:center
    5. 父元素 相对定位，子元素绝对定位，+transform，translateX可以移动本身元素的50%。


### 垂直居中

- 纯文本利用line-height 设置于元素高度一致实现居中
- 通过设置父容器相对定位，子级设置绝对定位，margin实现自适应居中
- 父级设置display: flex; 子级设置margin为auto实现自适应居中
- 父级设置相对定位，子级设置绝对定位，并且通过位移transform 实现
- table 布局，父级通过转换成表格形式，然后子级设置vertical-align 实现。（需要注意的是：vertical-align: middle使用的前提条件是内联元素以及display值为table-cell的元素）


## CSS3新特性

- 新的选择器：
- 边框属性： 如border-radius、box-shadow、border-image
- 背景属性： 如background-clip、background-origin、background-size和background-break 
- 文字属性：word-wrap、text-shadow、text-overflow
- 颜色：rgba分为两部分，rgb为颜色值，a为透明度、hsla分为四部分，h为色相，s为饱和度，l为亮度，a为透明度
- transition，transform，animation，渐变，弹性布局网格布局


## px、em、rem和vw、vh

px是固定的像素，一旦设置了就无法因为放大而改变。em是相对父元素设置的字体大小，rem是相对根（HTML根节点）元素设置的字体大小来计算

vw、vh 是视窗宽度和视窗高度，1vw是视窗宽度的百分之一，1vh是视窗高度的百分之一

注意：百分比是相对于父元素的，而vw、vh是相对于视口的，是不一样的