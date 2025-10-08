import json
from user_auth import post_auth_header, get_user_info
from rds import execute_commit_fetch_one, execute_commit_many

def update_group_athletes(event, context):
    body = json.loads(event['body'])
    auth_header = post_auth_header()

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        athlete_ids = body['athleteIds']
        group_id = body['groupId']

        # Remove all current athletes from the group
        group = execute_commit_fetch_one(
            """
                UPDATE athlete_groups ag
                SET removed = TRUE
                FROM groups g
                WHERE ag.groupId = g.id 
                    AND g.id = %s 
                    AND g.coachId = %s
                RETURNING g.id
            """
        ,(group_id, user_id))

        if not group:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Group not found or you do not have permission to modify it.'})
            }
        # Add new athletes to the group
        params = [(athlete_id, group_id) for athlete_id in athlete_ids]
        execute_commit_many(
            """
                INSERT INTO athlete_groups (athleteId, groupId)
                VALUES (%s, %s)
                ON CONFLICT (athleteId, groupId) DO UPDATE SET removed = FALSE;
            """,
            params
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Group athletes updated successfully.'}),
            'headers': auth_header
        }
    except Exception as e:
        print(f"Error updating group athletes: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': auth_header
        }
