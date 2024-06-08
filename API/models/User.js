const pool = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const result = await pool.query('select * from users where email = $1', [email]);
        return result.rows[0];
    },
    create: async (user) => {
        const { username, email, password, dateofbirth, gender, heightininches, weightinpounds, goalweight } = user;
        const result = await pool.query(
            `INSERT INTO users 
            (username, email, password, dateofbirth, gender, heightininches, weightinpounds, goalweight) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [username, email, password, dateofbirth, gender, heightininches, weightinpounds, goalweight]
        );
        return result.rows[0];
    }
};

module.exports = User;