import { Approval, ApprovalQueryParams } from '../types/approval'
import { mockApprovals } from '../mock/data'
import { approvalTypes } from '../config/approval-types'

class ApprovalService {
  private approvals: Approval[] = []

  constructor() {
    // 初始化时加载模拟数据
    this.approvals = JSON.parse(JSON.stringify(mockApprovals))
  }

  // 获取审批列表
  getApprovals(params: ApprovalQueryParams) {
    let filtered = [...this.approvals]

    // 按状态筛选
    if (params.status) {
      filtered = filtered.filter(a => a.status === params.status)
    }

    // 按类型筛选
    if (params.type) {
      filtered = filtered.filter(a => a.type === params.type)
    }

    // 排序: 待审批在前,按提交时间倒序
    filtered.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1
      return new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime()
    })

    // 分页
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filtered.slice(start, end)

    return {
      list,
      total,
      page: params.page,
      pageSize: params.pageSize
    }
  }

  // 根据ID获取审批详情
  getApprovalById(id: string): Approval | undefined {
    return this.approvals.find(a => a.id === id)
  }

  // 提交审批结果
  submitApproval(id: string, data: { action: string, comment?: string, approver: string }) {
    const approval = this.approvals.find(a => a.id === id)

    if (!approval) {
      throw new Error('Approval not found')
    }

    if (approval.status !== 'pending') {
      throw new Error('Approval already processed')
    }

    // 更新审批状态
    const newStatus = data.action === 'approve' ? 'approved' : 'rejected'
    approval.status = newStatus

    // 更新审批流程
    const currentStep = approval.approvalFlow.find(step => step.status === 'pending')
    if (currentStep) {
      currentStep.status = newStatus
      currentStep.comment = data.comment || ''
      currentStep.time = new Date().toISOString().replace('T', ' ').substring(0, 19)
    }

    return approval
  }

  // 获取审批类型配置
  getApprovalTypes() {
    return approvalTypes
  }
}

export default new ApprovalService()
