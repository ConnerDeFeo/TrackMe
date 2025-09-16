from rds import fetch_one
import json

# Gets all current proposals (requests or invites) for a user
def get_pending_proposals(event, context):
    query_params = event.get('queryStringParameters', {})
    accountMappings = {
        'athlete': 'invites',
        'coach': 'requests'
    }
    try:
        userId = query_params['userId']
        accountType = query_params['accountType'].lower()
        count = fetch_one(f"SELECT COUNT(*) FROM athlete_coach_{accountMappings[accountType]} WHERE {accountType}Id = %s", (userId,))
        if not count:
            count = [0]
        return {
            'statusCode': 200,
            'body': json.dumps({"count": count[0]})
        }
    except Exception as e:
        print(f"Error fetching pending proposals: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }