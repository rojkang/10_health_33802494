-- DROP TABLES IF THEY EXIST
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS users;

-- USERS TABLE 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- REHAB EXERCISE LIBRARY
CREATE TABLE IF NOT EXISTS exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    body_part VARCHAR(50) NOT NULL, 
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    instructions TEXT NOT NULL
);

-- PROGRESS LOGS 
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    log_date DATE NOT NULL,
    pain_level INT NOT NULL, 
    notes TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
