import json
from rds import fetch_one, fetch_all

def get_workout_group(event, context):
    # Extract the groupId from the event
    group_id = event.get("queryStringParameters", {}).get("groupId")

    if not group_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing groupId"})
        }

    # Fetch the workout group from the database
    workout_group = fetch_one("SELECT * FROM workout_groups WHERE id = %s", (group_id,))

    if not workout_group:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "Workout group not found"})
        }

    # Fetch the members of the workout group
    group_members = fetch_all("SELECT * FROM workout_group_members WHERE groupId = %s", (group_id,))

    return {
        "statusCode": 200,
        "body": json.dumps({
            "group": workout_group,
            "members": group_members
        })
    }
