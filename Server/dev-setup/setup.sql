DROP TABLE IF EXISTS coaches CASCADE;
DROP TABLE IF EXISTS athletes CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS athlete_groups CASCADE;

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