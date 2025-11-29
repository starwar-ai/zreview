<template>
  <view class="approval-list-container">
    <!-- Tab切换 -->
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="handleTabChange(tab.value)"
      >
        <text>{{ tab.label }}</text>
        <view v-if="tab.count > 0" class="badge">{{ tab.count }}</view>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar" v-if="activeTab === 'pending'">
      <picker
        mode="selector"
        :range="typeOptions"
        range-key="name"
        @change="handleTypeChange"
      >
        <view class="filter-item">
          <text>{{ selectedTypeName || '全部类型' }}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
    </view>

    <!-- 列表 -->
    <scroll-view
      scroll-y
      class="list-scroll"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
    >
      <view v-if="displayList.length > 0" class="list-content">
        <approval-card
          v-for="item in displayList"
          :key="item.id"
          :data="item"
          @click="goToDetail(item.id)"
        />
      </view>

      <empty-state v-else :text="emptyText" />

      <!-- 加载提示 -->
      <view v-if="loading" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { useApprovalStore } from '@/store/approval'
import { useUserStore } from '@/store/user'
import ApprovalCard from './components/ApprovalCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { Approval } from '@/types/approval'

const approvalStore = useApprovalStore()
const userStore = useUserStore()

// Tab选项
const tabs = computed(() => [
  { label: '待我审批', value: 'pending', count: approvalStore.pendingApprovals.length },
  { label: '我已审批', value: 'completed', count: approvalStore.approvedApprovals.length + approvalStore.rejectedApprovals.length },
  { label: '我发起的', value: 'initiated', count: 0 }
])

const activeTab = ref('pending')
const selectedType = ref('')
const refreshing = ref(false)
const loading = ref(false)

// 类型选项
const typeOptions = computed(() => [
  { type: '', name: '全部类型' },
  ...approvalStore.typeConfigs
])

const selectedTypeName = computed(() => {
  if (!selectedType.value) return ''
  const config = approvalStore.typeConfigs.find(t => t.type === selectedType.value)
  return config?.name || ''
})

// 显示的列表
const displayList = computed(() => {
  let list: Approval[] = []

  if (activeTab.value === 'pending') {
    list = approvalStore.pendingApprovals
  } else if (activeTab.value === 'completed') {
    list = [...approvalStore.approvedApprovals, ...approvalStore.rejectedApprovals]
  } else {
    list = []
  }

  // 按类型筛选
  if (selectedType.value) {
    list = list.filter(item => item.type === selectedType.value)
  }

  return list
})

const emptyText = computed(() => {
  if (activeTab.value === 'pending') return '暂无待审批事项'
  if (activeTab.value === 'completed') return '暂无已审批记录'
  return '暂无发起的审批'
})

// Tab切换
function handleTabChange(value: string) {
  activeTab.value = value
  selectedType.value = ''
}

// 类型筛选
function handleTypeChange(e: any) {
  const index = e.detail.value
  selectedType.value = typeOptions.value[index].type
}

// 跳转详情
function goToDetail(id: string) {
  uni.navigateTo({
    url: `/pages/detail/index?id=${id}`
  })
}

// 刷新
async function onRefresh() {
  refreshing.value = true
  try {
    await fetchData()
  } finally {
    refreshing.value = false
  }
}

// 加载更多
function onLoadMore() {
  // 暂不实现分页
}

// 获取数据
async function fetchData() {
  loading.value = true
  try {
    await approvalStore.fetchApprovals()
  } catch (error) {
    console.error('Fetch approvals error:', error)
  } finally {
    loading.value = false
  }
}

// 页面加载
onMounted(() => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    uni.reLaunch({
      url: '/pages/login/index'
    })
    return
  }

  // 加载数据
  fetchData()
})

// 下拉刷新
onPullDownRefresh(() => {
  fetchData().finally(() => {
    uni.stopPullDownRefresh()
  })
})
</script>

<style lang="scss" scoped>
.approval-list-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f8fa;
}

.tabs {
  display: flex;
  background: #ffffff;
  border-bottom: 1rpx solid #ebedf0;

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    font-size: 28rpx;
    color: #646566;
    position: relative;

    &.active {
      color: #1989fa;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #1989fa;
        border-radius: 2rpx;
      }
    }

    .badge {
      margin-left: 8rpx;
      padding: 0 12rpx;
      height: 32rpx;
      line-height: 32rpx;
      background: #ee0a24;
      color: #ffffff;
      font-size: 20rpx;
      border-radius: 16rpx;
    }
  }
}

.filter-bar {
  background: #ffffff;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #ebedf0;

  .filter-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 24rpx;
    background: #f7f8fa;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #323233;

    .arrow {
      font-size: 20rpx;
      color: #969799;
    }
  }
}

.list-scroll {
  flex: 1;
  overflow: hidden;
}

.list-content {
  padding: 24rpx 32rpx;
}

.loading-more {
  padding: 32rpx;
  text-align: center;
  font-size: 24rpx;
  color: #969799;
}
</style>
