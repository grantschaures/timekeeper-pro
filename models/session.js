const db = require("../db");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hourlyData = new Schema({
    deepWorkTime: { type: Number },
    distractions: { type: Number },
    inDeepWork: { type: Boolean }
});

const sessionSummarySchema = new Schema({
    comments: { type: String, default: ""},
    subjectiveFeedback: { type: String, default: ""}
});

// Define the Session schema
const sessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    timeZone: { type: String },
    totalDeepWork: { type: Number },
    focusQualityV2: { type: Number },
    focusQualityV5: { type: Number },
    qualityAdjustedDeepWorkV2: { type: Number },
    qualityAdjustedDeepWorkV5: { type: Number },
    totalDistractions: { type: Number },
    distractionTimesArr: [{ type: Date }],
    distractionsPerIntervalArr: [{ type: Number }],
    deepWorkIntervals: [{ type: Number }],
    breakIntervals: [{ type: Number }],
    avgDeepWorkInterval: { type: Number },
    avgBreakInterval: { type: Number },
    deepWorkIntervalCount: { type: Number },
    breakIntervalCount: { type: Number },
    targetHours: { type: Number },
    hitTarget: { type: Boolean },
    pomodorosCompleted: { type: Number },
    pipWindowEvents: { type: [Date], default: [] },
    labelTimes: {
        type: Map,
        of: Number,
        default: {}
    },
    perHourData: {
        type: Object,
        of: hourlyData,
        default: {}
    },
    sessionSummary: { type: sessionSummarySchema, default: {} } // Ensure sessionSummary is always included
}, { collection: 'Sessions' });

// Create the Session model
const Session = db.model("Session", sessionSchema);

module.exports = { Session, sessionSchema };