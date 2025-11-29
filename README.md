# Zreview – 企业微信审批小程序（支持企业微信 + 个人微信双打开）




## 项目定位
让出差频繁的管理层和业务人员，**随时随地 30 秒完成审批**，彻底告别“领导不在公司就卡死”的尴尬。

## 核心优势
- 100% 无感登录：企业微信免登 + 个人微信扫码自动绑定
- 同时支持企业微信内嵌 + 普通微信打开（客户、外部顾问也能看）
- 配置化驱动：一条 JSON 配置即可新增/修改审批类型，无需二次开发
- 极致手机阅读体验：自动适配订单、费用、请假、合同等复杂多子表场景
- 双保险提醒 + 离线缓存，永远不漏批

### 主要特点

- 🚀 **即时响应**：实时接收审批通知，快速处理待办事项
- 📱 **移动优先**：专为移动端优化的界面设计，适配各种屏幕尺寸
- 🔐 **安全可靠**：基于企业微信身份认证，无需额外登录
- ⚙️ **灵活配置**：支持多种审批类型的自定义配置
- 🔄 **双向同步**：与ERP系统实时同步，确保数据一致性
- 📊 **全面追溯**：完整的审批历史记录，便于查询和审计

## 核心功能

### 1. 审批通知管理
- 实时推送待审批消息到企业微信
- 支持消息聚合和优先级设置
- 一键跳转到审批详情页面
- 未读消息提醒和角标显示

### 2. 审批处理
- 查看完整的审批内容和附件
- 查看审批流程和历史记录
- 支持同意/拒绝操作
- 可添加审批意见和备注
- 支持批量审批功能

### 3. 审批列表查询
- 待审批和已审批分类展示
- 多维度筛选功能：
  - 按审批人筛选
  - 按审批类型筛选
  - 按申请时间范围筛选
  - 按审批状态筛选
- 支持关键字搜索
- 列表数据分页加载

### 4. 多类型审批支持
- 请假审批
- 报销审批
- 采购审批
- 订单审批
- 自定义审批类型

## 使用场景
### 场景一：收到审批提醒 → 秒批
1. ERP 推送审批任务 → 企业微信消息卡片通知（可点击直接跳转）
2. 点击通知直达审批详情页
3. 一屏看清：申请人、金额、事由、附件、审批流进度
4. 大按钮「同意」「拒绝」，支持必填/选填备注
5. 提交即实时回写 ERP，申请人手机立刻收到“已通过”通知

### 场景二：主动查看审批列表
进入方式（任选其一）：
- 企业微信工作台 → Zreview 应用图标
- 企业微信/微信聊天中点击历史消息卡片
- 微信搜索小程序名称直接打开
功能：
- 待我审批 / 我已审批 / 我发起的 三 Tab 切换
- 支持按「审批类型」「申请人」「时间范围」「关键字」多维筛选
- 列表智能高亮：超24小时未审批自动标红

## 技术方案亮点（2025 最新最佳实践）

| 需求 | 实现方案 | 优势 |
|------|----------|------|
| 同时支持企业微信 + 个人微信 | 小程序选择「仅在企业微信内运行」关闭 → 普通微信也能打开 | 一套代码，两端通用，外部人员也能看单据 |
| 无感登录 | 企业微信内：wx.qy.login + 自建应用免登<br>个人微信：微信登录 + 后端返回临时二维码，企业微信扫码绑定 | 零账号密码，安全合规 |
| 配置化审批表单 | 后端维护 approval_types.json 配置表<br>字段支持 text、amount、date、image、table（子表）、attachment 等 | 新增审批类型只需改配置，0 发版 |
| 手机端极致展示 | 采用「卡片 + 折叠面板 + 表格自适应」方案<br>子表超过5行自动收起，点击展开 | 再复杂的订单也一目了然 |
| 定时拉取新任务 | 小程序前台每5分钟轮询一次<br>进入小程序立即刷新<br>支持微信后台存活时推送 | 不漏单、不卡单 |
| 本地缓存 | 全部列表和详情缓存到 storage，断网也能看历史 | 出差飞机地铁照样批 |
| 用户-ERP 账号映射 | 数据库表 user_mapping(userid, corp_id, erp_employee_id) | 精准回写审批人 |
| 审批结果回写 | 调用 ERP 标准 Restful/SOAP 接口，带数字签名 | 实时同步，杜绝不同步 |

