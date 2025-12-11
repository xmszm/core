<template>
  <div class="introduction-page">
    <n-card class="intro-card">
      <template #header>
        <div class="header-content">
          <h1 class="title">@xmszm/core</h1>
          <n-tag type="info" size="small">v0.0.1</n-tag>
        </div>
      </template>

      <div class="content">
        <n-space vertical :size="24">
          <!-- 项目简介 -->
          <section>
            <h2 class="section-title">
              <n-icon :component="BookOutline" />
              项目简介
            </h2>
            <p class="description">
              <strong>@xmszm/core</strong> 是一个基于 Vue 3 + Naive UI 的组件与工具库，提供开箱即用的配置式表单、表格、弹窗等常用组件，以及丰富的工具函数集合。
            </p>
          </section>

          <!-- 核心特性 -->
          <section>
            <h2 class="section-title">
              <n-icon :component="SparklesOutline" />
              核心特性
            </h2>
            <n-grid :cols="2" :x-gap="16" :y-gap="16">
              <n-gi>
                <n-card class="feature-card">
                  <n-space vertical :size="8">
                    <div class="feature-icon">
                      <n-icon :component="DocumentTextOutline" size="24" />
                    </div>
                    <h3 class="feature-title">配置化表单</h3>
                    <p class="feature-desc">
                      通过 Options 定义字段，自动生成 rules，轻松构建复杂表单
                    </p>
                  </n-space>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="feature-card">
                  <n-space vertical :size="8">
                    <div class="feature-icon">
                      <n-icon :component="GridOutline" size="24" />
                    </div>
                    <h3 class="feature-title">表格增强</h3>
                    <p class="feature-desc">
                      内置操作列创建器、排序、筛选、虚拟滚动与省略 tooltip
                    </p>
                  </n-space>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="feature-card">
                  <n-space vertical :size="8">
                    <div class="feature-icon">
                      <n-icon :component="SquareOutline" size="24" />
                    </div>
                    <h3 class="feature-title">弹窗集成</h3>
                    <p class="feature-desc">
                      commonDialogMethod 将表单与弹窗能力合并，减少样板代码
                    </p>
                  </n-space>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="feature-card">
                  <n-space vertical :size="8">
                    <div class="feature-icon">
                      <n-icon :component="ConstructOutline" size="24" />
                    </div>
                    <h3 class="feature-title">实用工具</h3>
                    <p class="feature-desc">
                      上传、权限、路由 meta 初始化、数组对象转换等常用方法
                    </p>
                  </n-space>
                </n-card>
              </n-gi>
            </n-grid>
          </section>

          <!-- 主要组件 -->
          <section>
            <h2 class="section-title">
              <n-icon :component="CubeOutline" />
              主要组件
            </h2>
            <n-list>
              <n-list-item>
                <n-thing title="DataForm" description="配置式表单组件，支持多种输入方式">
                  <template #avatar>
                    <n-icon :component="DocumentTextOutline" />
                  </template>
                </n-thing>
              </n-list-item>
              <n-list-item>
                <n-thing title="DataTable" description="增强型表格组件，支持排序、筛选、操作列">
                  <template #avatar>
                    <n-icon :component="GridOutline" />
                  </template>
                </n-thing>
              </n-list-item>
              <n-list-item>
                <n-thing title="CommonQuery" description="通用查询组件，快速构建查询表单">
                  <template #avatar>
                    <n-icon :component="SearchOutline" />
                  </template>
                </n-thing>
              </n-list-item>
              <n-list-item>
                <n-thing title="commonDialogMethod" description="弹窗方法，集成表单与弹窗功能">
                  <template #avatar>
                    <n-icon :component="SquareOutline" />
                  </template>
                </n-thing>
              </n-list-item>
              <n-list-item>
                <n-thing title="Options" description="选项配置组件，统一管理表单字段">
                  <template #avatar>
                    <n-icon :component="OptionsOutline" />
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </section>

          <!-- 工具函数 -->
          <section>
            <h2 class="section-title">
              <n-icon :component="HammerOutline" />
              工具函数
            </h2>
            <n-space :size="8" wrap>
              <n-tag>upload</n-tag>
              <n-tag>auth</n-tag>
              <n-tag>config</n-tag>
              <n-tag>array</n-tag>
              <n-tag>object</n-tag>
              <n-tag>time</n-tag>
              <n-tag>ellipsis</n-tag>
              <n-tag>initRouteMeta</n-tag>
            </n-space>
          </section>

          <!-- 技术栈 -->
          <section>
            <h2 class="section-title">
              <n-icon :component="CodeWorkingOutline" />
              技术栈
            </h2>
            <n-space :size="8" wrap>
              <n-tag type="success">Vue 3</n-tag>
              <n-tag type="success">Naive UI</n-tag>
              <n-tag type="info">Vite</n-tag>
              <n-tag type="info">VitePress</n-tag>
              <n-tag type="warning">Day.js</n-tag>
              <n-tag type="warning">Lodash</n-tag>
            </n-space>
          </section>

          <!-- 快速开始 -->
          <section>
            <h2 class="section-title">
              <n-icon :component="RocketOutline" />
              快速开始
            </h2>
            <n-card class="code-card">
              <n-code :code="installCode" language="bash" />
            </n-card>
            <n-card class="code-card">
              <n-code :code="usageCode" language="javascript" />
            </n-card>
          </section>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import {
  BookOutline,
  CodeWorkingOutline,
  ConstructOutline,
  CubeOutline,
  DocumentTextOutline,
  GridOutline,
  HammerOutline,
  OptionsOutline,
  RocketOutline,
  SearchOutline,
  SparklesOutline,
  SquareOutline,
} from '@vicons/ionicons5'
import {
  NCard,
  NCode,
  NGrid,
  NGi,
  NIcon,
  NList,
  NListItem,
  NSpace,
  NTag,
  NThing,
} from 'naive-ui'

const installCode = `npm install @xmszm/core

# 或
pnpm add @xmszm/core
yarn add @xmszm/core`

const usageCode = `import { DataForm, DataTable, CommonQuery } from '@xmszm/core'
import '@xmszm/core/dist/style.css'

// 使用组件
<DataForm :options="formOptions" />
<DataTable :data="tableData" :columns="columns" />
<CommonQuery :query="query" :options="queryOptions" />`
</script>

<style scoped lang="less">
.introduction-page {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.intro-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #18a058;
}

.content {
  padding: 8px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.description {
  margin: 0;
  line-height: 1.8;
  color: #666;
  font-size: 15px;
}

.feature-card {
  height: 100%;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.feature-icon {
  color: #18a058;
}

.feature-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.feature-desc {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.code-card {
  margin-top: 12px;
}
</style>

