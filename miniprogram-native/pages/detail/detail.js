// pages/detail/detail.js
const { getApprovalDetail, submitApproval, getApprovalTypes } = require('../../api/approval')
const { formatDate, formatDateTime, formatAmount, formatDateRange, getStatusText, getStatusColor, getTypeColor } = require('../../utils/format')
const { cacheApprovalDetail, getCachedApprovalDetail } = require('../../utils/storage')
const config = require('../../config/index')
const app = getApp()

Page({
  data: {
    id: '',
    approval: {
      approvalFlow: []
    },
    typeConfig: null,
    formFields: [],
    statusText: '',
    statusColor: '',
    typeColor: '',
    typeIcon: '',
    submitTime: '',
    // 图片预览
    previewImages: [],
    // 附件列表
    attachments: [],
    // 表格展开状态
    tableExpandMap: {},
    submitting: false
  },

  onLoad(options) {
    // 检查登录状态
    if (!app.isLoggedIn()) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
      return
    }

    if (options.id) {
      this.setData({ id: options.id })
      this.loadDetail()
    }
  },

  /**
   * 加载详情
   */
  async loadDetail() {
    wx.showLoading({ title: '加载中...' })

    try {
      // 尝试从缓存加载
      const cachedDetail = getCachedApprovalDetail(this.data.id)
      if (cachedDetail) {
        this.processDetailData(cachedDetail)
      }

      // 加载类型配置
      let typeConfigs = config.approvalTypes
      try {
        const typesRes = await getApprovalTypes()
        if (typesRes.data) {
          typeConfigs = { ...config.approvalTypes, ...typesRes.data }
        }
      } catch (error) {
        console.log('使用本地类型配置')
      }

      // 加载审批详情
      const res = await getApprovalDetail(this.data.id)
      const approval = res.data

      // 缓存详情数据
      cacheApprovalDetail(this.data.id, approval)

      // 处理数据
      this.processDetailData(approval, typeConfigs)
    } catch (error) {
      console.error('加载详情失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  /**
   * 处理详情数据
   */
  processDetailData(approval, typeConfigs = config.approvalTypes) {
    // 获取类型配置
    const typeConfig = typeConfigs[approval.type]

    // 处理表单字段
    const formFields = this.processFormFields(approval, typeConfig)

    // 处理审批流程
    const approvalFlow = approval.approvalFlow.map(step => ({
      ...step,
      statusText: getStatusText(step.status),
      time: step.time ? formatDateTime(step.time) : ''
    }))

    // 收集所有图片用于预览
    const previewImages = []
    const attachments = []
    
    formFields.forEach(field => {
      if (field.type === 'image' && Array.isArray(field.value)) {
        previewImages.push(...field.value)
      } else if (field.type === 'file' && Array.isArray(field.value)) {
        attachments.push(...field.value)
      }
    })

    this.setData({
      approval: {
        ...approval,
        approvalFlow
      },
      typeConfig,
      formFields,
      statusText: getStatusText(approval.status),
      statusColor: getStatusColor(approval.status),
      typeColor: getTypeColor(approval.type),
      typeIcon: typeConfig?.icon || '📄',
      submitTime: formatDateTime(approval.submitTime),
      previewImages,
      attachments
    })
  },

  /**
   * 处理表单字段
   */
  processFormFields(approval, typeConfig) {
    if (!typeConfig || !typeConfig.fields) return []

    const displayFieldKeys = typeConfig.displayRules?.detail || typeConfig.fields.map(f => f.key)
    const formFields = []

    displayFieldKeys.forEach(fieldKey => {
      const fieldConfig = typeConfig.fields.find(f => f.key === fieldKey)
      if (!fieldConfig) return

      const value = approval.formData?.[fieldKey]
      let formattedValue = value

      // 格式化值
      if (fieldConfig.type === 'amount') {
        formattedValue = formatAmount(value)
      } else if (fieldConfig.type === 'date') {
        formattedValue = formatDate(value)
      } else if (fieldConfig.type === 'daterange') {
        formattedValue = formatDateRange(value)
      } else if (fieldConfig.type === 'select') {
        formattedValue = value
      } else if (fieldConfig.type === 'image') {
        // 图片数组
        formattedValue = Array.isArray(value) ? value : []
      } else if (fieldConfig.type === 'file') {
        // 附件数组
        formattedValue = Array.isArray(value) ? value : []
      }

      formFields.push({
        key: fieldKey,
        label: fieldConfig.label,
        type: fieldConfig.type,
        value: value,
        formattedValue: formattedValue,
        columns: fieldConfig.columns || [],
        tableData: fieldConfig.type === 'table' ? (value || []) : [],
        unit: fieldConfig.unit || ''
      })
    })

    return formFields
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      current: url,
      urls: this.data.previewImages
    })
  },

  /**
   * 下载附件
   */
  downloadFile(e) {
    const { url, name } = e.currentTarget.dataset
    wx.showLoading({ title: '下载中...' })
    
    wx.downloadFile({
      url: url,
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200) {
          // 打开文档
          wx.openDocument({
            filePath: res.tempFilePath,
            fileType: this.getFileType(name),
            success: () => {
              console.log('打开文档成功')
            },
            fail: (err) => {
              console.error('打开文档失败:', err)
              wx.showToast({
                title: '无法打开该文件',
                icon: 'none'
              })
            }
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('下载失败:', err)
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 获取文件类型
   */
  getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase()
    const typeMap = {
      'pdf': 'pdf',
      'doc': 'doc',
      'docx': 'docx',
      'xls': 'xls',
      'xlsx': 'xlsx',
      'ppt': 'ppt',
      'pptx': 'pptx'
    }
    return typeMap[ext] || 'pdf'
  },

  /**
   * 切换表格展开状态
   */
  toggleTable(e) {
    const { key } = e.currentTarget.dataset
    const tableExpandMap = { ...this.data.tableExpandMap }
    tableExpandMap[key] = !tableExpandMap[key]
    this.setData({ tableExpandMap })
  },

  /**
   * 处理审批
   */
  async handleSubmit(action) {
    if (this.data.submitting) return
    
    const actionText = action === 'approve' ? '同意' : '拒绝'

    // 如果是拒绝,要求输入意见
    if (action === 'reject') {
      wx.showModal({
        title: '拒绝原因',
        editable: true,
        placeholderText: '请输入拒绝原因（必填）',
        success: async (res) => {
          if (res.confirm) {
            const comment = res.content?.trim()
            if (!comment) {
              wx.showToast({
                title: '请输入拒绝原因',
                icon: 'none'
              })
              return
            }
            await this.submitApproval(action, comment)
          }
        }
      })
    } else {
      wx.showModal({
        title: '确认审批',
        content: `确定${actionText}这个审批吗?`,
        editable: true,
        placeholderText: '可以添加审批意见（选填）',
        success: async (res) => {
          if (res.confirm) {
            await this.submitApproval(action, res.content || '同意')
          }
        }
      })
    }
  },

  /**
   * 提交审批
   */
  async submitApproval(action, comment) {
    this.setData({ submitting: true })
    wx.showLoading({ title: '提交中...' })

    try {
      await submitApproval(this.data.id, { action, comment })

      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })

      // 延迟返回,让用户看到成功提示
      setTimeout(() => {
        // 触发列表刷新
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage) {
          prevPage.loadApprovals && prevPage.loadApprovals()
        }
        wx.navigateBack()
      }, 2000)
    } catch (error) {
      console.error('提交失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: error.message || '提交失败，请重试',
        icon: 'none',
        duration: 2000
      })
    } finally {
      this.setData({ submitting: false })
    }
  },

  /**
   * 同意
   */
  handleApprove() {
    this.handleSubmit('approve')
  },

  /**
   * 拒绝
   */
  handleReject() {
    this.handleSubmit('reject')
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: `审批：${this.data.approval.summary || '审批详情'}`,
      path: `/pages/detail/detail?id=${this.data.id}`,
      imageUrl: ''
    }
  }
})