## 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                    企业微信 / 个人微信                      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Zreview 小程序前端                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │审批列表页 │  │审批详情页 │  │个人中心页 │       │  │
│  │  └──────────┘  └──────────┘  └──────────┘       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    后端服务层                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │              API Gateway / 路由层                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │认证服务   │  │审批服务   │  │通知服务   │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │用户服务   │  │配置服务   │  │同步服务   │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────┘
           │                              │
           │                              │
           ▼                              ▼
┌──────────────────┐         ┌──────────────────────┐
│   本地数据库      │         │   ERP 系统接口        │
│                  │         │                      │
│  - 用户映射表     │         │  - 审批数据接口       │
│  - 审批缓存表     │         │  - 审批结果回传       │
│  - 配置表         │         │  - 用户信息接口       │
└──────────────────┘         └──────────────────────┘
```

### 核心组件说明

#### 前端层
- **小程序框架**：采用原生小程序或 UniApp/Taro 等跨平台框架
- **状态管理**：使用 Vuex/Redux 管理全局状态
- **UI组件库**：基于 WeUI 或其他小程序 UI 组件库

#### 后端服务层
- **认证服务**：处理企业微信登录和用户身份验证
- **审批服务**：核心业务逻辑，处理审批数据的增删改查
- **通知服务**：管理消息推送和通知
- **用户服务**：用户信息管理和ERP用户映射
- **配置服务**：管理审批类型配置和显示规则
- **同步服务**：定时从ERP拉取数据，同步审批结果

#### 数据层
- **本地数据库**：缓存审批数据，提高响应速度
- **ERP系统**：企业资源计划系统，审批数据的来源和最终归宿

### 数据流向

1. **审批数据获取流程**
   ```
   ERP系统 → 同步服务(定时任务) → 本地数据库 → API → 小程序前端
   ```

2. **审批处理流程**
   ```
   小程序前端 → API → 审批服务 → 本地数据库
                                 ↓
                          ERP系统接口(回传结果)
   ```

3. **消息推送流程**
   ```
   同步服务(检测新审批) → 通知服务 → 企业微信API → 用户手机
   ```

## 技术栈

### 前端技术
- **框架**：微信小程序原生开发 / UniApp / Taro
- **语言**：JavaScript / TypeScript
- **UI组件**：WeUI / Vant Weapp
- **状态管理**：Vuex / MobX / Redux
- **构建工具**：微信开发者工具 / Webpack / Vite
- **网络请求**：wx.request / axios适配

### 后端技术
- **开发语言**：Node.js / Python / Java / Go
- **Web框架**：Express / Koa / FastAPI / Spring Boot / Gin
- **数据库**：MySQL / PostgreSQL / MongoDB
- **缓存**：Redis
- **任务调度**：Cron / Bull / Celery
- **API文档**：Swagger / API Blueprint

### 基础设施
- **服务器**：阿里云 / 腾讯云 / AWS
- **容器化**：Docker / Kubernetes
- **反向代理**：Nginx
- **日志系统**：ELK Stack / 阿里云SLS
- **监控告警**：Prometheus + Grafana

### 第三方服务
- **企业微信API**：用户认证、消息推送
- **ERP系统API**：业务数据交互

## 技术要求

### 1. 小程序平台要求
- ✅ 使用企业微信小程序形式开发
- ✅ 支持在企业微信中打开
- ✅ 支持在个人微信中打开（需配置）
- ✅ 兼容iOS和Android平台
- ✅ 适配不同屏幕尺寸

### 2. 身份认证要求
- ✅ 集成企业微信登录
- ✅ 无需用户名密码，自动登录
- ✅ 建立企业微信用户与ERP用户的映射关系
- ✅ 支持多企业、多组织架构

### 3. 审批展示要求
- ✅ 不同类型的审批显示不同的字段
- ✅ 通过配置文件定义审批类型的显示规则
- ✅ 支持复杂数据结构（如订单明细、多条子记录）
- ✅ 自动将数据格式化为移动端友好的展示方式
- ✅ 支持图片、附件的预览

### 4. 数据同步要求
- ✅ 定时从ERP系统拉取新审批（建议5分钟间隔）
- ✅ 本地缓存待审批和已审批列表
- ✅ 实时同步审批结果到ERP
- ✅ 支持断网情况下的离线查看
- ✅ 网络恢复后自动同步

### 5. 性能要求
- ✅ 首屏加载时间 < 2秒
- ✅ 列表滚动流畅（60fps）
- ✅ 支持大数据量列表的分页加载
- ✅ 图片懒加载和压缩

### 6. 安全要求
- ✅ HTTPS加密传输
- ✅ API接口鉴权
- ✅ 敏感数据加密存储
- ✅ 操作日志记录
- ✅ 防止XSS、CSRF攻击

## 项目结构

```
zreview/
├── miniprogram/                # 小程序前端代码
│   ├── pages/                  # 页面文件
│   │   ├── index/              # 首页（审批列表）
│   │   ├── detail/             # 审批详情页
│   │   ├── filter/             # 筛选页
│   │   └── profile/            # 个人中心
│   ├── components/             # 组件
│   │   ├── approval-card/      # 审批卡片组件
│   │   ├── approval-form/      # 审批表单组件
│   │   ├── timeline/           # 时间线组件
│   │   └── empty-state/        # 空状态组件
│   ├── utils/                  # 工具函数
│   │   ├── request.js          # 网络请求封装
│   │   ├── storage.js          # 本地存储封装
│   │   └── format.js           # 数据格式化
│   ├── config/                 # 配置文件
│   │   ├── api.js              # API地址配置
│   │   └── approval-types.js   # 审批类型配置
│   ├── app.js                  # 小程序入口
│   ├── app.json                # 小程序配置
│   └── app.wxss                # 全局样式
│
├── server/                     # 后端服务代码
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   ├── services/           # 业务逻辑层
│   │   ├── models/             # 数据模型
│   │   ├── middlewares/        # 中间件
│   │   ├── routes/             # 路由
│   │   ├── utils/              # 工具函数
│   │   ├── config/             # 配置文件
│   │   └── app.js              # 应用入口
│   ├── tests/                  # 测试文件
│   ├── scripts/                # 脚本文件
│   └── package.json
│
├── config/                     # 审批配置文件
│   ├── approval-types/         # 审批类型定义
│   │   ├── leave.json          # 请假审批配置
│   │   ├── expense.json        # 报销审批配置
│   │   ├── purchase.json       # 采购审批配置
│   │   └── order.json          # 订单审批配置
│   └── display-rules.json      # 显示规则配置
│
├── docs/                       # 文档
│   ├── api/                    # API文档
│   ├── design/                 # 设计文档
│   └── deployment/             # 部署文档
│
├── scripts/                    # 脚本
│   ├── deploy.sh               # 部署脚本
│   └── sync.sh                 # 数据同步脚本
│
├── .gitignore
├── README.md
└── LICENSE
```

## 快速开始

### 环境准备

1. **安装开发工具**
   ```bash
   # 下载微信开发者工具
   # https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   ```

