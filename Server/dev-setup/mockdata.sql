Insert into coaches (userId, username) values ('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9', 'coachdefeo');
Insert into athletes (userId, username) values ('912b25e0-c091-700b-a580-dbad51f124e6', 'athletedefeo');
Insert into athletes (userId, username) values ('51cb2510-30c1-7063-474c-bbc37fc07bcc', 'testdefeo');
Insert into athlete_coaches (coachId, athleteId) values('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9','912b25e0-c091-700b-a580-dbad51f124e6');
Insert into athlete_coaches (coachId, athleteId) values('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9','51cb2510-30c1-7063-474c-bbc37fc07bcc');
Insert into groups (coachId, name) values ('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9', 'Domain Expansion');
Insert into groups (coachId, name) values ('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9', 'Infinite Void');
Insert into athlete_groups (athleteId, groupId) values ('912b25e0-c091-700b-a580-dbad51f124e6', 1);
Insert into athlete_groups (athleteId, groupId) values ('51cb2510-30c1-7063-474c-bbc37fc07bcc', 1);
Insert into athlete_groups (athleteId, groupId) values ('912b25e0-c091-700b-a580-dbad51f124e6', 2);
Insert into athlete_groups (athleteId, groupId) values ('51cb2510-30c1-7063-474c-bbc37fc07bcc', 2);
INSERT INTO workouts (coachId, title, description, sections, isTemplate) 
VALUES (
    '81cbd5d0-c0a1-709a-560f-ceb88b7d53d9',
    'Test Workout',
    'This is a test workout',
    '[
        {
            "name": "Test name",
            "sets": 3,
            "exercises": [
                {
                    "distance": 100,
                    "measurement": "meters",
                    "reps": 2,
                    "type": "run"
                },
                {
                    "type": "rest",
                    "duration": 60
                },
                {
                    "description": "Push-ups",
                    "reps": 4,
                    "type": "strength"
                }
            ],
            "inputs": true
        },
        {
            "name": "Test name 2",
            "sets": 2,
            "exercises": [
                {
                    "distance": 200,
                    "measurement": "meters",
                    "type": "run"
                }
            ]
        },
        {
            "name": "Warm-up",
            "sets": 1,
        }
    ]'::jsonb,
    true
);
INSERT INTO group_workouts (groupId, workoutId) VALUES (1, 1);
INSERT INTO group_workouts (groupId, workoutId) VALUES (2, 1);