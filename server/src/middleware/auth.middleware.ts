import { Context, Next } from 'koa'
import { User } from '../types/approval'

// 模拟用户数据库
const mockUsers: Record<string, User> = {
  'token_zhangsan': { id: '1', name: '张三', role: 'manager' },
  'token_lisi': { id: '2', name: '李四', role: 'finance' },
  'token_wangwu': { id: '3', name: '王五', role: 'staff' }
}

export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    ctx.status = 401
    ctx.body = { code: 401, message: 'Unauthorized' }
    return
  }

  // 简化版: 直接从 token 映射获取用户信息
  const user = mockUsers[token]

  if (!user) {
    ctx.status = 401
    ctx.body = { code: 401, message: 'Invalid token' }
    return
  }

  ctx.state.user = user
  await next()
}
