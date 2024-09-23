import{_ as a,c as i,o as l,a4 as e}from"./chunks/framework.C8UKyWV9.js";const b=JSON.parse('{"title":"CSS 基础相关","description":"","frontmatter":{},"headers":[],"relativePath":"md/css-md/basis.md","filePath":"md/css-md/basis.md","lastUpdated":null}'),t={name:"md/css-md/basis.md"},r=e('<h1 id="css-基础相关" tabindex="-1">CSS 基础相关 <a class="header-anchor" href="#css-基础相关" aria-label="Permalink to &quot;CSS 基础相关&quot;">​</a></h1><h2 id="元素水平、垂直居中" tabindex="-1">元素水平、垂直居中 <a class="header-anchor" href="#元素水平、垂直居中" aria-label="Permalink to &quot;元素水平、垂直居中&quot;">​</a></h2><h3 id="水平居中" tabindex="-1">水平居中 <a class="header-anchor" href="#水平居中" aria-label="Permalink to &quot;水平居中&quot;">​</a></h3><p>行内元素：</p><ul><li>text-align: center;</li></ul><p>块级元素：</p><ul><li><p>确定宽度的：</p><ol><li>margin: 0 auto;</li><li>父元素position: relative,子元素绝对定位并设置 margin-left: -width/2</li></ol></li><li><p>不确定宽度的：</p><ol><li>display:table，margin：0 auto</li><li>display：inline-block，text-align:center</li><li>display：flex，justify-content:center</li><li>display：grid，justify-content:center</li><li>父元素 相对定位，子元素绝对定位，+transform，translateX可以移动本身元素的50%。</li></ol></li></ul><h3 id="垂直居中" tabindex="-1">垂直居中 <a class="header-anchor" href="#垂直居中" aria-label="Permalink to &quot;垂直居中&quot;">​</a></h3><ul><li>纯文本利用line-height 设置于元素高度一致实现居中</li><li>通过设置父容器相对定位，子级设置绝对定位，margin实现自适应居中</li><li>父级设置display: flex; 子级设置margin为auto实现自适应居中</li><li>父级设置相对定位，子级设置绝对定位，并且通过位移transform 实现</li><li>table 布局，父级通过转换成表格形式，然后子级设置vertical-align 实现。（需要注意的是：vertical-align: middle使用的前提条件是内联元素以及display值为table-cell的元素）</li></ul><h2 id="css3新特性" tabindex="-1">CSS3新特性 <a class="header-anchor" href="#css3新特性" aria-label="Permalink to &quot;CSS3新特性&quot;">​</a></h2><ul><li>新的选择器：</li><li>边框属性： 如border-radius、box-shadow、border-image</li><li>背景属性： 如background-clip、background-origin、background-size和background-break</li><li>文字属性：word-wrap、text-shadow、text-overflow</li><li>颜色：rgba分为两部分，rgb为颜色值，a为透明度、hsla分为四部分，h为色相，s为饱和度，l为亮度，a为透明度</li><li>transition，transform，animation，渐变，弹性布局网格布局</li></ul><h2 id="px、em、rem和vw、vh" tabindex="-1">px、em、rem和vw、vh <a class="header-anchor" href="#px、em、rem和vw、vh" aria-label="Permalink to &quot;px、em、rem和vw、vh&quot;">​</a></h2><p>px是固定的像素，一旦设置了就无法因为放大而改变。em是相对父元素设置的字体大小，rem是相对根（HTML根节点）元素设置的字体大小来计算</p><p>vw、vh 是视窗宽度和视窗高度，1vw是视窗宽度的百分之一，1vh是视窗高度的百分之一</p><p>注意：百分比是相对于父元素的，而vw、vh是相对于视口的，是不一样的</p>',15),o=[r];function s(n,d,c,h,m,p){return l(),i("div",null,o)}const _=a(t,[["render",s]]);export{b as __pageData,_ as default};