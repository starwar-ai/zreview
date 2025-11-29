// app.js
const config = require('./config/index')

App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: config.api.baseURL,
    isWorkWeChat: false, // 是否在企业微信环境
    syncTimer: null // 定时同步定时器
  },

  onLaunch() {
    console.log('小程序启动')
    
    // 检测运行环境
    this.checkEnvironment()
    
    // 检查登录状态
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')

    if (token && userInfo) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
    }
    
    // 启动定时同步
    this.startSyncTimer()
  },

  onShow() {
    console.log('小程序显示')
    // 小程序从后台进入前台时，触发一次数据同步
    this.triggerSync()
  },

  onHide() {
    console.log('小程序隐藏')
  },

/**
 * 检测运行环境（企业微信 or 个人微信）
 */
checkEnvironment() {
  // 使用配置文件中的环境检测方法
  const env = config.wechat.getEnvironment()
  this.globalData.isWorkWeChat = env.isWorkWeChat
  console.log('运行环境:', env.isWorkWeChat ? '企业微信' : '个人微信')
  
  if (config.debug) {
    console.log('环境信息:', env)
    console.log('配置信息:', {
      env: config.ENV,
      version: config.version,
      features: config.features
    })
  }
},

  /**
   * 登录 - 支持企业微信免登和个人微信扫码登录
   */
  login(userInfo, token) {
    this.globalData.userInfo = userInfo
    this.globalData.token = token
    wx.setStorageSync('token', token)
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('loginTime', Date.now())
  },

  /**
   * 登出
   */
  logout() {
    this.globalData.userInfo = null
    this.globalData.token = null
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('cachedApprovals')
    wx.removeStorageSync('loginTime')
    
    // 停止定时同步
    this.stopSyncTimer()
  },

  /**
   * 检查是否登录
   */
  isLoggedIn() {
    return !!this.globalData.token
  },

/**
 * 启动定时同步（每5分钟）
 */
startSyncTimer() {
  if (!config.features.enableAutoSync) {
    console.log('自动同步功能已关闭')
    return
  }
  
  if (this.globalData.syncTimer) {
    clearInterval(this.globalData.syncTimer)
  }
  
  // 每5分钟触发一次同步
  this.globalData.syncTimer = setInterval(() => {
    console.log('定时同步触发')
    this.triggerSync()
  }, config.wechat.sync.interval)
},

  /**
   * 停止定时同步
   */
  stopSyncTimer() {
    if (this.globalData.syncTimer) {
      clearInterval(this.globalData.syncTimer)
      this.globalData.syncTimer = null
    }
  },

  /**
   * 触发数据同步
   */
  triggerSync() {
    // 通过全局事件通知各页面刷新数据
    if (this.isLoggedIn()) {
      wx.eventCenter = wx.eventCenter || {}
      wx.eventCenter.trigger && wx.eventCenter.trigger('syncData')
    }
  }
})
