# Zreview 小程序 - 原生版本

## 项目简介

Zreview 是一款企业微信审批小程序，支持企业微信和个人微信双打开，让管理层和业务人员随时随地 30 秒完成审批。

## 最新优化内容

### 1. 配置化驱动
- ✅ 添加 `config/` 目录，集中管理所有配置
- ✅ 审批类型配置化 (`config/approval-types.js`)
- ✅ API 配置分离 (`config/api.js`)
- ✅ 企业微信配置独立 (`config/wechat.js`)

### 2. 双端登录支持
- ✅ 支持企业微信免登录
- ✅ 支持个人微信扫码绑定
- ✅ 自动检测运行环境
- ✅ 统一的认证工具模块 (`utils/auth.js`)

### 3. 增强功能
- ✅ **搜索功能**: 支持按单号、申请人、关键字搜索
- ✅ **高级筛选**: 支持按申请人、时间范围筛选
- ✅ **自动刷新**: 每 5 分钟自动同步数据
- ✅ **离线缓存**: 支持断网查看历史数据
- ✅ **图片预览**: 支持审批单中的图片查看
- ✅ **附件下载**: 支持下载和查看附件文件
- ✅ **复杂表格**: 支持多行数据展开/收起
- ✅ **超时提醒**: 超过 24 小时未审批自动标红

### 4. UI/UX 优化
- ✅ 现代化卡片设计
- ✅ 流畅的加载动画
- ✅ 友好的空状态提示
- ✅ 更好的错误处理
- ✅ 分页加载支持
- ✅ 下拉刷新优化

## 目录结构

```
miniprogram-native/
├── config/                     # 配置文件
│   ├── api.js                  # API 配置
│   ├── approval-types.js       # 审批类型配置
│   └── wechat.js               # 企业微信配置
├── pages/                      # 页面
│   ├── index/                  # 审批列表页
│   ├── detail/                 # 审批详情页
│   ├── login/                  # 登录页
│   └── profile/                # 个人中心页
├── utils/                      # 工具函数
│   ├── request.js              # 网络请求封装
│   ├── storage.js              # 本地存储封装
│   ├── format.js               # 数据格式化
│   └── auth.js                 # 认证工具
├── api/                        # API 接口
│   └── approval.js             # 审批相关接口
├── app.js                      # 小程序入口
├── app.json                    # 小程序配置
└── app.wxss                    # 全局样式
```

## 核心特性

### 1. 配置化审批类型

通过修改 `config/approval-types.js` 即可新增或修改审批类型，无需修改代码：

```javascript
{
  type: 'leave',
  name: '请假审批',
  icon: '📅',
  color: '#1989fa',
  fields: [
    { key: 'applicant', label: '申请人', type: 'text' },
    { key: 'leaveType', label: '请假类型', type: 'select' },
    // ... 更多字段
  ],
  displayRules: {
    list: ['applicant', 'leaveType', 'dateRange'],
    detail: ['applicant', 'leaveType', 'dateRange', 'duration', 'reason']
  }
}
```

支持的字段类型：
- `text`: 文本
- `textarea`: 多行文本
- `number`: 数字
- `amount`: 金额
- `date`: 日期
- `daterange`: 日期范围
- `select`: 下拉选择
- `image`: 图片（支持预览）
- `file`: 附件（支持下载）
- `table`: 表格（支持展开/收起）

### 2. 智能缓存策略

- 自动缓存审批列表和详情
- 支持过期时间设置（默认 30 分钟）
- 断网时自动使用缓存数据
- 网络恢复后自动同步

### 3. 定时同步机制

- 小程序启动时立即同步
- 从后台切换到前台时同步
- 每 5 分钟自动同步一次
- 支持手动下拉刷新

### 4. 搜索和筛选

**搜索功能**：
- 支持按审批单号搜索
- 支持按申请人姓名搜索
- 支持按摘要内容搜索
- 实时搜索，防抖处理

