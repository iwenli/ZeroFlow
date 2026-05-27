export async function downloadDirect(url, filename, onFallback) {
    try {
        // 核心逻辑：前端直接 fetch 资源并转为 Blob，避免后端中转任何媒体流量。
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
        return true;
    }
    catch (error) {
        // 关键降级：CORS/防盗链等异常时只能提示用户手动另存，绝不回退到后端代理下载。
        const reason = error instanceof Error ? error.message : 'unknown error';
        onFallback(url, reason);
        return false;
    }
}
