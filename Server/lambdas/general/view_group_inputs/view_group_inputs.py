from datetime import datetime,timezone
import json
from rds import fetch_all

#Grabs all user inputs for a given date and groupId
def view_group_inputs(event, context):
    query_params = event.get("queryStringParameters", {})

    try:
        group_id = query_params['groupId']
        date = query_params.get('date',datetime.now(timezone.utc).strftime('%Y-%m-%d'))

        #Grab data from rds
        athlete_inputs = fetch_all(
            """
                SELECT ai.athleteId, a.username, ai.distance, ai.time 
                FROM athlete_inputs ai
                JOIN athletes a ON ai.athleteId = a.userId
                WHERE groupId = %s AND date = %s
            """,
            (group_id, date)
        )

        #Convert data to json format
        if athlete_inputs:
            parsed_data = {}
            for input in athlete_inputs:
                if input[0] not in parsed_data:
                    parsed_data[input[0]] = {}
                    parsed_data[input[0]]['username'] = input[1]
                    parsed_data[input[0]]['inputs'] = []
                parsed_data[input[0]]['inputs'].append({
                    "distance": input[2],
                    "time": input[3]
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