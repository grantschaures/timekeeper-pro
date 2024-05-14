require('dotenv').config();
const express = require('express');
const router = require("express").Router();
const jwt = require('jsonwebtoken');

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
      res.json({ tokenVerified: true })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;