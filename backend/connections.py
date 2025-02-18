import boto3

def create_boto_connection():
    cf_client = boto3.client('cloudformation', region_name='us-east-1')
    return cf_client