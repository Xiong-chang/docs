import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.C8UKyWV9.js";const c=JSON.parse('{"title":"Prettier","description":"","frontmatter":{},"headers":[],"relativePath":"md/specification-md/prettier.md","filePath":"md/specification-md/prettier.md","lastUpdated":null}'),t={name:"md/specification-md/prettier.md"},h=n(`<h1 id="prettier" tabindex="-1">Prettier <a class="header-anchor" href="#prettier" aria-label="Permalink to &quot;Prettier&quot;">​</a></h1><p>一个代码格式化工具,确保代码风格的一致性，避免团队成员之间因为代码格式问题产生分歧,配合 <code>Eslint</code> 使用，可以更方便的进行代码格式化</p><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><p>本地安装：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prettier</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --save-dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 或者</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prettier</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --dev</span></span></code></pre></div><p>全局安装：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prettier</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 或者</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> global</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prettier</span></span></code></pre></div><h2 id="初始化" tabindex="-1">初始化 <a class="header-anchor" href="#初始化" aria-label="Permalink to &quot;初始化&quot;">​</a></h2><p>新建一个 <code>.prettierrc.js</code></p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    //直接写规则</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    printWidth: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">80</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//单行长度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    tabWidth: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//缩进长度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    useTabs: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//使用空格代替tab缩进</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    semi: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//句末使用分号</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    singleQuote: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//使用单引号</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    quoteProps: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;as-needed&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//仅在必需时为对象的key添加引号</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    jsxSingleQuote: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// jsx中使用单引号</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    trailingComma: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;all&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//多行时尽可能打印尾随逗号</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    bracketSpacing: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//在对象前后添加空格-eg: { foo: bar }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    jsxBracketSameLine: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//多属性html标签的‘&gt;’折行放置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    arrowParens: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;always&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//单参数箭头函数参数周围使用圆括号-eg: (x) =&gt; x</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    requirePragma: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//无需顶部注释即可格式化</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    insertPragma: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//在已被preitter格式化的文件顶部加上标注</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    proseWrap: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;preserve&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//不知道怎么翻译</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    htmlWhitespaceSensitivity: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ignore&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//对HTML全局空白不敏感</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    vueIndentScriptAndStyle: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//不对vue中的script及style标签缩进</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    endOfLine: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;lf&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//结束行形式</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    embeddedLanguageFormatting: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;auto&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//对引用代码进行格式化</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h2 id="使用" tabindex="-1">使用 <a class="header-anchor" href="#使用" aria-label="Permalink to &quot;使用&quot;">​</a></h2><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npx</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prettier</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --write</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> .</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 或</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prettier</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --write</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> .</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 或 在package.json 的 scrpits 里配置自定义</span></span></code></pre></div>`,12),p=[h];function l(e,k,r,d,E,g){return a(),i("div",null,p)}const F=s(t,[["render",l]]);export{c as __pageData,F as default};