2. **安装Node.js环境**
   ```bash
   # 要求 Node.js >= 14.0.0
   node --version
   npm --version
   ```

3. **安装依赖**
   ```bash
   # 前端依赖
   cd miniprogram
   npm install

   # 后端依赖
   cd ../server
   npm install
   ```

### 配置小程序

1. **注册企业微信小程序**
   - 登录企业微信管理后台
   - 创建小程序应用
   - 获取 AppID 和 AppSecret

2. **配置开发者工具**
   - 打开微信开发者工具
   - 导入项目，填入 AppID
   - 选择 miniprogram 目录

3. **配置后端接口地址**
   ```javascript
   // miniprogram/config/api.js
   module.exports = {
     baseURL: 'https://your-api-domain.com',
     timeout: 10000
   }
   ```

### 启动项目

1. **启动后端服务**
   ```bash
   cd server
   npm run dev
   # 服务运行在 http://localhost:3000
   ```

2. **启动小程序**
   - 在微信开发者工具中点击"编译"
   - 选择"预览"生成二维码
   - 使用企业微信扫码预览

### 测试账号

开发环境提供测试账号用于调试：
```
测试账号：test_user_001
ERP用户ID：10001
所属部门：技术部
```

## 配置说明

### 审批类型配置

审批类型配置文件位于 `config/approval-types/` 目录，采用 JSON 格式定义每种审批的展示规则。

#### 请假审批配置示例

