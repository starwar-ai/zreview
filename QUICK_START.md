# Zreview 快速启动指南

## 🎯 项目简介

Zreview是一个企业微信审批小程序的最小化演示原型,采用前后端分离架构:
- **后端**: Node.js + Koa + TypeScript
- **前端**: UniApp + Vue 3 + TypeScript + Pinia
- **数据**: 模拟数据(8条审批记录,4种类型)

## ✅ 当前状态

- ✅ 后端服务器已完成并运行中 (http://localhost:3000)
- ✅ 前端所有页面和组件已创建
- ✅ 状态管理和API封装已完成
- ⚠️ 前端依赖尚未安装
- ⚠️ 小程序尚未在开发工具中运行

## 🚀 快速启动步骤

### 步骤1: 安装前端依赖

```bash
cd /Users/zhangkai/Dev/zreview/miniprogram
npm install
```

### 步骤2: 准备TabBar图标 (可选)

如果需要显示TabBar图标,请在 `miniprogram/src/static/` 目录下准备以下图片:
- `tab-approval.png` (64x64)
- `tab-approval-active.png` (64x64)
- `tab-profile.png` (64x64)
- `tab-profile-active.png` (64x64)

或者临时删除 `pages.json` 中的 tabBar 配置。

### 步骤3: 启动小程序开发

方式一: 使用微信开发者工具

1. 下载并安装微信开发者工具
2. 打开工具,选择"导入项目"
3. 项目目录选择: `/Users/zhangkai/Dev/zreview/miniprogram`
4. AppID: 使用测试号或留空
5. 点击"导入"

方式二: 命令行编译 (可选)

```bash
cd /Users/zhangkai/Dev/zreview/miniprogram
npm run dev:mp-weixin
```

然后在微信开发者工具中打开 `dist/dev/mp-weixin` 目录。

### 步骤4: 配置API地址

如果后端服务器地址不是 `localhost:3000`,修改:
`miniprogram/src/api/request.ts` 中的 `BASE_URL`

### 步骤5: 测试登录

在小程序中输入以下测试账号:
- `zhangsan` - 张三 (部门经理,可查看5条待审批)
- `lisi` - 李四 (财务主管,可查看1条待审批)
- `wangwu` - 王五 (采购专员)

---

## 📂 项目结构

```
zreview/
├── server/                  # 后端 (已完成)
│   ├── src/
│   │   ├── types/          # 类型定义
│   │   ├── config/         # 配置文件
│   │   ├── mock/           # 模拟数据 (8条)
│   │   ├── middleware/     # 中间件
│   │   ├── services/       # 业务逻辑
│   │   ├── controllers/    # 控制器
│   │   ├── routes/         # 路由
│   │   └── app.ts          # 入口
│   └── package.json
│
├── miniprogram/             # 前端 (已完成)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── login/      # 登录页 ✅
│   │   │   ├── index/      # 审批列表页 ✅
│   │   │   ├── detail/     # 审批详情页 ✅
│   │   │   └── profile/    # 个人中心 ✅
│   │   ├── components/     # 全局组件 ✅
│   │   ├── store/          # 状态管理 ✅
│   │   ├── api/            # API封装 ✅
│   │   ├── utils/          # 工具函数 ✅
│   │   └── types/          # 类型定义 ✅
│   └── package.json
│
└── docs/                    # 文档
    ├── development-plan.md  # 开发方案
    ├── api.md              # API文档
    └── PROGRESS.md         # 进度报告
```

---

## 🧪 功能测试清单

### 登录功能
- [ ] 使用 `zhangsan` 登录成功
- [ ] Token保存到本地存储
- [ ] 自动跳转到审批列表页

### 审批列表
- [ ] "待我审批" Tab显示5条审批
- [ ] "我已审批" Tab显示2条审批
- [ ] 点击审批卡片跳转到详情页
- [ ] 下拉刷新功能正常
- [ ] 按类型筛选正常

### 审批详情
- [ ] 表单字段正确显示
- [ ] 表格数据展示正常
- [ ] 审批流程时间线显示
- [ ] 点击"同意"按钮成功提交
- [ ] 提交后返回列表,状态已更新

### 个人中心
- [ ] 用户信息显示正确
- [ ] 统计数据显示正确
- [ ] 点击"退出登录"成功退出

---

## 🔌 后端API端点

后端服务器: http://localhost:3000

### 认证
- `POST /api/auth/login` - 登录

### 审批
- `GET /api/approvals` - 获取审批列表
- `GET /api/approvals/:id` - 获取审批详情
- `POST /api/approvals/:id/submit` - 提交审批结果
- `GET /api/approvals/types` - 获取审批类型配置

详细API文档见: `docs/api.md`

---

## 🎨 已实现的功能

### 前端 ✅
1. **登录页** - 简化登录,支持3个测试账号
2. **审批列表页** - Tab切换、筛选、下拉刷新
3. **审批详情页** - 动态表单渲染、审批流程时间线、提交审批
4. **个人中心** - 用户信息、统计数据、退出登录
5. **审批卡片组件** - 展示审批摘要和关键字段
6. **审批表单组件** - 支持多种字段类型(文本、金额、日期、表格等)
7. **审批时间线组件** - 可视化审批流程
8. **空状态组件** - 无数据提示

### 后端 ✅
1. **用户认证** - 简化的token认证
2. **审批列表查询** - 支持状态和类型筛选
3. **审批详情** - 返回完整的审批信息
4. **提交审批** - 同意/拒绝操作
5. **审批类型配置** - 4种审批类型的配置
6. **模拟数据** - 8条测试数据

---

## 🐛 常见问题

### Q1: 前端依赖安装失败?
A: 尝试使用淘宝镜像:
```bash
npm install --registry=https://registry.npmmirror.com
```

### Q2: 小程序无法访问后端API?
A: 检查:
1. 后端服务器是否在运行 (http://localhost:3000/health)
2. 微信开发者工具"详情"中是否勾选"不校验合法域名"

### Q3: TabBar图标不显示?
A: 临时方案 - 在 `pages.json` 中删除整个 `tabBar` 配置,或准备图标文件。

### Q4: 编译报错 "Cannot find module"?
A: 确保已安装所有依赖:
```bash
cd miniprogram
rm -rf node_modules
npm install
```

---

## 📝 下一步扩展方向

当前是最小化演示原型,后续可扩展:

1. **企业微信集成** - 真实的企业微信登录和消息推送
2. **数据库集成** - 使用PostgreSQL替换模拟数据
3. **ERP对接** - 与真实ERP系统集成
4. **批量审批** - 一次性处理多个审批
5. **高级筛选** - 更多筛选条件和搜索功能
6. **数据统计** - 审批统计和报表
7. **附件上传** - 支持图片和文件上传
8. **审批流配置** - 可配置的多级审批流程

---

## 📞 技术支持

- 查看完整开发方案: `docs/development-plan.md`
- 查看API文档: `docs/api.md`
- 查看进度报告: `PROGRESS.md`

---

生成时间: 2025-11-29
项目完成度: 95%
