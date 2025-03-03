'use strict';

require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
const User = require("./models/user");
const cookieParser = require('cookie-parser');
const http2 = require('http2');
const fs = require('fs');

// initialization of a new express application
const app = express();

const PRIMARY_DOMAIN = 'hyperchill.io';
const TESTING_DOMAIN = 'hyperchill-testing-df1b0f1f63d0.herokuapp.com';
// could add another domain for hyperchill-testing

//CHECKING REQUESTS IN LOG
const logRequest = function(req, res, next) {
  console.log(`Request: ${req.method} for ${req.path}`);
  next();
};

app.use(logRequest);

async function connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error(error);
    }
}

connect();
//////////

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if ((req.headers.host !== PRIMARY_DOMAIN) && (req.headers.host !== TESTING_DOMAIN)) {
      // Redirect to the primary domain
      return res.redirect(301, `https://${PRIMARY_DOMAIN}${req.url}`);
    }
    next();
  });
  
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`);
    else
      next();
  });
}

app.use(cookieParser()); // Use cookieParser middleware to parse cookies
app.get('/', (req, res, next) => {
    const token = req.cookies.token; // Accessing the cookie token
    if (token) {
        // Handle your session validation and other logic here
      console.log("Token received: " + token);
    } else {
      console.log("No Token found");
    }
    next();
});

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

app.post("/", (req, res) => {
  res.redirect('/');
});

app.get("/login", (req, res) => {
  const filePath = path.join(__dirname, 'public', 'login.html')
  res.sendFile(filePath);
});

app.get("/signup", (req, res) => {
  const filePath = path.join(__dirname, 'public', 'signup.html')
  res.sendFile(filePath);
});

app.get("/reset-password", (req, res) => {
  const filePath = path.join(__dirname, 'public', 'reset-password.html')
  res.sendFile(filePath);
});

app.get("/privacy-policy", (req, res) => {
  const filePath = path.join(__dirname, 'public', 'privacy-policy.html')
  res.sendFile(filePath);
});

app.get("/terms-and-conditions", (req, res) => {
  const filePath = path.join(__dirname, 'public', 'terms-and-conditions.html')
  res.sendFile(filePath);
});

app.get("/invalid-token", (req, res) => {
  const filePath = path.join(__dirname, 'public', 'invalid-token.html')
  res.sendFile(filePath);
});

// Token verification endpoint
app.get("/set-password/:token", async (req, res) => {
  const { token } = req.params; // Get the token from URL parameters
  try {
      const user = await User.findOne({
          token: token,
          tokenExpire: { $gt: new Date() } // Ensure the token is not expired
      });
      if (!user) {
        // If no user or token is invalid/expired, send the invalid token page
        const filePath = path.join(__dirname, 'public', 'invalid-token.html');
        return res.sendFile(filePath); // Use return here to stop execution after sending the response
      }
      // If the token is valid, send the set password page
      const filePath = path.join(__dirname, 'public', 'set-password.html');
      res.sendFile(filePath); // It's fine to not return here since this is the last action
  } catch (err) {
      // Handle any errors that occur during the process
      console.error(err); // Log the error for debugging
      return res.status(500).send("An error occurred while verifying the token."); // Use return here
  }
});

// SPA Requests

app.get('/blog', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html')
  res.sendFile(filePath);
})

app.get('/about', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html')
  res.sendFile(filePath);
})

app.get('/settings', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html')
  res.sendFile(filePath);
})

app.use('/api/api', require('./api/api'));
app.use('/api/user', require('./api/user'));
app.use("/api/users", require("./api/users"));
app.use("/api/state", require("./api/state"));
app.use("/api/data", require("./api/data"));
app.use("/extension/auth", require("./extension/auth"));

const PORT = process.env.PORT || 3000;
// Start the web server

app.listen(PORT, function() {
  console.log(`Server is running at http://localhost:${PORT}/`);
});