# 更新日志

## v1.1.1 (2024-01-XX)

### 🔧 修复问题

#### 1. 修复 process.env 未定义错误
- **问题**: 在小程序环境中使用 Node.js 的 `process.env` 导致报错
- **原因**: 小程序运行环境不支持 Node.js 的 process 对象
- **解决方案**: 
  - 移除 `config/wechat.js` 中的 `process.env` 引用
  - 使用硬编码配置值替代环境变量
  - 添加 `config/index.js` 统一管理配置

#### 2. 修复模块路径问题
- **问题**: `require('./config')` 在小程序中报错 "module 'config.js' is not defined"
- **原因**: 小程序模块系统需要明确指定文件名，不会自动寻找 `index.js`
- **解决方案**:
  - 将所有 `require('./config')` 改为 `require('./config/index')`
  - 更新以下文件的模块引用：
    - `app.js`
    - `pages/index/index.js`
    - `pages/detail/detail.js`
    - `utils/auth.js`
    - `utils/request.js`

#### 3. 修复变量未定义错误
- **问题**: `detail.js` 中 `approvalTypesConfig is not defined` 错误
- **原因**: 在重构过程中，部分变量名没有统一更新
- **解决方案**:
  - 将 `detail.js` 中的 `approvalTypesConfig` 全部替换为 `config.approvalTypes`
  - 确保所有配置引用统一使用 `config` 对象

#### 2. 优化环境检测
- 改进企业微信环境检测逻辑
- 使用 `wx.getSystemInfoSync()` 替代 `navigator.userAgent`
- 添加异常处理，提高兼容性

#### 3. 统一配置管理
- 新增 `config/index.js` 作为配置入口
- 所有模块统一引用 `config` 而非单独文件
- 添加功能开关和版本信息配置

### 📝 技术改进

#### 配置文件优化
```javascript
// 新的配置结构
const config = require('./config')
config.wechat.isWorkWeChat()  // 企业微信检测
config.features.enableAutoSync   // 功能开关
config.api.baseURL            // API 地址
```

#### 错误处理增强
- 企业微信登录时添加降级处理
- 环境检测添加异常捕获
- 网络请求完善错误信息

### 🚀 新增特性

#### 1. 功能开关
在 `config/index.js` 中新增功能开关：
- `enableSearch`: 搜索功能
- `enableFilter`: 筛选功能  
- `enableAutoSync`: 自动同步
- `enableCache`: 缓存功能
- `enableImagePreview`: 图片预览
- `enableFileDownload`: 文件下载

#### 2. 调试模式
- 添加全局调试开关
- 启动时输出详细配置信息
- 环境检测结果可视化

### 📋 影响文件

修改的文件：
- `config/wechat.js` - 移除 process.env 引用
- `config/index.js` - 新增配置入口文件
- `app.js` - 统一引用 config
- `pages/index/index.js` - 更新配置引用
- `pages/detail/detail.js` - 更新配置引用  
- `utils/auth.js` - 更新配置引用
- `utils/request.js` - 更新配置引用

新增的文件：
- `config/index.js` - 统一配置管理
- `CHANGELOG.md` - 更新日志

### ✅ 测试建议

1. **环境测试**
   - 测试企业微信环境检测
   - 测试个人微信环境检测
   - 验证配置信息输出

2. **功能测试**
   - 验证所有功能开关正常
   - 测试登录流程完整性
   - 确认网络请求正常

3. **兼容性测试**
   - 不同微信版本测试
   - 不同手机型号测试
   - 网络异常情况测试

### 🎯 下一步计划

1. **配置热更新**
   - 支持远程配置下发
   - 实现配置动态加载
   - 添加配置版本管理

2. **监控完善**
   - 添加错误监控上报
   - 性能监控埋点
   - 用户行为统计

3. **体验优化**
   - 骨架屏加载优化
   - 微信分享功能增强
   - 离线功能完善

---

## v1.1.0 (2024-01-XX)

### 🎉 重大更新

#### 1. 配置化驱动
- 添加 `config/` 目录，集中管理所有配置
- 审批类型配置化，支持动态添加类型
- API 配置分离，支持多环境切换

#### 2. 双端登录支持  
- 企业微信免登录支持
- 个人微信扫码绑定
- 自动环境检测和适配

#### 3. 功能增强
- 搜索功能：按单号、申请人、关键字搜索
- 高级筛选：申请人、时间范围筛选
- 自动刷新：每5分钟定时同步
- 离线缓存：断网查看历史数据
- 图片预览：支持审批单图片查看
- 附件下载：支持文件下载和预览
- 复杂表格：支持多行数据展开收起
- 超时提醒：超过24小时自动标红

#### 4. UI/UX 优化
- 现代化卡片设计
- 流畅加载动画
- 友好空状态提示
- 更好错误处理
- 分页加载支持
- 下拉刷新优化

---

## v1.0.0 (2024-01-XX)

### 🎯 初始版本

#### 基础功能
- 审批列表展示
- 审批详情查看
- 简单登录功能
- 基础用户管理