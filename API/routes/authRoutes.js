const express = require('express');
const { register, login, deleteUser } = require('../controllers/authController');
const router = express.Router();


router.get('/', (req, res) => {
    res.send("<h1>API works!</h1>");
});

// routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;