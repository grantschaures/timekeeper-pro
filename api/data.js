const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
const Report = require("../models/report");
const Login = require("../models/login");
const NotesEntry = require("../models/notes-entries");
const DeletedAccount = require("../models/deleted-account");
const { Session } = require("../models/session");
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware for parsing JSON bodies
router.use(express.json());

// Middleware for checking and renewing the token (also checks if session token/ cookie has expired)
router.use(checkAndRenewToken);

// CONSTANTS
MAX_ITEMS_SESSION_START_TIME_ARR = 5; // can reduce if necessary

router.post("/update-session-summary-data", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { sessionId, summaryData } = req.body;
    // console.log(req.body);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ 
                message: "User not found"
            });
        }

        // Find the session associated with the user
        const session = await Session.findById(sessionId);

        if (summaryData.type === 'comments') {
            // update comments
            session.sessionSummary.comments = summaryData.value;
        } else if (summaryData.type === 'subjectiveFeedback') {
            // update subjective feedback rating
            session.sessionSummary.subjectiveFeedback = summaryData.value;
        }

        await session.save();

        // READING FROM DB
        const note = await Note.findOne({ userId: user._id });
        const sessions = await Session.find({ userId: user._id });
        const notesEntries = await NotesEntry.find({ userId: user._id});

        let noteSessionData = {
            note: note,
            sessions: sessions,
            notesEntries: notesEntries
        }

        res.json({ message: "Session summary data updated successfully", noteSessionData });

    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});


