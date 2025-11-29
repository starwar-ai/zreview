// utils/event-bus.js
// 全局事件总线工具，用于跨页面通信

/**
 * 简单的事件总线实现
 */
class EventBus {
  constructor() {
    this.listeners = {}
  }

  /**
   * 注册事件监听
   * @param {string} event 事件名
   * @param {function} callback 回调函数
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * 触发事件
   * @param {string} event 事件名
   * @param {any} data 事件数据
   */
  trigger(event, data) {
    const callbacks = this.listeners[event] || []
    callbacks.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`事件回调执行失败 [${event}]:`, error)
      }
    })
  }

  /**
   * 移除事件监听
   * @param {string} event 事件名
   * @param {function} callback 回调函数
   */
  off(event, callback) {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
  }

  /**
   * 移除事件的所有监听
   * @param {string} event 事件名
   */
  offAll(event) {
    if (event) {
      this.listeners[event] = []
    } else {
      this.listeners = {}
    }
  }

  /**
   * 获取事件监听器数量
   * @param {string} event 事件名
   */
  listenerCount(event) {
    return (this.listeners[event] || []).length
  }
}

// 创建单例实例
const eventBus = new EventBus()

// 导出事件总线
module.exports = {
  EventBus,
  eventBus,
  // 兼容性方法
  on: eventBus.on.bind(eventBus),
  trigger: eventBus.trigger.bind(eventBus),
  off: eventBus.off.bind(eventBus),
  offAll: eventBus.offAll.bind(eventBus),
  listenerCount: eventBus.listenerCount.bind(eventBus)
}