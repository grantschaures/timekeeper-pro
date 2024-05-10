const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define sub-schema for Pomodoro settings
const pomodoroSchema = new Schema({
  notificationToggle: { type: Boolean, default: false },
  intervalArr: {
    type: [Number],
    default: [25, 5, 15]
  },
  autoStartPomToggle: { type: Boolean, default: false },
  autoStartBreakToggle: { type: Boolean, default: false },
  alertVolume: { type: Number, default: 0.5 },
  alertSound: { type: String, default: "none" }
});

// Repeat similar structure for other settings like chillTime, flowTime, etc.
const chillTimeSchema = new Schema({
  notificationToggle: { type: Boolean, default: false },
    intervalArr: {
      type: [Number],
      default: [5, 8, 10, 15]
    },
    alertVolume: { type: Number, default: 0.5},
    alertSound: { type: String, default: "none" }
});

const flowTimeSchema = new Schema({
  notificationToggle: { type: Boolean, default: false },
  suggestionMinutes: { type: Number, default: 90 },
  alertVolume: { type: Number, default: 0.5},
  alertSound: { type: String, default: "none" },
  targetTimeReachedToggle: { type: Boolean, default: false }
});

const backgroundsThemesSchema = new Schema({
  flowTimeBackground: { type: String, default: "green-default"},
  chillTimeBackground: { type: String, default: "blue-default"},
  darkThemeActivated: { type: Boolean, default: true },
  flowTimeAnimation:  { type: Boolean, default: true },
  chillTimeAnimation: { type: Boolean, default: true }
});

const notesSchema = new Schema({
  autoSwitchToggle: { type: Boolean, default: false }
});

const soundsSchema = new Schema({
  transitionClockSound:  { type: Boolean, default: false }
});

// Main User schema
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String },
  token: { type: String },
  tokenExpire: { type: Date },
  emailVerified: { type: Boolean, required: true },
  googleAccountLinked: { type: Boolean },
  logins: { type: Number, default: 0 },
  settings: {
    pomodoro: pomodoroSchema,
    chillTime: chillTimeSchema,
    flowTime: flowTimeSchema,
    backgroundsThemes: backgroundsThemesSchema,
    notes: notesSchema,
    sounds: soundsSchema
  }
}, { collection: 'Users' });

const User = mongoose.model('User', userSchema);

module.exports = User;