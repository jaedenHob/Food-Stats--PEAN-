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
    },

    delete: async (foodId) => {
        const result = await pool.query(' DELETE FROM foodlist WHERE id = $1 RETURNING *', [foodId]);
        return result.rowCount > 0; // true if a food gets deleted
    }
};

module.exports = foodItem;