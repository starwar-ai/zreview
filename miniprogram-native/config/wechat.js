// config/wechat.js
// 企业微信配置

module.exports = {
  // 企业微信信息
  corpId: process.env.WECHAT_CORP_ID || 'your-corp-id',
  agentId: process.env.WECHAT_AGENT_ID || 'your-agent-id',
  
  // 是否在企业微信环境
  isWorkWeChat: function() {
    return /wxwork/i.test(navigator.userAgent)
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
