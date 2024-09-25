const express = require("express");
const User = require("../models/user");
const Note = require("../models/note");
const Report = require("../models/report");
const router = express.Router();
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const mongoose = require('mongoose');

router.use(express.json());

router.post('/emailsignup', async (req, res) => {
    console.log('Server-side function executed');

    const { email } = req.body;
    console.log('Received email:', email);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check if the user already exists
        let user = await User.findOne({ email: email }).session(session);

        if (user) {
            if (user.emailVerified) {
                // If user exists and is verified, inform the client appropriately.
                // Note: You can't use `alert` on the server-side. Alerts are client-side JavaScript.
                // Consider sending a JSON response instead.
                return res.status(400).json({
                    message: "There is already an account associated with that email. Please try logging in."
                });
            } else {
                // If user exists but isn't verified (hasn't set password), regenerate token and update expiration
                user.token = generateToken();
                user.tokenExpire = new Date(new Date().getTime() + 60 * 60 * 1000);
                console.log("User exists but isn't verified (hasn't set password). Regenerating token and updating expiration.")
            }
        } else {
            // If no user exists, create new user
            user = new User({
                email: email,
                token: generateToken(),
                tokenExpire: new Date(new Date().getTime() + 60 * 60 * 1000),
                emailVerified: false,
                signupDate: new Date(Date.now()),
                logins: 0
            });

            // Create the notes entry
            const note = new Note({
                userId: user._id,
                userEmail: email,
                labels: new Map([
                    ["tag-1", "✍️ Homework"],
                    ["tag-2", "📚 Reading"],
                    ["tag-3", "🧘 Meditation"]
                ]),
                lastLabelIdNum: 3,  // Default value
                lastSelectedEmojiId: "books-emoji"  // Default value
            });
            await note.save({ session });

            // Create the report document entry
            const report = new Report({
                userId: user._id,
                userEmail: email,
                sessionCount: 0
            })
            await report.save({ session });
        }

        // Save the user (new or updated)
        await user.save({ session });
        console.log('User saved successfully with expiration date for token.');

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Send verification email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: {
                email: 'noreply@hyperchill.io',
                name: 'Hyperchill.io',
            },
            subject: 'Please set your password',
            text: 'Visit hyperchill.io/login',
            html: `<div style="text-align: center;">
                        <img src="https://hyperchill.io/images/email/updatedLogoImage.png" style="width: 520px; height: auto;">
                        <hr style="margin: 20px auto; width: 528px;">
                        <p style="font-size: 24px; color: black; font-family: Verdana, Geneva, Tahoma, sans-serif;">
                            Please set a new password for your account
                        </p><br>
                        <a href="https://hyperchill.io/set-password/${user.token}" style="background-color: #00af2c; font-family: Verdana, Geneva, Tahoma, sans-serif; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px;">
                            Set Password
                        </a>
                        <div style="margin-top: 70px;">
                            <div style="font-family: Verdana, Geneva, Tahoma, sans-serif; color: rgb(150, 150, 150)">
                                This email was sent by <a href="https://hyperchill.io">Hyperchill.io</a>
                            </div>
                        </div>
                   </div>`
        };

        await sgMail.send(msg);
        console.log('Email sent');
        res.sendStatus(200); // Send success response here, after email is sent
    } catch (err) {
        console.error('Error saving the user or sending email:', err);
        res.status(500).send('An error occurred.');
    }
});

router.post('/resetPassword', async (req, res) => {
    console.log('Server-side function executed');

    const { email } = req.body;
    console.log('Received email:', email);

    try {
        // Check if the user already exists
        let user = await User.findOne({ email: email });

        if (user) {
            if (user.emailVerified) {
                user.token = generateToken();
                user.tokenExpire = new Date(new Date().getTime() + 60 * 60 * 1000);
            } else {
                return res.status(400).json({
                    message: "Your initial password has not been set. Please check your email for a link to set your password. If the link is expired, re-enter your email on the signup page to get a new link."
                });
            }
        } else {
            // If no user exists
            return res.status(400).json({
                message: "There does not exist an account with the email you entered."
            });
        }

        // Save the user (new or updated)
        await user.save();
        console.log('User saved successfully with expiration date for token.');

        // Send verification email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: {
                email: 'noreply@hyperchill.io',
                name: 'Hyperchill.io',
            },
            subject: 'Reset your password',
            text: 'Visit hyperchill.io/login',
            html: `<div style="text-align: center;">
                        <img src="https://hyperchill.io/images/email/updatedLogoImage.png" style="width: 520px; height: auto;">
                        <hr style="margin: 20px auto; width: 528px;">
                        <p style="font-size: 24px; color: black; font-family: Verdana, Geneva, Tahoma, sans-serif;">
                            Please reset your account password
                        </p><br>
                        <a href="https://hyperchill.io/set-password/${user.token}" style="background-color: #00af2c; font-family: Verdana, Geneva, Tahoma, sans-serif; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px;">
                            Reset Password
                        </a>
                        <div style="margin-top: 70px;">
                            <div style="font-family: Verdana, Geneva, Tahoma, sans-serif; color: rgb(150, 150, 150)">
                                This email was sent by <a href="https://hyperchill.io">Hyperchill.io</a>
                            </div>
                        </div>
                   </div>`
        };

        await sgMail.send(msg);
        console.log('Email sent');
        res.sendStatus(200); // Send success response here, after email is sent
    } catch (err) {
        console.error('Error saving the user or sending email:', err);
        res.status(500).send('An error occurred.');
    }
});

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

module.exports = router;
