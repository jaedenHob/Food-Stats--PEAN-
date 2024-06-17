const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Food = require('../models/FoodList');

const register = async (req, res) => {
    const { username, email, password, dateofbirth, gender, heightininches, weightinpounds, goalweight } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // create salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
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
            return res.status(400).json({ message: 'Invalid email or email not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is incorrect'});
        }

        const token = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, { expiresIn: '30m' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.userId;
        const result = await User.delete(userId);

        if (result) {
            res.status(200).json({ message: 'User has been successfully deleted' });
        } 
        else {
            res.status(404).json({ message: 'User  does not exist' });
        }
    } catch (error) {
        console.error('Error deleting user: ', userId);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createFood = async (req, res) => {
    try {
        const userId = req.userId;

        const { foodName, proteins, fats, carbs, calories, servinSizeGrams} = req.body;

        const newFoodItem = {
            userId,
            foodName,
            proteins,
            fats,
            carbs,
            calories,
            servinSizeGrams
        };
        
        const result = await Food.create(newFoodItem);

        if (result) {
            res.status(201).json(result);
        } else {
            res.status(404).json({message: 'Error Error Error'});
        }

    } catch (error) {
        console.error('Error creating food: ', userId);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteFood = async (req, res) => {
    try {
        const userId = req.userId;
        const { id: foodId } = req.body;

        console.log(foodId);

        const result = await Food.delete(foodId);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'food not found' });
        }
    
    } catch (error) {
        console.error('Error deleting food: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { register, login, deleteUser, createFood, deleteFood };