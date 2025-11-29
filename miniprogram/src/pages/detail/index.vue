<template>
  <view class="approval-detail-container">
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <view v-else-if="approval" class="detail-content">
      <!-- 头部信息 -->
      <view class="detail-header">
        <view class="type-badge" :style="{ background: typeConfig?.color }">
          {{ typeConfig?.name }}
        </view>
        <view class="status-badge" :class="approval.status">
          {{ statusText }}
        </view>
      </view>

      <!-- 表单内容 -->
      <view class="detail-body">
        <approval-form
          v-if="typeConfig"
          :config="typeConfig"
          :data="approval.formData"
        />
      </view>

      <!-- 审批流程 -->
      <view class="detail-flow">
        <view class="section-title">审批流程</view>
        <approval-timeline :steps="approval.approvalFlow" />
      </view>

      <!-- 操作按钮 -->
      <view v-if="approval.status === 'pending'" class="detail-actions">
        <button class="btn btn-reject" @click="handleReject">拒绝</button>
        <button class="btn btn-approve" @click="handleApprove">同意</button>
      </view>
    </view>

    <empty-state v-else text="审批不存在" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useApprovalStore } from '@/store/approval'
import { getStatusText } from '@/utils/format'
import ApprovalForm from './components/ApprovalForm.vue'
import ApprovalTimeline from './components/ApprovalTimeline.vue'
import EmptyState from '@/components/EmptyState.vue'

const approvalStore = useApprovalStore()

const approvalId = ref('')
const loading = ref(false)

const approval = computed(() => approvalStore.currentApproval)

const typeConfig = computed(() => {
  if (!approval.value) return null
  return approvalStore.typeConfigs.find(t => t.type === approval.value!.type)
})

const statusText = computed(() =>
  approval.value ? getStatusText(approval.value.status) : ''
)

// 加载详情
async function fetchDetail() {
  if (!approvalId.value) return

  loading.value = true
  try {
    await approvalStore.fetchApprovalDetail(approvalId.value)
  } catch (error) {
    console.error('Fetch detail error:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 处理审批
async function handleSubmit(action: 'approve' | 'reject') {
  const actionText = action === 'approve' ? '同意' : '拒绝'

  uni.showModal({
    title: '确认操作',
    content: `确定要${actionText}该审批吗?`,
    success: async (res) => {
      if (!res.confirm) return

      try {
        await approvalStore.submitApproval(approvalId.value, { action })

        uni.showToast({
          title: `${actionText}成功`,
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        console.error('Submit error:', error)
      }
    }
  })
}

function handleApprove() {
  handleSubmit('approve')
}

function handleReject() {
  handleSubmit('reject')
}

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    approvalId.value = options.id
    fetchDetail()
  }
})

onMounted(() => {
  if (!approvalId.value) {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<style lang="scss" scoped>
.approval-detail-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 120rpx;
}

.loading {
  padding: 200rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #969799;
}

.detail-content {
  padding: 24rpx;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 12rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;

  .type-badge {
    padding: 12rpx 24rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #ffffff;
    font-weight: bold;
  }

  .status-badge {
    padding: 8rpx 16rpx;
    border-radius: 6rpx;
    font-size: 24rpx;

    &.pending {
      background: #fff7e6;
      color: #ed6a0c;
    }

    &.approved {
      background: #e8f5e9;
      color: #07c160;
    }

    &.rejected {
      background: #ffebee;
      color: #ee0a24;
    }
  }
}

.detail-body {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.detail-flow {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 32rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #323233;
    margin-bottom: 24rpx;
  }
}

.detail-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 24rpx;
  padding: 24rpx;
  background: #ffffff;
  border-top: 1rpx solid #ebedf0;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);

  .btn {
    flex: 1;
    height: 88rpx;
    border-radius: 8rpx;
    font-size: 32rpx;
    font-weight: bold;
    border: none;

    &.btn-reject {
      background: #ffffff;
      color: #ee0a24;
      border: 2rpx solid #ee0a24;
    }

    &.btn-approve {
      background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
      color: #ffffff;
    }
  }
}
</style>
