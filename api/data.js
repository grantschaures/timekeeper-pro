const express = require("express");
const User = require("../models/user");
const router = express.Router();  // This is a slight refactor for clarity
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.use(express.json());

router.post("/update-settings", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { settings } = req.body;

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (user) {
            // Use dot notation to update nested fields
            for (const [section, settingsObject] of Object.entries(settings)) {
                for (const [key, value] of Object.entries(settingsObject)) {
                    user.settings[section][key] = value;
                }
            }

            await user.save();
            res.json({ success: true, message: 'Settings updated successfully' });
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

// function updateUserSettings() {

// }

module.exports = router;
