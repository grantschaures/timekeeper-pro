const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
const Report = require("../models/report");
const Login = require("../models/login");
const router = require("express").Router();
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid'); // UUID library to generate unique session IDs
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

// telling the router to use the JSON parsing middleware for all routes under this router
router.use(express.json());

// Add a new User to the database
router.post("/validateUser", async function(req, res) {

    const email = req.body.user.email;
    const password = req.body.user.password;
    
    try {
        const user = await User.findOne({ email: email });
        if (user && bcrypt.compare(password, user.password)) {
            beginSession(user, res);
            console.log("User validated successfully");

        } else {
            // Authentication failed
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// router.post("/verifyPassword", async function(req, res) {
//     const { token, password } = req.body;
    
//     try {
//         // Find the user by token and ensure token has not expired
//         const user = await User.findOne({
//             token: token,
//             tokenExpire: { $gt: new Date() }
//         });

//         if (!user) {
//             return res.status(404).send("Token is invalid or has expired.");
//         }

//         // Hash the new password
//         const saltRounds = 10; //salt is a randomly generated value used to ensure uniqueness of each hash
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Update the user's password and clear the token fields
//         user.password = hashedPassword;
//         user.emailVerified = true;
//         user.token = undefined; // Invalidate the token
//         user.tokenExpire = undefined; // Clear the expiration

//         // Save the updated user
//         await user.save();

//         res.status(200).json({ message: "Password has been updated successfully." });

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("An error occurred while updating the password.");
//     }
// });

// const CLIENT_ID = process.env.CLIENT_ID;
// const client = new OAuth2Client(CLIENT_ID);

// // Google Sign-In Endpoint
// router.post("/verifyIdToken", async function(req, res) {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         console.log("/verifyIdToken endpoint has been reached");
//         const token = req.body.idToken;
//         const userAgent = req.body.userAgent;
//         const userDevice = req.body.userDevice;
//         const timeZone = req.body.userTimeZone;
//         const loginMethod = "Google";

//         // Google OAuth2 server verification of token
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: CLIENT_ID,
//         });
//         const payload = ticket.getPayload();
        
//         const email = payload.email; // Extracting email from payload
//         let user = await User.findOne({ email: email });

//         let loginDate = new Date();
//         let loginData = {
//             loginDate,
//             userAgent,
//             userDevice,
//             loginMethod,
//             timeZone
//         }


//         let newLogin;
//         if (user) {
//             user.googleAccountLinked = true; // should already be true anyway
//             user.logins++;
//             user.lastLogin = loginData;
//             await user.save({ session });

//             newLogin = new Login({
//                 userId: user._id,
//                 userEmail: user.email,
//                 ...loginData
//             })
//             await newLogin.save({ session });

//         } else {
//             // If no user exists, create a new one
//             user = new User({
//                 email: email,
//                 emailVerified: false,
//                 logins: 1,
//                 googleAccountLinked: true,
//                 lastLogin: loginData,
//                 signupDate: new Date(Date.now())
//                 // settings are added w/ default values based on defined schema
//             });
//             await user.save({ session });

//             newLogin = new Login({
//                 userId: user._id,
//                 userEmail: user.email,
//                 ...loginData
//             })
//             await newLogin.save({ session });

//             // Create the note document entry
//             let note = new Note({
//                 userId: user._id,
//                 userEmail: email,
//                 labels: new Map([
//                     ["tag-1", "✍️ Homework"],
//                     ["tag-2", "📚 Reading"],
//                     ["tag-3", "🧘 Meditation"]
//                 ]),
//                 lastLabelIdNum: 3,  // Default value
//                 lastSelectedEmojiId: "books-emoji"  // Default value
//             });
//             await note.save({ session });

//             // Create the report document entry
//             const report = new Report({
//                 userId: user._id,
//                 userEmail: email,
//                 sessionCount: 0
//             })
//             await report.save({ session });
//         }

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();
        
//         beginSession(user, res);

//     } catch (error) {
//         // Abort the transaction only if it hasn't been committed
//         if (session.inTransaction()) {
//             await session.abortTransaction();
//         }
        
//         res.status(400).json({ error: 'Invalid ID token' });
//         console.error('Error during ID token verification:', error);

//     } finally {
//         // Ensure session is ended
//         session.endSession();
//     }
// });

// This function sends the JWT to the client browser
function beginSession(user, res) {
    const SECRET_KEY = process.env.SECRET_KEY;

    // Create a JWT payload
    const payload = {
        userId: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Expires 24 hours from now
    };

    // Generate a JWT token
    const token = jwt.sign(payload, SECRET_KEY);

    // Send the JWT token in the JSON response
    res.json({
        message: 'Login successful',
        loginSuccess: true,
        token: token, // Include the JWT here
        email: user.email
    });
}

module.exports = router;