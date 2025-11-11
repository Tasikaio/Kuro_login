# 使用说明

## 快速开始

### 1. 环境准备

确保系统已安装以下软件：
- Python 3.8+
- pip（Python包管理器）

### 2. 安装依赖

```bash
# 安装所有依赖
pip install -r requirements.txt

# 或者仅安装Web应用依赖
pip install -r config/requirements/requirements_web.txt
```

### 3. 配置环境

复制环境配置模板：
```bash
cp config/env/.env.example config/env/.env
```

编辑 `config/env/.env` 文件，根据需要修改配置：
```env
# 应用配置
DEBUG=True
PORT=5000
HOST=127.0.0.1

# 验证码配置
ANDROID_CAPTCHA_ID=3f7e2d848ce0cb7e7d019d621e556ce2
```

### 4. 启动服务

```bash
# 使用启动脚本
python start_server.py

# 或者直接运行Flask应用
python src/api/app.py
```

### 5. 访问应用

服务启动后，在浏览器中访问：
```
http://127.0.0.1:5000
```

## 项目结构说明

```
Kuro_login/
├── src/                    # 源代码目录
│   ├── api/               # API接口层
│   ├── core/              # 核心业务逻辑
│   ├── geetest_captcha/   # 验证码处理模块
│   └── utils/             # 工具类模块
├── web/                   # Web前端文件
│   ├── static/           # 静态资源（CSS、JS）
│   └── templates/         # HTML模板
├── config/                # 配置文件
│   ├── env/              # 环境配置
│   └── requirements/     # 依赖管理
├── docs/                 # 项目文档
├── tests/                # 测试文件
└── start_server.py       # 服务启动脚本
```

## 功能特性

### 核心功能
- ✅ 手机号验证码登录
- ✅ Token自动获取
- ✅ 验证码自动识别
- ✅ 会话管理
- ✅ 数据本地存储

### 安全特性
- ✅ 输入验证
- ✅ 会话超时控制
- ✅ 错误处理
- ✅ 安全日志

### 用户体验
- ✅ 响应式设计
- ✅ 实时状态反馈
- ✅ 自动重试机制
- ✅ 离线数据保存

## 开发指南

### 添加新功能

1. **后端开发**：
   - 在 `src/core/` 目录添加业务逻辑
   - 在 `src/api/` 目录添加API接口
   - 更新相关配置文件

2. **前端开发**：
   - 修改 `web/templates/` 中的HTML模板
   - 更新 `web/static/` 中的CSS和JS文件
   - 确保API调用路径正确

### 测试

```bash
# 运行单元测试
python -m pytest tests/unit/

# 运行集成测试
python -m pytest tests/integration/
```

### 部署

#### 生产环境部署

1. 修改环境配置：
```env
DEBUG=False
HOST=0.0.0.0
```

2. 使用生产级WSGI服务器：
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 src.api.app:app
```

#### Docker部署

创建 `Dockerfile`：
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python", "src/api/app.py"]
```

构建并运行：
```bash
docker build -t kuro-login .
docker run -p 5000:5000 kuro-login
```

## 故障排除

### 常见问题

1. **依赖安装失败**
   - 检查Python版本（需要3.8+）
   - 尝试使用国内镜像源：`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt`

2. **服务启动失败**
   - 检查端口是否被占用：`netstat -ano | findstr :5000`
   - 修改 `config/env/.env` 中的端口配置

3. **验证码识别失败**
   - 检查网络连接
   - 验证验证码ID配置是否正确
   - 查看日志文件获取详细错误信息

4. **前端资源加载失败**
   - 检查静态文件路径配置
   - 确认Flask路由配置正确
   - 查看浏览器开发者工具的网络请求

### 日志查看

应用日志位于：
- 控制台输出（开发环境）
- `logs/kuro_login.log`（生产环境）

### 性能优化

1. **启用缓存**：
   - 配置Redis缓存会话数据
   - 使用CDN加速静态资源

2. **数据库优化**：
   - 添加数据库连接池
   - 优化查询语句

3. **前端优化**：
   - 压缩CSS/JS文件
   - 启用Gzip压缩
   - 使用浏览器缓存

## 技术支持

如有问题，请查看：
- [API文档](./api/README.md)
- 项目GitHub仓库
- 开发者文档