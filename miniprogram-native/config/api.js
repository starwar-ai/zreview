// config/api.js
// API 配置文件

const ENV = 'development' // development | production

const config = {
  development: {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    enableMock: false // 是否启用 Mock 数据
  },
  production: {
    baseURL: 'https://your-api-domain.com/api',
    timeout: 15000,
    enableMock: false
  }
}

module.exports = config[ENV]
