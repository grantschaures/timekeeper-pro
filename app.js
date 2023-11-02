'use strict';

require('dotenv').config();
const express = require("express");
const path = require('path');

// initialization of a new express application
const app = express();


//CHECKING REQUESTS IN LOG
const logRequest = function(req, res, next) {
    console.log(`Request: ${req.method} for ${req.path}`);
    next();
};
 
app.use(logRequest);
//////////

//COMMENT OUT WHEN TESTING ON LOCALHOST:3000
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`);
    else
        next();
});

// Serve static files from the public dir
app.use(express.static("public")); //app.use() function is used to mount middleware functions at a specific path
//express.static() is a built in middleware function in express to serve static files such as images, CS files, and JS files

// A middleware function (or just middleware) is a function that examines or modifies the request and/or response objects. A middleware function has three parameters: req, res, and next

app.get("/test", (req, res) => {
    const filePath = path.join(__dirname, 'public', 'test.html')
    res.sendFile(filePath);
});


const PORT = process.env.PORT || 3000;
// Start the web server
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}/`);
});