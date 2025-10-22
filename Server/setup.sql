CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    accountType VARCHAR(10) CHECK (accountType IN ('Coach', 'Athlete')),
    bio TEXT,
    firstName VARCHAR(255),
    lastName VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_relations(
    userId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    relationId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    UNIQUE (userId, relationId)
);

CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    dateCreated VARCHAR(10) DEFAULT CURRENT_DATE,
    coachId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    UNIQUE (name, coachId)
);

CREATE TABLE IF NOT EXISTS athlete_groups (
    athleteId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    groupId INT REFERENCES groups(id) NOT NULL,
    PRIMARY KEY (athleteId, groupId),
    removed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS workouts(
    id SERIAL PRIMARY KEY,
    coachId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    sections JSONB,
    isTemplate BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS group_workouts (
    id SERIAL PRIMARY KEY,
    groupId INT REFERENCES groups(id) NOT NULL,
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    workoutId INT REFERENCES workouts(id) NOT NULL,
    UNIQUE (groupId, workoutId, date)
);

CREATE TABLE IF NOT EXISTS athlete_time_inputs(
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    distance INT DEFAULT 0,
    time FLOAT DEFAULT 0,
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS athlete_rest_inputs(
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    restTime INT DEFAULT 0,
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS section_templates(
    id SERIAL PRIMARY KEY,
    coachId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    name VARCHAR(50) NOT NULL,
    minSets INT DEFAULT 1,
    maxSets INT,
    exercises JSONB,
    UNIQUE (coachId, name)
);

CREATE OR REPLACE VIEW athlete_inputs AS
SELECT 
    id,
    athleteId,
    distance,
    time,
    date,
    NULL AS restTime,
    timeStamp,
    'run' AS type
FROM athlete_time_inputs
UNION ALL
SELECT 
    id,
    athleteId,
    NULL AS distance,
    NULL AS time,
    date,
    restTime,
    timeStamp,
    'rest' AS type
FROM athlete_rest_inputs;

CREATE INDEX idx_user_relations_userid_relationid
ON user_relations (userId, relationId);