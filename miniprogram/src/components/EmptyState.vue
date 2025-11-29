<template>
  <view class="empty-state">
    <view class="empty-icon">📋</view>
    <view class="empty-text">{{ text }}</view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '暂无数据'
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 24rpx;
    opacity: 0.3;
  }

  .empty-text {
    font-size: 28rpx;
    color: #969799;
  }
}
</style>
