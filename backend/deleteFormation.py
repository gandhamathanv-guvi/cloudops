import boto3

# Initialize the CloudFormation client
cf_client = boto3.client('cloudformation', region_name='us-east-1')  # Change region if needed

# Stack name to delete
stack_name = "MyEC2Stack"

try:
    # Delete the CloudFormation stack
    print(f"Deleting stack '{stack_name}'...")
    cf_client.delete_stack(StackName=stack_name)

    # Wait for stack deletion to complete
    waiter = cf_client.get_waiter('stack_delete_complete')
    waiter.wait(StackName=stack_name)
    print(f"✅ Stack '{stack_name}' has been deleted successfully!")

except Exception as e:
    print(f"❌ Error: {str(e)}")