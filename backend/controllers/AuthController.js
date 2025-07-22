const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User'); // Assuming you have a User model defined

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const userModel = new UserModel({ username, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201).json({ message: 'User registered successfully', user: { username } });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const login = async (req, res) => {
    try {
        // Simulate user registration logic
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: 'Authentication Failed! Email or Password is wrong' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Authentication Failed! Email or Password is wrong' });
        }
        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        res.status(200).json(
            { 
                message: 'Login successful',
                token: jwtToken 
            }
        );
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


module.exports = {
    signup, 
    login
};