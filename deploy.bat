@echo off
echo 正在部署库街区登录应用...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到Python，请先安装Python 3.9+
    pause
    exit /b 1
)

REM 创建虚拟环境
echo 1. 创建虚拟环境...
if not exist "venv" (
    python -m venv venv
)

REM 激活虚拟环境
echo 2. 激活虚拟环境并安装依赖...
call venv\Scripts\activate.bat

REM 安装依赖
echo 3. 安装Python依赖...
pip install -r config\requirements\requirements_web.txt

REM 启动应用
echo 4. 启动应用...
echo 应用将在 http://127.0.0.1:5000 启动
echo 按 Ctrl+C 停止服务
echo.
python src/api/app.py

pause