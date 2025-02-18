from database import * 
from datetime import datetime
from main import delete_stack
import asyncio

async def delete_expired_stacks():
    expired_stacks_query =  stacks_collection.find({
        "expire_time": {"$lte": datetime.utcnow()},
        "status": {"$ne": "DELETED"}
    })
    expired_stacks = await expired_stacks_query.to_list(length=None)
    if len(expired_stacks)==0:
        print("🗑️ No Stacks To Delete")

    for stack in expired_stacks:
        stack_name = stack["stack_name"]
        try:
            await delete_stack(stack_name)
        except Exception as e:
            print(f"❌ Error deleting stack '{stack_name}': {e}")

if __name__ == "__main__":
    # Run the async function
    asyncio.run(delete_expired_stacks())