import Router from 'koa-router'
import authRouter from './auth'
import approvalRouter from './approval'

const router = new Router()

// 注册路由
router.use(authRouter.routes())
router.use(approvalRouter.routes())

// 健康检查
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() }
})

export default router
