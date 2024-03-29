const express = require("express");
const User = require("../models/user");
const router = express.Router(); // Simplified
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail'); // Move this to the top

router.use(express.json());

// Removed the other route for brevity

router.post('/emailsignup', async (req, res) => {
    console.log('Server-side function executed');

    const email = req.body.email;
    console.log('Received email:', email);

    // Generate secure token for user
    let token = generateToken();
    let expiration = new Date(new Date().getTime() + 60 * 60 * 1000); // Adds 60 minutes to the current time

    try {
        const user = new User({
            email: email,
            token: token,
            tokenExpire: expiration,
            emailVerified: false
        });

        await user.save();
        console.log('User saved successfully with expiration date for token.');

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
                    <hr style="margin: 20px auto; width: 528px;">
                    <p style="font-size: 24px; color: black; font-family: Verdana, Geneva, Tahoma, sans-serif;">Please set a new password for your account</p><br>
                    <a href="https://hyperchill.io/set-password/${token}" style="background-color: #00af2c; font-family: Verdana, Geneva, Tahoma, sans-serif; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px;">Set Password</a>
                    <div style="margin-top: 70px;">
                        <div style="font-family: Verdana, Geneva, Tahoma, sans-serif; color: rgb(150, 150, 150)">This email was sent by <a href="https://hyperchill.io">HyperChill.io</a></div>
                    </div>
                  </div>`
        };

        await sgMail.send(msg); // Use await to ensure email is sent before responding
        console.log('Email sent');
        res.sendStatus(200); // Send success response here, after email is sent
    } catch (err) {
        console.error('Error saving the user or sending email:', err);
        if (!res.headersSent) {
            res.status(500).send(err);
        }
    }
});

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

module.exports = router;
