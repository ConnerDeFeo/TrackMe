import json
from rds import execute_commit
from user_auth import get_user_info

# deletes group from db
def delete_group(event, context):
    query_params = event.get("queryStringParameters", {})
    try:
        user_info = get_user_info(event)
        coach_id = user_info["user_id"]
        group_id = query_params["groupId"]

        # light delete group from db
        execute_commit(
            "UPDATE groups SET deleted = TRUE WHERE id = %s AND coachId = %s",
            (group_id, coach_id)
        )
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Group deleted successfully"})
        }

    except Exception as e:
        print(f"Error parsing query parameters: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error while parsing query parameters"})
        }