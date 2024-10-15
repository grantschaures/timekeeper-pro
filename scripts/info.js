const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
// After making corresponding changes to user.js model
// run: node scripts/info.js

const User = require('../models/user'); // Assuming you've defined your User model
const Note = require("../models/note");
const Report = require("../models/report");
const { Session } = require("../models/session");

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/**
 * FUNCTION: Retrieves all session documents from the sessions collection
 */
async function getSessions() {
    try {
        // Fetch all session documents
        const sessions = await Session.find({});
        sessions.forEach( session => {
            if (session.sessionSummary.subjectiveFeedback === "good") {
                console.log('good subjective rating value found');
            } else if (session.sessionSummary.subjectiveFeedback === "ok") {
                console.log('ok subjective rating value found');
            } else if (session.sessionSummary.subjectiveFeedback === "bad") {
                console.log('bad subjective rating value found');
            } else if (session.sessionSummary.subjectiveFeedback === "unsure") {
                console.log('unsure subjective rating found');
            } else if (session.sessionSummary.subjectiveFeedback === "3") {
                console.log("a subjective rating of 3 has been found");
            } else if (session.sessionSummary.subjectiveFeedback === "4") {
                console.log("a subjective rating of 4 has been found");
            } else if (session.sessionSummary.subjectiveFeedback === "5") {
                console.log("a subjective rating of 5 has been found")
            } else if (session.sessionSummary.subjectiveFeedback === "-3") {
                console.log("a subjective rating of -3 has been found");
            } else if (session.sessionSummary.subjectiveFeedback === "-4") {
                console.log("a subjective rating of -4 has been found");
            } else if (session.sessionSummary.subjectiveFeedback === "-5") {
                console.log("a subjective rating of -5 has been found");
            }
        })
    } catch (error) {
        console.error("Error fetching sessions:", error);
    }
}
// getSessions().then(() => mongoose.disconnect());

async function ameliorateSubjectiveRating() {
    try {
        const result = await Session.updateMany(
            { 'sessionSummary.subjectiveFeedback': '-5' },  // Use quotes and dot notation for nested field
            { $set: { 'sessionSummary.subjectiveFeedback': '-2' } }  // Use dot notation in update operation
        );
        console.log(`${result.modifiedCount} documents updated`);
    } catch (err) {
        console.error("Error updating documents:", err);
    }
}
// ameliorateSubjectiveRating().then(() => mongoose.disconnect());