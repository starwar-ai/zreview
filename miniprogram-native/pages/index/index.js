// pages/index/index.js
const { getApprovalList, getApprovalTypes } = require('../../api/approval')
const { formatDate, formatDateTime, formatAmount, formatDateRange, getStatusText, getStatusColor, getTypeColor } = require('../../utils/format')
const { cacheApprovalList, getCachedApprovalList } = require('../../utils/storage')
const config = require('../../config/index')
const app = getApp()

Page({
  data: {
    activeTab: 'pending',
    tabs: [
      { value: 'pending', label: '待我审批', count: 0 },
      { value: 'completed', label: '我已审批', count: 0 },
      { value: 'initiated', label: '我发起的', count: 0 }
    ],
    currentType: '',
    typeOptions: [
      { value: 'leave', label: '请假', icon: '📅' },
      { value: 'expense', label: '报销', icon: '💰' },
      { value: 'purchase', label: '采购', icon: '🛒' },
      { value: 'order', label: '订单', icon: '📦' }
    ],
    // 搜索和筛选
    searchKeyword: '',
    showFilter: false,
    filterOptions: {
      startDate: '',
      endDate: '',
      applicant: ''
    },
    allApprovals: [],
    displayList: [],
    typeConfigs: {},
    refreshing: false,
    loading: false,
    // 分页
    page: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad() {
    // 检查登录状态
    if (!app.isLoggedIn()) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
      return
    }

    this.loadTypeConfigs()
    this.loadApprovals()
    
    // 监听全局同步事件
    this.setupSyncListener()
  },

  onShow() {
    // 每次显示页面时刷新数据
    if (app.isLoggedIn()) {
      this.loadApprovals()
    }
  },

  onUnload() {
    // 取消监听
    if (this.syncListener && wx.eventCenter && wx.eventCenter.off) {
      wx.eventCenter.off('syncData', this.syncListener)
    }
  },

  /**
   * 设置同步监听器
   */
  setupSyncListener() {
    this.syncListener = () => {
      console.log('收到同步事件，刷新审批列表')
      this.loadApprovals(true)
    }
    
    // 注册监听
    if (wx.eventCenter && wx.eventCenter.on) {
      wx.eventCenter.on('syncData', this.syncListener)
    }
  },

  /**
   * 加载审批类型配置
   */
  async loadTypeConfigs() {
    try {
      // 优先使用本地配置
      this.setData({
        typeConfigs: config.approvalTypes
      })
      
      // 尝试从服务器加载最新配置
      const res = await getApprovalTypes()
      if (res.data) {
        this.setData({
          typeConfigs: { ...config.approvalTypes, ...res.data }
        })
      }
    } catch (error) {
      console.error('加载审批类型配置失败:', error)
      // 使用本地配置作为降级方案
      this.setData({
        typeConfigs: config.approvalTypes
      })
    }
  },

  /**
   * 加载审批列表
   */
  async loadApprovals(silent = false) {
    if (this.data.loading) return
    
    if (!silent) {
      this.setData({ loading: true })
    }

    try {
      // 根据activeTab决定status参数
      let status = ''
      if (this.data.activeTab === 'pending') {
        status = 'pending'
      } else if (this.data.activeTab === 'completed') {
        status = 'approved,rejected'
      }

      const params = {
        status,
        page: this.data.page,
        pageSize: this.data.pageSize
      }

      // 添加类型筛选
      if (this.data.currentType) {
        params.type = this.data.currentType
      }

      // 添加搜索关键字
      if (this.data.searchKeyword) {
        params.keyword = this.data.searchKeyword
      }

      // 添加日期范围筛选
      if (this.data.filterOptions.startDate) {
        params.startDate = this.data.filterOptions.startDate
      }
      if (this.data.filterOptions.endDate) {
        params.endDate = this.data.filterOptions.endDate
      }

      const res = await getApprovalList(params)
      const approvals = res.data.list || []

      // 缓存数据
      cacheApprovalList(approvals, this.data.activeTab)

      // 更新数据
      this.setData({
        allApprovals: approvals,
        hasMore: approvals.length >= this.data.pageSize
      })

      this.updateTabCounts()
      this.filterApprovals()
    } catch (error) {
      console.error('加载审批列表失败:', error)
      // 尝试从缓存加载
      const cachedApprovals = getCachedApprovalList(this.data.activeTab)
      if (cachedApprovals && cachedApprovals.length > 0) {
        wx.showToast({
          title: '网络异常，显示缓存数据',
          icon: 'none',
          duration: 1500
        })
        this.setData({
          allApprovals: cachedApprovals
        })
        this.updateTabCounts()
        this.filterApprovals()
      }
    } finally {
      this.setData({ loading: false })
    }
  },

  /**
   * 更新Tab计数
   */
  updateTabCounts() {
    const { allApprovals } = this.data
    const tabs = this.data.tabs.map(tab => {
      let count = 0
      if (tab.value === 'pending') {
        count = allApprovals.filter(a => a.status === 'pending').length
      } else if (tab.value === 'completed') {
        count = allApprovals.filter(a => a.status === 'approved' || a.status === 'rejected').length
      } else if (tab.value === 'initiated') {
        count = allApprovals.length
      }
      return { ...tab, count }
    })

    this.setData({ tabs })
  },

  /**
   * 过滤审批列表
   */
  filterApprovals() {
    const { allApprovals, activeTab, currentType, typeConfigs, searchKeyword, filterOptions } = this.data
    let filtered = [...allApprovals]

    // 按Tab过滤
    if (activeTab === 'pending') {
      filtered = filtered.filter(a => a.status === 'pending')
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(a => a.status === 'approved' || a.status === 'rejected')
    }

    // 按类型过滤
    if (currentType) {
      filtered = filtered.filter(a => a.type === currentType)
    }

    // 按关键字搜索
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter(a => {
        return (
          (a.summary && a.summary.toLowerCase().includes(keyword)) ||
          (a.applicant && a.applicant.toLowerCase().includes(keyword)) ||
          (a.id && a.id.toLowerCase().includes(keyword))
        )
      })
    }

    // 按申请人筛选
    if (filterOptions.applicant) {
      filtered = filtered.filter(a => a.applicant && a.applicant.includes(filterOptions.applicant))
    }

    // 按时间范围筛选
    if (filterOptions.startDate || filterOptions.endDate) {
      filtered = filtered.filter(a => {
        const submitTime = new Date(a.submitTime).getTime()
        if (filterOptions.startDate && submitTime < new Date(filterOptions.startDate).getTime()) {
          return false
        }
        if (filterOptions.endDate && submitTime > new Date(filterOptions.endDate).getTime() + 86400000) {
          return false
        }
        return true
      })
    }

    // 处理显示数据
    const displayList = filtered.map(approval => {
      const config = typeConfigs[approval.type]
      const displayFields = []

      if (config && config.displayRules && config.displayRules.list) {
        config.displayRules.list.forEach(fieldKey => {
          const fieldConfig = config.fields.find(f => f.key === fieldKey)
          if (fieldConfig && approval.formData) {
            let value = approval.formData[fieldKey]

            // 格式化值
            if (fieldConfig.type === 'amount') {
              value = formatAmount(value)
            } else if (fieldConfig.type === 'date') {
              value = formatDate(value)
            } else if (fieldConfig.type === 'daterange') {
              value = formatDateRange(value)
            }

            displayFields.push({
              key: fieldKey,
              label: fieldConfig.label,
              value: value
            })
          }
        })
      }

      // 检查是否超过24小时未审批
      const isOverdue = approval.status === 'pending' && 
        (Date.now() - new Date(approval.submitTime).getTime()) > 24 * 60 * 60 * 1000

      return {
        ...approval,
        statusText: getStatusText(approval.status),
        statusColor: getStatusColor(approval.status),
        typeColor: getTypeColor(approval.type),
        typeIcon: config?.icon || '📄',
        submitTime: formatDateTime(approval.submitTime),
        displayFields,
        isOverdue
      }
    })

    this.setData({ displayList })
  },

  /**
   * 切换Tab
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ 
      activeTab: tab, 
      currentType: '',
      searchKeyword: '',
      page: 1
    })
    this.loadApprovals()
  },

  /**
   * 按类型筛选
   */
  filterByType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ currentType: type, page: 1 })
    this.filterApprovals()
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
    // 防抖搜索
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.filterApprovals()
    }, 500)
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({ searchKeyword: '' })
    this.filterApprovals()
  },

  /**
   * 显示/隐藏筛选面板
   */
  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter })
  },

  /**
   * 筛选条件变化
   */
  onFilterChange(e) {
    const { field, value } = e.currentTarget.dataset
    this.setData({
      [`filterOptions.${field}`]: value
    })
  },

  /**
   * 应用筛选
   */
  applyFilter() {
    this.setData({ showFilter: false, page: 1 })
    this.filterApprovals()
  },

  /**
   * 重置筛选
   */
  resetFilter() {
    this.setData({
      filterOptions: {
        startDate: '',
        endDate: '',
        applicant: ''
      },
      showFilter: false,
      page: 1
    })
    this.filterApprovals()
  },

  /**
   * 下拉刷新
   */
  async onRefresh() {
    this.setData({ refreshing: true, page: 1 })
    await this.loadApprovals()
    setTimeout(() => {
      this.setData({ refreshing: false })
    }, 500)
  },

  /**
   * 上拉加载更多
   */
  async onLoadMore() {
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({ page: this.data.page + 1 })
    await this.loadApprovals(true)
  },

  /**
   * 跳转到详情页
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})
