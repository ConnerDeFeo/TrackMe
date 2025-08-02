import json
from rds import execute

# Function to invite an athlete to a group
def invite_athlete(event, context):
    body = json.loads(event.get('body', '{}'))
    try:
        athlete_id = body['athleteId']
        group_id = body['groupId']

        # Insert the athlete into the group invite table
        execute(
            """
            INSERT INTO athlete_group_invites (athleteId, groupId)
            VALUES (%s, %s)
            ON CONFLICT (athleteId, groupId) DO NOTHING
            """, 
            (athlete_id, group_id)
        )
        return {
            "statusCode": 200,
            "body": f"Invitation sent to {athlete_id} for group {group_id}"
        }
    except Exception as e:
        print(f"Error inviting athlete: {str(e)}")
        return {
            "statusCode": 500,
            "body": f"Error inviting athlete: {str(e)}"
        }
