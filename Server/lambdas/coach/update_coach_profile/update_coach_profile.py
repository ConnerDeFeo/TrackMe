import json
from rds import execute_commit
from user_auth import get_user_info

def update_coach_profile(event, context):
    body = json.loads(event['body'])

    # Attempt coach profile update
    try:
        user_info = get_user_info(event)
        coachId = user_info['userId']
        bio = body.get('bio')
        firstName = body.get('firstName')
        lastName = body.get('lastName')
        gender = body.get('gender')
        profilePictureUrl = body.get('profilePictureUrl')

        # Update athlete profile in the database
        execute_commit(
            """
                UPDATE coaches
                SET bio = %s, firstName = %s, lastName = %s, 
                gender = %s, profilePictureUrl = %s
                WHERE userId = %s
            """,
            (bio, firstName, lastName, gender, profilePictureUrl, coachId)
        )
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Coach profile updated successfully"})
        }

    except Exception as e:
        print(f"Error updating coach profile: {e}")
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": {"message": "Error updating user profile"}
        }