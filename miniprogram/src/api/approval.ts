import { get, post } from './request'
import type {
  Approval,
  ApprovalListData,
  ApprovalTypeConfig,
  ApiResponse
} from '@/types/approval'

// 获取审批列表
export function getApprovalList(params: {
  status?: string
  type?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<ApprovalListData>> {
  return get<ApprovalListData>('/approvals', params)
}

// 获取审批详情
export function getApprovalDetail(id: string): Promise<ApiResponse<Approval>> {
  return get<Approval>(`/approvals/${id}`)
}

// 提交审批结果
export function submitApproval(id: string, data: {
  action: 'approve' | 'reject'
  comment?: string
}): Promise<ApiResponse<Approval>> {
  return post<Approval>(`/approvals/${id}/submit`, data)
}

// 获取审批类型配置
export function getApprovalTypes(): Promise<ApiResponse<ApprovalTypeConfig[]>> {
  return get<ApprovalTypeConfig[]>('/approvals/types')
}

// 登录
export function login(username: string): Promise<ApiResponse<{
  token: string
  userInfo: any
}>> {
  return post('/auth/login', { username })
}
