const express = require('express');
const { register, login, deleteUser } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/', (req, res) => {
    res.send("<h1>API works!</h1>");
});

// routes
router.post('/register', register);
router.post('/login', login);
router.delete('/delete/user/:id', deleteUser);

module.exports = router;