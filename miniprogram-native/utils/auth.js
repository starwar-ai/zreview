// utils/auth.js
// 企业微信和个人微信双登录支持

const { request } = require('./request')

/**
 * 企业微信登录
 */
function workWeChatLogin() {
  return new Promise((resolve, reject) => {
  // 检查是否在企业微信环境
  const config = require('../config/index')
  if (!config.wechat.isWorkWeChat()) {
      reject(new Error('当前不在企业微信环境，无法使用企业微信登录'))
      return
    }

    // 企业微信登录接口可能不存在，需要处理兼容性
    if (typeof wx.qy !== 'undefined' && wx.qy.login) {
      wx.qy.login({
        success: async (res) => {
          try {
            // 将 code 发送到后端换取 token
            const result = await request({
              url: '/auth/work-wechat/login',
              method: 'POST',
              data: { code: res.code },
              showError: true
            })
            resolve(result.data)
          } catch (error) {
            reject(error)
          }
        },
        fail: (err) => {
          console.error('企业微信登录失败:', err)
          reject(new Error('企业微信登录失败，请重试'))
        }
      })
    } else {
      // 如果不支持企业微信接口，降级到普通微信登录
      console.log('企业微信接口不可用，降级到微信登录')
      weChatLogin()
        .then(resolve)
        .catch(reject)
    }
  })
}

/**
 * 个人微信登录（扫码绑定）
 */
function weChatLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: async (res) => {
        try {
          // 将 code 发送到后端
          const result = await request({
            url: '/auth/wechat/login',
            method: 'POST',
            data: { code: res.code },
            showError: true
          })
          
          // 如果需要绑定企业微信账号，返回二维码
          if (result.data.needBind) {
            // 显示二维码让用户用企业微信扫码绑定
            resolve({
              needBind: true,
              qrCode: result.data.qrCode,
              bindToken: result.data.bindToken
            })
          } else {
            // 已绑定，直接登录
            resolve({
              needBind: false,
              userInfo: result.data.userInfo,
              token: result.data.token
            })
          }
        } catch (error) {
          reject(error)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 检查绑定状态
 * @param {string} bindToken 绑定令牌
 */
function checkBindStatus(bindToken) {
  return request({
    url: '/auth/wechat/bind-status',
    method: 'POST',
    data: { bindToken },
    showError: false
  })
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return request({
    url: '/auth/user-info',
    method: 'GET'
  })
}

/**
 * 刷新 Token
 */
function refreshToken() {
  return request({
    url: '/auth/refresh-token',
    method: 'POST'
  })
}

/**
 * 登出
 */
function logout() {
  return request({
    url: '/auth/logout',
    method: 'POST',
    showError: false
  })
}

module.exports = {
  workWeChatLogin,
  weChatLogin,
  checkBindStatus,
  getUserInfo,
  refreshToken,
  logout
}
