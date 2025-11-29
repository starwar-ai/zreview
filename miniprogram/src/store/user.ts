import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/approval'
import { setToken, setUserInfo, removeToken, removeUserInfo, getToken, getUserInfo } from '@/utils/storage'
import type { UserInfo } from '@/types/approval'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(getToken() || '')
  const userInfo = ref<UserInfo | null>(getUserInfo())
  const isLoggedIn = ref<boolean>(!!token.value)

  // 登录
  async function login(username: string) {
    try {
      const res = await loginApi(username)

      token.value = res.data.token
      userInfo.value = res.data.userInfo
      isLoggedIn.value = true

      // 保存到本地存储
      setToken(res.data.token)
      setUserInfo(res.data.userInfo)

      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false

    // 清除本地存储
    removeToken()
    removeUserInfo()

    uni.showToast({
      title: '已退出登录',
      icon: 'none'
    })
  }

  // 检查登录状态
  function checkLogin(): boolean {
    const savedToken = getToken()
    if (savedToken) {
      token.value = savedToken
      userInfo.value = getUserInfo()
      isLoggedIn.value = true
      return true
    }
    return false
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    checkLogin
  }
})
