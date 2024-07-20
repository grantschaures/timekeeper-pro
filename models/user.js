const db = require("../db");

// User model from the schema (we're just gonna have to roll w/ this nesting :P)
const User = db.model("User", {
  email:    { type: String, required: true },
  password: { type: String, required: false },
  // Adding temporary secure token and its expiration
  token: { type: String, required: false },
  tokenExpire: { type: Date, required: false },
  emailVerified: { type: Boolean, required: true},
  googleAccountLinked: { type: Boolean, required: false},
  logins: { type: Number, required: true, default: 0 },
  loginTimeArr: [{
    loginDate: { type: Date },
    userAgent: { type: String },
    userDevice: { type: String },
    loginMethod: { type: String }
  }],
  lastLogin: {
    loginDate: { type: Date },
    userAgent: { type: String },
    userDevice: { type: String },
    loginMethod: { type: String }
  },
  sessionCompletionTimeArr: [{ // this effectively contains a count of the number of session the user has logged
    timeZone: { type: String },
    sessionCompletionDateUTC: { type: Date }
  }],
  lastIntervalSwitch: { type: Date }, // last time the user (value gets replaced each time user switches interval)
  settings: {
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
    notes: {
      autoSwitchToggle: { type: Boolean, default: false },
      propagateUnfinishedTasksToggle: { type: Boolean, default: false }
    },
    sounds: {
      transitionClockSound:  { type: Boolean, default: false }
    }
  },
  targetHours:  { type: Number, required: false },
  showingTimeLeft: { type: Boolean, default: false },
}, 'Users');

module.exports = User;