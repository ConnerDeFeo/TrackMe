from dynamo import update_item
import json

#Removes a coaches workout
def delete_workout(event, context):
    body = json.loads(event['body'])

    try:
        workout_id = body['workoutId']
        coach_id = body['coachId']

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