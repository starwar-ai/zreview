// 存储键名
export const StorageKeys = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  CACHED_APPROVALS: 'cachedApprovals'
}

// 设置存储
export function setStorage(key: string, data: any): void {
  try {
    uni.setStorageSync(key, JSON.stringify(data))
  } catch (e) {
    console.error('setStorage error:', e)
  }
}

// 获取存储
export function getStorage<T = any>(key: string): T | null {
  try {
    const data = uni.getStorageSync(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('getStorage error:', e)
    return null
  }
}

// 移除存储
export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('removeStorage error:', e)
  }
}

// 清空存储
export function clearStorage(): void {
  try {
    uni.clearStorageSync()
  } catch (e) {
    console.error('clearStorage error:', e)
  }
}

// Token相关
export function getToken(): string | null {
  return getStorage<string>(StorageKeys.TOKEN)
}

export function setToken(token: string): void {
  setStorage(StorageKeys.TOKEN, token)
}

export function removeToken(): void {
  removeStorage(StorageKeys.TOKEN)
}

// 用户信息相关
export function getUserInfo(): any {
  return getStorage(StorageKeys.USER_INFO)
}

export function setUserInfo(userInfo: any): void {
  setStorage(StorageKeys.USER_INFO, userInfo)
}

export function removeUserInfo(): void {
  removeStorage(StorageKeys.USER_INFO)
}
