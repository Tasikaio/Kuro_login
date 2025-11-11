FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装系统依赖（如果需要图形界面或OCR相关依赖）
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements_web.txt

# 暴露端口
EXPOSE 5000

# 设置环境变量
ENV FLASK_ENV=production
ENV PYTHONPATH=/app/src

# 启动命令
CMD ["python", "src/api/app.py"]