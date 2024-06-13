const pool = require('../config/db');

const foodItem = {
    create: async (newFoodItem) => {
        const { userId, foodName, proteins, fats, carbs, calories, servinSizeGrams } = newFoodItem;
        const result = await pool.query(
            `INSERT INTO foodlist 
            (userid, foodname, protein, fats, carbs, calories, servingsizegrams) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [userId, foodName, proteins, fats, carbs, calories, servinSizeGrams]
        );
        return result.rows[0];
    }

    // delete: async (userId) => {
    //     const result = await pool.query(' DELETE FROM users WHERE userid = $1 RETURNING *', [userId]);
    //     return result.rowCount > 0; // true if a user gets deleted
    // }
};

module.exports = foodItem;