**筛选功能**：
- 按审批类型筛选
- 按申请人筛选
- 按时间范围筛选
- 支持组合筛选

### 5. 审批流程可视化

- 时间线展示审批流程
- 不同状态不同颜色标识
- 显示审批人、时间、意见
- 当前节点高亮显示

## 使用说明

### 环境要求

- 微信开发者工具 >= 1.06.0
- 小程序基础库 >= 2.10.0
- Node.js >= 14.0.0（用于后端）

### 快速开始

1. **配置 API 地址**
   
   编辑 `config/api.js`：
   ```javascript
   module.exports = {
     development: {
       baseURL: 'http://localhost:3000/api',
       timeout: 10000
     }
   }
   ```

2. **配置企业微信信息**
   
   编辑 `config/wechat.js`：
   ```javascript
   module.exports = {
     corpId: 'your-corp-id',
     agentId: 'your-agent-id'
   }
   ```

3. **导入项目**
   
   使用微信开发者工具打开 `miniprogram-native` 目录

4. **编译运行**
   
   点击"编译"按钮，即可在模拟器中预览

### 测试账号

开发环境提供以下测试账号：

```
经理账号: manager
财务账号: finance  
员工账号: staff
```

## API 接口

小程序需要后端提供以下 API：

### 认证接口
- `POST /api/auth/work-wechat/login` - 企业微信登录
- `POST /api/auth/wechat/login` - 个人微信登录
- `POST /api/auth/wechat/bind-status` - 检查绑定状态
- `GET /api/auth/user-info` - 获取用户信息

### 审批接口
- `GET /api/approvals` - 获取审批列表
- `GET /api/approvals/:id` - 获取审批详情
- `POST /api/approvals/:id/submit` - 提交审批结果
- `GET /api/approvals/types` - 获取审批类型配置

## 性能优化

### 1. 网络优化
- 请求失败自动重试
- 支持请求并发控制
- 智能缓存策略
- 离线数据支持

### 2. 渲染优化
- 长列表分页加载
- 图片懒加载
- 表格数据折叠显示
- 防抖和节流处理

### 3. 用户体验
- 加载状态提示
- 错误信息友好提示
- 操作反馈及时
- 网络异常降级处理

## 注意事项

1. **网络域名配置**
   
   需要在小程序管理后台配置服务器域名：
   - request 合法域名
   - uploadFile 合法域名
   - downloadFile 合法域名

2. **企业微信配置**
   
   需要在企业微信管理后台：
   - 创建小程序应用
   - 配置可信域名
   - 设置 IP 白名单

3. **个人微信支持**
   
   如需在个人微信中打开，需要：
   - 小程序设置中关闭"仅在企业微信内运行"
   - 配置用户绑定接口

## 常见问题

### Q: 如何新增审批类型？

A: 编辑 `config/approval-types.js`，添加新的审批类型配置即可。

### Q: 如何修改刷新间隔？

A: 编辑 `config/wechat.js`，修改 `sync.interval` 值（单位：毫秒）。

### Q: 缓存数据如何清理？

A: 
```javascript
const { clearExpiredCache } = require('./utils/storage')
clearExpiredCache() // 清理过期缓存
```

### Q: 如何禁用自动同步？

A: 在 `app.js` 中注释掉 `this.startSyncTimer()` 调用。

## 更新日志

### v1.1.0 (2024-01-XX)
- ✅ 添加配置化审批类型管理
- ✅ 支持企业微信和个人微信双登录
- ✅ 增强审批表单展示（图片、附件、表格）
- ✅ 添加搜索和高级筛选功能
- ✅ 实现定时自动刷新机制
- ✅ 优化本地缓存策略
- ✅ 改进 UI 和交互体验

### v1.0.0 (2024-01-XX)
- 🎉 初始版本发布
- 基础审批列表和详情功能
- 简单的登录和用户管理

## 技术支持

如有问题或建议，请联系：
- 邮箱: dev@your-company.com
- 项目地址: https://github.com/your-org/zreview

## 许可证

MIT License
