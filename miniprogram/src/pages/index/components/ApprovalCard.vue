<template>
  <view class="approval-card" @click="handleClick">
    <view class="card-header">
      <view class="type-badge" :style="{ background: typeColor }">
        {{ data.typeName }}
      </view>
      <view class="status-badge" :class="data.status">
        {{ statusText }}
      </view>
    </view>

    <view class="card-body">
      <view class="summary">{{ data.summary }}</view>

      <view class="info-row">
        <view class="info-item">
          <text class="label">申请人:</text>
          <text class="value">{{ data.applicant }}</text>
        </view>
        <view class="info-item">
          <text class="label">提交时间:</text>
          <text class="value">{{ formatTime }}</text>
        </view>
      </view>

      <!-- 显示关键字段 -->
      <view v-if="displayFields.length > 0" class="fields">
        <view
          v-for="field in displayFields"
          :key="field.key"
          class="field-item"
        >
          <text class="field-label">{{ field.label }}:</text>
          <text class="field-value">{{ getFieldValue(field) }}</text>
        </view>
      </view>
    </view>

    <view class="card-footer">
      <view class="time-tag">{{ relativeTime }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useApprovalStore } from '@/store/approval'
import { getStatusText, getStatusColor, getRelativeTime, formatDateTime, formatAmount, formatDateRange } from '@/utils/format'
import type { Approval } from '@/types/approval'

interface Props {
  data: Approval
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'click'): void
}>()

const approvalStore = useApprovalStore()

// 类型配置
const typeConfig = computed(() => {
  return approvalStore.typeConfigs.find(t => t.type === props.data.type)
})

const typeColor = computed(() => typeConfig.value?.color || '#969799')

// 状态文本和颜色
const statusText = computed(() => getStatusText(props.data.status))

// 显示字段
const displayFields = computed(() => {
  if (!typeConfig.value) return []

  const listFields = typeConfig.value.displayRules.list
  return typeConfig.value.fields.filter(f => listFields.includes(f.key))
})

// 格式化时间
const formatTime = computed(() => formatDateTime(props.data.submitTime))
const relativeTime = computed(() => getRelativeTime(props.data.submitTime))

// 获取字段值
function getFieldValue(field: any): string {
  const value = props.data.formData[field.key]

  if (value === undefined || value === null) return '-'

  switch (field.type) {
    case 'amount':
      return formatAmount(Number(value))
    case 'daterange':
      return formatDateRange(value)
    case 'date':
      return value
    case 'table':
      return `${value.length}项`
    default:
      return String(value)
  }
}

function handleClick() {
  emit('click')
}
</script>

<style lang="scss" scoped>
.approval-card {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);

  &:active {
    opacity: 0.9;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;

  .type-badge {
    padding: 8rpx 16rpx;
    border-radius: 6rpx;
    font-size: 24rpx;
    color: #ffffff;
    font-weight: bold;
  }

  .status-badge {
    padding: 6rpx 12rpx;
    border-radius: 4rpx;
    font-size: 22rpx;

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

.card-body {
  .summary {
    font-size: 30rpx;
    font-weight: bold;
    color: #323233;
    margin-bottom: 16rpx;
    line-height: 1.5;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 32rpx;
    margin-bottom: 12rpx;

    .info-item {
      font-size: 24rpx;

      .label {
        color: #969799;
      }

      .value {
        color: #323233;
        margin-left: 8rpx;
      }
    }
  }

  .fields {
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #ebedf0;

    .field-item {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      font-size: 26rpx;

      .field-label {
        color: #646566;
        min-width: 140rpx;
      }

      .field-value {
        flex: 1;
        color: #323233;
        font-weight: 500;
      }
    }
  }
}

.card-footer {
  margin-top: 16rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid #ebedf0;

  .time-tag {
    font-size: 22rpx;
    color: #969799;
  }
}
</style>
