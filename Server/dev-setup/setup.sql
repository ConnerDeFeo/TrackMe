DROP TABLE IF EXISTS 
coaches, 
athletes, 
groups, 
athlete_groups, 
athlete_coaches, 
athlete_coach_invites, 
group_workouts, 
athlete_workout_inputs, 
workout_groups, 
workout_group_members, 
workout_group_inputs CASCADE;


--User and user relation related tables--
CREATE TABLE coaches (
    userId VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE athletes (
    userId VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dateCreated VARCHAR(10) DEFAULT CURRENT_DATE,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    UNIQUE (name, coachId)
);

CREATE TABLE athlete_groups (
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    groupId INT REFERENCES groups(id) NOT NULL,
    PRIMARY KEY (athleteId, groupId)
);

CREATE TABLE athlete_coaches (
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    UNIQUE (athleteId, coachId)
);

CREATE TABLE athlete_coach_invites (
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    UNIQUE (athleteId, coachId)
);

CREATE TABLE group_workouts (
    id SERIAL PRIMARY KEY,
    groupId INT REFERENCES groups(id) NOT NULL,
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    workoutId VARCHAR(255) NOT NULL,
    UNIQUE (groupId, date)
);
--Indexes for faster lookups--
CREATE INDEX idx_group_workouts ON group_workouts (groupId, date, workoutId);

CREATE TABLE athlete_workout_inputs(
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    groupWorkoutId INT REFERENCES group_workouts(id) NOT NULL,
    distance int DEFAULT 0,
    time int DEFAULT 0
);

CREATE TABLE workout_groups (
    id SERIAL PRIMARY KEY,
    leaderId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    workoutId INT REFERENCES group_workouts(id) NOT NULL,
    workoutGroupName VARCHAR(255) NOT NULL,
    UNIQUE (workoutId, workoutGroupName)
);

CREATE TABLE workout_group_members(
    workoutGroupId INT REFERENCES workout_groups(id) NOT NULL,
    athleteUsername VARCHAR(255),
    PRIMARY KEY (workoutGroupId, athleteUsername)
);

CREATE TABLE workout_group_inputs(
    workoutGroupId INT REFERENCES workout_groups(id) NOT NULL,
    distance int DEFAULT 0,
    time int DEFAULT 0
);

-- INSERT INTO coaches (userId, username) VALUES ('81cbd5d0-c0a1-709a-560f-ceb88b7d53d9', 'coachdefeo');
-- INSERT INTO athletes (userId, username) VALUES ('91cbd5d0-c0a1-709a-560f-ceb88b7d53d9', 'athletedefeo');
