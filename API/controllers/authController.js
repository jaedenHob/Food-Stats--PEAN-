const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    const { username, email, password, dateofbirth, gender, heightininches, weightinpounds, goalweight } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, dateofbirth, gender, heightininches, weightinpounds, goalweight });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: req.body });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await User.delete(userId);

        if (result) {
            res.status(200).json({ message: 'User has been successfully deleted' });
        } 
        else {
            res.status(404).json({ message: 'User  does not exist' });
        }
    } catch (error) {
        console.error('Error deleting user: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { register, login, deleteUser };