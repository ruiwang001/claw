# 🚀 3分钟部署上线指南

## 最简单的部署方式（全免费）

### ✅ 你需要准备的

1. **GitHub 账号** (免费注册: https://github.com/join)
2. **Vercel 账号** (用 GitHub 直接登录: https://vercel.com)
3. **Render 账号** (用 GitHub 直接登录: https://render.com)

---

## 📦 部署步骤

### 第 1 步: 推送代码到 GitHub

```bash
# 在本地项目目录执行
cd /Users/wangrui/.openclaw/workspace/stock-guardian

git init
git add .
git commit -m "Initial commit"
```

然后去 https://github.com/new 创建新仓库，名字叫 `stock-guardian`。

创建后按页面提示推送代码：

```bash
git remote add origin https://github.com/你的用户名/stock-guardian.git
git push -u origin main
```

---

### 第 2 步: 部署前端到 Vercel（1分钟）

1. 访问 https://vercel.com/new
2. 选择你的 GitHub 仓库 `stock-guardian`
3. 配置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. 点击 **Deploy**

✅ 完成！你会得到一个免费域名如：`https://stock-guardian.vercel.app`

---

### 第 3 步: 部署后端到 Render（2分钟）

1. 访问 https://dashboard.render.com/
2. 点击 **New +** → **Web Service**
3. 选择你的 GitHub 仓库
4. 填写配置：

| 配置项 | 值 |
|--------|-----|
| **Name** | `stock-guardian-api` |
| **Root Directory** | `backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port 10000` |

5. 点击 **Advanced** → **Add Environment Variable**，添加：

```
JWT_SECRET=随机字符串(自己编一个)
LLM_BASE_URL=https://api.moonshot.cn/v1
LLM_API_KEY=sk-ZAJL7H4PbSiIhuOEiMRRaaStdVvo5bxFvl8CR9QNy8vGYAsY
LLM_MODEL=moonshot-v1-32k
MARKET_DATA_PROVIDER=mock
AGENT_CRON_MINUTES=15
```

6. 点击 **Create Web Service**

✅ 完成！你会得到一个后端地址如：`https://stock-guardian-api.onrender.com`

---

### 第 4 步: 配置前端 API 地址

1. 回到 Vercel Dashboard
2. 进入你的项目 → **Settings** → **Environment Variables**
3. 添加：
   - **Name**: `NEXT_PUBLIC_API_BASE`
   - **Value**: `https://stock-guardian-api.onrender.com`（你的 Render 地址）
4. 点击 **Save**
5. 重新部署：到 **Deployments** → 点击最新部署的 **...** → **Redeploy**

---

## 🎉 完成！

你的网站已上线：
- 🌐 **前端**: `https://stock-guardian.vercel.app`
- ⚙️ **后端**: `https://stock-guardian-api.onrender.com`

全部免费！包含：
- ✅ 免费域名
- ✅ HTTPS 证书
- ✅ 全球 CDN
- ✅ 自动部署（每次 push 代码自动更新）

---

## 🌟 自定义域名（可选）

如果你想要自己的域名（如 `yourname.com`）：

### 免费域名选项：
1. **Freenom**: https://freenom.com （免费 .tk, .ml, .ga, .cf, .gq）
2. **Cloudflare Pages**: https://pages.cloudflare.com （自带 .pages.dev）

### 付费域名（推荐）：
- 阿里云: https://wanwang.aliyun.com
- Namecheap: https://namecheap.com （~$10/年）

### 绑定域名到 Vercel：
1. 在 Vercel Dashboard → **Domains** → 添加你的域名
2. 按提示在域名服务商添加 DNS 记录
3. 自动获得 HTTPS 证书

---

## 🔧 使用自动部署脚本

如果你想一键部署，运行：

```bash
./deploy-easy.sh
```

按提示操作即可。

---

## 📱 监控网站状态

推荐免费监控服务：
- **UptimeRobot**: https://uptimerobot.com （免费 50 个监控）
- **Pingdom**: https://pingdom.com

---

## ❓ 常见问题

**Q: Vercel 免费额度够用吗？**  
A: 个人使用完全够用，每月 100GB 流量。

**Q: Render 免费服务会休眠吗？**  
A: 是的，15 分钟无访问会休眠，首次访问需要 30 秒唤醒。

**Q: 如何防止休眠？**  
A: 可以用 UptimeRobot 每 5 分钟 ping 一次你的后端地址。

**Q: 数据会丢失吗？**  
A: Render 免费版使用 SQLite，服务重启数据会重置。需要持久化请升级到付费版或使用 PostgreSQL。

---

有问题随时问我！🎩
