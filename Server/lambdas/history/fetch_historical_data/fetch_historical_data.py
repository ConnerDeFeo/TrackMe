import json
from rds import fetch_all
from user_auth import get_user_info, get_auth_header

# inputs for a given user on a given date
def fetch_historical_data(event, context):
    # Extract query parameters from the incoming event
    query_params = event.get('queryStringParameters', {})
    auth_header = get_auth_header()

    try:
        # Get authenticated user info and determine coach ID
        user_info = get_user_info(event)
        user_id = user_info['userId']
        account_type = user_info['accountType']
        # Expecting 'date' parameter for historical lookup
        date = query_params['date']

        params = [user_id]
        # Join clause for athlete inputs based on account type
        if account_type == "Athlete":
            input_join_clause = "WHERE ai.athleteId = %s"
        else:
            input_join_clause = """
                JOIN user_relations ur ON ai.athleteId = ur.userId AND ur.relationId = %s
                JOIN user_relations ur2 ON ai.athleteId = ur2.relationId AND ur2.userId = %s
            """
            params.append(user_id)
        params.append(date)

        # Fetch all athlete input entries for this coach on the same date
        athlete_inputs = fetch_all(
            f"""
                SELECT u.userId, u.username, u.firstName, u.lastName, u.profilePicUrl, ai.time, ai.distance, ai.restTime, ai.note, ai.type
                FROM athlete_inputs ai
                JOIN users u ON ai.athleteId = u.userId
                {input_join_clause} AND ai.date = %s
                ORDER BY ai.timeStamp ASC
            """,params) or []

        # Prepare a dictionary to group data by group ID
        filtered_data = {}

        # Populate filtered_data with athlete inputs per group and athlete
        for user_id, username, firstName, lastName, profilePicUrl, time, distance, rest_time, note, input_type in athlete_inputs:
            # Initialize athlete entry if not present
            if user_id not in filtered_data:
                filtered_data[user_id] = {
                    "username": username,
                    "firstName": firstName,
                    "lastName": lastName,
                    "profilePicUrl": profilePicUrl,
                    "inputs": []
                }
            # Distinguish input type: rest or performance
            if rest_time:
                filtered_data[user_id]["inputs"].append({
                    "restTime": rest_time,
                    "type": input_type
                })
            elif note:
                filtered_data[user_id]["inputs"].append({
                    "note": note,
                    "type": input_type
                })
            elif time and distance:
                filtered_data[user_id]["inputs"].append({
                    "time": time,
                    "distance": distance,
                    "type": input_type
                })

        # Return the assembled data as a JSON response
        return {
            "statusCode": 200,
            "body": json.dumps(filtered_data),
            "headers": auth_header
        }

    except Exception as e:
        print(f"Error occurred while fetching historical data: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"}),
            "headers": auth_header
        }