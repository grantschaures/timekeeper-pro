const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
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

router.post("/update-labels", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { labelArr } = req.body;
    console.log(req.body);

    const labelDict = labelArr[0];
    const lastLabelIdNum = labelArr[1];
    const lastSelectedEmojiId = labelArr[2];

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ 
                isLoggedIn: false,
                message: "User not found"
            });
        }

        // Find the note associated with the user
        const note = await Note.findOne({ userId: user._id });

        if (!note) {
            return res.status(404).json({
                isLoggedIn: true,
                message: "Note not found"
            });
        }

        // Update the labels object
        note.labels = labelDict;
        note.lastLabelIdNum = lastLabelIdNum;
        note.lastSelectedEmojiId = lastSelectedEmojiId;
        // console.log(labels);

        // Save the updated note
        await note.save();

        return res.json({
            isLoggedIn: true,
            message: "Labels updated successfully",
            note: note
        });
    } catch (error) {
        return res.status(401).json({
            isLoggedIn: false,
            message: "Session is not valid: " + error.message
        });
    }
});

router.post("/update-notes", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { notesObj } = req.body;

    console.log(notesObj);

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ 
                isLoggedIn: false,
                message: "User not found"
            });
        }

        // Find the note associated with the user
        const note = await Note.findOne({ userId: user._id });

        if (!note) {
            return res.status(404).json({
                isLoggedIn: true,
                message: "Note not found"
            });
        }

        // Update the labels object
        note.noteTasks = notesObj.notesArr;
        note.lastTaskInputIdNum = notesObj.lastTaskInputIdNum;

        // Save the updated note
        await note.save();

        return res.json({
            isLoggedIn: true,
            message: "Labels updated successfully",
            note: note
        });
    } catch (error) {
        return res.status(401).json({
            isLoggedIn: false,
            message: "Session is not valid: " + error.message
        });
    }
});

module.exports = router;