# 库街区登录 Web 应用

本项目为 [Kuro-AutoSignin](https://github.com/mxyooR/Kuro-autosignin) 的附属项目，提供基于 Web 的库街区登录 Token 获取功能。

## 🚀 特性

- **Web 界面**：现代化的 Web 界面，支持响应式设计
- **验证码处理**：自动处理图标点选和滑块验证码
- **Token 管理**：自动获取并管理登录 Token
- **会话保持**：支持会话管理和数据本地存储
- **配置管理**：基于环境变量的灵活配置

## 📁 项目结构

```
Kuro_login/
├── src/                    # 源代码目录
│   ├── api/               # API接口层 (Flask应用)
│   ├── core/              # 核心业务逻辑
│   ├── geetest_captcha/   # 验证码处理模块
│   └── utils/             # 工具类模块
├── web/                   # Web前端文件
│   ├── static/           # 静态资源 (CSS、JS)
│   └── templates/         # HTML模板
├── config/                # 配置文件
│   ├── env/              # 环境配置
│   └── requirements/     # 依赖管理
├── docs/                 # 项目文档
│   ├── api/             # API文档
│   └── usage/           # 使用说明
├── tests/                # 测试文件
└── start_server.py       # 服务启动脚本
```

## 🛠️ 快速开始

### 环境要求

- Python 3.8+
- pip（Python包管理器）

### 安装依赖

```bash
# 安装所有依赖
pip install -r requirements.txt

# 或者仅安装Web应用依赖
pip install -r config/requirements/requirements_web.txt
```

### 配置环境

1. 复制环境配置模板：
```bash
cp config/env/.env.example config/env/.env
```

2. 编辑 `config/env/.env` 文件，根据需要修改配置：
```env
# 应用配置
DEBUG=True
PORT=5000
HOST=127.0.0.1

# 验证码配置
ANDROID_CAPTCHA_ID=3f7e2d848ce0cb7e7d019d621e556ce2
```

### 启动服务

```bash
# 使用启动脚本
python start_server.py

# 或者直接运行Flask应用
python src/api/app.py
```

### 访问应用

服务启动后，在浏览器中访问：
```
http://127.0.0.1:5000
```

## 📚 文档

- [使用说明](docs/usage/README.md) - 详细的使用指南和配置说明
- [API文档](docs/api/README.md) - 完整的API接口文档

## 🔧 验证码类型说明

库街区目前使用两种验证码类型：
1. **图标点选验证码**：需要识别并点击图片中的特定图标
2. **滑块验证码**：需要拖动滑块到指定位置

## 📋 功能特性

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

## 🚨 注意事项

> [!WARNING]
> 1. 由于目前库街区已换回滑块验证，关于图标点选验证仅使用极验官网的Demo进行测试，并不能保证使用
> 2. 识别点选的模型是用网络上的模型，并不保证识别率
> 3. 由于 `ddddocr` 模块目前并不支持 3.13 以上版本，安装环境时注意 Python 版本控制在 3.13 以下

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

本项目基于开源许可证发布。

## 🙏 致谢

- **图标点选的图片处理部分代码来自** [Bump-mann/simple_ocr: 一个简单的识别验证码的代码](https://github.com/Bump-mann/simple_ocr)
- **原始项目来源** [@Ko-Koa](https://github.com/Ko-Koa)
- **手动登录方法来源** [@2314933036](https://github.com/2314933036)

