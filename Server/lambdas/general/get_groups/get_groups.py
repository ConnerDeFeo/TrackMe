import json
from rds import fetch_all
from user_auth import get_user_info, get_auth_header

#Gets all related groups for an athlete or coach
def get_groups(event, context):
    auth_header = get_auth_header()
    
    try:
        # Query string parameters
        user_info = get_user_info(event)
        userId = user_info["userId"]
        accountType = user_info['accountType']

        #Athletes
        if accountType == 'Athlete':
            group_data = fetch_all(
                """
                    SELECT g.name, g.id FROM athlete_groups ag
                    JOIN groups g ON ag.groupId = g.id
                    WHERE ag.athleteId = %s
                    AND ag.removed = FALSE
                    AND g.deleted = FALSE
                """,
                (userId,)
            )

        #Coaches
        else:
            group_data = fetch_all(
                """
                    SELECT g.name, g.id FROM groups g
                    JOIN users u ON g.coachId = u.userId
                    WHERE u.userId = %s
                    AND g.deleted = FALSE
                """,
                (userId,)
            )

        if group_data:
            return {
                "statusCode": 200,
                "body": json.dumps(group_data),
                "headers": auth_header
            }
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Group not found"}),
                "headers": auth_header
            }
    except Exception as e:
        print(f"Error retrieving group: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": auth_header
        }