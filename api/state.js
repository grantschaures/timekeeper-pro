const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
const Report = require("../models/report");
const NotesEntry = require("../models/notes-entries");
const { Session } = require("../models/session");
const router = express.Router();  // This is a slight refactor for clarity
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.use(express.json());

router.get("/sessionValidation", async function(req, res) {

    const token = req.cookies.token;  // Extract the JWT from cookies directly

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        console.log("Endpoint 1 reached")
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // const user = await User.findById(decoded.userId);
        const user = await User.findById('66aebd43e9e0ce6eb2786d0e');

        if (user) {
            console.log("Endpoint 2 reached")
            const note = await Note.findOne({ userId: user._id });
            const report = await Report.findOne({ userId: user._id });
            const sessions = await Session.find({ userId: user._id });
            const notesEntries = await NotesEntry.find({ userId: user._id});
            
            return res.json({ // the only place where isLoggedIn = true matters
                user: user,
                note: note,
                report: report,
                sessions: sessions,
                notesEntries: notesEntries,
                isLoggedIn: true
            });
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(401).json({
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
