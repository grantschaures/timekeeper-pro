const express = require("express");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require('bcrypt');

// telling the router to use the JSON parsing middleware for all routes under this router
router.use(express.json());

// Add a new User to the database
//async functionality seems to be unecessary
router.post("/validateUser", async function(req, res) {
    try {
        const user = new User(req.body);
        await user.save(); //stores user in database
        res.status(201).json(user);
        console.log("");
        console.log("User Email: " + user.email);
        console.log("User Password: " + user.password);
        console.log("");
    } catch (err) {
        res.status(400).send(err);
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

module.exports = router;