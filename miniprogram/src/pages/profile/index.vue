<template>
  <view class="profile-container">
    <view class="profile-header">
      <view class="avatar">{{ userInitial }}</view>
      <view class="user-info">
        <view class="username">{{ userStore.userInfo?.name || '未登录' }}</view>
        <view class="role">{{ roleText }}</view>
      </view>
    </view>

    <view class="profile-body">
      <view class="section">
        <view class="section-title">统计信息</view>
        <view class="stats">
          <view class="stat-item">
            <view class="stat-value">{{ pendingCount }}</view>
            <view class="stat-label">待审批</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">{{ approvedCount }}</view>
            <view class="stat-label">已通过</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">{{ rejectedCount }}</view>
            <view class="stat-label">已拒绝</view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">账号信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">用户名</text>
            <text class="info-value">{{ userStore.userInfo?.name || '-' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">角色</text>
            <text class="info-value">{{ roleText }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">系统信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">版本号</text>
            <text class="info-value">v1.0.0</text>
          </view>
          <view class="info-item">
            <text class="info-label">环境</text>
            <text class="info-value">开发环境</text>
          </view>
        </view>
      </view>

      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useApprovalStore } from '@/store/approval'

const userStore = useUserStore()
const approvalStore = useApprovalStore()

const userInitial = computed(() => {
  const name = userStore.userInfo?.name
  return name ? name.charAt(0) : '?'
})

const roleText = computed(() => {
  const roleMap: Record<string, string> = {
    manager: '部门经理',
    finance: '财务主管',
    staff: '采购专员'
  }
  return roleMap[userStore.userInfo?.role || ''] || '未知角色'
})

const pendingCount = computed(() => approvalStore.pendingApprovals.length)
const approvedCount = computed(() => approvalStore.approvedApprovals.length)
const rejectedCount = computed(() => approvalStore.rejectedApprovals.length)

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗?',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()

        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/index'
          })
        }, 500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 60rpx 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    color: #ffffff;
    font-weight: bold;
    margin-right: 32rpx;
  }

  .user-info {
    flex: 1;

    .username {
      font-size: 36rpx;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 8rpx;
    }

    .role {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.profile-body {
  padding: 24rpx;
}

.section {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #323233;
    margin-bottom: 24rpx;
  }

  .stats {
    display: flex;
    gap: 24rpx;

    .stat-item {
      flex: 1;
      text-align: center;
      padding: 24rpx 0;
      background: #f7f8fa;
      border-radius: 8rpx;

      .stat-value {
        font-size: 48rpx;
        font-weight: bold;
        color: #1989fa;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: #646566;
      }
    }
  }

  .info-list {
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 0;
      border-bottom: 1rpx solid #ebedf0;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 28rpx;
        color: #646566;
      }

      .info-value {
        font-size: 28rpx;
        color: #323233;
      }
    }
  }
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  border: 2rpx solid #ee0a24;
  border-radius: 8rpx;
  color: #ee0a24;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 48rpx;
}
</style>
