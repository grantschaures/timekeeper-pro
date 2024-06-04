const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
const router = express.Router();  // This is a slight refactor for clarity
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.use(express.json());

router.post("/sessionValidation", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (user) {
            const note = await Note.findOne({ userId: user._id });
            return res.json({ 
                user: user,
                note: note,
                isLoggedIn: true
            });
        } else {
            return res.status(401).json({ 
                isLoggedIn: false,
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(401).json({
            isLoggedIn: false,
            message: "Session is not valid: " + error.message
        });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', { // Overwrite the token cookie
        httpOnly: true,
        expires: new Date(0) // Set an expiration date in the past
    });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
