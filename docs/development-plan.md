# Zreview 企业微信审批小程序 - 最小化演示原型开发方案

## 项目概述

**目标**: 构建一个可演示的审批小程序原型,验证产品方向和核心交互流程

**技术栈**:
- 前端: UniApp (Vue 3 + TypeScript)
- 后端: Node.js + Koa
- 数据库: PostgreSQL
- 工具: Vite, ESLint, Prettier

**实现范围** (Minimal Demo):
- ✅ 基础UI框架和页面结构
- ✅ 模拟数据展示
- ✅ 核心交互流程(查看列表、详情、审批操作)
- ✅ 简化的认证流程
- ❌ 暂不包含: ERP集成、企业微信消息推送、复杂的用户权限管理

---

## 阶段一: 项目初始化

### 1.1 目录结构创建

```
zreview/
├── .gitignore
├── README.md
├── package.json                    # 根项目管理
│
├── miniprogram/                    # UniApp 前端
│   ├── src/
│   │   ├── pages/                  # 页面
│   │   │   ├── index/              # 审批列表页
│   │   │   │   ├── index.vue
│   │   │   │   └── components/
│   │   │   │       └── ApprovalCard.vue
│   │   │   ├── detail/             # 审批详情页
│   │   │   │   ├── index.vue
│   │   │   │   └── components/
│   │   │   │       ├── ApprovalForm.vue
│   │   │   │       └── ApprovalTimeline.vue
│   │   │   ├── login/              # 登录页(简化版)
│   │   │   │   └── index.vue
│   │   │   └── profile/            # 个人中心
│   │   │       └── index.vue
│   │   ├── components/             # 全局组件
│   │   │   ├── EmptyState.vue      # 空状态
│   │   │   └── LoadingSpinner.vue  # 加载动画
│   │   ├── api/                    # API 请求
│   │   │   ├── request.ts          # axios 封装
│   │   │   └── approval.ts         # 审批相关接口
│   │   ├── store/                  # Pinia 状态管理
│   │   │   ├── index.ts
│   │   │   ├── user.ts             # 用户状态
│   │   │   └── approval.ts         # 审批状态
│   │   ├── utils/                  # 工具函数
│   │   │   ├── format.ts           # 格式化函数
│   │   │   └── storage.ts          # 本地存储
│   │   ├── types/                  # TypeScript 类型定义
│   │   │   └── approval.ts
│   │   ├── mock/                   # 模拟数据
│   │   │   └── approvals.ts
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── manifest.json           # UniApp 配置
│   │   └── pages.json              # 页面路由配置
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                         # Node.js 后端
│   ├── src/
│   │   ├── app.ts                  # 应用入口
│   │   ├── routes/                 # 路由
│   │   │   ├── index.ts
│   │   │   ├── auth.ts             # 认证路由
│   │   │   └── approval.ts         # 审批路由
│   │   ├── controllers/            # 控制器
│   │   │   ├── auth.controller.ts
│   │   │   └── approval.controller.ts
│   │   ├── services/               # 业务逻辑
│   │   │   └── approval.service.ts
│   │   ├── middleware/             # 中间件
│   │   │   ├── auth.middleware.ts  # 简化认证
│   │   │   └── error.middleware.ts # 错误处理
│   │   ├── config/                 # 配置
│   │   │   ├── index.ts
│   │   │   └── approval-types.ts   # 审批类型配置
│   │   ├── types/                  # 类型定义
│   │   │   └── approval.ts
│   │   └── mock/                   # 模拟数据
│   │       └── data.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
└── docs/                           # 文档
    ├── api.md                      # API 文档
    └── development-plan.md         # 本开发方案
```

### 1.2 核心依赖

**前端 (miniprogram/package.json)**:
```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "pinia": "^2.1.0",
    "axios": "^1.6.0",
    "@dcloudio/uni-app": "^3.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@types/node": "^20.10.0",
    "sass": "^1.69.0"
  }
}
```

**后端 (server/package.json)**:
```json
{
  "dependencies": {
    "koa": "^2.14.0",
    "koa-router": "^12.0.0",
    "koa-bodyparser": "^4.4.0",
    "koa-cors": "^0.0.16",
    "@koa/cors": "^4.0.0",
    "dotenv": "^16.3.0",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "@types/koa": "^2.14.0",
    "@types/koa-router": "^7.4.0",
    "@types/node": "^20.10.0"
  }
}
```

