from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongodb:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.devops_learning_platform

# Collections
users = db.users
courses = db.courses
course_objectives = db.course_objectives
course_prerequisites = db.course_prerequisites
course_technical_requirements = db.course_technical_requirements
checkpoints = db.checkpoints
user_progress = db.user_progress
courses_collection = db.courses_collection
labs_collection = db.labs_collection
tests_collection = db.tests_collection
stacks_collection = db.stacks_collection