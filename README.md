# Stock Guardian AI 🚀

24/7 AI-powered US stock portfolio risk monitoring with sentiment analysis and intelligent alerts.

[English](#english) | [中文](#中文)

---

## English

### Features

- 🤖 **AI Agent**: Monitors your portfolio every 15 minutes
- 📊 **Risk Scoring**: 0-10 risk level based on volatility and sentiment
- 📈 **Sentiment Analysis**: 0-100 score using VADER + LLM
- 🚨 **Smart Alerts**: Configurable rules for risk, sentiment, hotness, and price changes
- 🌐 **Bilingual**: English/Chinese language switch
- ✨ **Glassmorphism UI**: Modern frosted glass design with particle background

### Quick Start

#### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/stock-guardian.git
cd stock-guardian

# Copy and edit environment variables
cp .env.example .env
# Edit .env and add your LLM_API_KEY

# Deploy locally
./deploy.sh local

# Or deploy with Nginx (production)
./deploy.sh production
```

#### Option 2: Cloud Deployment (Free)

- **Frontend**: [Vercel](https://vercel.com) - One-click deploy
- **Backend**: [Render](https://render.com) - Free tier available

See [DEPLOY.md](./DEPLOY.md) for detailed instructions.

### Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **AI**: Kimi API (OpenAI-compatible)
- **Data**: Stooq (free) / Polygon.io / Reddit

### Screenshots

![Home](screenshots/home.png)
![Portfolio](screenshots/portfolio.png)
![Stock Detail](screenshots/detail.png)

---

## 中文

### 功能特性

- 🤖 **AI 智能监控**：每15分钟自动扫描你的投资组合
- 📊 **风险评分**：基于波动率和情绪的 0-10 分风险评估
- 📈 **情绪分析**：使用 VADER + LLM 的 0-100 分情绪指数
- 🚨 **智能预警**：可配置的风险、情绪、热度、价格预警规则
- 🌐 **中英双语**：一键切换中英文界面
- ✨ **玻璃质感 UI**：现代毛玻璃设计，带粒子动画背景

### 快速开始

#### 方式一：Docker（推荐）

```bash
# 克隆仓库
git clone https://github.com/yourusername/stock-guardian.git
cd stock-guardian

# 复制并编辑环境变量
cp .env.example .env
# 编辑 .env 填入你的 LLM_API_KEY

# 本地部署
./deploy.sh local

# 或使用 Nginx（生产环境）
./deploy.sh production
```

#### 方式二：云部署（免费）

- **前端**: [Vercel](https://vercel.com) - 一键部署
- **后端**: [Render](https://render.com) - 免费套餐

详细部署指南见 [DEPLOY.md](./DEPLOY.md)。

### 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: FastAPI + SQLAlchemy + SQLite
- **AI**: Kimi API（OpenAI 兼容）
- **数据**: Stooq（免费）/ Polygon.io / Reddit

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | JWT signing key | Yes |
| `LLM_BASE_URL` | AI API base URL | Yes |
| `LLM_API_KEY` | Kimi/OpenAI API key | Yes |
| `LLM_MODEL` | Model name | Yes |
| `MARKET_DATA_PROVIDER` | mock/stooq | Yes |
| `POLYGON_API_KEY` | Polygon.io API key | No |
| `REDDIT_CLIENT_ID` | Reddit OAuth ID | No |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | No |

---

## License

MIT License

---

Made with ❤️ by Stock Guardian Team
