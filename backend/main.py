from fastapi import FastAPI, HTTPException, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, ExpiredSignatureError, jwt
from bson import ObjectId
from typing import Optional
from typing import List
import httpx
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import time
import paramiko
import io

from models import *
from database import *
from schemas import *
from auth import verify_token, create_access_token
from utility import get_password_hash, verify_password
from connections import  *
from tasks import delete_stack_task

load_dotenv()

app = FastAPI(title="DevOps Learning Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

@app.get("/")
async def root():
    return {"message": "Hello World"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await db.users.find_one({"user_id": user_id})
    if user is None:
        raise credentials_exception
    
    return {"user_id": user["user_id"], "name": user["name"], "email": user["email"]}

@app.post("/auth/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())  # Generate a unique user ID
    hashed_password = get_password_hash(user.password)
    new_user = {"user_id": user_id, "name": user.name, "email": user.email, "hashed_password": hashed_password}
    await db.users.insert_one(new_user)

    return UserResponse(id=user_id, name=user.name, email=user.email)

@app.post("/auth/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": db_user["user_id"]})
    return {"token": token, "user": {"id": db_user["user_id"], "name": db_user["name"], "email": db_user["email"]}}

@app.get("/auth/user")
async def get_user(current_user: dict = Depends(get_current_user)):
    user_id = current_user['user_id']
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0, "hashed_password": 0})
    return user

@app.get("/dashboard")
async def get_dashboard():
    user = await db.users.find_one({}, {"_id": 0})
    courses = await db.courses.find({}, {"_id": 0}).to_list(None)
    achievements = await db.achievements.find({}, {"_id": 0}).to_list(None)  # Added projection to exclude _id

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user": user,
        "courses": courses,
        "achievements": achievements
    }


# Utility to convert ObjectId to string
def course_helper(course) -> dict:
    return {
        "id": str(course["_id"]),
        "title": course["title"],
        "description": course["description"],
        "reviews": course["reviews"],
        "duration": course["duration"],
        "titleTag": course["titleTag"],
        "level": course["level"],
        "labs": course["labs"]
    }

# API Endpoints
@app.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    course = await courses_collection.find_one({"courseId": course_id})
    if course:
        return course_helper(course)
    raise HTTPException(status_code=404, detail="Course not found")


# Get API to retrieve lab details by labId
@app.get("/labs/{lab_id}", response_model=Lab)
async def get_lab(lab_id: str):
    lab = await labs_collection.find_one({"labId": lab_id})
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    return lab

@app.get("/labs/checkstatus/{lab_id}")
async def get_lab(lab_id: str, current_user: dict = Depends(get_current_user)):
    lab = await labs_collection.find_one({"labId": lab_id})
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    test = await tests_collection.find_one({"labId": lab_id, "user_id": current_user["user_id"],"status": "RUNNING"},{"_id": 0})
    if not test:
        raise HTTPException(status_code=204, detail="Test not found")
    stackDetails = await stacks_collection.find_one({"stack_id": test["stackId"] })
    return {"test_id": test['testId'], "estimatedTime": test["estimatedTime"] , "link": stackDetails['config']["ShellInABoxURL"]}

@app.get("/labs/{testId}/verify/{verifyId}")
async def get_verify_status(testId: str, verifyId: str, current_user: dict = Depends(get_current_user)):
    verify_step = await verify_lab_step.find_one({"verifyId": verifyId})
    if not verify_step:
        raise HTTPException(status_code=404, detail="Invalid Verify ID")
    print(verify_step)
    test = await tests_collection.find_one({"testId": testId, "user_id": current_user["user_id"],"status": "RUNNING"},{"_id": 0})
    if not test:
        raise HTTPException(status_code=204, detail="Test not found")
    stackDetails = await stacks_collection.find_one({"stack_id": test["stackId"] })
    INSTANCE_IP = stackDetails['config']['InstancePublicIP']
    INSTANCE_NAME = "ubuntu"
    COMMAND = verify_step['command']
    # **Test Case 1: Check if Nginx is installed**
    print(f"Checking if {COMMAND} is installed on {INSTANCE_IP}...")
    output, error = execute_ssh_command(INSTANCE_IP, INSTANCE_NAME, "./gandhamathanv-nivas.pem", COMMAND)
    if output == verify_step['output']:
        return {"status": "success"}
    else:
        return {"status": "failed"}

# Function to generate stack ID
def generate_stack_id():
    return str(uuid.uuid4())


# Start Lab Endpoint
@app.post("/lab/start")
async def start_lab(request: TestStartRequest,current_user: dict = Depends(get_current_user)):
    lab_id = request.lab_id
    lab = await labs_collection.find_one({"labId": lab_id})
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    stack_name = f"{lab['title'].lower().replace(' ', '-')}-{generate_stack_id()}"
    stack_id = await create_stack(stack_name, lab['templateUrl'])
    test_id = str(uuid.uuid4())
    estimatedTime = datetime.utcnow() + timedelta(minutes=lab['duration'])
    lab_data = {
        "testId": test_id,
        "labId": lab_id,
        "user_id": current_user['user_id'],
        "stackId": stack_id,
        "startedAt": datetime.utcnow(),
        "estimatedTime": estimatedTime + timedelta(minutes=5),
        "endedAt": None,
        "status": "RUNNING"
    }
    tests_collection.insert_one(lab_data)
    stack = await stacks_collection.find_one({"stack_id": stack_id})
    scheduler.enqueue_in(timedelta(hours=1), delete_stack_task, stack_name, test_id)
    stacks_collection.update_one(
        {"stack_id": stack_id},
        {"$set": {"expire_time": estimatedTime}}
    )
    stack =   await stacks_collection.find_one({"stack_id": stack_id})
    return {"test_id": test_id, "estimatedTime": estimatedTime , "link": stack['config']["ShellInABoxURL"]}

