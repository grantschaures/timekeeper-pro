const db = require("../db");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the hourlyData schema
const hourlyData = new Schema({
    deepWorkTime: { type: Number },
    distractions: { type: Number },
    inDeepWork: { type: Boolean }
});

// Define the sessions schema
const sessionSchema = new Schema({
    startTime: { type: Date },
    endTime: { type: Date },
    timeZone: { type: String },

    totalDeepWork: { type: Number },
    focusQuality: { type: Number },
    qualityAdjustedDeepWork: { type: Number },
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

    labelTimes: {
        type: Map,
        of: Number,
        default: {}
    },

    perHourData: {
        type: Object,
        of: hourlyData,
        default: {}
    }
});

// Define the Report schema
const reportSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    sessionCount: { type: Number },
    sessionsArr: [sessionSchema]
}, { collection: 'Reports' });

// Create the Report model
const Report = db.model("Report", reportSchema);

module.exports = Report;