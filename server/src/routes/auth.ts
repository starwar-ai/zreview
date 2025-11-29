import Router from 'koa-router'
import { AuthController } from '../controllers/auth.controller'

const router = new Router({ prefix: '/api/auth' })

// 登录
router.post('/login', AuthController.login)

export default router
