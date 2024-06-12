-- create table for users
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dateofbirth DATE,
    gender CHAR(1),
    heightininches INT,
    weightinpounds DECIMAL(5, 2),
    goalweight DECIMAL(5, 2),
    goalcalories INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- create a table to have a list of foods
CREATE TABLE foodList (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    foodName VARCHAR(255) NOT NULL,
    protein FLOAT NOT NULL,
    fats FLOAT NOT NULL,
    carbs FLOAT NOT NULL,
    calories FLOAT NOT NULL,
    servingSizeGrams FLOAT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userid) ON DELETE CASCADE
);

-- create a table for daily food entries
CREATE TABLE foodEntries (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    foodName VARCHAR(255) NOT NULL,
    totalServingsInGrams FLOAT NOT NULL,
    totalProtein FLOAT NOT NULL,
    totalFats FLOAT NOT NULL,
    totalCarbs FLOAT NOT NULL,
    totalCalories FLOAT NOT NULL,
    entryDate DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userid) ON DELETE CASCADE
);
