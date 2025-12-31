#Implement Redis caching for:
#-video metadata
#-subsccription status
#-Popular content 
import aioredis
import json
from typing import Optional
class CacheService:
    def __init__(self, redis_url: str):
        self.redis = aioredis.from_url(redis_url)
    async def get_video_metadata(self, video_id: int) -> Optional[dict]:
        data = await self.redis.get(f"video_metadata:{video_id}")
        if data:
            return json.loads(data)
        return None
    async def set_video_metadata(self, video_id: int, metadata: dict, expire: int = 3600):
        await self.redis.set(f"video_metadata:{video_id}", json.dumps(metadata), ex=expire)
    async def get_subscription_status(self, user_id: int) -> Optional[bool]:
        data = await self.redis.get(f"subscription_status:{user_id}")
        if data is not None:
            return data == b'true'
        return None
    async def set_subscription_status(self, user_id: int, is_active: bool, expire: int = 3600):
        await self.redis.set(f"subscription_status:{user_id}", 'true' if is_active else 'false', ex=expire)
    async def get_popular_content(self) -> Optional[list]:
        data = await self.redis.get("popular_content")
        if data:
            return json.loads(data)
        return None
    async def set_popular_content(self, content_list: list, expire: int = 3600):
        await self.redis.set("popular_content", json.dumps(content_list), ex=expire)
cache_service = CacheService(redis_url="redis://localhost:6379")
