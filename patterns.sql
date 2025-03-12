CREATE TABLE users (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text,
    name text,
    pswhash text
);

CREATE TABLE patterns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    materials TEXT NOT NULL,
    instructions TEXT NOT NULL
);

