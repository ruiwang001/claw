#!/bin/bash

# 🚀 最简部署指南 - 3分钟上线

set -e

clear
echo "🚀 Stock Guardian AI - 3分钟部署指南"
echo "======================================"
echo ""

# Step 1: GitHub
echo "📦 第 1 步: 推送到 GitHub"
echo "-------------------------"

if [ ! -d .git ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit"
    echo ""
    echo "⚠️  请先创建 GitHub 仓库:"
    echo "   访问: https://github.com/new"
    echo "   仓库名: stock-guardian"
    echo "   然后运行:"
    echo "   git remote add origin https://github.com/你的用户名/stock-guardian.git"
    echo "   git push -u origin main"
    echo ""
    read -p "按回车键继续..."
fi

# Step 2: Deploy Frontend
echo ""
echo "🌐 第 2 步: 部署前端到 Vercel"
echo "-----------------------------"

if ! command -v vercel >/dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm install -g vercel
fi

echo "🔑 请登录 Vercel..."
vercel login

cd frontend

# 创建配置文件
cat > vercel.json << 'EOF'
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_BASE": "https://stock-guardian-api.onrender.com"
  }
}
EOF

echo ""
echo "⚡ 部署前端..."
vercel --prod

FRONTEND_URL=$(vercel inspect --token=$(cat ~/.vercel/auth.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4) 2>/dev/null | grep "Production" | head -1 | awk '{print $2}')

cd ..

# Step 3: Deploy Backend
echo ""
echo "⚙️  第 3 步: 部署后端到 Render"
echo "-----------------------------"
echo ""
echo "请手动完成以下步骤："
echo ""
echo "1️⃣  访问: https://dashboard.render.com/"
echo ""
echo "2️⃣  点击 'New +' → 'Web Service'"
echo ""
echo "3️⃣  选择你的 GitHub 仓库"
echo ""
echo "4️⃣  填写配置："
echo "   ┌─────────────────────────────────────┐"
echo "   │ Name: stock-guardian-api            │"
echo "   │ Root Directory: backend             │"
echo "   │ Runtime: Python 3                   │"
echo "   │ Build Command: pip install -r req...│"
echo "   │ Start Command: uvicorn app.main:... │"
echo "   └─────────────────────────────────────┘"
echo ""
echo "5️⃣  点击 'Advanced' → 'Add Environment Variable'"
echo "   添加以下变量："
echo ""
echo "   JWT_SECRET=$(openssl rand -hex 16)"
echo "   LLM_BASE_URL=https://api.moonshot.cn/v1"
echo "   LLM_API_KEY=sk-ZAJL7H4PbSiIhuOEiMRRaaStdVvo5bxFvl8CR9QNy8vGYAsY"
echo "   LLM_MODEL=moonshot-v1-32k"
echo "   MARKET_DATA_PROVIDER=mock"
echo "   AGENT_CRON_MINUTES=15"
echo ""
echo "6️⃣  点击 'Create Web Service'"
echo ""

read -p "⏸️  完成上述步骤后按回车键..."

# Step 4: Update Frontend API URL
echo ""
echo "🔄 第 4 步: 更新前端 API 地址"
echo "----------------------------"

BACKEND_URL="https://stock-guardian-api.onrender.com"

echo "更新前端配置..."
cd frontend

# 更新 .env.local
echo "NEXT_PUBLIC_API_BASE=$BACKEND_URL" > .env.local

# 重新部署
vercel --prod

cd ..

echo ""
echo "✅ 部署完成！"
echo "============"
echo ""
echo "🌐 你的网站地址："
echo "   前端: https://stock-guardian.vercel.app"
echo "   后端: $BACKEND_URL"
echo ""
echo "💡 免费域名："
echo "   - Vercel 提供 .vercel.app 免费域名"
echo "   - Render 提供 .onrender.com 免费域名"
echo ""
echo "⚡ 自定义域名（可选）："
echo "   1. 在 Vercel Dashboard 添加自定义域名"
echo "   2. 或在 Cloudflare 注册免费域名"
echo ""

# 保存配置
cat > .deploy-info << EOF
部署时间: $(date)
前端: https://stock-guardian.vercel.app
后端: $BACKEND_URL
JWT_SECRET: $(openssl rand -hex 16)
EOF

echo "💾 配置已保存到 .deploy-info"
echo ""
