import json
from rds import fetch_all

#Get
def get_coach_requests(event,context):
    query_params = event.get('queryStringParameters', {})

    try:
        user_id = query_params['userId']

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