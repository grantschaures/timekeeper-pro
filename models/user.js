const db = require("../db");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionStartTimeSchema = new Schema({
  startTime: { type: Date }
})

// User model from the schema
const User = db.model("User", {
  email:    { type: String, required: true },
  password: { type: String, required: false },
  // Adding temporary secure token and its expiration
  token: { type: String, required: false },
  tokenExpire: { type: Date, required: false },
  emailVerified: { type: Boolean, required: true},
  googleAccountLinked: { type: Boolean, required: false},
  signupDate: { type: Date, required: true, default: Date.now },
  logins: { type: Number, required: true, default: 0 },
  lastLogin: {
    loginDate: { type: Date },
    userAgent: { type: String },
    userDevice: { type: String },
    loginMethod: { type: String },
    timeZone: { type: String }
  },
  lastIntervalSwitch: { type: Date }, // last time the user (value gets replaced each time user switches interval)
  lastActivity: { type: Date },
  sessionRunning: { type: Boolean },
  invaliDate: { type: Date },
  sessionStartTimeArr: [sessionStartTimeSchema],
  settings: { // could potentially be independent schema w/ own collection
    pomodoro: {
      notificationToggle: { type: Boolean, default: false },
      intervalArr: { 
        type: [Number], // Defines an array of numbers
        default: [25, 5, 15]  // Default array provided
      },
      autoStartPomToggle: { type: Boolean, default: false },
      autoStartBreakToggle: { type: Boolean, default: false },
      alertVolume: { type: Number, default: 0.5},
      alertSound: { type: String, default: "none" }
    },
    chillTime: {
      notificationToggle: { type: Boolean, default: false },
      intervalArr: {
        type: [Number],
        default: [5, 8, 10, 15]
      },
      alertVolume: { type: Number, default: 0.5},
      alertSound: { type: String, default: "none" }
    },
    flowTime: {
      notificationToggle: { type: Boolean, default: false },
      suggestionMinutes: { type: Number, default: 90 },
      alertVolume: { type: Number, default: 0.5},
      alertSound: { type: String, default: "none" },
      targetTimeReachedToggle: { type: Boolean, default: false }
    },
    backgroundsThemes: {
      flowTimeBackground: { type: String, default: "green-default"},
      chillTimeBackground: { type: String, default: "blue-default"},
      flowTimeBackgroundTemp: { type: String, default: null },
      chillTimeBackgroundTemp: { type: String, default: null },
      darkThemeActivated: { type: Boolean, default: false },
      flowTimeAnimation:  { type: Boolean, default: false },
      chillTimeAnimation: { type: Boolean, default: false }
    },
    display: {
      intervalTime: { type: Boolean, default: true },
      totalTime: { type: Boolean, default: true },
      muffinToggle: { type: Boolean, default: true }
    },
    notes: {
      autoSwitchToggle: { type: Boolean, default: false },
      propagateUnfinishedTasksToggle: { type: Boolean, default: false },
      timestampsToggle:  { type: Boolean, default: true }
    },
    sounds: {
      transitionClockSound:  { type: Boolean, default: false }
    }
  },
  targetHours:  { type: Number, required: false },
  showingTimeLeft: { type: Boolean, default: false },
}, 'Users');

module.exports = User;