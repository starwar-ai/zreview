import Router from 'koa-router'
import { ApprovalController } from '../controllers/approval.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = new Router({ prefix: '/api/approvals' })

// 所有审批路由都需要认证
router.use(authMiddleware)

// 获取审批列表
router.get('/', ApprovalController.getList)

// 获取审批类型配置
router.get('/types', ApprovalController.getTypes)

// 获取审批详情
router.get('/:id', ApprovalController.getDetail)

// 提交审批结果
router.post('/:id/submit', ApprovalController.submit)

export default router