---

## 阶段二: 前端开发 (UniApp)

### 2.1 类型定义 (miniprogram/src/types/approval.ts)

```typescript
// 审批状态
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

// 审批类型
export type ApprovalType = 'leave' | 'expense' | 'purchase' | 'order'

// 字段类型
export type FieldType = 'text' | 'number' | 'amount' | 'date' | 'daterange' | 'textarea' | 'table' | 'image' | 'file'

// 审批字段配置
export interface ApprovalField {
  key: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  columns?: Array<{key: string, label: string, width?: string}>
}

// 审批类型配置
export interface ApprovalTypeConfig {
  type: ApprovalType
  name: string
  icon: string
  color: string
  fields: ApprovalField[]
  displayRules: {
    list: string[]      // 列表页显示字段
    detail: string[]    // 详情页显示字段
  }
}

// 审批项
export interface Approval {
  id: string
  type: ApprovalType
  typeName: string
  applicant: string
  applicantAvatar?: string
  submitTime: string
  status: ApprovalStatus
  summary: string
  formData: Record<string, any>
  approvalFlow: ApprovalFlowStep[]
}

// 审批流程节点
export interface ApprovalFlowStep {
  step: number
  approver: string
  status: ApprovalStatus | 'pending'
  comment?: string
  time?: string
}
```

### 2.2 模拟数据 (miniprogram/src/mock/approvals.ts)

提供至少 4 种审批类型的模拟数据:
- 请假审批 (3条)
- 报销审批 (2条)
- 采购订单审批 (2条,包含子表数据)
- 合同审批 (1条)

状态分布: pending(5条), approved(2条), rejected(1条)

### 2.3 核心页面

#### 2.3.1 审批列表页 (pages/index/index.vue)

**功能**:
- Tab切换: 待我审批 / 我已审批 / 我发起的
- 审批卡片展示(使用 ApprovalCard 组件)
- 下拉刷新、上拉加载
- 简单筛选(按类型)

**关键实现**:
```vue
<template>
  <view class="approval-list">
    <u-tabs v-model="activeTab" @change="handleTabChange">
      <u-tab title="待我审批" name="pending" :badge="pendingCount" />
      <u-tab title="我已审批" name="completed" />
      <u-tab title="我发起的" name="initiated" />
    </u-tabs>

    <scroll-view
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      @refresherrefresh="onRefresh"
    >
      <approval-card
        v-for="item in approvalList"
        :key="item.id"
        :data="item"
        @click="goToDetail(item.id)"
      />

      <empty-state v-if="approvalList.length === 0" />
    </scroll-view>
  </view>
</template>
```

#### 2.3.2 审批详情页 (pages/detail/index.vue)

**功能**:
- 动态渲染表单字段(根据配置)
- 审批流程时间线
- 审批操作按钮(同意/拒绝)
- 支持添加审批意见

**关键实现**:
```vue
<template>
  <view class="approval-detail">
    <!-- 头部信息 -->
    <view class="header">
      <view class="type-badge" :style="{background: typeConfig.color}">
        {{ typeConfig.name }}
      </view>
      <view class="status-badge" :class="approval.status">
        {{ statusText }}
      </view>
    </view>

    <!-- 动态表单展示 -->
    <approval-form :config="typeConfig" :data="approval.formData" />

    <!-- 审批流程 -->
    <approval-timeline :steps="approval.approvalFlow" />

    <!-- 操作按钮 (仅待审批状态显示) -->
    <view v-if="approval.status === 'pending'" class="actions">
      <button @click="handleReject" class="btn-reject">拒绝</button>
      <button @click="handleApprove" class="btn-approve">同意</button>
    </view>
  </view>
</template>
```

#### 2.3.3 登录页 (pages/login/index.vue)

**简化实现**:
- 输入用户名(模拟登录,无密码)
- 支持的测试用户:
  - `zhangsan` (张三 - 部门经理)
  - `lisi` (李四 - 财务主管)
  - `wangwu` (王五 - 采购专员)
- 登录后保存 token 到本地存储

### 2.4 核心组件

#### ApprovalCard.vue
- 展示审批摘要信息
- 高亮显示关键字段(金额、申请人等)
- 状态标识

#### ApprovalForm.vue
- 根据 typeConfig 动态渲染字段
- 支持多种字段类型展示
- 表格类型数据支持折叠(超过5行)

