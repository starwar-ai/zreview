import { Approval } from '../types/approval'

export const mockApprovals: Approval[] = [
  // 请假审批 - 待审批
  {
    id: 'A20231201001',
    type: 'leave',
    typeName: '请假审批',
    applicant: '王小明',
    applicantAvatar: '',
    submitTime: '2023-12-01 09:30:00',
    status: 'pending',
    summary: '王小明申请事假2天',
    formData: {
      applicant: '王小明',
      department: '技术部',
      leaveType: '事假',
      dateRange: ['2023-12-05', '2023-12-06'],
      duration: 2,
      reason: '家中有事需要处理'
    },
    approvalFlow: [
      {
        step: 1,
        approver: '张三',
        status: 'pending',
        comment: '',
        time: ''
      }
    ]
  },
  // 请假审批 - 待审批
  {
    id: 'A20231201002',
    type: 'leave',
    typeName: '请假审批',
    applicant: '李晓华',
    applicantAvatar: '',
    submitTime: '2023-12-01 10:15:00',
    status: 'pending',
    summary: '李晓华申请病假1天',
    formData: {
      applicant: '李晓华',
      department: '市场部',
      leaveType: '病假',
      dateRange: ['2023-12-02', '2023-12-02'],
      duration: 1,
      reason: '身体不适,需要就医'
    },
    approvalFlow: [
      {
        step: 1,
        approver: '张三',
        status: 'pending',
        comment: '',
        time: ''
      }
    ]
  },
  // 费用报销 - 待审批
  {
    id: 'A20231201003',
    type: 'expense',
    typeName: '费用报销审批',
    applicant: '赵敏',
    applicantAvatar: '',
    submitTime: '2023-12-01 11:20:00',
    status: 'pending',
    summary: '赵敏申请差旅费报销',
    formData: {
      applicant: '赵敏',
      department: '销售部',
      expenseType: '差旅费',
      amount: 3580.00,
      date: '2023-11-28',
      description: '出差北京客户拜访,包含机票、住宿和餐费',
      attachments: []
    },
    approvalFlow: [
      {
        step: 1,
        approver: '李四',
        status: 'pending',
        comment: '',
        time: ''
      }
    ]
  },
  // 采购订单 - 待审批
  {
    id: 'A20231201004',
    type: 'purchase',
    typeName: '采购订单审批',
    applicant: '王五',
    applicantAvatar: '',
    submitTime: '2023-12-01 14:30:00',
    status: 'pending',
    summary: '王五申请办公用品采购',
    formData: {
      applicant: '王五',
      department: '行政部',
      supplier: '晨光文具有限公司',
      totalAmount: 5280.00,
      items: [
        { productCode: 'P001', productName: 'A4打印纸', quantity: 50, price: 28.00, amount: 1400.00 },
        { productCode: 'P002', productName: '中性笔', quantity: 200, price: 2.50, amount: 500.00 },
        { productCode: 'P003', productName: '文件夹', quantity: 100, price: 3.80, amount: 380.00 },
        { productCode: 'P004', productName: '订书机', quantity: 20, price: 25.00, amount: 500.00 },
        { productCode: 'P005', productName: '笔记本', quantity: 150, price: 12.00, amount: 1800.00 },
        { productCode: 'P006', productName: '计算器', quantity: 10, price: 70.00, amount: 700.00 }
      ],
      reason: '第四季度办公用品补充采购'
    },
    approvalFlow: [
      {
        step: 1,
        approver: '张三',
        status: 'pending',
        comment: '',
        time: ''
      }
    ]
  },
  // 订单审批 - 待审批
  {
    id: 'A20231201005',
    type: 'order',
    typeName: '订单审批',
    applicant: '刘强',
    applicantAvatar: '',
    submitTime: '2023-12-01 15:45:00',
    status: 'pending',
    summary: '刘强申请客户订单审批',
    formData: {
      applicant: '刘强',
      orderNo: 'SO20231201001',
      customer: '上海科技有限公司',
      totalAmount: 158000.00,
      items: [
        { productName: '企业级路由器', quantity: 10, price: 8000.00, amount: 80000.00 },
        { productName: '24口交换机', quantity: 20, price: 3200.00, amount: 64000.00 },
        { productName: '网线(箱)', quantity: 10, price: 800.00, amount: 8000.00 },
        { productName: '配件工具包', quantity: 6, price: 1000.00, amount: 6000.00 }
      ],
      deliveryDate: '2023-12-15',
      notes: '客户要求提供安装调试服务'
    },
    approvalFlow: [
      {
        step: 1,
        approver: '张三',
        status: 'pending',
        comment: '',
        time: ''
      }
    ]
  },
  // 请假审批 - 已通过
  {
    id: 'A20231130001',
    type: 'leave',
    typeName: '请假审批',
    applicant: '张伟',
    applicantAvatar: '',
    submitTime: '2023-11-30 09:00:00',
    status: 'approved',
    summary: '张伟申请年假3天',
    formData: {
      applicant: '张伟',
      department: '技术部',
      leaveType: '年假',
      dateRange: ['2023-12-10', '2023-12-12'],
      duration: 3,
      reason: '个人休假安排'
    },
    approvalFlow: [
      {
        step: 1,
        approver: '张三',
        status: 'approved',
        comment: '同意',
        time: '2023-11-30 10:30:00'
      }
    ]
  },
  // 费用报销 - 已通过
  {
    id: 'A20231130002',
    type: 'expense',
    typeName: '费用报销审批',
    applicant: '陈佳',
    applicantAvatar: '',
    submitTime: '2023-11-30 13:20:00',
    status: 'approved',
    summary: '陈佳申请培训费报销',
    formData: {
      applicant: '陈佳',
      department: '技术部',
      expenseType: '培训费',
      amount: 4800.00,
      date: '2023-11-25',
      description: '参加Vue3高级开发培训课程',
      attachments: []
    },
    approvalFlow: [
      {
        step: 1,
        approver: '李四',
        status: 'approved',
        comment: '同意报销',
        time: '2023-11-30 15:00:00'
      }
    ]
  },
  // 采购订单 - 已拒绝
  {
    id: 'A20231129001',
    type: 'purchase',
    typeName: '采购订单审批',
    applicant: '孙丽',
    applicantAvatar: '',
    submitTime: '2023-11-29 16:00:00',
    status: 'rejected',
    summary: '孙丽申请设备采购',
    formData: {
      applicant: '孙丽',
      department: '技术部',
      supplier: '戴尔电脑专卖店',
      totalAmount: 85000.00,
      items: [
        { productCode: 'D001', productName: 'Dell工作站', quantity: 10, price: 8500.00, amount: 85000.00 }
      ],
      reason: '部门扩编,需要增加工作站'
    },
    approvalFlow: [
      {
        step: 1,
        approver: '张三',
        status: 'rejected',
        comment: '本季度预算已用完,建议下季度重新申请',
        time: '2023-11-30 09:00:00'
      }
    ]
  }
]
