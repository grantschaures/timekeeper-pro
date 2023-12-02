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
      subject: 'Verify email and set password',
      text: 'Visit hyperchill.io/login',
      html: '<strong>Visit hyperchill.io/login</strong>', //change this to add a button and so forth
      // headers: {
      //   'X-SMTPAPI': {
      //     'category': 'example_category'
      //   },
      //   'Sender': 'HyperChill.io noreply@hyperchill.io',
      //   'X-Sent-Using': 'SendGrid-API',
      //   'X-Transport': 'web'
      // }
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