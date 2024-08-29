import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Learning Record",
  description: "A VitePress Site",
  outDir: "docs", //打包输出的目录
  base: "/docs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'introduction', link: '/markdown-examples' }
    ],

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated:{
      text: '最后更新时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },
    // 搜索
    search: {
      provider: 'local'
    },

    sidebar: [
      {
        text: "JavaScript",
        items: [
          { text: "this指针/闭包/作用域", link: "/md/js/this.md" },
          { text: "前端异步编程规范", link: "/md/js/promise.md" },
          // { text: "JS高级", link: "/md/js-md/senior.md" },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
