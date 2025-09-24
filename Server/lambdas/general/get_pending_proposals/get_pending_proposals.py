from rds import fetch_one
import json
from user_auth import get_user_info

# Gets all current proposals (requests or invites) for a user
def get_pending_proposals(event, context):
    accountMappings = {
        'athlete': 'invites',
        'coach': 'requests'
    }
    try:
        user_info = get_user_info(event)
        userId = user_info['userId']
        accountType = user_info['accountType'].lower()
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