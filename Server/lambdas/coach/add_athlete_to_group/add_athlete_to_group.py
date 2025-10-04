import json
from rds import execute_commit, fetch_all, fetch_one
from user_auth import get_user_info
#Adds an athlete to a group
def add_athlete_to_group(event, context):
    body = json.loads(event.get('body', '{}'))

    try:
        user_info = get_user_info(event)
        coach_id = user_info["userId"]
        athlete_id = body['athleteId']
        group_id = body['groupId']

        #Check to see if coach has athlete added
        connection_active = fetch_all(
        """
            SELECT * FROM user_relations
            WHERE userId = %s AND relationId = %s
            OR userId = %s AND relationId = %s
        """, (athlete_id, coach_id, coach_id, athlete_id))

        # If they are connected, add athlete to group
        if connection_active and len(connection_active) == 2:
            # Check if they were previously a part of the group
            previous_group = fetch_one(
            """
                SELECT * FROM athlete_groups
                WHERE athleteId = %s AND groupId = %s AND removed = TRUE
            """, (athlete_id, group_id))
            if previous_group:
                execute_commit(
                """
                    UPDATE athlete_groups
                    SET removed = FALSE
                    WHERE athleteId = %s AND groupId = %s
                """, (athlete_id, group_id))
            else:
                execute_commit(
                """
                    INSERT INTO athlete_groups (athleteId, groupId)
                    VALUES (%s, %s)
                """, (athlete_id, group_id))
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Athlete added to group successfully'})
            }

        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Athlete is not associated with this coach'})
        }

    except Exception as e:
        print(f"Error parsing request body: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }
