from datetime import datetime,timezone
import json
from rds import fetch_all
from user_auth import get_auth_header

#Grabs all user inputs for a given date and groupId
def view_group_inputs(event, context):
    query_params = event.get("queryStringParameters", {})
    auth_header = get_auth_header()

    try:
        group_id = query_params['groupId']
        date = query_params.get('date',datetime.now(timezone.utc).strftime('%Y-%m-%d'))

        #Grab data from rds
        athlete_time_inputs = fetch_all(
            """
                SELECT athleteId, distance, time, restTime, type
                FROM athlete_inputs
                WHERE date = %s AND groupId = %s
                ORDER BY timeStamp ASC
            """,
            (date, group_id)
        )

        #Convert data to json format
        if athlete_time_inputs:
            parsed_data = {}
            for athleteId, distance, time, restTime, type in athlete_time_inputs:
                if athleteId not in parsed_data:
                    parsed_data[athleteId] = []
                if restTime is not None: # Running input
                    parsed_data[athleteId].append({
                        "restTime": restTime,
                        "type": type
                    })
                else:
                    parsed_data[athleteId].append({
                        "distance": distance,
                        "time": time,
                        "type": type
                    })

            return {
                "statusCode": 200,
                "body": json.dumps(parsed_data),
                "headers": auth_header
            }
        return {
            "statusCode": 404,
            "body": {
                "error": "No inputs found"
            },
            "headers": auth_header
        }

    except Exception as e:
        print(f"Error retrieving inputs: {e}")
        return {
            "statusCode": 500,
            "body": {
                "error": str(e)
            },
            "headers": auth_header
        }