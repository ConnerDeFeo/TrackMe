import json
from rds import execute_commit

# Function to accept a group invite
def accept_group_invite(event, context):
    # Extract athleteId and groupId from the event
    body = json.loads(event['body'])
    try:
        athlete_id = body['athleteId']
        group_id = body['groupId']

        # Insert the athlete into the group, remove the invite
        execute_commit(
            """
            INSERT INTO athlete_groups (athleteId, groupId)
            VALUES (%s, %s); DELETE FROM athlete_group_invites WHERE athleteId = %s AND groupId = %s;
            """,
            (athlete_id, group_id, athlete_id, group_id)
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Group invite accepted successfully'})
        }
    except Exception as e:
        print(f"Error accepting group invite: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