# End Lab Endpoint
@app.post("/lab/end")
async def end_lab(request: TestEndRequest):
    testId = request.test_id
    print(testId)
    test = await tests_collection.find_one({"testId": testId})
    if not test:
        raise HTTPException(status_code=404, detail="Lab not found.")

    if test.get("status") == "COMPLETED":
        raise HTTPException(status_code=400, detail="Lab has already ended.")
    stackDetails = await stacks_collection.find_one({"stack_id": test["stackId"] })
    stack_name = stackDetails['stack_name']
    q.enqueue(delete_stack_task, stack_name)
    updated_data = {
        "$set": {
            "endedAt": datetime.utcnow(),
            "status": "COMPLETED"
        }
    }
    tests_collection.update_one({"testId": testId}, updated_data)
    stackDetails = await stacks_collection.update_one({"stack_id": test["stackId"] },{"$set": {"status": "DELETED_INITIATED"}})
    return {"message": "Lab ended successfully."}


async def create_stack(stack_name,template_url):
    try:
        cf_client = create_boto_connection()
        # Create the CloudFormation stack
        cf_client.create_stack(
            StackName= stack_name,
            TemplateURL= template_url,
            Capabilities=['CAPABILITY_NAMED_IAM']
        )

        stack_id = generate_stack_id() 
        # Insert stack info into MongoDB
        stack_record = {
            "stack_id": stack_id,
            "stack_name": stack_name,
            "status": "CREATING",
            "created_at": datetime.utcnow(),
            "closed_at": None,
            "expire_time": None
        }
        stacks_collection.insert_one(stack_record)
        # Wait for stack creation to complete
        waiter = cf_client.get_waiter('stack_create_complete')
        waiter.wait(StackName=stack_name)

        # Fetch the stack outputs
        stack_details = cf_client.describe_stacks(StackName=stack_name)
        outputs = stack_details['Stacks'][0].get('Outputs', [])
        config = {}
        for output in outputs:
            config[output['OutputKey']] = output['OutputValue']

        # Update the stack status in MongoDB
        stacks_collection.update_one(
            {"stack_name": stack_name},
            {"$set": {"status": "ACTIVE", "config" : config, "output": output}}
        )
        return stack_id

    except Exception as e:
        stacks_collection.update_one(
            {"stack_name": stack_name},
            {"$set": {"status": "ERROR", "error_message": str(e)}}
        )
        raise HTTPException(status_code=500, detail=f"❌ Error: {str(e)}")


async def delete_stack(stack_name: str):
    try:
        cf_client = create_boto_connection()
        # Check if the stack is already deleted in MongoDB
        stack_record = stacks_collection.find_one({"stack_name": stack_name})
        result = await stack_record  # Await the Future to get the actual dictionary
        if result and result.get("status") == "DELETED":
            return {"message": f"⚠️ Stack '{stack_name}' is already deleted."}
        # Start the timer
        start_time = time.time()
        # Delete the CloudFormation stack
        cf_client.delete_stack(StackName=stack_name)

        # Wait for stack deletion to complete
        waiter = cf_client.get_waiter('stack_delete_complete')
        waiter.wait(StackName=stack_name)


        # End the timer
        end_time = time.time()
        time_taken = end_time - start_time

        # Update the stack status and closed_at in MongoDB
        stacks_collection.update_one(
            {"stack_name": stack_name},
            {"$set": {"status": "DELETED", "closed_at": datetime.utcnow(),"deletion_time_seconds": time_taken}}
        )

        return {"message": f"✅ Stack '{stack_name}' has been deleted successfully!"}

    except Exception as e:
        stacks_collection.update_one(
            {"stack_name": stack_name},
            {"$set": {"status": "ERROR", "error_message": str(e)}}
        )
        raise HTTPException(status_code=500, detail=f"❌ Error: {str(e)}")


# SSH Command Executor
def execute_ssh_command(EC2_IP, EC2_USER,EC2_PEM, command):
    try:
        # Initialize SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())  # Bypass host key checking


        # Convert string into a file-like object
        with open("./gandhamathanv-nivas.pem", "r") as file:
            EC2_PEM_CONTENT = file.read()
        key_file = io.StringIO(EC2_PEM_CONTENT)

        # # Load the private key
        key = paramiko.RSAKey.from_private_key(key_file)

         # Read the private key file
        # key = paramiko.RSAKey(filename=EC2_PEM)

        # Connect to EC2 instance
        ssh.connect(EC2_IP, username=EC2_USER, pkey=key)

        # Execute command
        stdin, stdout, stderr = ssh.exec_command(command)
        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()
        print(f"Output: {output}")
        print(f"Error: {error}")

        # Close SSH connection
        ssh.close()

        return output, error
    except Exception as e:
        print(f"Error: {e}")
        return None, str(e)


@app.get("/test")
def test():
    q.enqueue(delete_stack_task, "hosting-with-nginx879cc0c7-a74e-4254-87fa-e94a706ec5e5")
    return {"message": "Test successful"}