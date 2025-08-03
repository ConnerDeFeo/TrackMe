import json

test_coach = {
        "body": json.dumps({
            "userId": "123",
            'username': "testcoach",
        })
    }
test_group = {
        "body": json.dumps({
            "groupName": "Test Group",
            "userId": "123"
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
        "groupId": "1"
    })
}

test_accept_group_invite = {
        "body": json.dumps({
            "athleteId": "1234",
            "groupId": "1"
        })
    }

test_workout = {
    "body": json.dumps({
        'coach_id': '123',
        'title': 'Test Workout',
        'description': 'This is a test workout',
        'excersies': [
            {
                'name': 'Test name',
                'sets': 3,
                'reps': 10,
                'excersiesParts': [
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
                'excersiesParts': [
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

test_assign_workout = {
    "body": json.dumps({
        "title": "Test Workout",
        "userId": "123",
        "groupName": "Test Group"
    })
}