import json
from rds import fetch_all
from user_auth import get_user_info

#Get
def get_coach_invites(event,context):

    try:
        user_info = get_user_info(event)
        user_id = user_info['user_id']
        #Fetch all coaches from the db that have made a request to the athlete
        coaches = fetch_all(
        """
            SELECT c.userId, c.username
            FROM coaches c
            JOIN athlete_coach_invites aci ON c.userId = aci.coachId
            WHERE aci.athleteId = %s
        """, (user_id,))

        if coaches:
            return {
                "statusCode": 200,
                "body": json.dumps(coaches)
            }
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "No coach requests found"})
        }
    except Exception as e:
        print(f"Error fetching coach requests: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"})
        }