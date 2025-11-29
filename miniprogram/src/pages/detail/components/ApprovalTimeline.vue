<template>
  <view class="approval-timeline">
    <view
      v-for="(step, index) in steps"
      :key="index"
      class="timeline-item"
      :class="{ last: index === steps.length - 1 }"
    >
      <view class="timeline-dot" :class="getDotClass(step.status)">
        <view class="dot-inner"></view>
      </view>

      <view class="timeline-content">
        <view class="step-header">
          <view class="step-info">
            <text class="step-title">审批人: {{ step.approver }}</text>
            <view class="step-status" :class="step.status">
              {{ getStatusText(step.status) }}
            </view>
          </view>
          <view v-if="step.time" class="step-time">{{ step.time }}</view>
        </view>

        <view v-if="step.comment" class="step-comment">
          <view class="comment-label">审批意见:</view>
          <view class="comment-text">{{ step.comment }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getStatusText } from '@/utils/format'
import type { ApprovalFlowStep } from '@/types/approval'

interface Props {
  steps: ApprovalFlowStep[]
}

defineProps<Props>()

function getDotClass(status: string): string {
  if (status === 'approved') return 'approved'
  if (status === 'rejected') return 'rejected'
  return 'pending'
}
</script>

<style lang="scss" scoped>
.approval-timeline {
  position: relative;

  .timeline-item {
    position: relative;
    padding-left: 56rpx;
    padding-bottom: 48rpx;

    &.last {
      padding-bottom: 0;
    }

    &::before {
      content: '';
      position: absolute;
      left: 15rpx;
      top: 40rpx;
      bottom: 0;
      width: 2rpx;
      background: #ebedf0;
    }

    &.last::before {
      display: none;
    }
  }

  .timeline-dot {
    position: absolute;
    left: 0;
    top: 0;
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    background: #ffffff;
    border: 2rpx solid #ebedf0;
    display: flex;
    align-items: center;
    justify-content: center;

    &.approved {
      border-color: #07c160;

      .dot-inner {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #07c160;
      }
    }

    &.rejected {
      border-color: #ee0a24;

      .dot-inner {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #ee0a24;
      }
    }

    &.pending {
      border-color: #ff976a;

      .dot-inner {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #ff976a;
      }
    }
  }

  .timeline-content {
    .step-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12rpx;

      .step-info {
        flex: 1;

        .step-title {
          font-size: 28rpx;
          color: #323233;
          font-weight: 500;
        }

        .step-status {
          display: inline-block;
          margin-left: 16rpx;
          padding: 4rpx 12rpx;
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

      .step-time {
        font-size: 24rpx;
        color: #969799;
        white-space: nowrap;
        margin-left: 16rpx;
      }
    }

    .step-comment {
      background: #f7f8fa;
      border-radius: 8rpx;
      padding: 16rpx;
      margin-top: 12rpx;

      .comment-label {
        font-size: 24rpx;
        color: #646566;
        margin-bottom: 8rpx;
      }

      .comment-text {
        font-size: 26rpx;
        color: #323233;
        line-height: 1.6;
      }
    }
  }
}
</style>
