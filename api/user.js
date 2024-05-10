require('dotenv').config();
const express = require('express');
const router = require("express").Router();
const User = require("../models/user");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// telling the router to use the JSON parsing middleware for all routes under this router
router.use(express.json());

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden, invalid token' });
        }
        req.user = decoded;
        next();
      });
    } else {
      res.status(401).json({ message: 'Unauthorized, no token provided' });
    }
}

router.get('/data', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      console.log(req.user.userId)
      res.json({ user: user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;