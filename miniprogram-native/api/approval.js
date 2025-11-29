// api/approval.js
const { request } = require('../utils/request')

/**
 * 用户登录
 */
function login(username) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: { username }
  })
}

/**
 * 获取审批列表
 */
function getApprovalList(params = {}) {
  const { status, type } = params
  let url = '/approvals'
  const query = []

  if (status) query.push(`status=${status}`)
  if (type) query.push(`type=${type}`)

  if (query.length > 0) {
    url += '?' + query.join('&')
  }

  return request({ url })
}

/**
 * 获取审批详情
 */
function getApprovalDetail(id) {
  return request({
    url: `/approvals/${id}`
  })
}

/**
 * 提交审批
 */
function submitApproval(id, data) {
  return request({
    url: `/approvals/${id}/submit`,
    method: 'POST',
    data
  })
}

/**
 * 获取审批类型配置
 */
function getApprovalTypes() {
  return request({
    url: '/approvals/types'
  })
}

module.exports = {
  login,
  getApprovalList,
  getApprovalDetail,
  submitApproval,
  getApprovalTypes
}
