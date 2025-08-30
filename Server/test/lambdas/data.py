import json

from datetime import datetime, timezone

date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

class TestData:
    test_coach = {
            "body": json.dumps({
                "userId": "123",
                'username': "testcoach",
            })
        }
    
    test_group = {
            "body": json.dumps({
                "groupName": "Test Group",
                "coachId": "123"
            })
        }
    
    test_athlete = {
            "body": json.dumps({
                "userId": "1234",
                "username": "test_athlete"
            })
        }
    
    test_invite = {
        "body": json.dumps({
            "athleteId": "1234",
            "coachId": "123"
        })
    }

    test_accept_coach_invite = {
            "body": json.dumps({
                "athleteId": "1234",
                "coachId": "123"
            })
        }

    test_workout = {
        "body": json.dumps({
            'coachId': '123',
            'title': 'Test Workout', 
            'description': 'This is a test workout',
            'exercises': [
                {
                    'name': 'Test name',
                    'sets': 3,
                    'reps': 10,
                    'exerciseParts': [
                        {
                            'distance': 100,
                            'measurement': 'meters'
                        },
                        {
                            'distance': 50,
                            'measurement': 'meters'
                        }
                    ],
                    "inputs":True
                },
                {
                    'name': 'Test name 2',
                    'sets': 2,
                    'reps': 15,
                    'exerciseParts': [
                        {
                            'distance': 200,
                            'measurement': 'meters'
                        }
                    ]
                },
                {
                    'name': 'Warm-up',
                }
            ]
        })
    }

    test_get_group_athlete = {
        "queryStringParameters":{
            "userId": "1234",
            "accountType": "Athlete"
        }
    }

    test_get_group_coach = {
        "queryStringParameters": {
            "userId": "123",
            "accountType": "Coach"
        }
    }

    test_add_athlete_to_group = {
        "body": json.dumps({
            "athleteId": "1234",
            "coachId": "123",
            "groupId": "1"
        })
    }

    test_input_times = {
        "body": json.dumps({
            "athleteIds": ["1234"],
            'groupId': 1,
            "date": date,
            'inputs': [
                {
                    'distance': 100,
                    'time': 10.8
                },
                {
                    'distance': 200,
                    'time': 30
                }
            ]
        })
    }

    test_update_athlete_profile = {
        "body": json.dumps({
            "athleteId": '1234',
            "bio": "Updated bio",
            "firstName": "Updated",
            "lastName": "Name",
            "tffrsUrl": "http://updated.url",
            "gender": "Male",
            "profilePictureUrl": None,
            'tffrsUrl':"someurl",
            'bodyWeight': 70
        })
    }

    test_update_coach_profile = {
        "body": json.dumps({
            "coachId": '123',
            "bio": "Updated bio",
            "firstName": "Updated",
            "lastName": "Name",
            "tffrsUrl": "http://updated.url",
            "gender": "Female",
            "profilePictureUrl": None
        })
    }
