# 角色与任务
你是一位精通 Python FastAPI 和 Vue 3 (TypeScript + Vite + Tailwind CSS) 的资深全栈系统架构师。
请为我编写一个**媒体资源解析与纯前端下载网页**的完整项目代码。你需要根据我提供的标准项目目录，输出每个核心文件的完整、生产可用的源码。

## 🛠️ 核心架构与带宽零消耗原则
1. 后端（FastAPI）仅负责：接收用户输入的 URL -> 调用 yt-dlp 解析 -> 返回清洗后的结构化 JSON 媒体直链（数据量极小，仅几 KB）。
2. 后端坚决不进行任何媒体文件的中转、下载或缓存，确保**服务器带宽消耗为零**。
3. 前端（Vue 3）负责：渲染媒体列表，并通过浏览器沙盒技术（Fetch To Blob）或引导用户右键另存为的方式，**100% 走用户本地网络下载资源**。

---

## 📂 规范项目目录结构
请严格按照以下目录职责输出各文件代码：

media-parser-pro/
├── backend/                  # 后端服务 (FastAPI)
│   ├── app/
│   │   ├── main.py           # 应用程序入口、CORS配置、路由注册
│   │   ├── schemas.py        # Pydantic 数据验证模型 (输入/输出 DTO)
│   │   └── services/
│   │       └── parser.py     # yt-dlp 核心解析与数据清洗逻辑
│   └── requirements.txt      # 后端依赖清单
└── frontend/                 # 前端工程 (Vue 3 + TS + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── ImageGrid.vue # 多图渲染与勾选下载组件
    │   │   └── VideoCard.vue # 视频播放与直链下载组件
    │   ├── utils/
    │   │   └── downloader.ts # 突破防盗链的 Fetch-to-Blob 下载核心算法
    │   └── App.vue           # 核心页面（主布局、输入框、状态调度）

---

## 📑 后端文件输出要求

### 1. `backend/requirements.txt`
包含 fastapi, uvicorn, yt-dlp, pydantic 及其稳定版本。

### 2. `backend/app/schemas.py`
* 定义 `ParseRequest` 模型，包含用户输入的 `url`。
* 定义 `MediaData` 模型，包含：`title`, `uploader`, `platform`, `type` (枚举值: 'video' 或 'images'), `media_list` (直链字符串数组)。
* 定义统一的响应模型 `ParseResponse` (包含 success, data, message)。

### 3. `backend/app/services/parser.py`
* 实现 `MediaParserService.parse(url)` 静态方法。
* `ydl_opts` 必须配置：`'skip_download': True`, `'extract_flat': False`, `'socket_timeout': 15`。
* 编写健壮的数据清洗逻辑：
  * 判断 `info` 字典中是否存在 `'entries'`，若存在则判定 `type = 'images'` 并循环提取子条目的 url。
  * 若不存在，判定 `type = 'video'`，优先获取顶层 `url`，若无则从 `formats` 中筛选出同时包含音视频的完整格式直链。

### 4. `backend/app/main.py`
* 实例化 FastAPI，配置全局 CORS（允许所有源跨域，方便前端调用）。
* 编写 `POST /api/parse` 路由，调用服务层，并用 `try...except` 严密捕获所有异常（如链接无效、风控403），返回 `success: false` 及友好错误文案。

---

## 💻 前端文件输出要求

### 1. `frontend/src/utils/downloader.ts`
* 编写异步函数 `downloadDirect(url, filename, onFallback)`。
* 核心策略：使用 `fetch(url, { mode: 'cors' })` 请求直链，转换为 `Blob`，通过 `URL.createObjectURL` 生成本地虚拟链接，模拟 `<a download>` 点击触发本地下载。
* 降级策略：使用 `try...except` 捕获跨域（CORS）报错。一旦被浏览器拦截，**绝对不能请求后端中转**，必须触发 `onFallback` 回调，交给 UI 层弹出引导。

### 2. `frontend/src/components/VideoCard.vue`
* 接收 `title`, `uploader`, `videoUrl` 作为 Props。
* 使用 HTML5 `<video controls>` 渲染播放器，配有现代感 Tailwind 样式。
* 提供“立即下载视频”按钮。如果触发降级回调，显示一个优雅的 Modal 弹窗，文案引导用户：“由于平台防盗链限制，请【点击在新标签页打开视频】，随后在视频上【右键 -> 视频另存为】即可免费下载。”

### 3. `frontend/src/components/ImageGrid.vue`
* 接收 `title`, `uploader`, `images` (数组) 作为 Props。
* 使用 Tailwind Grid 栅格布局展示多张图片，右上角带勾选框，底部有“全选/取消全选”和“下载选中”按钮。
* 下载时循环触发 `downloadDirect`，同样包含防盗链降级弹窗，引导用户右键另存为。

### 4. `frontend/src/App.vue`
* 主界面。包含精美居中的大输入框，带“一键粘贴”（使用 `navigator.clipboard`）和“立即解析”按钮。
* 包含解析状态控制（Loading 动画、Skeleton 骨架屏占位、Error 红色横幅提示）。
* 根据后端返回的 `type`，动态挂载渲染 `<VideoCard>` 或 `<ImageGrid>` 组件。

---

## ⚠️ 交付约束
* 请提供**完整、无断点、无伪代码**的生产级源码。
* 代码中必须包含关键的中文注释，详细解释 `yt-dlp` 的字典过滤逻辑，以及前端 `Blob` 下载的异常捕获。