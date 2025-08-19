from dynamo import update_item
import json

#Removes a coaches workout
def delete_workout(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        workout_id = query_params['workoutId']
        coach_id = query_params['coachId']

        #Update the table to soft delete the workout
        update_item(
            "Workouts", 
            key={'workout_id':workout_id, 'coach_id':coach_id}, 
            update_expression="SET deleted = :deleted",
            expression_attribute_values={":deleted": True}
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Workout deleted successfully'})
        }
    except Exception as e:
        print(f"Error deleting workout: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to delete workout', 'message': str(e)})
        }