#### ApprovalTimeline.vue
- 垂直时间线样式
- 区分已完成/进行中/待审批节点
- 显示审批意见

### 2.5 状态管理 (Pinia)

**user store**:
- 用户信息
- token
- 登录/登出方法

**approval store**:
- 审批列表(按状态分类)
- 当前审批详情
- 审批类型配置
- 获取列表、详情、提交审批等方法

### 2.6 API 请求封装

```typescript
// api/request.ts
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
})

// 请求拦截器 - 添加 token
request.interceptors.request.use(config => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  response => response.data,
  error => {
    uni.showToast({ title: error.message, icon: 'none' })
    return Promise.reject(error)
  }
)

export default request
```

---

## 阶段三: 后端开发 (Node.js + Koa)

### 3.1 应用入口 (server/src/app.ts)

```typescript
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import router from './routes'
import errorMiddleware from './middleware/error.middleware'

const app = new Koa()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(bodyParser())
app.use(errorMiddleware)
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

### 3.2 路由定义

**routes/auth.ts** - 认证路由:
- `POST /api/auth/login` - 登录(模拟)

**routes/approval.ts** - 审批路由:
- `GET /api/approvals` - 获取审批列表
  - Query: `status` (pending/approved/rejected), `type`, `page`, `pageSize`
- `GET /api/approvals/:id` - 获取审批详情
- `POST /api/approvals/:id/submit` - 提交审批结果
  - Body: `{action: 'approve'|'reject', comment: string}`
- `GET /api/approval-types` - 获取审批类型配置

### 3.3 控制器实现

**controllers/approval.controller.ts**:
```typescript
import { Context } from 'koa'
import ApprovalService from '../services/approval.service'

export class ApprovalController {
  // 获取列表
  static async getList(ctx: Context) {
    const { status, type, page = 1, pageSize = 20 } = ctx.query
    const result = await ApprovalService.getApprovals({
      status: status as string,
      type: type as string,
      page: Number(page),
      pageSize: Number(pageSize)
    })
    ctx.body = { code: 0, message: 'success', data: result }
  }

  // 获取详情
  static async getDetail(ctx: Context) {
    const { id } = ctx.params
    const approval = await ApprovalService.getApprovalById(id)
    if (!approval) {
      ctx.status = 404
      ctx.body = { code: 404, message: 'Approval not found' }
      return
    }
    ctx.body = { code: 0, message: 'success', data: approval }
  }

  // 提交审批
  static async submit(ctx: Context) {
    const { id } = ctx.params
    const { action, comment } = ctx.request.body
    const user = ctx.state.user // 从认证中间件获取

    await ApprovalService.submitApproval(id, {
      action,
      comment,
      approver: user.name
    })

    ctx.body = { code: 0, message: '提交成功' }
  }

