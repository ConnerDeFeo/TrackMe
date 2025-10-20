from user_auth import get_auth_header, get_user_info
import json
from rds import fetch_one

def get_earliest_date_available(event, context):
    auth_header = get_auth_header()
    try:
        # Placeholder for the actual logic to get the earliest date available
        user_info = get_user_info(event)
        user_id = user_info['userId']
        account_type = user_info['accountType']

        params = [user_id]
        if account_type == "Athlete":
            join_clause = " WHERE ai.athleteId = %s"
        else:
            join_clause = """
                JOIN user_relations ur ON ai.athleteId = ur.userId
                JOIN user_relations ur2 ON ai.athleteId = ur2.relationId
                WHERE ur.relationId = %s AND ur2.userId = %s
            """
            params.append(user_id)

        # Get earliest history date for user and connections
        result = fetch_one(
            f"""
                SELECT MIN(ai.date) FROM athlete_inputs ai
                {join_clause}
            """,
            tuple(params)
        )
        earliest_date = result[0] if result and result[0] else None
        return {
            "statusCode": 200,
            "body": json.dumps(earliest_date),
            "headers": auth_header
        }
    except Exception as e:
        print(f"Error occurred while getting earliest date available: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error"}),
            "headers": auth_header
        }