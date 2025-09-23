from rds import fetch_all
import json
from user_auth import get_user_info

#Shows all coach invites for an athlete
def view_coach_invites(event, context):

    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']

        #Grab all invites for the athlete
        invites = fetch_all(
        """
            SELECT c.username FROM athlete_coach_invites aci
            JOIN coaches c ON aci.coachId = c.userId
            WHERE aci.athleteId = %s
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
