# Outside.exe

An AI-powered real-world adventure game that turns physical exploration into a living quest.

## 🚀 Deployment Guide (Non-Vercel)

Since this app uses a local SQLite database (`better-sqlite3`), it cannot be deployed to standard serverless platforms (like Vercel) without a separate database provider. Follow these steps to deploy it on your own VPS or server.

### 1. Prerequisites
- Node.js 20+
- npm / yarn / pnpm
- Linux Server (Ubuntu recommended)

### 2. Installation
```bash
git clone <your-repo-url>
cd outside-exe
npm install
```

### 3. Configuration
Create a `.env` file in the root directory:
```env
# AI Configuration
AI_MODE=demo       # options: demo, local, openai
OPENAI_API_KEY=your_key_here
OLLAMA_BASE_URL=http://localhost:11434

# Database Configuration
DATABASE_URL=outside.db # Use an absolute path if using Docker/Volumes
```

### 4. Build and Start
```bash
npm run build
npm run start
```

### 5. Process Management (Optional but Recommended)
Use **PM2** to keep the app running in the background:
```bash
npm install -g pm2
pm2 start npm --name "outside-exe" -- start
pm2 save
```

## 🛠 Technical Architecture
- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (via `better-sqlite3`) with WAL mode for concurrency.
- **AI**: Adaptive loop using Local Gemma (via Ollama) or OpenAI.
