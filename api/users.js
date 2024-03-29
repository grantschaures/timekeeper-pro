const express = require("express");
const User = require("../models/user");
const router = require("express").Router();

// telling the router to use the JSON parsing middleware for all routes under this router
router.use(express.json());

// Add a new User to the database
//async functionality seems to be unecessary
router.post("/", async function(req, res) {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/emailsignup', (req, res) => {
    // Your server-side function logic here
    console.log('Server-side function executed');
  
    const email = req.body.email;
    console.log('Received email:', email);

    










  
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    console.log("API KEY: ", process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, // Change to your recipient
      from: {
        email: 'noreply@hyperchill.io',
        name: 'HyperChill.io',
      },
      subject: 'Please set your password',
      text: 'Visit hyperchill.io/login',
      html:`<div style="text-align: center;">
              <img src="https://hyperchill.io/images/email/logoImageSmall.png">
              <hr style="margin: 20px auto; width: 500px;"> <!-- Adjusted margin here -->
              <strong style="font-size: 24px;">Please set a new password for your account</strong><br>
              <a href="https://hyperchill.io/set-password" style="background-color: #00af2c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 50px;">Set Password</a>
            </div>`
    }


  

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  
    res.sendStatus(200);
  });

module.exports = router;