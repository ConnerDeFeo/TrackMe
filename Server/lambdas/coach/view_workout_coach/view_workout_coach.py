import json

#Fetches workout from databse for a coach to view
#Includes workout details and the times for all athletes in the group
def view_workout_coach(event, context):
    body = json.loads(event['body'])

    try:
        date = body['date']
        group_name = body['groupName']
        coach_id = body['coachId']

        #
    except Exception as e:
        print(f"Error parsing input: {e}")