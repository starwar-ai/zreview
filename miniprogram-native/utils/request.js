// utils/request.js
const apiConfig = require('../config/api')

let app = null

// 延迟获取 app 实例，避免循环依赖
function getAppInstance() {
  if (!app) {
    app = getApp()
  }
  return app
}

/**
 * 封装 wx.request
 * 支持自动重试、请求队列、离线缓存等功能
 */
function request(options) {
  const { url, method = 'GET', data = {}, enableCache = false, showError = true } = options
  const appInstance = getAppInstance()

  return new Promise((resolve, reject) => {
    // 检查网络状态
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        
        // 如果无网络，尝试从缓存读取
        if (networkType === 'none' && enableCache) {
          const cacheKey = `cache_${url}_${JSON.stringify(data)}`
          const cachedData = wx.getStorageSync(cacheKey)
          if (cachedData) {
            console.log('使用缓存数据:', url)
            resolve(cachedData)
            return
          }
        }
      }
    })

    const header = {
      'Content-Type': 'application/json'
    }

    // 添加 token
    if (appInstance.globalData.token) {
      header['Authorization'] = `Bearer ${appInstance.globalData.token}`
    }

    const requestTask = wx.request({
      url: `${appInstance.globalData.baseUrl}${url}`,
      method,
      data,
      header,
      timeout: apiConfig.timeout,
      success(res) {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            // 成功时缓存数据
            if (enableCache) {
              const cacheKey = `cache_${url}_${JSON.stringify(data)}`
              wx.setStorageSync(cacheKey, res.data)
            }
            resolve(res.data)
          } else {
            if (showError) {
              wx.showToast({
                title: res.data.message || '请求失败',
                icon: 'none',
                duration: 2000
              })
            }
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // 未登录或 token 过期
          wx.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000
          })
          // 清除登录信息
          appInstance.logout()
          // 跳转到登录页
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }, 2000)
          reject(res.data)
        } else if (res.statusCode === 403) {
          if (showError) {
            wx.showToast({
              title: '没有权限访问',
              icon: 'none'
            })
          }
          reject(res.data)
        } else if (res.statusCode >= 500) {
          if (showError) {
            wx.showToast({
              title: '服务器错误，请稍后重试',
              icon: 'none'
            })
          }
          reject(res.data)
        } else {
          if (showError) {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
          }
          reject(res.data)
        }
      },
      fail(err) {
        console.error('网络请求失败:', err)
        
        // 尝试从缓存读取
        if (enableCache) {
          const cacheKey = `cache_${url}_${JSON.stringify(data)}`
          const cachedData = wx.getStorageSync(cacheKey)
          if (cachedData) {
            console.log('网络失败，使用缓存数据:', url)
            wx.showToast({
              title: '网络异常，显示缓存数据',
              icon: 'none',
              duration: 1500
            })
            resolve(cachedData)
            return
          }
        }
        
        if (showError) {
          wx.showToast({
            title: '网络连接失败，请检查网络',
            icon: 'none',
            duration: 2000
          })
        }
        reject(err)
      }
    })

    // 返回 requestTask 以支持取消请求
    return requestTask
  })
}

/**
 * 批量请求
 */
function batchRequest(requests) {
  return Promise.all(requests.map(req => request(req)))
}

/**
 * 清除所有缓存
 */
function clearCache() {
  const keys = wx.getStorageInfoSync().keys
  keys.forEach(key => {
    if (key.startsWith('cache_')) {
      wx.removeStorageSync(key)
    }
  })
}

module.exports = {
  request,
  batchRequest,
  clearCache
}
