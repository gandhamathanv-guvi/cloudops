import asyncio
from database import db, client
from models import generate_uuid
from datetime import datetime
import uuid



# Seeder to populate the database with initial lab data
async def seed_lab_data():
    initial_data = [
        {
            "labId": "hosting-with-nginx",
            "title": "Google Cloud Networking Lab",
            "description": "Learn the fundamentals of Google Cloud networking.",
            "steps": [
                {
                    "id": 1,
                    "title": "Set Up Google Cloud Environment",
                    "description": "Initialize and configure your Google Cloud project settings",
                    "commands": [
                        {"command": "gcloud init", "description": "Initialize the Google Cloud CLI", "output": "Welcome! This command will take you through the configuration of gcloud."},
                        {"command": "gcloud auth login", "description": "Authenticate with your Google Cloud account", "output": "You are now logged in to Google Cloud."},
                        {"command": "gcloud config set project PROJECT_ID", "description": "Set your active project", "output": "Updated property [core/project]."}
                    ]
                },
                {
                    "id": 2,
                    "title": "Create and Configure VPC Network",
                    "description": "Set up a Virtual Private Cloud network with custom subnets",
                    "commands": [
                        {"command": "gcloud compute networks create my-vpc --subnet-mode=custom", "description": "Create a new VPC network", "output": "Network created successfully."},
                        {"command": "gcloud compute networks subnets create subnet-1 --network=my-vpc --region=us-central1 --range=10.0.0.0/24", "description": "Create a subnet in the VPC", "output": "Subnet created successfully."},
                        {"command": "gcloud compute firewall-rules create allow-internal --network my-vpc --allow tcp,udp,icmp --source-ranges=10.0.0.0/24", "description": "Configure firewall rules", "output": "Firewall rule created successfully."}
                    ]
                }
            ]
        }
    ]
    await db.labs_collection.delete_many({})  # Clear existing data
    await db.labs_collection.insert_many(initial_data)

# Seeder
async def seed_course_data():
    if await db.courses_collection.count_documents({}) == 0:
        course_data = {
            "title": "High-Performance NGINX Hosting",
            "description": "Learn to deploy and optimize NGINX servers.",
            "reviews": 4.8,
            "duration": "1 hour",
            "level": "Beginner",
            "labs": [
                {
                    "icon": "Server",
                    "title": "Setting Up an NGINX Server",
                    "description": "Install and start NGINX on Linux.",
                    "commands": [
                        {"command": "sudo apt update", "description": "Updates package lists."},
                        {"command": "sudo apt install nginx", "description": "Installs NGINX."},
                        {"command": "sudo systemctl start nginx", "description": "Starts NGINX."}
                    ]
                },
                {
                    "icon": "Settings",
                    "title": "NGINX Configuration and Optimization",
                    "description": "Modify NGINX for performance.",
                    "commands": [
                        {"command": "sudo nano /etc/nginx/nginx.conf", "description": "Edit config file."},
                        {"command": "sudo nginx -t", "description": "Test configuration."},
                        {"command": "sudo systemctl reload nginx", "description": "Apply changes."}
                    ]
                }
            ]
        }
        await db.courses_collection.insert_one(course_data)

async def main():
    try:
        await seed_lab_data()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())