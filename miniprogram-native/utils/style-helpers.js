// utils/style-helpers.js
// 样式工具函数 - 用于在 JS 中访问设计 Token

const tokens = require('../config/design-tokens.js')

/**
 * 获取颜色值
 * @param {string} path - 颜色路径，如 'zinc.500' 或 'primary'
 * @returns {string} 颜色值
 */
function getColor(path) {
  const keys = path.split('.')
  let value = tokens.colors

  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key]
    } else {
      return ''
    }
  }

  return value || ''
}

/**
 * 获取间距值
 * @param {string|number} key - 间距键，如 '4' 或 4
 * @returns {string} 间距值 (rpx)
 */
function getSpacing(key) {
  return tokens.spacing[String(key)] || '0rpx'
}

/**
 * 获取圆角值
 * @param {string} key - 圆角键，如 'md' 或 'lg'
 * @returns {string} 圆角值 (rpx)
 */
function getRadius(key) {
  return tokens.radius[key] || tokens.radius.md
}

/**
 * 获取字体大小
 * @param {string} key - 字体大小键，如 'base' 或 'lg'
 * @returns {string} 字体大小 (rpx)
 */
function getFontSize(key) {
  return tokens.fontSize[key] || tokens.fontSize.base
}

/**
 * 获取阴影值
 * @param {string} key - 阴影键，如 'sm' 或 'md'
 * @returns {string} 阴影值
 */
function getShadow(key) {
  return tokens.shadow[key] || tokens.shadow.none
}

/**
 * 获取状态颜色
 * @param {string} status - 状态: 'pending' | 'approved' | 'rejected'
 * @returns {object} { color, bg } 状态对应的颜色
 */
function getStatusColor(status) {
  const statusMap = {
    pending: {
      color: tokens.colors.warning,
      bg: '#fff7ed',
      border: '#fed7aa'
    },
    approved: {
      color: tokens.colors.success,
      bg: '#f0fdf4',
      border: '#bbf7d0'
    },
    rejected: {
      color: tokens.colors.error,
      bg: '#fef2f2',
      border: '#fecaca'
    },
    completed: {
      color: tokens.colors.success,
      bg: '#f0fdf4',
      border: '#bbf7d0'
    }
  }

  return statusMap[status] || statusMap.pending
}

/**
 * 获取审批类型样式配置
 * @param {string} type - 审批类型
 * @returns {object} { color, icon } 类型对应的颜色和图标
 */
function getTypeStyle(type) {
  // shadcn 风格：统一使用 zinc 配色，不同类型用不同深浅的灰色
  const typeMap = {
    leave: {
      color: tokens.colors.zinc[700],
      bg: tokens.colors.zinc[100],
      icon: '📅'
    },
    expense: {
      color: tokens.colors.zinc[800],
      bg: tokens.colors.zinc[100],
      icon: '💰'
    },
    purchase: {
      color: tokens.colors.zinc[700],
      bg: tokens.colors.zinc[100],
      icon: '🛒'
    },
    contract: {
      color: tokens.colors.zinc[800],
      bg: tokens.colors.zinc[100],
      icon: '📄'
    },
    travel: {
      color: tokens.colors.zinc[700],
      bg: tokens.colors.zinc[100],
      icon: '✈️'
    }
  }

  return typeMap[type] || {
    color: tokens.colors.zinc[700],
    bg: tokens.colors.zinc[100],
    icon: '📋'
  }
}

/**
 * 构建样式对象字符串 (用于内联样式)
 * @param {object} styles - 样式对象，如 { color: '#000', fontSize: '32rpx' }
 * @returns {string} 样式字符串
 */
function buildStyleString(styles) {
  if (!styles || typeof styles !== 'object') {
    return ''
  }

  return Object.entries(styles)
    .map(([key, value]) => {
      // 将驼峰转换为连字符
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}`
    })
    .join('; ')
}

/**
 * 生成 className 字符串
 * @param {object} classMap - className 映射，如 { 'active': isActive, 'disabled': isDisabled }
 * @returns {string} className 字符串
 */
function classNames(classMap) {
  if (!classMap || typeof classMap !== 'object') {
    return ''
  }

  return Object.entries(classMap)
    .filter(([_, condition]) => condition)
    .map(([className, _]) => className)
    .join(' ')
}

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {string} currency - 货币符号，默认 '¥'
 * @returns {string} 格式化后的金额字符串
 */
function formatAmount(amount, currency = '¥') {
  if (typeof amount !== 'number') {
    return `${currency}0.00`
  }

  return `${currency}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式，默认 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

module.exports = {
  tokens,
  getColor,
  getSpacing,
  getRadius,
  getFontSize,
  getShadow,
  getStatusColor,
  getTypeStyle,
  buildStyleString,
  classNames,
  formatAmount,
  formatDate
}
