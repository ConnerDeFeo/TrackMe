DROP TABLE IF EXISTS coaches CASCADE;
DROP TABLE IF EXISTS athletes CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS athlete_groups CASCADE;
DROP TABLE IF EXISTS athlete_group_invites CASCADE;

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

--Workout related tables--

CREATE TABLE workout_inputs(
    id SERIAL PRIMARY KEY,
    athleteId VARCHAR(255) REFERENCES athletes(userId),
    distance FLOAT NOT NULL,
    time FLOAT NOT NULL,
    date VARCHAR(10) DEFAULT CURRENT_DATE
);

CREATE TABLE workouts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
);

CREATE TABLE group_workouts(
    groupId INT REFERENCES groups(id),
    workoutId INT REFERENCES workouts(id),
    PRIMARY KEY (groupId, workoutId),
    date VARCHAR(10) DEFAULT CURRENT_DATE
);

CREATE TABLE excersies (
    id SERIAL PRIMARY KEY,
    notes VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    sets INT DEFAULT 1 NOT NULL,
    reps INT DEFAULT 1 NOT NULL
);

CREATE TABLE excersies_parts(
    id SERIAL PRIMARY KEY,
    distance FLOAT NOT NULL,
    measurement VARCHAR(50) NOT NULL
);

CREATE TABLE workout_excersies(
    workoutId INT REFERENCES workouts(id),
    excersiesId INT REFERENCES excersies(id),
    PRIMARY KEY (workoutId, excersiesId)
);
