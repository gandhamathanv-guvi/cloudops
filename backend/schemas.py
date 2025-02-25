from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class UserBase(BaseModel):
    name: str
    avatar: str

class UserResponse(UserBase):
    id: str

class CourseObjectiveResponse(BaseModel):
    id: str
    description: str

class CoursePrerequisiteResponse(BaseModel):
    id: str
    description: str

class CourseTechnicalRequirementResponse(BaseModel):
    id: str
    description: str

class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    estimated_time: str
    image_url: str
    methodology: str
    objectives: List[CourseObjectiveResponse]
    prerequisites: List[CoursePrerequisiteResponse]
    technical_requirements: List[CourseTechnicalRequirementResponse]
    created_at: Optional[datetime] = None

class CheckpointResponse(BaseModel):
    id: str
    title: str
    description: str
    command: str
    verified: Optional[bool] = False



# Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str


# Pydantic Models
class Command(BaseModel):
    command: str
    description: str
    output: Optional[str] = None

class Step(BaseModel):
    id: int
    title: str
    description: str
    commands: List[Command]
    verifyId: str | bool

class Lab(BaseModel):
    labId: str
    title: str
    description: str
    steps: List[Step]