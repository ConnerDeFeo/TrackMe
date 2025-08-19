import json
from dynamo import query_items
from decimal_encoder import DecimalEncoder

#Fetches all of a given coaches workouts
def get_workouts(event, context):
    query_params = event.get('queryStringParameters', {})

    try:
        coach_id = query_params['coach_id']

        #Grab all workouts accosiated with the coach_id
        workouts = query_items('Workouts', key_condition_expression="coach_id = :cid", filter_expression="deleted = :deleted", expression_attribute_values={":cid": coach_id, ":deleted": False})

        if workouts:
            return {
                "statusCode": 200,
                "body": json.dumps(workouts, cls=DecimalEncoder)
            }
        return {
            "statusCode": 404,
            "body": "No workouts found"
        }

    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            "statusCode": 500,
            "body": f"Error fetching workouts: {str(e)}"
        }
