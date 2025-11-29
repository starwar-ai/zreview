import { Context } from 'koa'
import ApprovalService from '../services/approval.service'

export class ApprovalController {
  // 获取审批列表
  static async getList(ctx: Context) {
    const { status, type, page = '1', pageSize = '20' } = ctx.query

    const result = ApprovalService.getApprovals({
      status: status as string,
      type: type as string,
      page: Number(page),
      pageSize: Number(pageSize)
    })

    ctx.body = { code: 0, message: 'success', data: result }
  }

  // 获取审批详情
  static async getDetail(ctx: Context) {
    const { id } = ctx.params

    const approval = ApprovalService.getApprovalById(id)

    if (!approval) {
      ctx.status = 404
      ctx.body = { code: 404, message: 'Approval not found' }
      return
    }

    ctx.body = { code: 0, message: 'success', data: approval }
  }

  // 提交审批结果
  static async submit(ctx: Context) {
    const { id } = ctx.params
    const { action, comment } = ctx.request.body as any
    const user = ctx.state.user

    if (!action || !['approve', 'reject'].includes(action)) {
      ctx.status = 400
      ctx.body = { code: 400, message: 'Invalid action' }
      return
    }

    try {
      const approval = ApprovalService.submitApproval(id, {
        action,
        comment: comment || '',
        approver: user.name
      })

      ctx.body = { code: 0, message: '提交成功', data: approval }
    } catch (error: any) {
      ctx.status = 400
      ctx.body = { code: 400, message: error.message }
    }
  }

  // 获取审批类型配置
  static async getTypes(ctx: Context) {
    const types = ApprovalService.getApprovalTypes()
    ctx.body = { code: 0, message: 'success', data: types }
  }
}
