// config/approval-types.js
// 审批类型配置 - 配置化驱动，无需修改代码即可新增/修改审批类型

const approvalTypes = {
  // 请假审批
  leave: {
    type: 'leave',
    name: '请假审批',
    icon: '📅',
    color: '#1989fa',
    fields: [
      {
        key: 'applicant',
        label: '申请人',
        type: 'text',
        required: true
      },
      {
        key: 'leaveType',
        label: '请假类型',
        type: 'select',
        options: ['事假', '病假', '年假', '调休'],
        required: true
      },
      {
        key: 'dateRange',
        label: '请假时间',
        type: 'daterange',
        required: true
      },
      {
        key: 'duration',
        label: '请假天数',
        type: 'number',
        unit: '天',
        required: true
      },
      {
        key: 'reason',
        label: '请假事由',
        type: 'textarea',
        maxLength: 200,
        required: true
      },
      {
        key: 'attachments',
        label: '附件',
        type: 'file',
        accept: ['image', 'pdf'],
        maxCount: 3,
        required: false
      }
    ],
    displayRules: {
      list: ['applicant', 'leaveType', 'dateRange'],
      detail: ['applicant', 'leaveType', 'dateRange', 'duration', 'reason', 'attachments']
    }
  },

  // 报销审批
  expense: {
    type: 'expense',
    name: '报销审批',
    icon: '💰',
    color: '#07c160',
    fields: [
      {
        key: 'applicant',
        label: '申请人',
        type: 'text',
        required: true
      },
      {
        key: 'expenseType',
        label: '报销类型',
        type: 'select',
        options: ['差旅费', '招待费', '办公费', '其他'],
        required: true
      },
      {
        key: 'totalAmount',
        label: '报销金额',
        type: 'amount',
        currency: 'CNY',
        required: true
      },
      {
        key: 'expenseDate',
        label: '报销日期',
        type: 'date',
        required: true
      },
      {
        key: 'items',
        label: '报销明细',
        type: 'table',
        columns: [
          { key: 'itemName', label: '费用项目', width: '35%' },
          { key: 'amount', label: '金额', width: '25%' },
          { key: 'date', label: '日期', width: '25%' },
          { key: 'remark', label: '备注', width: '15%' }
        ]
      },
      {
        key: 'description',
        label: '报销说明',
        type: 'textarea',
        required: true
      },
      {
        key: 'receipts',
        label: '发票凭证',
        type: 'image',
        maxCount: 9,
        required: true
      }
    ],
    displayRules: {
      list: ['applicant', 'expenseType', 'totalAmount'],
      detail: ['applicant', 'expenseType', 'totalAmount', 'expenseDate', 'items', 'description', 'receipts']
    }
  },

  // 采购审批
  purchase: {
    type: 'purchase',
    name: '采购审批',
    icon: '🛒',
    color: '#ff9500',
    fields: [
      {
        key: 'applicant',
        label: '申请人',
        type: 'text',
        required: true
      },
      {
        key: 'purchaseType',
        label: '采购类型',
        type: 'select',
        options: ['设备采购', '原材料采购', '办公用品', '服务采购'],
        required: true
      },
      {
        key: 'totalAmount',
        label: '采购金额',
        type: 'amount',
        currency: 'CNY',
        required: true
      },
      {
        key: 'vendor',
        label: '供应商',
        type: 'text',
        required: true
      },
      {
        key: 'items',
        label: '采购清单',
        type: 'table',
        columns: [
          { key: 'itemName', label: '物品名称', width: '30%' },
          { key: 'spec', label: '规格', width: '20%' },
          { key: 'quantity', label: '数量', width: '15%' },
          { key: 'unitPrice', label: '单价', width: '15%' },
          { key: 'amount', label: '金额', width: '20%' }
        ]
      },
      {
        key: 'purpose',
        label: '采购用途',
        type: 'textarea',
        required: true
      }
    ],
    displayRules: {
      list: ['applicant', 'purchaseType', 'totalAmount'],
      detail: ['applicant', 'purchaseType', 'totalAmount', 'vendor', 'items', 'purpose']
    }
  },

  // 订单审批
  order: {
    type: 'order',
    name: '订单审批',
    icon: '📦',
    color: '#ee0a24',
    fields: [
      {
        key: 'orderNo',
        label: '订单号',
        type: 'text',
        required: true
      },
      {
        key: 'customer',
        label: '客户名称',
        type: 'text',
        required: true
      },
      {
        key: 'totalAmount',
        label: '订单金额',
        type: 'amount',
        currency: 'CNY',
        required: true
      },
      {
        key: 'orderDate',
        label: '下单日期',
        type: 'date',
        required: true
      },
      {
        key: 'deliveryDate',
        label: '交货日期',
        type: 'date',
        required: true
      },
      {
        key: 'items',
        label: '订单明细',
        type: 'table',
        columns: [
          { key: 'productName', label: '产品名称', width: '30%' },
          { key: 'spec', label: '规格', width: '20%' },
          { key: 'quantity', label: '数量', width: '15%' },
          { key: 'price', label: '单价', width: '15%' },
          { key: 'amount', label: '金额', width: '20%' }
        ]
      },
      {
        key: 'paymentTerms',
        label: '付款条件',
        type: 'text',
        required: true
      },
      {
        key: 'remark',
        label: '备注',
        type: 'textarea',
        required: false
      }
    ],
    displayRules: {
      list: ['orderNo', 'customer', 'totalAmount'],
      detail: ['orderNo', 'customer', 'totalAmount', 'orderDate', 'deliveryDate', 'items', 'paymentTerms', 'remark']
    }
  }
}

module.exports = approvalTypes
