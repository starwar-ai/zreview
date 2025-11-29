// pages/profile/profile.js
const { getApprovalList } = require('../../api/approval')
const app = getApp()

Page({
  data: {
    userInfo: {},
    userInitial: '?',
    roleText: '未知角色',
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    // 每次显示页面时刷新数据
    if (app.isLoggedIn()) {
      this.loadUserInfo()
      this.loadStats()
    }
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const userInfo = app.globalData.userInfo || {}

    const roleMap = {
      'manager': '部门经理',
      'finance': '财务主管',
      'staff': '采购专员'
    }

    const userInitial = userInfo.name ? userInfo.name.charAt(0) : '?'
    const roleText = roleMap[userInfo.role] || '未知角色'

    this.setData({
      userInfo,
      userInitial,
      roleText
    })
  },

  /**
   * 加载统计数据
   */
  async loadStats() {
    try {
      // 获取所有审批
      const res = await getApprovalList({})
      const approvals = res.data.list

      const pendingCount = approvals.filter(a => a.status === 'pending').length
      const approvedCount = approvals.filter(a => a.status === 'approved').length
      const rejectedCount = approvals.filter(a => a.status === 'rejected').length

      this.setData({
        pendingCount,
        approvedCount,
        rejectedCount
      })
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  },

  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗?',
      success: (res) => {
        if (res.confirm) {
          app.logout()

          wx.showToast({
            title: '已退出',
            icon: 'success'
          })

          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }, 500)
        }
      }
    })
  }
})
