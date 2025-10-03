--User and user relation related tables--
CREATE TABLE IF NOT EXISTS coaches (
    userId VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    gender VARCHAR(10),
    profilePictureUrl VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS athletes (
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

CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    dateCreated VARCHAR(10) DEFAULT CURRENT_DATE,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    UNIQUE (name, coachId)
);

CREATE TABLE IF NOT EXISTS athlete_groups (
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    groupId INT REFERENCES groups(id) NOT NULL,
    PRIMARY KEY (athleteId, groupId),
    removed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS athlete_coaches (
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    UNIQUE (athleteId, coachId)
);

-- Coaches requesting athletes to be coached by them
CREATE TABLE IF NOT EXISTS athlete_coach_invites (
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    UNIQUE (athleteId, coachId)
);

-- Athletes requesting to be coached by a coach (reverse of above table)
CREATE TABLE IF NOT EXISTS athlete_coach_requests (
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
    UNIQUE (athleteId, coachId)
);

CREATE TABLE IF NOT EXISTS workouts(
    id SERIAL PRIMARY KEY,
    coachId VARCHAR(255) REFERENCES coaches(userId) NOT NULL,
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

CREATE TABLE IF NOT EXISTS athlete_inputs(
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    groupId INT REFERENCES groups(id) NOT NULL,
    distance INT DEFAULT 0,
    time FLOAT DEFAULT 0,
    date VARCHAR(10) DEFAULT CURRENT_DATE
);


-- Addition 10/02/2025, athlete rest inputs with timestamp tracking
ALTER TABLE athlete_inputs RENAME TO athlete_time_inputs;
ALTER TABLE athlete_time_inputs ADD COLUMN IF NOT EXISTS timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS athlete_rest_inputs(
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId) NOT NULL,
    groupId INT REFERENCES groups(id) NOT NULL,
    restTime INT DEFAULT 0,
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW athlete_inputs AS
SELECT 
    id,
    athleteId,
    groupId,
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
    groupId,
    NULL AS distance,
    NULL AS time,
    date,
    restTime,
    timeStamp,
    'rest' AS type
FROM athlete_rest_inputs;
