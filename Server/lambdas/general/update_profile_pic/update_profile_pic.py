import json
from user_auth import get_user_info, post_auth_header
from rds import execute_commit
import boto3
import base64

def update_profile_pic(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        image_data = body['imageData']

        s3 = boto3.client('s3')
        key = f'profile-photos/{user_id}.jpg'
        
        s3.put_object(
            Bucket='your-bucket',
            Key=key,
            Body=base64.b64decode(image_data),
            ContentType='image/jpeg'
        )
    
        # Return the S3 URL
        s3_url = f'https://your-bucket.s3.amazonaws.com/{key}'

        # Update profile picture URL in the database
        execute_commit(
        '''
            UPDATE users
            SET profilePicUrl = %s
            WHERE userId = %s
        ''', (s3_url, user_id))

        return {
            'statusCode': 200,
            'body': json.dumps(s3_url),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Internal Server Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)}),
            'headers': auth_header
        }