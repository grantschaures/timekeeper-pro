const express = require("express");
const User = require("../models/user");
const router = require("express").Router();

// telling the router to use the JSON parsing middleware for all routes under this router
router.use(express.json());

// Add a new User to the database
//async functionality seems to be unecessary
router.post("/", function(req, res) {
    try {
        const user = new User(req.body);
        user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;