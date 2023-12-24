'use strict';

require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const path = require('path');

// initialization of a new express application
const app = express();

const PRIMARY_DOMAIN = 'hyperchill.io';

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
//new comment!
// //COMMENT OUT WHEN TESTING ON LOCALHOST:3000

// app.use((req, res, next) => {
//   if (req.headers.host !== PRIMARY_DOMAIN) {
//       // Redirect to the primary domain
//       return res.redirect(301, `https://${PRIMARY_DOMAIN}${req.url}`);
//   }
//   next();
// });

// app.use((req, res, next) => {
//     if (req.header('x-forwarded-proto') !== 'https')
//         res.redirect(`https://${req.header('host')}${req.url}`);
//     else
//       next();
// });

// Serve static files from the public dir
app.use(express.static("public")); //app.use() function is used to mount middleware functions at a specific path
//express.static() is a built in middleware function in express to serve static files such as images, CS files, and JS files

// A middleware function (or just middleware) is a function that examines or modifies the request and/or response objects. A middleware function has three parameters: req, res, and next
app.use(express.json());

let workerIntervalPomodoro;
app.post('/pomodoroInterval', (req, res) => {
  let serverTime = Date.now();

  let timeDiff = serverTime - req.body.clientTime;
  let timeDiffSeconds = Math.round(timeDiff / 1000);
  console.log(timeDiffSeconds);

  // Check if the request is to clear the interval
  if (req.body.pomodoroNotificationSeconds === "clearInterval") {
    clearInterval(workerIntervalPomodoro);
    workerIntervalPomodoro = null;
    res.send("Interval cleared");
    return;
  }

  // Assuming the body contains a number of seconds
  let totalNotificationSeconds = (req.body.pomodoroNotificationSeconds - 1) - timeDiffSeconds;
  if (typeof totalNotificationSeconds === 'number') {
    workerIntervalPomodoro = setInterval(() => {
      if (totalNotificationSeconds === 1) { //might need to modify this value...
        clearInterval(workerIntervalPomodoro);
        workerIntervalPomodoro = null;
        res.send("Interval finished");
      } else {
        totalNotificationSeconds--;
        console.log(totalNotificationSeconds);
      }
    }, 1000);
  } else {
    clearInterval(workerIntervalPomodoro);
    workerIntervalPomodoro = null;
    res.send("Interval cleared");
  }
});

app.get("/login", (req, res) => {
    const filePath = path.join(__dirname, 'public', 'login.html')
    res.sendFile(filePath);
});

app.get("/signup", (req, res) => {
    const filePath = path.join(__dirname, 'public', 'signup.html')
    res.sendFile(filePath);
});

app.use("/api/users", require("./api/users"));

const PORT = process.env.PORT || 3000;
// Start the web server
app.listen(PORT, function() {
    console.log(`Server is running at http://localhost:${PORT}/`);
});