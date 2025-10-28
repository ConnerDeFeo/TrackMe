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

CREATE TABLE IF NOT EXISTS athlete_note_inputs(
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    note TEXT DEFAULT '',
    date VARCHAR(10) DEFAULT CURRENT_DATE,
    timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW athlete_inputs AS
SELECT 
    id,
    athleteId,
    distance,
    time,
    date,
    NULL AS restTime,
    NULL AS note,
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
    NULL AS note,
    timeStamp,
    'rest' AS type
FROM athlete_rest_inputs
UNION ALL
SELECT 
    id,
    athleteId,
    NULL AS distance,
    NULL AS time,
    date,
    NULL AS restTime,
    note,
    timeStamp,
    'note' AS type
FROM athlete_note_inputs;

CREATE INDEX idx_user_relations_userid_relationid
ON user_relations (userId, relationId);

-- Addition 10/28/2025
CREATE TABLE IF NOT EXISTS context_urls(
    id SERIAL PRIMARY KEY,
    coachId VARCHAR(255) REFERENCES users(userId) NOT NULL,
    contextUrl TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_DATE
);