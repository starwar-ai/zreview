import { Context } from 'koa'

export class AuthController {
  // 模拟登录
  static async login(ctx: Context) {
    const { username } = ctx.request.body as any

    if (!username) {
      ctx.status = 400
      ctx.body = { code: 400, message: 'Username is required' }
      return
    }

    // 模拟用户映射
    const userTokenMap: Record<string, { token: string, name: string, role: string }> = {
      'zhangsan': { token: 'token_zhangsan', name: '张三', role: 'manager' },
      'lisi': { token: 'token_lisi', name: '李四', role: 'finance' },
      'wangwu': { token: 'token_wangwu', name: '王五', role: 'staff' }
    }

    const userInfo = userTokenMap[username]

    if (!userInfo) {
      ctx.status = 404
      ctx.body = { code: 404, message: 'User not found' }
      return
    }

    ctx.body = {
      code: 0,
      message: 'success',
      data: {
        token: userInfo.token,
        userInfo: {
          name: userInfo.name,
          role: userInfo.role
        }
      }
    }
  }
}
