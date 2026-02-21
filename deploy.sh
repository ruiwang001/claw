#!/bin/bash

# Stock Guardian AI - Deploy Script
# Usage: ./deploy.sh [local|production]

set -e

ENV=${1:-local}

echo "🚀 Stock Guardian AI 部署脚本"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，从 .env.example 创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑它并填入你的 API Key"
    echo ""
    echo "📝 需要设置的环境变量："
    echo "   - LLM_API_KEY (Kimi API Key)"
    echo "   - JWT_SECRET (随机字符串)"
    echo ""
    exit 1
fi

echo "🔨 开始构建..."
echo ""

if [ "$ENV" = "production" ]; then
    echo "🏭 生产模式部署（带 Nginx）"
    docker-compose --profile production up -d --build
else
    echo "🔧 本地模式部署"
    docker-compose up -d --build
fi

echo ""
echo "✅ 部署完成！"
echo ""

if [ "$ENV" = "production" ]; then
    echo "🌐 访问地址: http://localhost"
    echo "   - 前端: http://localhost (通过 Nginx)"
    echo "   - 后端 API: http://localhost/api"
else
    echo "🌐 访问地址:"
    echo "   - 前端: http://localhost:3000"
    echo "   - 后端 API: http://localhost:8000"
fi

echo ""
echo "📊 查看日志:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 停止服务:"
echo "   docker-compose down"
echo ""
