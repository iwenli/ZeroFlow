from __future__ import annotations

from typing import Any

import yt_dlp

from app.schemas import MediaData, MediaType


class MediaParserService:
    @staticmethod
    def parse(url: str) -> MediaData:
        # 只做信息解析，不下载媒体文件；确保服务端不消耗媒体带宽。
        ydl_opts = {
            'skip_download': True,
            'extract_flat': False,
            'socket_timeout': 15,
            'quiet': True,
            'no_warnings': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        if not isinstance(info, dict):
            raise ValueError('解析结果异常，未获得有效媒体信息。')

        title = str(info.get('title') or '未知标题')
        uploader = str(info.get('uploader') or info.get('channel') or '未知作者')
        platform = str(info.get('extractor_key') or info.get('extractor') or 'unknown')

        entries = info.get('entries')
        if isinstance(entries, list) and entries:
            # 图集场景：entries 里通常是每张图/每个子资源，优先取子项 url，其次 original_url/webpage_url。
            media_list: list[str] = []
            for item in entries:
                if not isinstance(item, dict):
                    continue
                direct = item.get('url') or item.get('original_url') or item.get('webpage_url')
                if isinstance(direct, str) and direct.startswith('http'):
                    media_list.append(direct)

            if not media_list:
                raise ValueError('未提取到可用图片直链。')

            return MediaData(
                title=title,
                uploader=uploader,
                platform=platform,
                type=MediaType.images,
                media_list=list(dict.fromkeys(media_list)),
            )

        # 视频场景：先尝试顶层 url（通常是最佳可播流），若无再从 formats 里筛选同时含音视频的完整格式。
        top_url = info.get('url')
        if isinstance(top_url, str) and top_url.startswith('http'):
            return MediaData(
                title=title,
                uploader=uploader,
                platform=platform,
                type=MediaType.video,
                media_list=[top_url],
            )

        formats = info.get('formats')
        candidates: list[tuple[int, str]] = []
        if isinstance(formats, list):
            for fmt in formats:
                if not isinstance(fmt, dict):
                    continue
                direct_url = fmt.get('url')
                vcodec = fmt.get('vcodec')
                acodec = fmt.get('acodec')
                if (
                    isinstance(direct_url, str)
                    and direct_url.startswith('http')
                    and isinstance(vcodec, str)
                    and isinstance(acodec, str)
                    and vcodec != 'none'
                    and acodec != 'none'
                ):
                    height = fmt.get('height')
                    score = int(height) if isinstance(height, int) else 0
                    candidates.append((score, direct_url))

        if not candidates:
            raise ValueError('未找到同时包含音视频的可下载格式。')

        candidates.sort(key=lambda x: x[0], reverse=True)
        best_url = candidates[0][1]
        return MediaData(
            title=title,
            uploader=uploader,
            platform=platform,
            type=MediaType.video,
            media_list=[best_url],
        )

