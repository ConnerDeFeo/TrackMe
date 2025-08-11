import json
from dynamo import query_items
from decimal_encoder import DecimalEncoder
#Fetches workout from databse for a coach to view
#Includes workout details and the times for all athletes in the group
def view_workout_coach(event, context):
    body = json.loads(event['body'])

    try:
        date = body['date']
        group_name = body['groupId']
        coach_id = body['coachId']


        #Fetch workout data from dynamodb
        partition_key = f"{coach_id}#{group_name}#{date}"
        workout_data = query_items(
            table_name='WorkoutInputs',
            key_condition_expression='group_date_identifier = :partition_key',
            expression_attribute_values={
                ':partition_key': partition_key,
            }
        )

        if not workout_data:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Workout not found'})
            }
        
        return {
            'statusCode': 200,
            'body': json.dumps(workout_data, cls=DecimalEncoder)
        }
    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }