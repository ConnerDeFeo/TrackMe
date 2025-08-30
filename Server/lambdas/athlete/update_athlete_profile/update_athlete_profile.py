import json
from rds import execute_commit

def update_athlete_profile(event, context):
    body = json.loads(event['body'])

    # Attempt athlete profile update
    try:
        athleteId = body['athleteId']
        bio = body.get('bio')
        firstName = body.get('firstName')
        lastName = body.get('lastName')
        tffrsUrl = body.get('tffrsUrl')
        gender = body.get('gender')
        profilePictureUrl = body.get('profilePictureUrl')

        # Update athlete profile in the database
        execute_commit(
            """
                UPDATE athletes
                SET bio = %s, firstName = %s, lastName = %s, 
                tffrsUrl = %s, gender = %s, profilePictureUrl = %s
                WHERE userId = %s
            """,
            (bio, firstName, lastName, tffrsUrl, gender, profilePictureUrl, athleteId)
        )
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Athlete profile updated successfully"})
        }

    except Exception as e:
        print(f"Error updating athlete profile: {e}")
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": {"message": "Error updating user profile"}
        }