import json
from dynamodb_client import query_items
from dynamodb_client import key, attr

#Gets a group for a coach
def get_group(event, context):
    body = json.loads(event['body'])
    userId = body['userId']
    groupName = body['groupName']

    try:
        # Logic to retrieve the group from the database
        data = query_items('coaches',
            key_condition_expression=key("userId").eq(userId),
            FilterExpression=attr("groupName").eq(groupName)
        )
        group = data['Items'][0]

        if group:
            return {
                "statusCode": 200,
                "body": json.dumps(group)
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