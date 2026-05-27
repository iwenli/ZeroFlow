# ZeroFlow 直链解析

ZeroFlow 是一个 后端只解析、前端直连下载的媒体资源解析工具。

- 后端：接收 URL，调用 yt-dlp 解析，返回结构化媒体直链 JSON。
- 前端：渲染资源并用浏览器 etch -> Blob 下载；若被 CORS/防盗链拦截，提示用户新标签页打开并右键另存为。

## 项目结构

`	xt
backend/
  app/
    main.py
    schemas.py
    services/parser.py
  requirements.txt
frontend/
  src/
    App.vue
    components/
      VideoCard.vue
      ImageGrid.vue
    utils/downloader.ts
`

## 开发运行流程

### 1. 环境要求

- Python 3.11+
- Node.js 18+（建议 20 LTS）
- npm 9+

### 2. 启动后端（FastAPI）

在项目根目录执行：

`powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
`

启动后：

- 健康检查：http://127.0.0.1:8000/health
- 解析接口：POST http://127.0.0.1:8000/api/parse

### 3. 启动前端（Vue3 + Vite）

如果你还没有初始化 Vite 工程，请先在 rontend/ 下补齐 package.json、ite.config.ts、index.html、src/main.ts、Tailwind 配置等基础文件。  
完成后执行：

`powershell
cd frontend
npm install
npm run dev
`

默认访问地址：http://127.0.0.1:5173

### 4. 联调说明

- 当前 App.vue 默认请求后端：http://127.0.0.1:8000/api/parse
- 若部署域名不同，请把该地址改为你的后端公网地址，或通过 Nginx 反向代理统一域名

## 部署流程（生产）

下面给出常见的前后端分离 + Nginx 反代部署方案（Linux）。

### 1. 部署后端

`ash
cd /opt/zeroflow/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
gunicorn -k uvicorn.workers.UvicornWorker -w 2 -b 127.0.0.1:8000 app.main:app
`

建议配合 systemd 守护进程，服务名例如 zeroflow-api.service。

### 2. 构建并部署前端静态文件

`ash
cd /opt/zeroflow/frontend
npm ci
npm run build
`

构建产物通常在 rontend/dist/，将其作为 Nginx 静态站点目录。

### 3. Nginx 配置示例

`
ginx
server {
    listen 80;
    server_name your-domain.com;

    root /opt/zeroflow/frontend/dist;
    index index.html;

    location / {
        try_files  / /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host System.Management.Automation.Internal.Host.InternalHost;
        proxy_set_header X-Real-IP ;
        proxy_set_header X-Forwarded-For ;
        proxy_set_header X-Forwarded-Proto ;
    }
}
`

重载 Nginx：

`ash
sudo nginx -t
sudo systemctl reload nginx
`

### 4. HTTPS（推荐）

建议使用 certbot 申请证书并启用自动续期：

`ash
sudo certbot --nginx -d your-domain.com
`

## 发布检查清单

- 后端 health 正常返回 {status:ok}
- 前端页面可打开并可提交解析
- POST /api/parse 可返回 success: true/false 的标准结构
- 防盗链资源下载失败时，前端会弹出新标签页打开 + 右键另存为引导
- 服务器没有进行任何媒体文件中转或缓存

## 常见问题

- 403：目标平台风控限制，需稍后重试或更换链接
- 前端下载失败：多为 CORS/Referer 限制，使用弹窗引导手动另存为
- yt-dlp 解析失败：先升级 yt-dlp 到较新版本再重试
