# tasks.py
import time
from datetime import datetime
from database import db  # Your MongoDB connection module
from connections import create_boto_connection  # Your AWS connection helper

async def delete_stack_task(stack_name: str, testId: str = None):
    """Task to delete a CloudFormation stack."""
    try:
        print("Deleting stack...")
        if not db.stacks_collection.find_one({"stack_name": stack_name}):
            print(f"❌ Stack {stack_name} not found in database")
            return f"❌ Stack {stack_name} not found in database"
        stack_details = await db.stacks_collection.find_one({"stack_name": stack_name, "status": "DELETED"})
        if stack_details:
            print(f"❌ Stack {stack_name} already deleted")
            return f"❌ Stack {stack_name} already deleted"
        
        if testId is not None:
            await db.tests_collection.update_one({"testId": testId}, {"$set": {"status": "ENDED"}})

        
        await db.stacks_collection.update_one({"stack_name": stack_name},{"$set": {"status": "DELETED_STARTED"}})
        cf_client = create_boto_connection()
        cf_client.delete_stack(StackName=stack_name)
        print(f"❌ Stack {stack_name} delete Strted")
        # Wait for stack deletion to complete
        waiter = cf_client.get_waiter('stack_delete_complete')
        waiter.wait(StackName=stack_name)
        print(f"Stack {stack_name} deleted successfully")

        # Update MongoDB: mark the stack as deleted
        db.stacks_collection.update_one(
            {"stack_name": stack_name},
            {"$set": {"status": "DELETED", "closed_at": datetime.utcnow()}}
        )
        return f"✅ Stack {stack_name} deleted successfully!"
    except Exception as e:
        print(f"❌ Error deleting stack {stack_name}: {str(e)}")
        db.stacks_collection.update_one(
            {"stack_name": stack_name},
            {"$set": {"status": "ERROR", "error_message": str(e)}}
        )
        return f"❌ Error deleting stack {stack_name}: {str(e)}"