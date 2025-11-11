# API 文档

## 概述

库街区登录项目的API接口文档，提供完整的RESTful API说明。

## 基础信息

- **基础URL**: `http://127.0.0.1:5000/api`
- **认证方式**: 无认证（公开API）
- **数据格式**: JSON

## API端点

### 1. 健康检查

**GET** `/api/health`

检查服务状态。

**响应示例**:
```json
{
    "status": "healthy",
    "service": "kuro-login-web"
}
```

### 2. 发送短信验证码

**POST** `/api/send_sms`

发送短信验证码到指定手机号。

**请求参数**:
```json
{
    "phoneNumber": "13800138000"
}
```

**响应示例**:
```json
{
    "success": true,
    "session_id": "uuid-string",
    "message": "验证码发送成功"
}
```

**错误响应**:
```json
{
    "success": false,
    "message": "错误信息"
}
```

### 3. 用户登录

**POST** `/api/login`

使用短信验证码登录并获取Token。

**请求参数**:
```json
{
    "session_id": "uuid-string",
    "smsCode": "123456"
}
```

**响应示例**:
```json
{
    "success": true,
    "data": {
        "token": "token-string",
        "userId": "user-id",
        "roleId": "role-id",
        "roleName": "角色名",
        "serverId": "server-id",
        "deviceCode": "device-uuid",
        "distinctId": "distinct-uuid"
    }
}
```

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 500 | 服务器内部错误 |

## 使用示例

### Python示例

```python
import requests

# 发送验证码
response = requests.post('http://127.0.0.1:5000/api/send_sms', json={
    'phoneNumber': '13800138000'
})

if response.json()['success']:
    session_id = response.json()['session_id']
    
    # 登录
    login_response = requests.post('http://127.0.0.1:5000/api/login', json={
        'session_id': session_id,
        'smsCode': '123456'
    })
    
    if login_response.json()['success']:
        token_data = login_response.json()['data']
        print(f"Token: {token_data['token']}")
```

### JavaScript示例

```javascript
// 发送验证码
const response = await fetch('/api/send_sms', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        phoneNumber: '13800138000'
    })
});

const result = await response.json();
if (result.success) {
    // 登录
    const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: result.session_id,
            smsCode: '123456'
        })
    });
    
    const loginResult = await loginResponse.json();
    if (loginResult.success) {
        console.log('Token:', loginResult.data.token);
    }
}
```