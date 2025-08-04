from rds import fetch_all
import json

def view_group_invites(event, context):
    body = json.loads(event['body'])

    try:
        user_id = body['userId']

        #Grab all invites for the athlete
        invites = fetch_all("""
            SELECT g.name, c.username FROM athlete_group_invites agi
            JOIN groups g ON agi.groupId = g.id
            JOIN coaches c ON g.coachId = c.userId
            WHERE agi.athleteId = %s
        """, (user_id,))
        return {
            'statusCode': 200,
            'body': json.dumps(invites)
        }

    except Exception as e:
        print(f"Error viewing group invites: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error viewing group invites: {}'.format(str(e))
            })
        }
