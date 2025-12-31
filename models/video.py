# Define Video model.
# Fields:
# - title, description, duration
# - category_id
# - hls_path
# - download_path
# - is_premium
# - release_year
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
Base = declarative_base()
class Video(Base):
    __tablename__ = 'videos'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    duration = Column(Integer, nullable=False)  # duration in seconds
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    hls_path = Column(String(500), nullable=False)
    download_path = Column(String(500), nullable=True)
    is_premium = Column(Boolean, default=False)
    release_year = Column(Integer, nullable=True)

    category = relationship("Category", back_populates="videos")
class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)

    videos = relationship("Video", back_populates="category")
    # Note: The Category model is included to establish the foreign key relationship.
    