import { getToken } from '@/utils/storage'
import type { ApiResponse } from '@/types/approval'

// API基础地址
const BASE_URL = 'http://localhost:3000/api'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

// 请求封装
export function request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
  const { url, method = 'GET', data, header = {} } = options

  // 添加token
  const token = getToken()
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res: any) => {
        const response = res.data as ApiResponse<T>

        if (response.code === 0) {
          resolve(response)
        } else {
          uni.showToast({
            title: response.message || '请求失败',
            icon: 'none'
          })
          reject(response)
        }
      },
      fail: (err: any) => {
        console.error('Request error:', err)
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// GET请求
export function get<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  // 将data转换为query string
  if (data) {
    const queryString = Object.keys(data)
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&')
    url = `${url}?${queryString}`
  }

  return request<T>({ url, method: 'GET' })
}

// POST请求
export function post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'POST', data })
}

// PUT请求
export function put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'PUT', data })
}

// DELETE请求
export function del<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'DELETE', data })
}
