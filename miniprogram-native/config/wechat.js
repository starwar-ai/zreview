// config/wechat.js
// 企业微信配置

module.exports = {
  // 企业微信信息（请根据实际配置修改）
  corpId: 'your-corp-id', // 企业微信企业ID
  agentId: 'your-agent-id', // 企业微信应用ID
  
  // 检测是否在企业微信环境
  isWorkWeChat: function() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      return /wxwork/i.test(systemInfo.system) || /wxwork/i.test(systemInfo.platform)
    } catch (error) {
      console.log('检测企业微信环境失败:', error)
      return false
    }
  },
  
  // 获取运行环境信息
  getEnvironment: function() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      const isWorkWeChat = this.isWorkWeChat()
      
      return {
        isWorkWeChat,
        system: systemInfo.system,
        platform: systemInfo.platform,
        version: systemInfo.version,
        SDKVersion: systemInfo.SDKVersion
      }
    } catch (error) {
      console.log('获取环境信息失败:', error)
      return {
        isWorkWeChat: false,
        error: error.message
      }
    }
  },
  
  // 消息推送配置
  message: {
    template: {
      title: '【审批通知】您有新的审批待处理',
      description: '{{applicant}}提交的{{approvalType}}需要您审批',
      url: 'pages/detail/detail?id={{approvalId}}'
    }
  },
  
  // 同步配置
  sync: {
    interval: 5 * 60 * 1000,  // 5分钟自动刷新
    enableBackgroundSync: true // 后台同步
  }
}
