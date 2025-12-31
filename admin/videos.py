# Build admin video management endpoints.
# Features:
# - Upload video files
# - Transcode to HLS
# - Manage categories and tags
# - Publish/unpublish content
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from dependencies import get_current_admin, AdminUser
from database import (
    create_video, get_video_by_id, update_video_status,
    create_category, get_all_categories,
    create_tag, get_all_tags
)
from enums import VideoStatus
router = APIRouter()
class VideoUploadRequest(BaseModel):
    title: str
    description: Optional[str]
    category_id: Optional[int]
    tag_ids: Optional[List[int]]
class VideoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: VideoStatus
    uploaded_at: datetime
    @router.post("/admin/videos/upload", response_model=VideoResponse)
async def upload_video_endpoint(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    tag_ids: Optional[str] = Form(None),  # Comma-separated tag 0ids
    file: UploadFile = File(...),
    current_admin: AdminUser = Depends(get_current_admin)
):
    # Save the uploaded file and initiate transcoding to HLS
    video = create_video(
        title=title,
        description=description,
        category_id=category_id,
        tag_ids=[int(tid) for tid in tag_ids.split(",")] if tag_ids else [],
        file=file,
        uploaded_by=current_admin.id
    )
    return VideoResponse(
        id=video.id,
        title=video.title,
        description=video.description,
        status=video.status,
        uploaded_at=video.uploaded_at
    )
    @router.post("/admin/videos/{video_id}/publish", response_model=VideoResponse)
async def publish_video_endpoint(
    video_id: int,
    current_admin: AdminUser = Depends(get_current_admin)
):
    video = get_video_by_id(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    updated_video = update_video_status(video_id, VideoStatus.PUBLISHED)
    return VideoResponse(
        id=updated_video.id,
        title=updated_video.title,
        description=updated_video.description,
        status=updated_video.status,
        uploaded_at=updated_video.uploaded_at
    )
@router.post("/admin/videos/{video_id}/unpublish", response_model=VideoResponse)
async def unpublish_video_endpoint(
    video_id: int,
    current_admin: AdminUser = Depends(get_current_admin)
):
    video = get_video_by_id(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    updated_video = update_video_status(video_id, VideoStatus.UNPUBLISHED)
    return VideoResponse(
        id=updated_video.id,
        title=updated_video.title,
        description=updated_video.description,
        status=updated_video.status,
        uploaded_at=updated_video.uploaded_at
    )
class CategoryCreateRequest(BaseModel):
    name: str
    description: Optional[str]
class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
@router.post("/admin/categories", response_model=CategoryResponse)
async def create_category_endpoint(
    request: CategoryCreateRequest,
    current_admin: AdminUser = Depends(get_current_admin)
):
    category = create_category(name=request.name, description=request.description)
    return CategoryResponse(id=category.id, name=category.name, description=category.description)
@router.get("/admin/categories", response_model=List[CategoryResponse])
async def list_categories_endpoint(
    current_admin: AdminUser = Depends(get_current_admin)
):
    categories = get_all_categories()
    return [CategoryResponse(id=cat.id, name=cat.name, description=cat.description) for cat in categories]
class TagCreateRequest(BaseModel):
    name: str
class TagResponse(BaseModel):
    id: int
    name: str
@router.post("/admin/tags", response_model=TagResponse)
async def create_tag_endpoint(
    request: TagCreateRequest,
    current_admin: AdminUser = Depends(get_current_admin)
):
    tag = create_tag(name=request.name)
    return TagResponse(id=tag.id, name=tag.name)
@router.get("/admin/tags", response_model=List[TagResponse])
async def list_tags_endpoint(
    current_admin: AdminUser = Depends(get_current_admin)
):
    tags = get_all_tags()
    return [TagResponse(id=tag.id, name=tag.name) for tag in tags]
    # Note: Actual file storage and transcoding logic would be implemented in the create_video function or related services.
    