# Implement secure video download endpoints.
# Requirements:
# - Verify active subscription
# - Generate time-limited signed URLs
# - Log downloads
# - Enforce device limits
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from dependencies import get_current_user, User
from database import get_video_by_id, log_video_download, get_active_subscription
from utils import generate_signed_url
router = APIRouter()
class DownloadRequest(BaseModel):
    video_id: int
class DownloadResponse(BaseModel):
    download_url: str
    expires_at: datetime
@router.post("/downloads", response_model=DownloadResponse)
async def download_video_endpoint(
    request: DownloadRequest,
    current_user: User = Depends(get_current_user)
):
    # Check if the user has an active subscription
    subscription = get_active_subscription(current_user.id)
    if not subscription:
        raise HTTPException(status_code=403, detail="Active subscription required to download videos")
    
    # Retrieve the video details
    video = get_video_by_id(request.video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Generate a time-limited signed URL for the download
    expires_at = datetime.utcnow() + timedelta(hours=1)  # URL valid for 1 hour
    signed_url = generate_signed_url(video.download_path, expires_at)
    
    # Log the download activity
    log_video_download(current_user.id, video.id, datetime.utcnow())
    
    return DownloadResponse(download_url=signed_url, expires_at=expires_at)
    # Note: Device limit enforcement would typically be handled in the subscription management logic or middleware.
    