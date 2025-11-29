<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import { useApprovalStore } from '@/store/approval'

onLaunch(() => {
  console.log('App Launch')

  // 检查登录状态
  const userStore = useUserStore()
  const isLoggedIn = userStore.checkLogin()

  if (!isLoggedIn) {
    // 未登录,跳转到登录页
    uni.reLaunch({
      url: '/pages/login/index'
    })
  } else {
    // 已登录,加载审批类型配置
    const approvalStore = useApprovalStore()
    approvalStore.fetchTypeConfigs()
  }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '@/styles/common.scss';
</style>
