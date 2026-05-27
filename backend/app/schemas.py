from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl


class MediaType(str, Enum):
    video = 'video'
    images = 'images'


class ParseRequest(BaseModel):
    url: HttpUrl = Field(..., description='用户输入的媒体页面地址')


class MediaData(BaseModel):
    title: str = Field(default='未知标题')
    uploader: str = Field(default='未知作者')
    platform: str = Field(default='unknown')
    type: MediaType
    media_list: List[str]


class ParseResponse(BaseModel):
    success: bool
    data: Optional[MediaData] = None
    message: str = ''
