import json
from rds import execute_commit

def update_coach_profile(event, context):
    body = json.loads(event['body'])

    # Attempt coach profile update
    try:
        coachId = body['coachId']
        bio = body.get('bio')
        firstName = body.get('firstName')
        lastName = body.get('lastName')
        tffrsUrl = body.get('tffrsUrl')
        gender = body.get('gender')
        profilePictureUrl = body.get('profilePictureUrl')

        # Update athlete profile in the database
        execute_commit(
            """
                UPDATE coaches
                SET bio = %s, firstName = %s, lastName = %s, tffrsUrl = %s, gender = %s, profilePictureUrl = %s
                WHERE userId = %s
            """,
            (bio, firstName, lastName, tffrsUrl, gender, profilePictureUrl, coachId)
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