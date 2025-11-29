// 审批状态
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

// 审批类型
export type ApprovalType = 'leave' | 'expense' | 'purchase' | 'order'

// 字段类型
export type FieldType = 'text' | 'number' | 'amount' | 'date' | 'daterange' | 'textarea' | 'table' | 'image' | 'file'

// 审批字段配置
export interface ApprovalField {
  key: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  columns?: Array<{key: string, label: string, width?: string}>
}

// 审批类型配置
export interface ApprovalTypeConfig {
  type: ApprovalType
  name: string
  icon: string
  color: string
  fields: ApprovalField[]
  displayRules: {
    list: string[]      // 列表页显示字段
    detail: string[]    // 详情页显示字段
  }
}

// 审批项
export interface Approval {
  id: string
  type: ApprovalType
  typeName: string
  applicant: string
  applicantAvatar?: string
  submitTime: string
  status: ApprovalStatus
  summary: string
  formData: Record<string, any>
  approvalFlow: ApprovalFlowStep[]
}

// 审批流程节点
export interface ApprovalFlowStep {
  step: number
  approver: string
  status: ApprovalStatus | 'pending'
  comment?: string
  time?: string
}

// 用户信息
export interface User {
  id: string
  name: string
  role: string
}

// 查询参数
export interface ApprovalQueryParams {
  status?: string
  type?: string
  page: number
  pageSize: number
}