  // 获取审批类型配置
  static async getTypes(ctx: Context) {
    const types = ApprovalService.getApprovalTypes()
    ctx.body = { code: 0, message: 'success', data: types }
  }
}
```

### 3.4 服务层 (使用模拟数据)

**services/approval.service.ts**:
- 初始化时从 `mock/data.ts` 加载数据到内存
- 实现增删改查逻辑(基于内存数据)
- 后续可替换为真实数据库操作

### 3.5 审批类型配置 (config/approval-types.ts)

定义 4 种审批类型的完整配置:
```typescript
export const approvalTypes: ApprovalTypeConfig[] = [
  {
    type: 'leave',
    name: '请假审批',
    icon: 'calendar',
    color: '#1989fa',
    fields: [
      { key: 'applicant', label: '申请人', type: 'text', required: true },
      { key: 'leaveType', label: '请假类型', type: 'text', required: true },
      { key: 'dateRange', label: '请假时间', type: 'daterange', required: true },
      { key: 'duration', label: '请假天数', type: 'number', required: true },
      { key: 'reason', label: '请假事由', type: 'textarea', required: true }
    ],
    displayRules: {
      list: ['applicant', 'leaveType', 'dateRange'],
      detail: ['applicant', 'leaveType', 'dateRange', 'duration', 'reason']
    }
  },
  // ... expense, purchase, order 配置
]
```

### 3.6 简化认证中间件

```typescript
// middleware/auth.middleware.ts
export const authMiddleware = async (ctx: Context, next: Function) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    ctx.status = 401
    ctx.body = { code: 401, message: 'Unauthorized' }
    return
  }

  // 简化版: 直接从 token 解析用户信息(实际应使用 JWT)
  const mockUsers = {
    'token_zhangsan': { id: '1', name: '张三', role: 'manager' },
    'token_lisi': { id: '2', name: '李四', role: 'finance' },
    'token_wangwu': { id: '3', name: '王五', role: 'staff' }
  }

  ctx.state.user = mockUsers[token] || mockUsers['token_zhangsan']
  await next()
}
```

---

## 阶段四: 配置与集成

### 4.1 环境配置

**server/.env**:
```env
NODE_ENV=development
PORT=3000
```

**miniprogram/src/config/index.ts**:
```typescript
export const config = {
  apiBaseURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : 'https://api.your-domain.com/api',
  timeout: 10000
}
```

### 4.2 UniApp 页面配置 (pages.json)

```json
{
  "pages": [
    {
      "path": "pages/login/index",
      "style": { "navigationBarTitleText": "登录" }
    },
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "审批中心",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/detail/index",
      "style": { "navigationBarTitleText": "审批详情" }
    },
    {
      "path": "pages/profile/index",
      "style": { "navigationBarTitleText": "个人中心" }
    }
  ],
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "审批",
        "iconPath": "static/tab-approval.png",
        "selectedIconPath": "static/tab-approval-active.png"
      },
      {
        "pagePath": "pages/profile/index",
        "text": "我的",
        "iconPath": "static/tab-profile.png",
        "selectedIconPath": "static/tab-profile-active.png"
      }
    ]
  }
}
```

### 4.3 本地存储策略

使用 `uni.storage` API:
- `token`: 登录令牌
- `userInfo`: 用户信息
- `cachedApprovals`: 缓存的审批列表(离线可查看)

---

## 阶段五: 样式与交互优化

### 5.1 设计规范

**颜色**:
- 主色: `#1989fa` (蓝色 - 审批通过)
- 危险色: `#ee0a24` (红色 - 审批拒绝)
- 警告色: `#ff976a` (橙色 - 待审批)
- 文本: `#323233` (主文本), `#969799` (次要文本)

**字体**:
- 标题: 16px / bold
- 正文: 14px / regular
- 辅助: 12px / regular

**间距**:
- 页面边距: 16px
- 卡片间距: 12px
- 内部间距: 8px / 12px

### 5.2 响应式适配

- 使用 rpx 单位(UniApp 自动转换)
- 卡片宽度: 100% - 32rpx
- 表格在小屏幕自动横向滚动
- 长文本自动截断,点击展开

### 5.3 交互反馈

- 按钮点击: 0.3s 过渡效果
- 列表项点击: 背景高亮
- 加载状态: 骨架屏或 loading 组件
- 操作成功/失败: Toast 提示

---

## 阶段六: 测试与演示准备

### 6.1 功能测试清单

**登录流程**:
- [ ] 使用测试账号登录成功
- [ ] Token 正确保存到本地
- [ ] 登出清除本地数据

**审批列表**:
- [ ] 三个 Tab 正确切换
- [ ] 待审批列表显示正确数量
- [ ] 点击卡片跳转到详情页
- [ ] 下拉刷新功能正常
- [ ] 按类型筛选正常

**审批详情**:
- [ ] 字段动态渲染正确
- [ ] 表格数据展示正常
- [ ] 审批流程时间线显示正确
- [ ] 同意/拒绝操作成功
- [ ] 操作后状态更新

**离线功能**:
- [ ] 无网络时能查看缓存的列表
- [ ] 网络恢复后自动同步

### 6.2 演示场景

**场景1: 查看待审批**
1. 登录为"张三"(部门经理)
2. 进入"待我审批" Tab,显示 3 条待审批
3. 查看一条请假审批详情

**场景2: 审批操作**
1. 在详情页点击"同意"
2. 添加审批意见"同意请假"
3. 提交成功,返回列表
4. 该审批从"待审批"移到"已审批"

**场景3: 复杂数据展示**
1. 查看采购订单审批
2. 展示包含子表的订单明细
3. 演示表格数据的展示和折叠

**场景4: 多类型审批**
1. 切换不同审批类型查看
2. 展示配置化驱动的不同表单结构

