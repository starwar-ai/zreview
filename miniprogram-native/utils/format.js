// utils/format.js

/**
 * 格式化金额
 */
function formatAmount(amount) {
  if (typeof amount !== 'number') return '¥0.00'
  return `¥${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

/**
 * 格式化日期
 */
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化日期时间
 */
function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 格式化日期范围
 */
function formatDateRange(dates) {
  if (!Array.isArray(dates) || dates.length !== 2) return ''
  return `${formatDate(dates[0])} 至 ${formatDate(dates[1])}`
}

/**
 * 获取状态文本
 */
function getStatusText(status) {
  const statusMap = {
    'pending': '待审批',
    'approved': '已通过',
    'rejected': '已拒绝',
    'submitted': '已提交'
  }
  return statusMap[status] || status
}

/**
 * 获取状态颜色
 */
function getStatusColor(status) {
  const colorMap = {
    'pending': '#ff9500',
    'approved': '#07c160',
    'rejected': '#ee0a24',
    'submitted': '#1989fa'
  }
  return colorMap[status] || '#969799'
}

/**
 * 获取审批类型颜色
 */
function getTypeColor(type) {
  const colorMap = {
    'leave': '#1989fa',
    'expense': '#07c160',
    'purchase': '#ff9500',
    'order': '#ee0a24'
  }
  return colorMap[type] || '#969799'
}

module.exports = {
  formatAmount,
  formatDate,
  formatDateTime,
  formatDateRange,
  getStatusText,
  getStatusColor,
  getTypeColor
}
