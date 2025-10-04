import json
from datetime import datetime, timezone
from testing_utils import generate_auth_header
date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

class TestData:
    test_coach = {
            "headers":generate_auth_header("123", "Coach", "testcoach")
        }
    
    test_group = {
            "body": json.dumps({
                "groupName": "Test Group"
            }),
            "headers":generate_auth_header("123", "Coach", "testcoach")
        }
    
    test_athlete = {
            "headers":generate_auth_header("1234", "Athlete", "test_athlete")
        }
    
    test_add_relation_athlete = {
            "body": json.dumps({
                "relationId": "123"
            }),
            "headers":generate_auth_header("1234", "Athlete", "test_athlete")
        }
    test_add_relation_coach = {
            "body": json.dumps({
                "relationId": "1234"
            }),
            "headers":generate_auth_header("123", "Coach", "testcoach")
        }

    test_accept_coach_invite = {
            "body": json.dumps({
                "coachId": "123"
            }),
            "headers":generate_auth_header("1234", "Athlete", "test_athlete")
        }

    test_workout = {
        "body": json.dumps({
            'title': 'Test Workout', 
            'description': 'This is a test workout',
            'sections': [
                {
                    'name': 'Test name',
                    'minSets': 3,
                    'maxSets': 5,
                    'exercises': [
                        {
                            'distance': 100,
                            'measurement': 'meters',
                            'type': 'run'
                        },
                        {
                            'type': 'rest',
                            'minDuration': 60,
                            'maxDuration': 90,
                            'description': 'Walk back'
                        },
                        {
                            'distance': 50,
                            'measurement': 'meters',
                            'type': 'run',
                            'minReps': 2,
                            'maxReps': 4
                        },
                        {
                            'type': 'strength',
                            'description': 'Push-ups',
                            'minReps': 10,
                            'maxReps': 20
                        }
                    ],
                    "inputs":True
                },
                {
                    'name': 'Test name 2',
                    'minSets': 2,
                    'maxSets': 2,
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
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }

    test_get_group_athlete = {
        "headers":generate_auth_header("1234", "Athlete", "test_athlete")
    }

    test_get_group_coach = {
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }

    test_add_athlete_to_group = {
        "body": json.dumps({
            "athleteId": "1234",
            "groupId": "1"
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }

    test_input_times = {
        "body": json.dumps({
            "athleteIds": ["1234"],
            'groupId': 1,
            "date": date,
            'inputs': [
                {
                    'distance': 100,
                    'time': 10.8,
                    'type': 'run'
                },
                {
                    'restTime': 5,
                    'type': 'rest'
                },
                {
                    'distance': 200,
                    'time': 30,
                    'type': 'run'
                },
            ]
        }),
        "headers":generate_auth_header("1234", "Athlete", "test_athlete")
    }

    test_update_athlete_profile = {
        "body": json.dumps({
            "bio": "Updated bio",
            "firstName": "Updated",
            "lastName": "Name",
            "tffrsUrl": "http://updated.url",
            "gender": "Male",
            "profilePictureUrl": None,
            'tffrsUrl':"someurl",
            'bodyWeight': 70
        }),
        "headers":generate_auth_header("1234", "Athlete", "test_athlete")
    }

    test_update_coach_profile = {
        "body": json.dumps({
            "bio": "Updated bio",
            "firstName": "Updated",
            "lastName": "Name",
            "tffrsUrl": "http://updated.url",
            "gender": "Female",
            "profilePictureUrl": None
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }

    test_assign_group_workout = {
        "body": json.dumps({
            "groupId": "1",
            "workoutId": 1,
            "date": date
        }),
        "headers":generate_auth_header("123", "Coach", "testcoach")
    }
