const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
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

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 5, // Limit each user to 5 requests per windowMs
    message: 'You have exceeded your max number of login attempts, please try again after 15 minutes',
    keyGenerator: (req, res) => {
        // Use username or user ID from request body to identify the user
        return req.body.email; // Ensure the username is unique
    },
    skipSuccessfulRequests: false, // Optional: only count failed login attempts
    handler: (req, res) => {
        console.log(`Rate limit exceeded for user: ${req.body.email}`);
        res.status(429).json({ message: 'You have exceeded your max number of login attempts, please try again after 15 minutes' });
    }
});

// Add a new User to the database
router.post("/validateUser", loginLimiter, async function(req, res) {

    // const { email, password } = req.body;
    const email = req.body.user.email;
    const password = req.body.user.password;
    const userAgent = req.body.userAgent;
    const userDevice = req.body.userDevice;
    const loginMethod = "Email";

    let loginDate = new Date();
    let loginData = {
        loginDate,
        userAgent,
        userDevice,
        loginMethod
    }

    try {
        const user = await User.findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) {
            user.logins++;
            user.loginTimeArr.push(loginData);
            user.lastLogin = loginData;
            user.save();

            beginSession(user, res);
        } else {
            // Authentication failed
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/verifyPassword", async function(req, res) {
    const { token, password } = req.body;
    
    try {
        // Find the user by token and ensure token has not expired
        const user = await User.findOne({
            token: token,
            tokenExpire: { $gt: new Date() }
        });

        if (!user) {
            return res.status(404).send("Token is invalid or has expired.");
        }

        // Hash the new password
        const saltRounds = 10; //salt is a randomly generated value used to ensure uniqueness of each hash
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update the user's password and clear the token fields
        user.password = hashedPassword;
        user.emailVerified = true;
        user.token = undefined; // Invalidate the token
        user.tokenExpire = undefined; // Clear the expiration

        // Save the updated user
        await user.save();

        res.status(200).json({ message: "Password has been updated successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while updating the password.");
    }
});

const CLIENT_ID = '234799271389-bk46do1l3pnvci922g3dmmf5cc8cfpfb.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

router.post("/verifyIdToken", async function(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("/verifyIdToken endpoint has been reached")
        const token = req.body.idToken;
        const userAgent = req.body.userAgent;
        const userDevice = req.body.userDevice;
        const loginMethod = "Google";

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        const email = payload.email; // Extracting email from payload
        let user = await User.findOne({ email: email });

        let note;

        let loginDate = new Date();
        let loginData = {
            loginDate,
            userAgent,
            userDevice,
            loginMethod
        }

        if (user) {
            user.googleAccountLinked = true;
            user.logins++;
            user.loginTimeArr.push(loginData);
            user.lastLogin = loginData;
            await user.save({ session });
        } else {
            // If no user exists, create a new one
            user = new User({
                email: email,
                emailVerified: false,
                logins: 1,
                googleAccountLinked: true,
                loginTimeArr: [loginData],
                lastLogin: loginData
                // settings are added w/ default values based on defined schema
            });
            await user.save({ session });

            // Create the note document entry
            note = new Note({
                userId: user._id,
                labels: new Map([
                    ["tag-1", "✍️ Homework"],
                    ["tag-2", "📚 Reading"],
                    ["tag-3", "🧘 Meditation"]
                ]),
                lastLabelIdNum: 3,  // Default value
                lastSelectedEmojiId: "books-emoji"  // Default value
            });
            await note.save({ session });
            console.log('Note saved for user.');
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        
        beginSession(user, res);

    } catch (error) {
        // Abort the transaction in case of an error
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({ error: 'Invalid ID token' });
        console.error('Error during ID token verification:', error);
    } finally {
        // Ensure session is ended
        if (session.inTransaction()) {
            await session.endSession();
        }
    }
});

function beginSession(user, res) {
    const SECRET_KEY = process.env.SECRET_KEY;
    
    // Create a JWT payload
    const payload = {
        userId: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // expires 24 hours from now
    };
    
    // Generate a JWT token
    const token = jwt.sign(payload, SECRET_KEY);
    
    // Set token in an HttpOnly cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Ensure this is set to true in production if using HTTPS
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    });
    
    // Redirect user or send a successful response
    res.json({
        message: 'Login successful',
        loginSuccess: true
    });
}

module.exports = router;