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

module.exports = router;