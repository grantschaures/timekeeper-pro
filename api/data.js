const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
const router = express.Router();  // This is a slight refactor for clarity
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware for parsing JSON bodies
router.use(express.json());

// Middleware for checking and renewing the token
router.use(checkAndRenewToken);

router.delete("/delete-account", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {
            // Delete the user document
            await User.findByIdAndDelete(userId);

            // Delete the corresponding note
            await Note.findOneAndDelete({ userId: userId });

            res.json({ success: true, message: 'delete-account endpoint reached successfully' });
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

// proxy for most recent use of the app
router.post("/last-interval-switch", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {
            let currentUTCDate = new Date();

            user.lastIntervalSwitch = currentUTCDate;

            await user.save();
            res.json({ success: true, message: 'User last interval switch time logged' });

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

router.post("/session-completion", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { userTimeZone } = req.body;

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {
            let currentUTCDate = new Date();

            // TESTING
            // let testDateStr = '2024-07-06T23:12:27.354Z';
            // currentUTCDate = new Date(testDateStr);
            // TESTING

            user.sessionCompletionTimeArr.push({
                timeZone: userTimeZone,
                sessionCompletionDateUTC: currentUTCDate
            });

            await user.save();
            res.json({ success: true, message: 'User activity time logged' });

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

router.post("/update-showing-time-left", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { showingTimeLeft } = req.body;

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (user) {
            user.showingTimeLeft = showingTimeLeft;
            await user.save();
            res.json({ success: true, message: 'Target Hours updated successfully' });
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

router.post("/update-target-hours", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { targetHours } = req.body;

    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (user) {
            if (targetHours === 0) {
                user.targetHours = undefined;
            } else {
                user.targetHours = targetHours;
            }
            await user.save();
            res.json({ success: true, message: 'Target Hours updated successfully' });
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

router.post("/update-settings", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { settings } = req.body;
    console.log(settings);

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
    // console.log(req.body);

    const labelDict = labelArr[0];
    const selectedLabelDict = labelArr[1];
    const lastLabelIdNum = labelArr[2];
    const lastSelectedEmojiId = labelArr[3];

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
        note.selectedLabels = selectedLabelDict;
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

// -----------------
// HELPER FUNCTIONS
// -----------------

function checkAndRenewToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ isLoggedIn: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if the token is expiring in less than 24 hours
        if (decoded.exp - currentTime < 24 * 60 * 60) {
            // Create a new token with extended expiration
            const newPayload = {
                userId: decoded.userId,
                iat: currentTime,
                exp: currentTime + (24 * 60 * 60) // 24 hours from now
            };
            const newToken = jwt.sign(newPayload, process.env.SECRET_KEY);

            // Set the new token in an HttpOnly cookie
            res.cookie('token', newToken, {
                httpOnly: true,
                secure: true, // Ensure this is set to true in production if using HTTPS
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
            });

            // Add the new token to the response body (optional)
            res.locals.newToken = newToken;
        }

        // Attach the decoded token to the request object for further processing
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            isLoggedIn: false,
            message: "Session is not valid: " + error.message
        });
    }
}