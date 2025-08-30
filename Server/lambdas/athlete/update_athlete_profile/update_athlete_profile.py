import json
from rds import execute_commit

def update_athlete_profile(event, context):
    body = json.loads(event['body'])

    # Attempt athlete profile update
    try:
        athleteId = body['athleteId']
        bio = body.get('bio')
        first_name = body.get('firstName')
        last_name = body.get('lastName')
        gender = body.get('gender')
        profile_picture_url = body.get('profilePictureUrl')
        tffrs_url = body.get('tffrsUrl')
        body_weight = body.get('bodyWeight')


        # Update athlete profile in the database
        execute_commit(
            """
                UPDATE athletes
                SET bio = %s, firstName = %s, lastName = %s, 
                gender = %s, profilePictureUrl = %s,
                bodyWeight = %s, tffrsUrl = %s
                WHERE userId = %s
            """,
            (bio, first_name, last_name, gender, profile_picture_url, body_weight, tffrs_url, athleteId)
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