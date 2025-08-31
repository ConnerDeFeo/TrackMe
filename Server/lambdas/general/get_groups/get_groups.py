import json
from rds import fetch_all

#Gets all related groups for an athlet or coach
def get_groups(event, context):
    query_params = event.get('queryStringParameters', {})
    try:
        # Query string parameters
        userId = query_params.get('userId')
        accountType = query_params.get('accountType')

        #Athletes
        if accountType == 'Athlete':
            group_data = fetch_all(
                """
                    SELECT g.name, g.id FROM athlete_groups ag
                    JOIN groups g ON ag.groupId = g.id
                    JOIN coaches c ON g.coachId = c.userId
                    WHERE ag.athleteId = %s
                    AND ag.removed = FALSE
                """,
                (userId,)
            )

        #Coaches
        else:
            group_data = fetch_all(
                """
                    SELECT g.name, g.id FROM groups g
                    JOIN coaches c ON g.coachId = c.userId
                    WHERE c.userId = %s
                """,
                (userId,)
            )

        if group_data:
            return {
                "statusCode": 200,
                "body": json.dumps(group_data)
            }
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Group not found"})
            }
    except Exception as e:
        print(f"Error retrieving group: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }