<template>
  <view class="login-container">
    <view class="login-header">
      <view class="logo">Zreview</view>
      <view class="subtitle">企业微信审批小程序</view>
    </view>

    <view class="login-form">
      <view class="form-item">
        <view class="label">用户名</view>
        <input
          v-model="username"
          class="input"
          placeholder="请输入用户名"
          placeholder-style="color: #c8c9cc"
        />
      </view>

      <view class="tips">
        <view class="tip-item">测试账号: zhangsan (张三 - 部门经理)</view>
        <view class="tip-item">测试账号: lisi (李四 - 财务主管)</view>
        <view class="tip-item">测试账号: wangwu (王五 - 采购专员)</view>
      </view>

      <button class="login-btn" @click="handleLogin" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const username = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value.trim()) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'none'
    })
    return
  }

  loading.value = true

  try {
    const success = await userStore.login(username.value.trim())

    if (success) {
      // 登录成功,跳转到首页
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }, 500)
    }
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100rpx 60rpx;
}

.login-header {
  text-align: center;
  margin-bottom: 120rpx;

  .logo {
    font-size: 64rpx;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 20rpx;
  }

  .subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.login-form {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);

  .form-item {
    margin-bottom: 40rpx;

    .label {
      font-size: 28rpx;
      color: #323233;
      margin-bottom: 16rpx;
    }

    .input {
      height: 88rpx;
      background: #f7f8fa;
      border-radius: 8rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
    }
  }

  .tips {
    margin-bottom: 40rpx;
    padding: 24rpx;
    background: #fff7e6;
    border-radius: 8rpx;

    .tip-item {
      font-size: 24rpx;
      color: #ed6a0c;
      line-height: 2;
    }
  }

  .login-btn {
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8rpx;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: bold;
    border: none;

    &:disabled {
      opacity: 0.6;
    }
  }
}
</style>
