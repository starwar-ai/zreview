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
    list: string[]
    detail: string[]
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
export interface UserInfo {
  name: string
  role: string
}

// API响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 审批列表响应
export interface ApprovalListData {
  list: Approval[]
  total: number
  page: number
  pageSize: number
}
