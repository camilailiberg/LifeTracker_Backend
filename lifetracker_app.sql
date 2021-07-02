CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK(POSITION('@' IN email) > 1),
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


--! one to many: 
-- a user can have many single_slee_tracker data
CREATE TABLE single_sleep_tracker (
    id SERIAL PRIMARY KEY,
    bed_time TIMESTAMP NOT NULL,
    wake_up_time TIMESTAMP NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);