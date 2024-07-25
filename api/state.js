const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
const Report = require("../models/report");
const router = express.Router();  // This is a slight refactor for clarity
const jwt = require('jsonwebtoken');
const { report } = require("./data");
require('dotenv').config();

router.use(express.json());

router.get("/sessionValidation", async function(req, res) {

    const token = req.cookies.token;  // Extract the JWT from cookies directly

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (user) {
            const note = await Note.findOne({ userId: user._id });
            const report = await Report.findOne({ userId: user._id });
            return res.json({ // the only place where isLoggedIn = true matters
                user: user,
                note: note,
                report: report,
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
