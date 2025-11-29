import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import router from './routes'
import { errorMiddleware } from './middleware/error.middleware'
import { config } from './config'

const app = new Koa()

// 中间件
app.use(cors())
app.use(bodyParser())
app.use(errorMiddleware)

// 路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动服务器
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`)
  console.log(`📝 Environment: ${config.env}`)
  console.log(`✅ Health check: http://localhost:${config.port}/health`)
})

export default app
