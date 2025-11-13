# import json
# from user_auth import get_user_info, post_auth_header
# from s3 import s3

# def upload_video(event, context):
#     body = json.loads(event['body'])
#     auth_header = post_auth_header()

#     try:
#         user_info = get_user_info(event)
#         user_id = user_info['userId']


#     except Exception as e:
#         print(f"Authentication Error: {e}")
#         return {
#             'statusCode': 401,
#             'body': json.dumps({'message': 'Unauthorized'}),
#             'headers': auth_header
#         }