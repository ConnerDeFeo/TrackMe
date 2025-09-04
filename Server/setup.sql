DROP TABLE IF EXISTS athlete_inputs CASCADE;
DROP TABLE IF EXISTS group_workouts CASCADE;
DROP TABLE IF EXISTS athlete_coach_invites CASCADE;
DROP TABLE IF EXISTS athlete_coach_requests CASCADE;
DROP TABLE IF EXISTS athlete_coaches CASCADE;
DROP TABLE IF EXISTS athlete_groups CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS athletes CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;

--User and user relation related tables--
CREATE TABLE coaches (
    userId VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    gender VARCHAR(10),
    profilePictureUrl VARCHAR(255)
);

CREATE TABLE athletes (
    userId VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    gender VARCHAR(10),
    profilePictureUrl VARCHAR(255),
    bodyWeight INT,
    tffrsUrl VARCHAR(255)
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
    PRIMARY KEY (athleteId, groupId),
    removed BOOLEAN DEFAULT FALSE
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

CREATE TABLE athlete_coach_requests (
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    UNIQUE (athleteId, coachId)
);

CREATE TABLE workouts(
    id SERIAL PRIMARY KEY,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    exercises JSONB,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE group_workouts (
    id SERIAL PRIMARY KEY,
    groupId INT REFERENCES groups(id) NOT NULL,
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    workoutId INT REFERENCES workouts(id) NOT NULL,
    UNIQUE (groupId, date, workoutId)
);

CREATE TABLE athlete_inputs(
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    groupId INT REFERENCES groups(id) NOT NULL,
    distance INT DEFAULT 0,
    time FLOAT DEFAULT 0,
    date VARCHAR(10) DEFAULT CURRENT_DATE
);

