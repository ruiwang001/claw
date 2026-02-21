# Stock Guardian AI - 部署指南

## 🚀 快速部署选项

### 方案 A：Vercel + Render（推荐，免费）

#### 1. 前端部署到 Vercel

```bash
cd frontend
npm i -g vercel
vercel login
vercel --prod
```

然后在 Vercel Dashboard 设置环境变量：
- `NEXT_PUBLIC_API_BASE` = https://你的后端地址.onrender.com

#### 2. 后端部署到 Render

1. 在 Render 创建 New Web Service
2. 连接你的 GitHub 仓库
3. 选择 `backend` 目录
4. 选择 Python 3.11
5. 添加环境变量（见下方）

**必需的环境变量：**
```env
JWT_SECRET=your_random_secret_here
LLM_BASE_URL=https://api.moonshot.cn/v1
LLM_API_KEY=sk-ZAJL7H4PbSiIhuOEiMRRaaStdVvo5bxFvl8CR9QNy8vGYAsY
LLM_MODEL=moonshot-v1-32k
MARKET_DATA_PROVIDER=mock
AGENT_CRON_MINUTES=15
```

---

### 方案 B：Docker 一键部署（自托管）

#### 1. 创建 Dockerfile（前端）

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

#### 2. 创建 Dockerfile（后端）

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 3. Docker Compose 部署

```bash
docker-compose up -d
```

---

### 方案 C：单服务器部署（阿里云/腾讯云/VPS）

#### 1. 构建前端

```bash
cd frontend
npm ci
npm run build
```

#### 2. 使用 PM2 运行前端

```bash
npm i -g pm2
pm2 start npm --name "stock-guardian-web" -- start
```

#### 3. 使用 PM2 运行后端

```bash
cd backend
source .venv/bin/activate
pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8000" --name "stock-guardian-api"
```

#### 4. Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 环境变量配置

### 后端必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `JWT_SECRET` | JWT 签名密钥 | 随机字符串 |
| `LLM_BASE_URL` | AI API 地址 | https://api.moonshot.cn/v1 |
| `LLM_API_KEY` | Kimi API Key | sk-xxxxx |
| `LLM_MODEL` | 模型名称 | moonshot-v1-32k |
| `MARKET_DATA_PROVIDER` | 数据源 | mock/stooq |

### 前端必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_API_BASE` | 后端 API 地址 | https://api.example.com |

---

## 🌐 域名配置

### 1. 购买域名
- 推荐：Namecheap / Cloudflare / 阿里云

### 2. DNS 解析
```
A记录：your-domain.com -> 你的服务器IP
```

### 3. HTTPS（Let's Encrypt）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

---

## 📊 推荐配置

| 场景 | 推荐方案 | 费用 |
|------|----------|------|
| 个人试用 | Vercel + Render | 免费 |
| 国内访问 | 阿里云 ECS + CDN | ~50元/月 |
| 高可用 | Vercel + Railway + PlanetScale | ~50美元/月 |

---

## 🚀 一键部署脚本

```bash
#!/bin/bash
# deploy.sh

echo "🚀 开始部署 Stock Guardian AI..."

# 构建前端
cd frontend
npm ci
npm run build
cd ..

# 构建后端 Docker
cd backend
docker build -t stock-guardian-api .
cd ..

# 构建前端 Docker
cd frontend
docker build -t stock-guardian-web .
cd ..

# 启动服务
docker-compose up -d

echo "✅ 部署完成！"
echo "🌐 访问地址: http://localhost"
```

---

## ⚠️ 注意事项

1. **API Key 安全**：不要把 Kimi API Key 提交到 GitHub
2. **数据库**：SQLite 适合单机，生产环境建议用 PostgreSQL
3. **监控**：建议使用 UptimeRobot 监控服务状态
4. **备份**：定期备份数据库文件

需要我帮你配置哪个方案？🎩
