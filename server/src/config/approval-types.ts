import { ApprovalTypeConfig } from '../types/approval'

export const approvalTypes: ApprovalTypeConfig[] = [
  {
    type: 'leave',
    name: '请假审批',
    icon: 'calendar',
    color: '#1989fa',
    fields: [
      { key: 'applicant', label: '申请人', type: 'text', required: true },
      { key: 'department', label: '部门', type: 'text', required: true },
      { key: 'leaveType', label: '请假类型', type: 'text', required: true },
      { key: 'dateRange', label: '请假时间', type: 'daterange', required: true },
      { key: 'duration', label: '请假天数', type: 'number', required: true },
      { key: 'reason', label: '请假事由', type: 'textarea', required: true }
    ],
    displayRules: {
      list: ['applicant', 'leaveType', 'dateRange'],
      detail: ['applicant', 'department', 'leaveType', 'dateRange', 'duration', 'reason']
    }
  },
  {
    type: 'expense',
    name: '费用报销审批',
    icon: 'money',
    color: '#07c160',
    fields: [
      { key: 'applicant', label: '申请人', type: 'text', required: true },
      { key: 'department', label: '部门', type: 'text', required: true },
      { key: 'expenseType', label: '费用类型', type: 'text', required: true },
      { key: 'amount', label: '报销金额', type: 'amount', required: true },
      { key: 'date', label: '发生日期', type: 'date', required: true },
      { key: 'description', label: '费用说明', type: 'textarea', required: true },
      { key: 'attachments', label: '发票附件', type: 'image' }
    ],
    displayRules: {
      list: ['applicant', 'expenseType', 'amount'],
      detail: ['applicant', 'department', 'expenseType', 'amount', 'date', 'description', 'attachments']
    }
  },
  {
    type: 'purchase',
    name: '采购订单审批',
    icon: 'cart',
    color: '#ff976a',
    fields: [
      { key: 'applicant', label: '申请人', type: 'text', required: true },
      { key: 'department', label: '部门', type: 'text', required: true },
      { key: 'supplier', label: '供应商', type: 'text', required: true },
      { key: 'totalAmount', label: '订单总额', type: 'amount', required: true },
      { key: 'items', label: '采购明细', type: 'table', required: true,
        columns: [
          { key: 'productCode', label: '物料编码', width: '25%' },
          { key: 'productName', label: '物料名称', width: '30%' },
          { key: 'quantity', label: '数量', width: '15%' },
          { key: 'price', label: '单价', width: '15%' },
          { key: 'amount', label: '金额', width: '15%' }
        ]
      },
      { key: 'reason', label: '采购事由', type: 'textarea', required: true }
    ],
    displayRules: {
      list: ['applicant', 'supplier', 'totalAmount'],
      detail: ['applicant', 'department', 'supplier', 'totalAmount', 'items', 'reason']
    }
  },
  {
    type: 'order',
    name: '订单审批',
    icon: 'orders',
    color: '#ed6a0c',
    fields: [
      { key: 'applicant', label: '申请人', type: 'text', required: true },
      { key: 'orderNo', label: '订单号', type: 'text', required: true },
      { key: 'customer', label: '客户名称', type: 'text', required: true },
      { key: 'totalAmount', label: '订单金额', type: 'amount', required: true },
      { key: 'items', label: '订单明细', type: 'table', required: true,
        columns: [
          { key: 'productName', label: '产品名称', width: '40%' },
          { key: 'quantity', label: '数量', width: '20%' },
          { key: 'price', label: '单价', width: '20%' },
          { key: 'amount', label: '金额', width: '20%' }
        ]
      },
      { key: 'deliveryDate', label: '交货日期', type: 'date', required: true },
      { key: 'notes', label: '备注', type: 'textarea' }
    ],
    displayRules: {
      list: ['orderNo', 'customer', 'totalAmount'],
      detail: ['applicant', 'orderNo', 'customer', 'totalAmount', 'items', 'deliveryDate', 'notes']
    }
  }
]
