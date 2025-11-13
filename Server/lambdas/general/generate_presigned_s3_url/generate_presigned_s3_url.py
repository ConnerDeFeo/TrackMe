import boto3
import json
from botocore.config import Config
from user_auth import get_user_info, get_auth_header
import time

s3_client = boto3.client('s3', config=Config(signature_version='s3v4'))

def generate_presigned_s3_url(event, context):
    auth_header = get_auth_header()
    query_params = event.get('queryStringParameters', {}) or {}

    try:
        user_info = get_user_info(auth_header)
        user_id = user_info['user_id']
        title = query_params['title']
        destination = query_params.get('destination', 'profilePicture')
        if destination not in ['profilePicture', 'videos']:
            raise ValueError("Invalid destination parameter")

        key = f"{destination}/{user_id}.jpg"
        if destination == 'videos':
            key = f"{destination}/{user_id}/{title}.mp4"
        else:
            key = f"{destination}/{user_id}.jpg"
    

        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': 'trackme-media',
                'Key': key,
                'ContentType': 'image/jpeg'
            },
            ExpiresIn=3600
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'presigned_url': presigned_url, "public_url": f"https://trackme-media.s3.amazonaws.com/{key}?{int(time.time())}"}),
            'headers': auth_header
        }
    except Exception as e:
        print("Authentication failed:", e)
        return {
            'statusCode': 401,
            'body': 'Unauthorized: ' + str(e)
        }