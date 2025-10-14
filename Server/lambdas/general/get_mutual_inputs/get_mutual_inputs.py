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
            SELECT ai.id, ai.athleteId, u.username, ai.date, ai.time, ai.distance, ai.restTime
            FROM athlete_inputs ai
            JOIN user_relations ur ON ai.athleteId = ur.relationId AND ur.userId = %s
            JOIN user_relations ur2 ON ai.athleteId = ur2.userId AND ur2.relationId = %s 
            JOIN users u ON ai.athleteId = u.userId
            WHERE ai.date = %s
            ORDER BY ai.date DESC, ai.id DESC
        """, (user_id, user_id, date)) or []

        return {
            "statusCode": 200,
            "body": json.dumps([{
                    'inputId': inp[0], 
                    'athleteId': inp[1], 
                    'username': inp[2], 
                    'date': str(inp[3]), 
                    'time': inp[4] if inp[4] is not None else None, 
                    'distance': inp[5] if inp[5] is not None else None, 
                    'restTime': inp[6] if inp[6] is not None else None
                } 
                for inp in inputs
            ]),
            "headers": auth_header
        }

    except Exception as e:
        print(f"Error in user authentication: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Unauthorized"}),
            "headers": auth_header
        }