// pages/login/login.js
const { login } = require('../../api/approval')
const app = getApp()

Page({
  data: {
    username: '',
    loading: false
  },

  onLoad() {
    // 如果已登录，跳转到首页
    if (app.isLoggedIn()) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  /**
   * 用户名输入
   */
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },

  /**
   * 选择测试账号
   */
  selectAccount(e) {
    const username = e.currentTarget.dataset.username
    this.setData({ username })
  },

  /**
   * 登录
   */
  async handleLogin() {
    const { username } = this.data

    if (!username || !username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    try {
      const res = await login(username.trim())

      // 保存登录信息
      app.login(res.data.userInfo, res.data.token)

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1000)
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      this.setData({ loading: false })
    }
  }
})