### 6.3 数据准备

- 准备 8-10 条模拟审批数据
- 覆盖 4 种审批类型
- 包含不同状态(待审批、已通过、已拒绝)
- 至少 1 条包含复杂子表数据

---

## 开发顺序建议

### 第一天: 基础搭建
1. 创建项目目录结构
2. 初始化前后端项目(package.json, tsconfig.json)
3. 安装依赖
4. 配置 UniApp 和 Vite
5. 配置 Koa 服务器基础结构

### 第二天: 后端开发
1. 定义类型和接口
2. 创建模拟数据
3. 实现审批类型配置
4. 实现 API 路由和控制器
5. 测试 API 接口(使用 Postman)

### 第三天: 前端核心功能
1. 创建类型定义
2. 实现状态管理(Pinia stores)
3. 实现 API 请求封装
4. 开发登录页
5. 开发审批列表页

### 第四天: 前端详情与组件
1. 开发审批详情页
2. 开发 ApprovalCard 组件
3. 开发 ApprovalForm 组件(动态渲染)
4. 开发 ApprovalTimeline 组件
5. 开发个人中心页

### 第五天: 集成与优化
1. 前后端联调
2. 实现本地缓存
3. 优化样式和交互
4. 添加 loading 和 错误处理
5. 准备演示数据和场景

---

## 关键技术要点

### 配置化驱动实现

**核心思路**: 通过 JSON 配置定义审批类型,前端根据配置动态渲染表单

```typescript
// 动态渲染逻辑示例
<template>
  <view v-for="field in displayFields" :key="field.key">
    <!-- 文本字段 -->
    <view v-if="field.type === 'text'" class="field-item">
      <text class="label">{{ field.label }}</text>
      <text class="value">{{ formData[field.key] }}</text>
    </view>

    <!-- 表格字段 -->
    <view v-else-if="field.type === 'table'" class="field-table">
      <text class="label">{{ field.label }}</text>
      <table-view :columns="field.columns" :data="formData[field.key]" />
    </view>

    <!-- 其他字段类型... -->
  </view>
</template>

<script>
const displayFields = computed(() => {
  const config = approvalTypes.find(t => t.type === approval.type)
  return config.fields.filter(f =>
    config.displayRules.detail.includes(f.key)
  )
})
</script>
```

### 状态管理最佳实践

```typescript
// store/approval.ts
export const useApprovalStore = defineStore('approval', {
  state: () => ({
    approvals: [] as Approval[],
    currentApproval: null as Approval | null,
    typeConfigs: approvalTypes
  }),

  getters: {
    pendingApprovals: (state) =>
      state.approvals.filter(a => a.status === 'pending'),

    approvedApprovals: (state) =>
      state.approvals.filter(a => a.status === 'approved'),

    getTypeConfig: (state) => (type: ApprovalType) =>
      state.typeConfigs.find(t => t.type === type)
  },

  actions: {
    async fetchApprovals(params) {
      const res = await approvalAPI.getList(params)
      this.approvals = res.list
      // 缓存到本地
      uni.setStorageSync('cachedApprovals', res.list)
    },

    async submitApproval(id, data) {
      await approvalAPI.submit(id, data)
      // 更新本地状态
      const index = this.approvals.findIndex(a => a.id === id)
      if (index > -1) {
        this.approvals[index].status = data.action === 'approve' ? 'approved' : 'rejected'
      }
    }
  }
})
```

---

## 后续扩展方向

完成最小化演示后,可按以下优先级扩展:

1. **Phase 2 - 完整认证**: 集成企业微信 OAuth 登录
2. **Phase 3 - 消息推送**: 接入企业微信消息 API
3. **Phase 4 - 数据库集成**: 替换模拟数据为 PostgreSQL
4. **Phase 5 - ERP 集成**: 对接真实 ERP 系统接口
5. **Phase 6 - 高级功能**: 批量审批、高级筛选、数据统计

---

## 预期成果

完成本方案后,将交付:

✅ 可在微信开发者工具中运行的 UniApp 小程序
✅ 可独立运行的 Node.js API 服务器
✅ 4 种不同类型的审批演示数据
✅ 完整的审批查看和操作流程
✅ 配置化驱动的审批表单展示
✅ 基础的本地缓存功能
✅ 演示文档和测试场景说明

**估计工作量**: 4-5 个工作日(单人开发)
