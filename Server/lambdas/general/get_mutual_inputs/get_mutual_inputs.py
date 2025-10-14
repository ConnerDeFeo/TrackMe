import json
from user_auth import get_user_info, get_auth_header
from rds import fetch_all
from datetime import datetime, timezone

def get_mutual_inputs(event, context):
    query_params = event.get('queryStringParameters')
    auth_header = get_auth_header()
    try:
        user_info = get_user_info(event)
        user_id = user_info['userId']
        date = query_params.get('date', datetime.now(timezone.utc).strftime("%Y-%m-%d"))

        # Fetch all mutual inputs for the user
        inputs = fetch_all(
        """
            SELECT ai.athleteId, ai.time, ai.distance, ai.restTime, ai.type
            FROM athlete_inputs ai
            JOIN user_relations ur ON ai.athleteId = ur.relationId AND ur.userId = %s
            JOIN user_relations ur2 ON ai.athleteId = ur2.userId AND ur2.relationId = %s 
            JOIN users u ON ai.athleteId = u.userId
            WHERE ai.date = %s
            ORDER BY ai.timeStamp DESC
        """, (user_id, user_id, date)) or []

        # Parse inputs into a structured format
        parsed_inputs = {}
        for athleteId, time, distance, restTime, type in inputs:
            if athleteId not in parsed_inputs:
                parsed_inputs[athleteId] = []
            if type=="rest":
                parsed_inputs[athleteId].append({'restTime': restTime, 'type': type})
            else:
                parsed_inputs[athleteId].append({'time': time, 'distance': distance, 'type': type})
        return {
            "statusCode": 200,
            "body": json.dumps(parsed_inputs),
            "headers": auth_header
        }

    except Exception as e:
        print(f"Error in user authentication: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Unauthorized"}),
            "headers": auth_header
        }