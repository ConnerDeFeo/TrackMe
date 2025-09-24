from datetime import datetime,timezone
import json
from rds import fetch_all
from user_auth import get_user_info

#Grabs all user inputs for a given date and groupId
def view_group_inputs(event, context):
    query_params = event.get("queryStringParameters", {})

    try:
        group_id = query_params['groupId']
        date = query_params.get('date',datetime.now(timezone.utc).strftime('%Y-%m-%d'))

        #Grab data from rds
        athlete_inputs = fetch_all(
            """
                SELECT athleteId, distance, time 
                FROM athlete_inputs
                WHERE groupId = %s AND date = %s
            """,
            (group_id, date)
        )

        #Convert data to json format
        if athlete_inputs:
            parsed_data = {}
            for input in athlete_inputs:
                if input[0] not in parsed_data:
                    parsed_data[input[0]] = []
                parsed_data[input[0]].append({
                    "distance": input[1],
                    "time": input[2]
                })

            return {
                "statusCode": 200,
                "body": json.dumps(parsed_data)
            }
        return {
            "statusCode": 404,
            "body": {
                "error": "No inputs found"
            }
        }

    except Exception as e:
        print(f"Error retrieving inputs: {e}")
        return {
            "statusCode": 500,
            "body": {
                "error": str(e)
            }
        }