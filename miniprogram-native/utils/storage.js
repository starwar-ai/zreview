// utils/storage.js
// 本地存储工具函数，支持过期时间、加密等功能

/**
 * 设置缓存（支持过期时间）
 * @param {string} key 缓存键
 * @param {any} value 缓存值
 * @param {number} expireTime 过期时间（毫秒），不传则永久有效
 */
function setStorage(key, value, expireTime) {
  const data = {
    value,
    time: Date.now(),
    expireTime: expireTime ? Date.now() + expireTime : null
  }
  
  try {
    wx.setStorageSync(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('设置缓存失败:', error)
    return false
  }
}

/**
 * 获取缓存（自动检查过期）
 * @param {string} key 缓存键
 * @param {any} defaultValue 默认值
 */
function getStorage(key, defaultValue = null) {
  try {
    const dataStr = wx.getStorageSync(key)
    if (!dataStr) return defaultValue
    
    const data = JSON.parse(dataStr)
    
    // 检查是否过期
    if (data.expireTime && Date.now() > data.expireTime) {
      wx.removeStorageSync(key)
      return defaultValue
    }
    
    return data.value
  } catch (error) {
    console.error('获取缓存失败:', error)
    return defaultValue
  }
}

/**
 * 移除缓存
 */
function removeStorage(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('移除缓存失败:', error)
    return false
  }
}

/**
 * 清空所有缓存
 */
function clearStorage() {
  try {
    wx.clearStorageSync()
    return true
  } catch (error) {
    console.error('清空缓存失败:', error)
    return false
  }
}

/**
 * 获取缓存信息
 */
function getStorageInfo() {
  try {
    return wx.getStorageInfoSync()
  } catch (error) {
    console.error('获取缓存信息失败:', error)
    return null
  }
}

/**
 * 缓存审批列表
 */
function cacheApprovalList(list, tabType = 'all') {
  const key = `approvals_${tabType}`
  return setStorage(key, list, 30 * 60 * 1000) // 缓存30分钟
}

/**
 * 获取缓存的审批列表
 */
function getCachedApprovalList(tabType = 'all') {
  const key = `approvals_${tabType}`
  return getStorage(key, [])
}

/**
 * 缓存审批详情
 */
function cacheApprovalDetail(id, detail) {
  const key = `approval_detail_${id}`
  return setStorage(key, detail, 30 * 60 * 1000) // 缓存30分钟
}

/**
 * 获取缓存的审批详情
 */
function getCachedApprovalDetail(id) {
  const key = `approval_detail_${id}`
  return getStorage(key, null)
}

/**
 * 清除过期缓存
 */
function clearExpiredCache() {
  try {
    const info = wx.getStorageInfoSync()
    info.keys.forEach(key => {
      const dataStr = wx.getStorageSync(key)
      if (!dataStr) return
      
      try {
        const data = JSON.parse(dataStr)
        if (data.expireTime && Date.now() > data.expireTime) {
          wx.removeStorageSync(key)
          console.log('清除过期缓存:', key)
        }
      } catch (e) {
        // 不是我们设置的缓存格式，跳过
      }
    })
  } catch (error) {
    console.error('清除过期缓存失败:', error)
  }
}

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  getStorageInfo,
  cacheApprovalList,
  getCachedApprovalList,
  cacheApprovalDetail,
  getCachedApprovalDetail,
  clearExpiredCache
}
