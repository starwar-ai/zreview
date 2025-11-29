// 格式化金额
export function formatAmount(amount: number): string {
  return `¥${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化日期时间
export function formatDateTime(datetime: string | Date): string {
  const d = typeof datetime === 'string' ? new Date(datetime) : datetime
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 格式化日期范围
export function formatDateRange(dates: string[]): string {
  if (!dates || dates.length !== 2) return ''
  const start = formatDate(dates[0])
  const end = formatDate(dates[1])
  return `${start} 至 ${end}`
}

// 获取状态文本
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

// 获取状态颜色
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: '#ff976a',
    approved: '#07c160',
    rejected: '#ee0a24'
  }
  return colorMap[status] || '#969799'
}

// 相对时间
export function getRelativeTime(datetime: string): string {
  const now = new Date().getTime()
  const target = new Date(datetime).getTime()
  const diff = now - target

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatDateTime(datetime)
  }
}
