CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    pswhash TEXT NOT NULL
);


CREATE TABLE patterns (
    id SERIAL PRIMARY KEY,        
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  
    name VARCHAR(255) NOT NULL,  
    difficulty VARCHAR(50) NOT NULL, 
    materials TEXT NOT NULL,      
    instructions TEXT NOT NULL   
);