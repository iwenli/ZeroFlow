from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ParseRequest, ParseResponse
from app.services.parser import MediaParserService

app = FastAPI(title='Media Parser Pro API', version='1.0.0')

# 全局 CORS：前端通常与后端分端口开发，放开跨域便于调试与部署。
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.post('/api/parse', response_model=ParseResponse)
def parse_media(payload: ParseRequest) -> ParseResponse:
    try:
        data = MediaParserService.parse(str(payload.url))
        return ParseResponse(success=True, data=data, message='解析成功')
    except Exception as exc:  # noqa: BLE001
        message = str(exc) or '解析失败，请检查链接或稍后重试。'
        if '403' in message:
            message = '目标平台触发访问限制（403），请稍后重试或更换链接。'
        return ParseResponse(success=False, data=None, message=message)