```json
{
  "type": "leave",
  "name": "请假审批",
  "icon": "calendar",
  "color": "#1989fa",
  "fields": [
    {
      "key": "applicant",
      "label": "申请人",
      "type": "text",
      "required": true
    },
    {
      "key": "leaveType",
      "label": "请假类型",
      "type": "select",
      "options": ["事假", "病假", "年假", "调休"],
      "required": true
    },
    {
      "key": "dateRange",
      "label": "请假时间",
      "type": "daterange",
      "required": true
    },
    {
      "key": "duration",
      "label": "请假天数",
      "type": "number",
      "unit": "天",
      "required": true
    },
    {
      "key": "reason",
      "label": "请假事由",
      "type": "textarea",
      "maxLength": 200,
      "required": true
    },
    {
      "key": "attachments",
      "label": "附件",
      "type": "file",
      "accept": ["image", "pdf"],
      "maxCount": 3,
      "required": false
    }
  ],
  "displayRules": {
    "list": ["applicant", "leaveType", "dateRange"],
    "detail": ["applicant", "leaveType", "dateRange", "duration", "reason", "attachments"]
  }
}
```

#### 订单审批配置示例（包含子记录）

```json
{
  "type": "order",
  "name": "订单审批",
  "icon": "shopping-cart",
  "color": "#07c160",
  "fields": [
    {
      "key": "orderNo",
      "label": "订单号",
      "type": "text"
    },
    {
      "key": "customer",
      "label": "客户名称",
      "type": "text"
    },
    {
      "key": "totalAmount",
      "label": "订单金额",
      "type": "money",
      "currency": "CNY"
    },
    {
      "key": "items",
      "label": "订单明细",
      "type": "table",
      "columns": [
        { "key": "productName", "label": "产品名称", "width": "40%" },
        { "key": "quantity", "label": "数量", "width": "20%" },
        { "key": "price", "label": "单价", "width": "20%" },
        { "key": "amount", "label": "金额", "width": "20%" }
      ]
    }
  ]
}
```

### ERP集成配置

```javascript
// server/src/config/erp.js
module.exports = {
  // ERP系统接口地址
  baseURL: 'https://erp.your-company.com/api',

  // API认证信息
  auth: {
    apiKey: process.env.ERP_API_KEY,
    apiSecret: process.env.ERP_API_SECRET
  },

  // 同步配置
  sync: {
    interval: 5 * 60 * 1000,  // 5分钟
    batchSize: 100,            // 每批次拉取数量
    maxRetries: 3              // 最大重试次数
  },

  // 接口路径
  endpoints: {
    getApprovals: '/approvals/pending',
    submitApproval: '/approvals/submit',
    getUserInfo: '/users/:userId',
    getApprovalDetail: '/approvals/:approvalId'
  }
}
```

### 企业微信配置

```javascript
// server/src/config/wechat.js
module.exports = {
  corpId: process.env.WECHAT_CORP_ID,
  agentId: process.env.WECHAT_AGENT_ID,
  secret: process.env.WECHAT_SECRET,

  // 消息推送配置
  message: {
    template: {
      title: '【审批通知】您有新的审批待处理',
      description: '{{applicant}}提交的{{approvalType}}需要您审批',
      url: 'pages/detail/index?id={{approvalId}}'
    }
  }
}
```

## API接口

### 认证相关

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "code": "企业微信登录code"
}

Response:
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "jwt_token_here",
    "userInfo": {
      "userId": "10001",
      "name": "张三",
      "avatar": "https://...",
      "department": "技术部"
    }
  }
}
```

### 审批相关

#### 获取审批列表
```
GET /api/approvals?status=pending&page=1&pageSize=20
Authorization: Bearer {token}

Response:
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "A20231129001",
        "type": "leave",
        "typeName": "请假审批",
        "applicant": "李四",
        "submitTime": "2023-11-29 10:30:00",
        "status": "pending",
        "summary": "李四申请事假2天"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 获取审批详情
```
GET /api/approvals/:id
Authorization: Bearer {token}

Response:
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "A20231129001",
    "type": "leave",
    "status": "pending",
    "formData": {
      "applicant": "李四",
      "leaveType": "事假",
      "dateRange": ["2023-12-01", "2023-12-02"],
      "duration": 2,
      "reason": "家中有事需要处理"
    },
    "approvalFlow": [
      {
        "step": 1,
        "approver": "张三",
        "status": "pending",
        "comment": "",
        "time": ""
      }
    ]
  }
}
```

#### 提交审批结果
```
POST /api/approvals/:id/submit
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "action": "approve",  // approve | reject
  "comment": "同意"
}

Response:
{
  "code": 0,
  "message": "提交成功"
}
```

完整API文档请参考：[docs/api/README.md](docs/api/README.md)

## 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 Airbnb JavaScript Style Guide
- 提交代码前运行 `npm run lint`

### Git工作流

