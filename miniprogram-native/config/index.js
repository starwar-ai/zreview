// config/index.js
// 统一配置入口

const apiConfig = require('./api')
const wechatConfig = require('./wechat')
const approvalTypes = require('./approval-types')

// 环境配置
const ENV_CONFIG = {
  // 当前环境：development | production
  ENV: 'development',
  
  // API 配置
  api: apiConfig,
  
  // 微信配置
  wechat: wechatConfig,
  
  // 审批类型配置
  approvalTypes: approvalTypes,
  
  // 版本信息
  version: '1.1.0',
  
  // 调试模式
  debug: true,
  
  // 功能开关
  features: {
    enableSearch: true,        // 搜索功能
    enableFilter: true,        // 筛选功能
    enableAutoSync: true,      // 自动同步
    enableCache: true,         // 缓存功能
    enableImagePreview: true,   // 图片预览
    enableFileDownload: true    // 文件下载
  }
}

module.exports = ENV_CONFIG