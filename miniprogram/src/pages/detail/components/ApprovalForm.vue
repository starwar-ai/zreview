<template>
  <view class="approval-form">
    <view
      v-for="field in displayFields"
      :key="field.key"
      class="form-field"
    >
      <view class="field-label">{{ field.label }}</view>

      <!-- 文本类型 -->
      <view v-if="field.type === 'text' || field.type === 'textarea'" class="field-value">
        {{ getValue(field.key) }}
      </view>

      <!-- 数字类型 -->
      <view v-else-if="field.type === 'number'" class="field-value field-number">
        {{ getValue(field.key) }}
      </view>

      <!-- 金额类型 -->
      <view v-else-if="field.type === 'amount'" class="field-value field-amount">
        {{ formatAmount(getValue(field.key)) }}
      </view>

      <!-- 日期类型 -->
      <view v-else-if="field.type === 'date'" class="field-value">
        {{ getValue(field.key) }}
      </view>

      <!-- 日期范围类型 -->
      <view v-else-if="field.type === 'daterange'" class="field-value">
        {{ formatDateRange(getValue(field.key)) }}
      </view>

      <!-- 表格类型 -->
      <view v-else-if="field.type === 'table'" class="field-table">
        <view class="table-wrapper">
          <scroll-view scroll-x class="table-scroll">
            <view class="table">
              <!-- 表头 -->
              <view class="table-row table-header">
                <view
                  v-for="col in field.columns"
                  :key="col.key"
                  class="table-cell"
                  :style="{ width: col.width || 'auto' }"
                >
                  {{ col.label }}
                </view>
              </view>

              <!-- 表格内容 -->
              <view
                v-for="(row, index) in getTableData(field.key)"
                :key="index"
                class="table-row"
              >
                <view
                  v-for="col in field.columns"
                  :key="col.key"
                  class="table-cell"
                  :style="{ width: col.width || 'auto' }"
                >
                  {{ row[col.key] }}
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="table-summary">
          共 {{ getTableData(field.key).length }} 项
        </view>
      </view>

      <!-- 图片类型 -->
      <view v-else-if="field.type === 'image'" class="field-images">
        <view v-if="getImageList(field.key).length > 0" class="image-list">
          <image
            v-for="(img, index) in getImageList(field.key)"
            :key="index"
            :src="img"
            class="image-item"
            mode="aspectFill"
          />
        </view>
        <view v-else class="no-data">暂无图片</view>
      </view>

      <!-- 其他类型 -->
      <view v-else class="field-value">
        {{ getValue(field.key) }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatAmount, formatDateRange } from '@/utils/format'
import type { ApprovalTypeConfig } from '@/types/approval'

interface Props {
  config: ApprovalTypeConfig
  data: Record<string, any>
}

const props = defineProps<Props>()

// 显示的字段
const displayFields = computed(() => {
  const detailFields = props.config.displayRules.detail
  return props.config.fields.filter(f => detailFields.includes(f.key))
})

// 获取值
function getValue(key: string): any {
  return props.data[key] ?? '-'
}

// 获取表格数据
function getTableData(key: string): any[] {
  const value = props.data[key]
  return Array.isArray(value) ? value : []
}

// 获取图片列表
function getImageList(key: string): string[] {
  const value = props.data[key]
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return [value]
  return []
}
</script>

<style lang="scss" scoped>
.approval-form {
  .form-field {
    margin-bottom: 32rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .field-label {
      font-size: 26rpx;
      color: #646566;
      margin-bottom: 12rpx;
    }

    .field-value {
      font-size: 28rpx;
      color: #323233;
      line-height: 1.6;
      word-break: break-all;
    }

    .field-number {
      font-weight: 500;
    }

    .field-amount {
      font-size: 36rpx;
      font-weight: bold;
      color: #ee0a24;
    }

    .field-table {
      .table-wrapper {
        border: 1rpx solid #ebedf0;
        border-radius: 8rpx;
        overflow: hidden;
      }

      .table-scroll {
        width: 100%;
      }

      .table {
        display: table;
        min-width: 100%;
        border-collapse: collapse;

        .table-row {
          display: table-row;

          &.table-header {
            background: #f7f8fa;
            font-weight: bold;
          }

          .table-cell {
            display: table-cell;
            padding: 16rpx 12rpx;
            font-size: 24rpx;
            color: #323233;
            border-bottom: 1rpx solid #ebedf0;
            text-align: center;
            min-width: 120rpx;

            &:not(:last-child) {
              border-right: 1rpx solid #ebedf0;
            }
          }

          &:last-child .table-cell {
            border-bottom: none;
          }
        }
      }

      .table-summary {
        margin-top: 12rpx;
        font-size: 24rpx;
        color: #969799;
        text-align: right;
      }
    }

    .field-images {
      .image-list {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;

        .image-item {
          width: 160rpx;
          height: 160rpx;
          border-radius: 8rpx;
          background: #f7f8fa;
        }
      }

      .no-data {
        font-size: 26rpx;
        color: #969799;
      }
    }
  }
}
</style>
