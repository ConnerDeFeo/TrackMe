import json
from user_auth import get_user_info
from rds import execute_commit

# adds a relation between two users (athlete-coach, coach-athlete)
def add_relation(event, context):
    body = json.loads(event['body'])

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        relation_id = body['relationId']

        # Insert relation into database
        execute_commit(
            "INSERT INTO user_relations (userId, relationId) VALUES (%s, %s)",
            (user_id, relation_id)
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Relation added successfully')
        }

    except Exception as e:
        print(f"Error getting user info: {e}")
        return {
            'statusCode': 401,
            'body': json.dumps('Unauthorized')
        }
