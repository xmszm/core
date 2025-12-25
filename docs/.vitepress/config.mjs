import { defineConfig } from 'vitepress'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: '@xmszm/core',
  description: 'naiveui core 组件与工具库 - Vue 3 + Naive UI 的表单、表格、弹窗与工具集合',
  lang: 'zh-CN',
  lastUpdated: true,
  base: '/core/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/quickstart' },
      { text: '组件', link: '/components/dataform' },
      { text: '工具', link: '/components/utils' },
      { text: '版本历史', link: '/guide/changelog' },
      { text: '示例 Demo', link: '/guide/demo' },
      { text: '在线示例', link: '/examples/', target: '_self' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '初始化配置', link: '/guide/config' },
            { text: '本地开发', link: '/guide/local-development' },
            { text: '版本历史', link: '/guide/changelog' },
            { text: '示例 Demo 说明', link: '/guide/demo' },
          ],
        },
      ],
      '/components/': [
        {
          text: '表单',
          items: [
            { text: 'DataForm', link: '/components/dataform' },
            { text: 'Options（动态项）', link: '/components/options' },
            { text: 'CommonQuery', link: '/components/query' },
          ],
        },
        {
          text: '表格',
          items: [{ text: 'DataTable', link: '/components/datatable' }],
        },
        {
          text: '弹窗',
          items: [{ text: 'commonDialogMethod', link: '/components/dialog' }],
        },
        {
          text: '工具',
          items: [
            { text: '操作列/排序/省略', link: '/components/utils' },
            { text: '上传', link: '/components/utils#上传工具' },
            { text: '权限与路由', link: '/components/utils#权限与路由' },
          ],
        },
        {
          text: '配置项',
          items: [
            { text: '配置项说明', link: '/components/config-options' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xmszm/core' },
    ],
    outline: [2, 3],
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    footer: {
      message: 'Released under the UNLICENSED License.',
      copyright: 'Copyright © 2024-present',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@xmszm/core': path.resolve(__dirname, '../../src'),
        core: path.resolve(__dirname, '../../src'),
        '@': path.resolve(__dirname, '../../src'),
      },
    },
  },
})
