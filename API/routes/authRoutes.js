const express = require('express');
const { register, login, deleteUser, createFood, deleteFood } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/', (req, res) => {
    res.send("<h1>API works!</h1>");
});


/**
 * Routes
 */

// Group of routes for foods and food entries creation and deletion
router.post('/create/food', authMiddleware, createFood);
router.delete('/delete/food', authMiddleware, deleteFood);


// Group of routes for User creation and deletion
router.post('/register', register);
router.post('/login', login);
router.delete('/delete/user', authMiddleware, deleteUser);

module.exports = router;