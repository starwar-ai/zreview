import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getApprovalList,
  getApprovalDetail,
  submitApproval as submitApprovalApi,
  getApprovalTypes
} from '@/api/approval'
import type { Approval, ApprovalTypeConfig } from '@/types/approval'
import { setStorage, getStorage, StorageKeys } from '@/utils/storage'

export const useApprovalStore = defineStore('approval', () => {
  // 状态
  const approvals = ref<Approval[]>([])
  const currentApproval = ref<Approval | null>(null)
  const typeConfigs = ref<ApprovalTypeConfig[]>([])
  const loading = ref(false)
  const total = ref(0)

  // 计算属性
  const pendingApprovals = computed(() =>
    approvals.value.filter(a => a.status === 'pending')
  )

  const approvedApprovals = computed(() =>
    approvals.value.filter(a => a.status === 'approved')
  )

  const rejectedApprovals = computed(() =>
    approvals.value.filter(a => a.status === 'rejected')
  )

  const getTypeConfig = computed(() => (type: string) =>
    typeConfigs.value.find(t => t.type === type)
  )

  // 获取审批列表
  async function fetchApprovals(params: {
    status?: string
    type?: string
    page?: number
    pageSize?: number
  } = {}) {
    loading.value = true

    try {
      const res = await getApprovalList({
        page: 1,
        pageSize: 100,
        ...params
      })

      approvals.value = res.data.list
      total.value = res.data.total

      // 缓存到本地
      setStorage(StorageKeys.CACHED_APPROVALS, res.data.list)

      return res.data
    } catch (error) {
      console.error('Fetch approvals error:', error)

      // 如果网络失败,尝试从缓存加载
      const cached = getStorage<Approval[]>(StorageKeys.CACHED_APPROVALS)
      if (cached) {
        approvals.value = cached
        uni.showToast({
          title: '已加载缓存数据',
          icon: 'none'
        })
      }

      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取审批详情
  async function fetchApprovalDetail(id: string) {
    loading.value = true

    try {
      const res = await getApprovalDetail(id)
      currentApproval.value = res.data
      return res.data
    } catch (error) {
      console.error('Fetch approval detail error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 提交审批
  async function submitApproval(id: string, data: {
    action: 'approve' | 'reject'
    comment?: string
  }) {
    loading.value = true

    try {
      const res = await submitApprovalApi(id, data)

      // 更新本地列表状态
      const index = approvals.value.findIndex(a => a.id === id)
      if (index > -1) {
        approvals.value[index].status = res.data.status
        approvals.value[index].approvalFlow = res.data.approvalFlow
      }

      // 更新当前审批
      if (currentApproval.value?.id === id) {
        currentApproval.value = res.data
      }

      uni.showToast({
        title: '提交成功',
        icon: 'success'
      })

      return res.data
    } catch (error) {
      console.error('Submit approval error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取审批类型配置
  async function fetchTypeConfigs() {
    try {
      const res = await getApprovalTypes()
      typeConfigs.value = res.data
      return res.data
    } catch (error) {
      console.error('Fetch type configs error:', error)
      throw error
    }
  }

  // 清空当前审批
  function clearCurrentApproval() {
    currentApproval.value = null
  }

  return {
    approvals,
    currentApproval,
    typeConfigs,
    loading,
    total,
    pendingApprovals,
    approvedApprovals,
    rejectedApprovals,
    getTypeConfig,
    fetchApprovals,
    fetchApprovalDetail,
    submitApproval,
    fetchTypeConfigs,
    clearCurrentApproval
  }
})
