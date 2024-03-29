const express = require("express");
const User = require("../models/user");
const router = require("express").Router();

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

// Token verification endpoint
router.get("/set-password/:token", async (req, res) => {
    const { token } = req.params; // Get the token from URL parameters
    try {
        const user = await User.findOne({
            token: token,
            tokenExpire: { $gt: new Date() } // Ensure the token is not expired
        });
        if (!user) {
            return res.status(404).send("Token is invalid or expired.");
        }
        // Token is valid, you can optionally send back some user info if needed
        res.status(200).send({ message: "Token is valid.", email: user.email });
    } catch (err) {
        res.status(500).send("An error occurred while verifying the token.");
    }
});

module.exports = router;