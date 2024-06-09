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
    },

    delete: async (userId) => {
        const result = await pool.query(' DELETE FROM users WHERE userid = $1 RETURNING *', [userId]);
        return result.rowCount > 0; // true if a user gets deleted
    }
};

module.exports = User;