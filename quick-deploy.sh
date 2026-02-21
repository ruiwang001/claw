#!/bin/bash

# 🚀 Stock Guardian AI - 一键部署脚本
# 自动部署到 Vercel (前端) + Render (后端)

set -e

echo "🚀 Stock Guardian AI 一键部署"
echo "==============================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查 Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查 Git
if ! command_exists git; then
    echo -e "${RED}❌ Git 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""

# 安装 Vercel CLI
if ! command_exists vercel; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "📝 部署前配置"
echo "--------------"

# 提示用户输入配置
echo -n "请输入你的网站名称 (如 stock-guardian): "
read SITE_NAME

if [ -z "$SITE_NAME" ]; then
    SITE_NAME="stock-guardian-$(date +%s)"
fi

echo -n "是否已配置 GitHub? (y/n): "
read HAS_GITHUB

if [ "$HAS_GITHUB" != "y" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  请先完成以下步骤：${NC}"
    echo ""
    echo "1️⃣  创建 GitHub 仓库"
    echo "   访问: https://github.com/new"
    echo "   仓库名: $SITE_NAME"
    echo "   选择: Public"
    echo ""
    echo "2️⃣  推送代码到 GitHub"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'initial'"
    echo "   git remote add origin https://github.com/你的用户名/$SITE_NAME.git"
    echo "   git push -u origin main"
    echo ""
    echo "完成后重新运行此脚本"
    exit 0
fi

echo ""
echo "🚀 开始部署前端到 Vercel"
echo "------------------------"

cd frontend

# 创建 vercel.json
cat > vercel.json << EOF
{
  "version": 2,
  "name": "$SITE_NAME",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_BASE": "https://$SITE_NAME-api.onrender.com"
  }
}
EOF

# 部署到 Vercel
echo ""
echo "⚡ 正在部署到 Vercel..."
vercel --prod --yes

FRONTEND_URL=$(vercel ls --token="$(vercel whoami 2>/dev/null || echo "")" 2>/dev/null | grep "$SITE_NAME" | head -1 | awk '{print $2}')

cd ..

echo ""
echo "🚀 开始部署后端到 Render"
echo "------------------------"

echo ""
echo -e "${YELLOW}⚠️  后端需要手动部署到 Render${NC}"
echo ""
echo "步骤："
echo "1. 访问 https://dashboard.render.com/"
echo "2. 点击 'New +' → 'Web Service'"
echo "3. 连接你的 GitHub 仓库"
echo "4. 配置："
echo "   - Name: $SITE_NAME-api"
echo "   - Root Directory: backend"
echo "   - Runtime: Python 3"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port 10000"
echo ""
echo "5. 添加环境变量："
echo "   JWT_SECRET=$(openssl rand -hex 32)"
echo "   LLM_BASE_URL=https://api.moonshot.cn/v1"
echo "   LLM_API_KEY=sk-ZAJL7H4PbSiIhuOEiMRRaaStdVvo5bxFvl8CR9QNy8vGYAsY"
echo "   LLM_MODEL=moonshot-v1-32k"
echo "   MARKET_DATA_PROVIDER=mock"
echo "   AGENT_CRON_MINUTES=15"
echo ""
echo "6. 点击 'Create Web Service'"
echo ""

echo -e "${GREEN}✅ 前端部署完成！${NC}"
echo ""
echo "🌐 访问地址："
echo "   前端: https://$SITE_NAME.vercel.app"
echo "   后端: https://$SITE_NAME-api.onrender.com"
echo ""
echo "📱 免费域名："
echo "   Vercel 提供免费的 .vercel.app 域名"
echo "   如: https://$SITE_NAME.vercel.app"
echo ""

# 保存部署信息
cat > DEPLOY_INFO.txt << EOF
部署信息
========
网站名称: $SITE_NAME
前端地址: https://$SITE_NAME.vercel.app
后端地址: https://$SITE_NAME-api.onrender.com
部署时间: $(date)

环境变量 (后端):
JWT_SECRET=$(openssl rand -hex 32)
LLM_BASE_URL=https://api.moonshot.cn/v1
LLM_API_KEY=sk-ZAJL7H4PbSiIhuOEiMRRaaStdVvo5bxFvl8CR9QNy8vGYAsY
LLM_MODEL=moonshot-v1-32k
MARKET_DATA_PROVIDER=mock
AGENT_CRON_MINUTES=15
EOF

echo "💾 部署信息已保存到 DEPLOY_INFO.txt"
echo ""
