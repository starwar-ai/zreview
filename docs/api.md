# Zreview API 文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token (除登录接口外都需要)

## 认证相关

### 1. 用户登录

**请求**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "zhangsan"
}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "token_zhangsan",
    "userInfo": {
      "name": "张三",
      "role": "manager"
    }
  }
}
```

**测试用户**:
- `zhangsan` - 张三 (部门经理)
- `lisi` - 李四 (财务主管)
- `wangwu` - 王五 (采购专员)

---

## 审批相关

### 2. 获取审批列表

**请求**
```http
GET /api/approvals?status=pending&type=leave&page=1&pageSize=20
Authorization: Bearer token_zhangsan
```

**Query参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 审批状态: `pending` / `approved` / `rejected` |
| type | string | 否 | 审批类型: `leave` / `expense` / `purchase` / `order` |
| page | number | 否 | 页码,默认 1 |
| pageSize | number | 否 | 每页数量,默认 20 |

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "A20231201001",
        "type": "leave",
        "typeName": "请假审批",
        "applicant": "王小明",
        "submitTime": "2023-12-01 09:30:00",
        "status": "pending",
        "summary": "王小明申请事假2天",
        "formData": { ... },
        "approvalFlow": [ ... ]
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 20
  }
}
```

### 3. 获取审批详情

**请求**
```http
GET /api/approvals/A20231201001
Authorization: Bearer token_zhangsan
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "A20231201001",
    "type": "leave",
    "typeName": "请假审批",
    "applicant": "王小明",
    "applicantAvatar": "",
    "submitTime": "2023-12-01 09:30:00",
    "status": "pending",
    "summary": "王小明申请事假2天",
    "formData": {
      "applicant": "王小明",
      "department": "技术部",
      "leaveType": "事假",
      "dateRange": ["2023-12-05", "2023-12-06"],
      "duration": 2,
      "reason": "家中有事需要处理"
    },
    "approvalFlow": [
      {
        "step": 1,
        "approver": "张三",
        "status": "pending",
        "comment": "",
        "time": ""
      }
    ]
  }
}
```

### 4. 提交审批结果

**请求**
```http
POST /api/approvals/A20231201001/submit
Authorization: Bearer token_zhangsan
Content-Type: application/json

{
  "action": "approve",
  "comment": "同意"
}
```

**Body参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| action | string | 是 | 审批动作: `approve` (同意) / `reject` (拒绝) |
| comment | string | 否 | 审批意见 |

**响应**
```json
{
  "code": 0,
  "message": "提交成功",
  "data": {
    "id": "A20231201001",
    "status": "approved",
    ...
  }
}
```

### 5. 获取审批类型配置

**请求**
```http
GET /api/approvals/types
Authorization: Bearer token_zhangsan
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "type": "leave",
      "name": "请假审批",
      "icon": "calendar",
      "color": "#1989fa",
      "fields": [
        {
          "key": "applicant",
          "label": "申请人",
          "type": "text",
          "required": true
        },
        ...
      ],
      "displayRules": {
        "list": ["applicant", "leaveType", "dateRange"],
        "detail": ["applicant", "department", "leaveType", "dateRange", "duration", "reason"]
      }
    },
    ...
  ]
}
```

---

## 错误码说明

| Code | 说明 |
|------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token无效 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 示例脚本

### 完整审批流程测试

```bash
# 1. 登录获取token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"zhangsan"}' | jq -r '.data.token')

# 2. 获取待审批列表
curl -X GET "http://localhost:3000/api/approvals?status=pending&page=1&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. 获取审批详情
curl -X GET "http://localhost:3000/api/approvals/A20231201001" \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. 提交审批(同意)
curl -X POST "http://localhost:3000/api/approvals/A20231201001/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"approve","comment":"同意"}' | jq

# 5. 查看已审批列表
curl -X GET "http://localhost:3000/api/approvals?status=approved&page=1&pageSize=5" \
  -H "Authorization: Bearer $TOKEN" | jq
```
