import boto3
import time

# Initialize the CloudFormation client
cf_client = boto3.client('cloudformation', region_name='us-east-1')  # Change region if needed

# S3 URL of the CloudFormation template
s3_template_url = "https://cf-templates-xlspu6fkepz6-us-east-1.s3.us-east-1.amazonaws.com/2025-02-10T170428.400Zs1d-cloud-config-shellinbox.json"

# Stack name
stack_name = "MyEC2Stack"

try:
    # Create the CloudFormation stack
    print(f"Creating stack '{stack_name}' from S3 template...")
    response = cf_client.create_stack(
        StackName=stack_name,
        TemplateURL=s3_template_url,
        Capabilities=['CAPABILITY_NAMED_IAM']  # Required if IAM resources are involved
    )

    # Wait for stack creation to complete
    waiter = cf_client.get_waiter('stack_create_complete')
    waiter.wait(StackName=stack_name)
    print("✅ Stack creation complete!")

    # Fetch the stack outputs
    stack_details = cf_client.describe_stacks(StackName=stack_name)
    outputs = stack_details['Stacks'][0].get('Outputs', [])

    for output in outputs:
        if output['OutputKey'] == 'InstancePublicIP':
            print(f"🚀 EC2 Public IP: {output['OutputValue']}")

except Exception as e:
    print(f"❌ Error: {str(e)}")