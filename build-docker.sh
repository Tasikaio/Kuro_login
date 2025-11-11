#!/bin/bash

# Docker镜像构建脚本

echo "开始构建库街区登录Docker镜像..."

# 构建镜像
docker build -t kuro-login:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker镜像构建成功"
    echo ""
    echo "运行以下命令启动服务："
    echo "docker run -p 5000:5000 kuro-login:latest"
    echo ""
    echo "或者使用docker-compose："
    echo "docker-compose up -d"
else
    echo "❌ Docker镜像构建失败"
    exit 1
fi