router.delete("/delete-session", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { sessionId } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the session to be deleted
        const sessionToBeDeleted = await Session.findById(sessionId);
        if (!sessionToBeDeleted) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Find or create a report for the user
        let report = await Report.findOne({ userId: user._id });
        if (!report) {
            report = new Report({ userId: user._id, userEmail: user.email, sessionCount: 0, deletedSessions: [] });
        }

        // Add the session to the deletedSessions array in the report
        report.deletedSessions.push(sessionToBeDeleted);
        await report.save();

        // Delete the session document
        await Session.findByIdAndDelete(sessionId);

        // READING FROM DB
        const note = await Note.findOne({ userId: user._id });
        const sessions = await Session.find({ userId: user._id });
        const notesEntries = await NotesEntry.find({ userId: user._id});

        let noteSessionData = {
            note: note,
            sessions: sessions,
            notesEntries: notesEntries
        }

        res.json({ noteSessionData, success: true, message: 'Session deleted successfully' });
        
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/update-notes-entry", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { notesObj } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Token was not found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {

            
            const notesEntry = await NotesEntry.findOne({ 
                userId: user._id,         // Ensure the note belongs to the specific user
                'entry.id': notesObj.id   // Ensure the note has the correct entry ID
            });
            console.log(notesEntry);
            
            if (notesEntry) {
                notesEntry.entry = notesObj;
                console.log(notesObj)
                await notesEntry.save();

            } else { // this shouldn't happen normally, but if for some reason the note entry isn't already present in Notes-Entries
                const newNotesEntry = new NotesEntry({
                    userId: user._id,
                    userEmail: user.email,
                    entry: notesObj
                });
                await newNotesEntry.save();
            }

            // READING FROM DB
            const note = await Note.findOne({ userId: user._id });
            const sessions = await Session.find({ userId: user._id });
            const notesEntries = await NotesEntry.find({ userId: user._id});
 
            let noteSessionData = {
                note: note,
                sessions: sessions,
                notesEntries: notesEntries
            }

            res.json({ noteSessionData, success: true, message: 'update-notes-entry endpoint reached successfully'});
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/add-notes-entry", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { notesObj } = req.body;
    // console.log(notesObj);

    if (!token) {
        return res.status(401).json({ message: "Token was not found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {
            
            const newNotesEntry = new NotesEntry({
                userId: user._id,
                userEmail: user.email,
                entry: notesObj
            });
            
            await newNotesEntry.save();

            // READING FROM DB
            const note = await Note.findOne({ userId: user._id });
            const sessions = await Session.find({ userId: user._id });
            const notesEntries = await NotesEntry.find({ userId: user._id});

            let noteSessionData = {
                note: note,
                sessions: sessions,
                notesEntries: notesEntries
            }

            res.json({ noteSessionData, success: true, message: 'add-notes-entry endpoint reached successfully'});
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/update-session-summary", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { userComments, sessionRating, sessionId } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Token was not found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        const user = await User.findById(userId);

        if (user) {

            // WRITING TO DB
            const report = await Report.findOne({ userId: user._id });
            if (!report) {
                return res.status(404).json({
                    message: "Report not found"
                });
            }

            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).json({
                    message: "Session not found"
                });
            }
            
            // Update the session summary
            session.sessionSummary.comments = userComments;
            session.sessionSummary.subjectiveFeedback = sessionRating;
            
            // Update latest session (if latest session still corresponds w/ sessionId, which may not always be the case)
            const lastSession = report.lastSession;
            if (lastSession.id === sessionId) {
                lastSession.sessionSummary.comments = userComments;
                lastSession.sessionSummary.subjectiveFeedback = sessionRating;
            }

            await report.save();
            await session.save();

            // READING FROM DB
            const note = await Note.findOne({ userId: user._id });
            if (!note) {
                return res.status(404).json({
                    message: "Note not found"
                });
            }

            const sessions = await Session.find({ userId: user._id });
            if (sessions.length === 0) {
                return res.status(404).json({
                    message: "No sessions found"
                });
            }

            const notesEntries = await NotesEntry.find({ userId: user._id});

            let noteSessionData = {
                note: note,
                sessions: sessions,
                notesEntries: notesEntries
            }
            
            res.json({ noteSessionData, success: true, message: 'update-session-summary endpoint reached successfully'});

        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

// update report and add session to Sessions collection
router.post("/update-report", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { session } = req.body;
    // console.log(session);

    if (!token) {
        return res.status(401).json({ message: "Token was not found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        // console.log("update-report endpoint: " + Date.now());

        if (user) {
            // update user
            user.sessionRunning = false;
            user.lastActivity = session.endTime;
            
            // update report
            const report = await Report.findOne({ userId: user._id });
            if (!report) {
                return res.status(404).json({
                    message: "Report not found"
                });
            }
            report.sessionCount++;
            
            // update session
            const newSession = new Session({
                userId: user._id,
                userEmail: user.email,
                ...session
            });
            report.lastSession = newSession;
            
            await user.save();
            await report.save();
            await newSession.save();

            res.json({ success: true, message: 'update-report endpoint reached successfully', sessionId: newSession._id });
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/update-invaliDate", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { invaliDate } = req.body;
    let sessionStartDate = new Date(invaliDate);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {
            user.invaliDate = sessionStartDate;
            await user.save();

            res.json({ success: true, message: 'update-invaliDate endpoint reached successfully' });
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/check-invaliDate", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { sessionStartTime } = req.body;
    let sessionStartDate = new Date(sessionStartTime);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        
        let invaliDate = user.invaliDate;

        let sessionStartTimeArr = user.sessionStartTimeArr;
        let targetDate = new Date(sessionStartDate);
        const index = sessionStartTimeArr.findIndex(dateString => new Date(dateString).getTime() === targetDate.getTime());
        // console.log(index);

        let raceCondition;
        if (index !== -1 && sessionStartTimeArr[index + 1] && (new Date(sessionStartTimeArr[index + 1]).getTime() - new Date(sessionStartTimeArr[index]).getTime() < 1000)) {
            raceCondition = true;
        } else {
            raceCondition = false;
        }

        let logAction;
        if ((sessionStartDate < invaliDate) || (raceCondition)) {
            logAction = false;
        } else {
            logAction = true;
        }

        if (user) {
            res.json({ logSession: logAction, success: true, message: 'check-invaliDate endpoint reached successfully' });
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/check-session", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {
            res.json({ sessionStatus: user.sessionRunning, success: true, message: 'check-session endpoint reached successfully' });
        } else {
            return res.status(404).json({
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.delete("/delete-account", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {
            // Add new entry to Deleted-Account Collection
            const newDeletedAccount = new DeletedAccount({
                userId: user._id,
                userEmail: user.email,
                deletionDate: new Date(Date.now())
            });
            await newDeletedAccount.save();

            // Delete the user document
            await User.findByIdAndDelete(userId);

            // Delete the corresponding note
            await Note.findOneAndDelete({ userId: userId });

            // Delete the corresponding report
            await Report.findOneAndDelete({ userId: userId });

            // Delete all corresponding sessions
            const sessions = await Session.find({ userId: userId });
            if (sessions.length > 0) {
                await Session.deleteMany({ userId: userId });
            }

            // Delete all corresponding logins
            const logins = await Login.find({ userId: userId });
            if (logins.length > 0) {
                await Login.deleteMany({ userId: userId });
            }

            res.json({ success: true, message: 'delete-account endpoint reached successfully' });
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

// proxy for most recent use of the app
router.post("/last-interval-switch", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { intervalSwitchCount, sessionStartTime } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (user) {
            let currentUTCDate = new Date();

            user.lastIntervalSwitch = currentUTCDate;
            user.lastActivity = currentUTCDate;

            if (intervalSwitchCount === 1) {
                user.sessionRunning = true;
                user.sessionStartTimeArr.push({ startTime: new Date(sessionStartTime) });

                // Trim the array to the last 100 items
                if (user.sessionStartTimeArr.length > MAX_ITEMS_SESSION_START_TIME_ARR) {
                    user.sessionStartTimeArr = user.sessionStartTimeArr.slice(-MAX_ITEMS_SESSION_START_TIME_ARR);
                }
            }

            await user.save();
            res.json({ success: true, message: 'User last interval switch time logged' });

        } else {
            return res.status(404).json({
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/update-showing-time-left", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { showingTimeLeft } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);
        let currentUTCDate = new Date();

        if (user) {
            user.showingTimeLeft = showingTimeLeft;
            user.lastActivity = currentUTCDate;
            await user.save();

            res.json({ success: true, message: 'Target Hours updated successfully' });
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/update-target-hours", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { targetHours } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);
        let currentUTCDate = new Date();

        if (user) {
            if (targetHours === 0) {
                user.targetHours = undefined;
            } else {
                user.targetHours = targetHours;
            }
            user.lastActivity = currentUTCDate;

            await user.save();
            res.json({ success: true, message: 'Target Hours updated successfully' });
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/update-settings", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { settings } = req.body;
    console.log(settings);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);
        let currentUTCDate = new Date();

        if (user) {
            // Use dot notation to update nested fields
            for (const [section, settingsObject] of Object.entries(settings)) {
                for (const [key, value] of Object.entries(settingsObject)) {
                    user.settings[section][key] = value;
                }
            }

            user.lastActivity = currentUTCDate;
            await user.save();

            res.json({ success: true, message: 'Settings updated successfully' });
        } else {
            return res.status(404).json({ 
                message: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/update-deleted-labels", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { deletedLabel } = req.body;
    console.log(deletedLabel);


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ 
                message: "User not found"
            });
        }

        // Find the note associated with the user
        const note = await Note.findOne({ userId: user._id });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        // Update the deleted labels object
        if (!note.deletedLabels) {
            note.deletedLabels = new Map();
        }

        for (const [key, value] of Object.entries(deletedLabel)) {
            note.deletedLabels.set(key, value);
        }
        await note.save();

        return res.json({
            message: "Labels updated successfully",
            note: note
        });
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
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

    let currentUTCDate = new Date();

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ 
                message: "User not found"
            });
        }

        // Find the note associated with the user
        const note = await Note.findOne({ userId: user._id });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        // Update the labels object
        note.labels = labelDict;
        note.selectedLabels = selectedLabelDict;
        note.lastLabelIdNum = lastLabelIdNum;
        note.lastSelectedEmojiId = lastSelectedEmojiId;

        user.lastActivity = currentUTCDate;
        // console.log(labels);

        // Save the updated note
        await note.save();

        // save the updated user
        await user.save();

        // READING FROM DB
        const sessions = await Session.find({ userId: user._id });

        const notesEntries = await NotesEntry.find({ userId: user._id});

        let noteSessionData = {
            note: note,
            sessions: sessions,
            notesEntries: notesEntries
        }


        res.json({ message: "Labels updated successfully", noteSessionData });

    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
});

router.post("/update-notes", async function(req, res) {
    // Assuming the JWT is sent automatically in cookie headers
    const token = req.cookies.token;  // Extract the JWT from cookies directly
    const { notesObj } = req.body;

    let currentUTCDate = new Date();

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ 
                message: "User not found"
            });
        }

        // Find the note associated with the user
        const note = await Note.findOne({ userId: user._id });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        // Update the labels object
        note.noteTasks = notesObj.notesArr;
        note.lastTaskInputIdNum = notesObj.lastTaskInputIdNum;

        user.lastActivity = currentUTCDate;

        // Save the updated note
        await note.save();

        await user.save();

        return res.json({
            message: "Labels updated successfully",
            note: note
        });
    } catch (error) {
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
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
        return res.status(420).json({ message: "Your session has expired, please log in again." });
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
        return res.status(500).json({
            message: "The server was unable to process the request: " + error.message
        });
    }
}