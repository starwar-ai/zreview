import { Context, Next } from 'koa'

export const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err.status || 500
    ctx.body = {
      code: ctx.status,
      message: err.message || 'Internal Server Error'
    }
    console.error('Error:', err)
  }
}
