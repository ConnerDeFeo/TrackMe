Insert into coaches (userId, username) values ('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9', 'coachdefeo');
Insert into athletes (userId, username) values ('912b25e0-c091-700b-a580-dbad51f124e6', 'athletedefeo');
Insert into athlete_coaches (coachId, athleteId) values('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9','912b25e0-c091-700b-a580-dbad51f124e6');
Insert into groups (coachId, name) values ('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9', 'Coach DeFeos group');
Insert into athlete_groups (athleteId, groupId) values ('912b25e0-c091-700b-a580-dbad51f124e6', 1);
INSERT INTO workouts (coachId, title, description, exercises) 
VALUES (
    '81cbd5d0-c0a1-709a-560f-ceb88b7d53d9',
    'Test Workout',
    'This is a test workout',
    '[
        {
            "name": "Test name",
            "sets": 3,
            "reps": 10,
            "exerciseParts": [
                {
                    "distance": 100,
                    "measurement": "meters"
                },
                {
                    "distance": 50,
                    "measurement": "meters"
                }
            ],
            "inputs": true
        },
        {
            "name": "Test name 2",
            "sets": 2,
            "reps": 15,
            "exerciseParts": [
                {
                    "distance": 200,
                    "measurement": "meters"
                }
            ]
        },
        {
            "name": "Warm-up"
        }
    ]'::jsonb
);
INSERT INTO group_workouts (groupId, workoutId) VALUES (1, 1);