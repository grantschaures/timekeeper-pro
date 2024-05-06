const express = require("express");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

const { v4: uuidv4 } = require('uuid'); // UUID library to generate unique session IDs
const sessionStore = new Map(); // Example in-memory store

// telling the router to use the JSON parsing middleware for all routes under this router
router.use(express.json());

// Add a new User to the database
//async functionality seems to be unecessary
router.post("/validateUser", async function(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) {
            user.logins++;
            user.save();

            // beginSession(user, res);
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
    try {
        console.log("/verifyIdToken endpoint has been reached")
        const token = req.body.idToken;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();

        console.log(payload)

        const email = payload.email; // Extracting email from payload
        let user = await User.findOne({ email: email });
        if (user) {
            user.googleAccountLinked = true;
            user.logins++;
        } else {
            // If no user exists, create a new one
            user = new User({
                email: email,
                emailVerified: false,
                logins: 1,
                googleAccountLinked: true
            });
        }
        await user.save();

        // beginSession(user, res);

    } catch (error) {
        res.status(400).json({ error: 'Invalid ID token' });
        console.error('Error during ID token verification:', error);
    }
});

function beginSession(user, res) {
    // Generate a unique session ID
    const sessionId = uuidv4();

    // Store user and session data in your session store
    sessionStore.set(sessionId, { userId: user._id, email: user.email });

    // Set session ID in HttpOnly cookie
    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 3600000 // 1 hour in milliseconds
    });

    // Redirect user or send a successful response
    res.json({
        message: 'Login successful',
        user: {
            id: user._id
        }
    });
}

module.exports = router;