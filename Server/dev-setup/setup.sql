DROP TABLE IF EXISTS coaches CASCADE;
DROP TABLE IF EXISTS athletes CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS athlete_groups CASCADE;
DROP TABLE IF EXISTS athlete_group_invites CASCADE;
DROP TABLE IF EXISTS group_workouts CASCADE;
DROP TABLE IF EXISTS athlete_workout_inputs CASCADE;
DROP TABLE IF EXISTS workout_groups CASCADE;
DROP TABLE IF EXISTS workout_group_members CASCADE;


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
    coachId VARCHAR(255) REFERENCES coaches(userId),
    UNIQUE (name, coachId)
);

CREATE TABLE athlete_groups (
    athleteId VARCHAR(255) REFERENCES athletes(userId),
    groupId INT REFERENCES groups(id),
    PRIMARY KEY (athleteId, groupId)
);

CREATE TABLE athlete_group_invites (
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId),
    groupId INT REFERENCES groups(id),
    UNIQUE (athleteId, groupId)
);

CREATE TABLE group_workouts (
    id SERIAL PRIMARY KEY,
    groupId INT REFERENCES groups(id),
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    title VARCHAR(255) NOT NULL,
    UNIQUE (groupId, date, title)
);

CREATE TABLE athlete_workout_inputs(
    athleteId VARCHAR(255) REFERENCES athletes(userId),
    groupWorkoutId INT REFERENCES group_workouts(id),
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    distance int DEFAULT 0,
    time int DEFAULT 0
);

CREATE TABLE workout_groups (
    id SERIAL PRIMARY KEY,
    leaderId VARCHAR(255) REFERENCES athletes(userId),
    workoutId INT REFERENCES group_workouts(id),
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    workoutGroupName VARCHAR(255) NOT NULL,
    UNIQUE (leaderId, workoutId, date)
);

CREATE TABLE workout_group_members(
    groupWorkoutId INT REFERENCES group_workouts(id),
    athleteUsername VARCHAR(255) REFERENCES athletes(username),
    PRIMARY KEY (groupWorkoutId, athleteUsername)
)
