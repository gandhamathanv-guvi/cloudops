from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise TypeError('string required')
        return str(v)

class User(BaseModel):
    id: PyObjectId = Field(default_factory=generate_uuid)
    github_id: str
    name: str
    avatar: str

    class Config:
        json_encoders = {PyObjectId: str}

class CourseObjective(BaseModel):
    id: PyObjectId = Field(default_factory=generate_uuid)
    course_id: PyObjectId
    description: str

    class Config:
        json_encoders = {PyObjectId: str}

class CoursePrerequisite(BaseModel):
    id: PyObjectId = Field(default_factory=generate_uuid)
    course_id: PyObjectId
    description: str

    class Config:
        json_encoders = {PyObjectId: str}

class CourseTechnicalRequirement(BaseModel):
    id: PyObjectId = Field(default_factory=generate_uuid)
    course_id: PyObjectId
    description: str

    class Config:
        json_encoders = {PyObjectId: str}

class Course(BaseModel):
    id: PyObjectId = Field(default_factory=generate_uuid)
    title: str
    description: str
    difficulty: str
    estimated_time: str
    image_url: str
    methodology: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {PyObjectId: str}

class Checkpoint(BaseModel):
    id: PyObjectId = Field(default_factory=generate_uuid)
    course_id: PyObjectId
    title: str
    description: str
    command: str
    order: int

    class Config:
        json_encoders = {PyObjectId: str}

class UserProgress(BaseModel):
    id: PyObjectId = Field(default_factory=generate_uuid)
    user_id: PyObjectId
    checkpoint_id: PyObjectId
    verified: bool = False
    verified_at: Optional[datetime] = None

    class Config:
        json_encoders = {PyObjectId: str}


# Pydantic models
class Command(BaseModel):
    command: str
    description: str

class Lab(BaseModel):
    icon: str
    title: str
    description: str
    commands: List[Command]

class Course(BaseModel):
    title: str
    description: str
    reviews: float
    duration: str
    titleTag: str
    level: str
    labs: List[Lab]

# Pydantic models
class TestStartRequest(BaseModel):
    lab_id: str

class TestEndRequest(BaseModel):
    test_id: str



class CreateCloudformationStackRequest(BaseModel):
    stack_name: str
    template_url: str
    expire_time: int = None  # Expiration time in seconds (optional)