1. 从 `develop` 分支创建功能分支
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 提交代码，遵循 Conventional Commits 规范
   ```bash
   git commit -m "feat: 添加审批列表筛选功能"
   ```

3. 推送并创建 Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

### 本地开发调试

1. **使用Mock数据**
   ```javascript
   // miniprogram/utils/request.js
   const USE_MOCK = true;  // 开启Mock模式
   ```

2. **查看日志**
   ```bash
   # 后端日志
   tail -f server/logs/app.log

   # 小程序日志
   # 在微信开发者工具的控制台查看
   ```

3. **数据库调试**
   ```bash
   # 连接本地数据库
   mysql -u root -p zreview_dev
   ```

### 单元测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- approval.test.js

# 查看测试覆盖率
npm run test:coverage
```

## 部署说明

### 开发环境部署

```bash
# 1. 构建前端
cd miniprogram
npm run build:dev

# 2. 上传小程序代码
# 使用微信开发者工具上传

# 3. 部署后端
cd server
npm run deploy:dev
```

### 生产环境部署

#### 方式一：传统部署

```bash
# 1. 构建
npm run build:prod

# 2. 上传代码到服务器
scp -r dist/ user@server:/app/zreview/

# 3. 启动服务
ssh user@server
cd /app/zreview
pm2 start ecosystem.config.js --env production
```

#### 方式二：Docker部署

```bash
# 1. 构建镜像
docker build -t zreview:latest .

# 2. 启动容器
docker-compose up -d

# 3. 查看日志
docker-compose logs -f
```

#### 方式三：Kubernetes部署

```bash
# 1. 应用配置
kubectl apply -f k8s/

# 2. 查看状态
kubectl get pods -n zreview

# 3. 查看日志
kubectl logs -f deployment/zreview-server -n zreview
```

### 小程序发布

1. 在微信开发者工具上传代码
2. 登录企业微信管理后台
3. 提交审核
4. 审核通过后发布

### 环境变量配置

```bash
# .env.production
NODE_ENV=production
PORT=3000

# 数据库配置
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=zreview
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Redis配置
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# 企业微信配置
WECHAT_CORP_ID=your-corp-id
WECHAT_AGENT_ID=your-agent-id
WECHAT_SECRET=your-secret

# ERP配置
ERP_API_KEY=your-erp-api-key
ERP_API_SECRET=your-erp-api-secret
```

## 常见问题

### Q1: 小程序无法登录？
**A:** 检查以下几点：
1. 确认企业微信 AppID 配置正确
2. 检查服务器域名是否已在小程序后台配置
3. 确认后端登录接口是否正常
4. 查看控制台是否有错误日志

### Q2: 审批列表数据不更新？
**A:** 可能原因：
1. 同步任务未正常运行，检查定时任务状态
2. ERP接口调用失败，查看后端日志
3. 缓存未清理，尝试下拉刷新

### Q3: 消息推送收不到？
**A:** 排查步骤：
1. 确认用户已关注企业微信应用
2. 检查消息推送配置是否正确
3. 查看企业微信消息推送日志
4. 确认用户未在免打扰时间段

### Q4: 审批提交后ERP未同步？
**A:** 检查：
1. ERP接口是否正常
2. 网络连接是否畅通
3. 查看错误日志和重试队列

### Q5: 图片无法显示？
**A:** 可能原因：
1. 图片URL未配置到小程序域名白名单
2. 图片服务器不支持HTTPS
3. 图片URL已过期

更多问题请查看 [Wiki](https://github.com/your-org/zreview/wiki) 或提交 [Issue](https://github.com/your-org/zreview/issues)

## 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ⭐ 为项目点Star

### 提交Issue

在提交Issue前，请先搜索是否已有相关Issue。新Issue应包含：

- 清晰的标题
- 详细的问题描述
- 复现步骤（如果是Bug）
- 期望的行为
- 实际的行为
- 截图（如果适用）
- 环境信息（操作系统、微信版本等）

### 提交Pull Request

1. Fork本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### Commit消息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链更改

示例：
```
feat(approval): 添加批量审批功能

- 支持在列表页选择多个审批项
- 添加批量同意/拒绝按钮
- 优化审批提交流程

Closes #123
```

## 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 联系我们

- 项目主页：[https://github.com/your-org/zreview](https://github.com/your-org/zreview)
- 问题反馈：[https://github.com/your-org/zreview/issues](https://github.com/your-org/zreview/issues)
- 邮箱：dev@your-company.com

---

<p align="center">
  Made with ❤️ by Your Company
</p>
