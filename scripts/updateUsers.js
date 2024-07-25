const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
// After making corresponding changes to user.js model
// run: node scripts/updateUsers.js

const User = require('../models/user'); // Assuming you've defined your User model
const Note = require("../models/note");
const Report = require("../models/report");

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/**
 * FUNCTION: Updates single document via addition of column
 */
async function updateSingleUser() {
  try {
    const user = await User.findOne({ email: 'grantschaures32@gmail.com' }); // Find a specific user
    if (user) {
      // pomodoro
      user.settings.pomodoro.notificationToggle = false;
      user.settings.pomodoro.intervalArr = [25, 5, 15];
      user.settings.pomodoro.autoStartPomToggle = false;
      user.settings.pomodoro.autoStartBreakToggle = false;
      user.settings.pomodoro.alertVolume = 0.5;
      user.settings.pomodoro.alertSound = "none";

      // chill time
      user.settings.chillTime.notificationToggle = false;
      user.settings.chillTime.intervalArr = [5, 8, 10, 15];
      user.settings.chillTime.alertVolume = 0.5;
      user.settings.chillTime.alertSound = "none";

      // flow time
      user.settings.flowTime.notificationToggle = false;
      user.settings.flowTime.suggestionMinutes = 90;
      user.settings.flowTime.alertVolume = 0.5;
      user.settings.flowTime.alertSound = "none";
      user.settings.flowTime.targetTimeReachedToggle = false;

      // backgrounds & themes
      user.settings.backgroundsThemes.flowTimeBackground = "green-default";
      user.settings.backgroundsThemes.chillTimeBackground = "blue-default";
      user.settings.backgroundsThemes.darkThemeActivated = true;
      user.settings.backgroundsThemes.flowTimeAnimation = true;
      user.settings.backgroundsThemes.chillTimeAnimation = true;

      // notes
      user.settings.notes.autoSwitchToggle = false;

      // sounds
      user.settings.sounds.transitionClockSound = false;

      await user.save();
      console.log('User updated successfully');
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Failed to update user:', error);
  }
}
// updateSingleUser().then(() => mongoose.disconnect());

/**
 * FUNCTION: Updates single document via deletion of column
 */
async function removeUserPreferences() {
    try {
      const user = await User.findOne({ email: 'grantschaures32@gmail.com' });
      if (user) {
        // Remove the preferences field
        user.preferences = undefined; // Setting it to undefined will remove it from the document upon saving
        await user.save();
        console.log('Preferences removed successfully');
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Failed to remove preferences:', error);
    }
}
// removeUserPreferences().then(() => mongoose.disconnect());

/**
 * FUNCTION: Add new columns to all users' settings
 */
async function updateAllUsers() {
  try {
    // New default values for each subdocument schema
    const newSettings = {
      pomodoro: {
        notificationToggle: false,
        intervalArr: [25, 5, 15],
        autoStartPomToggle: false,
        autoStartBreakToggle: false,
        alertVolume: 0.5,
        alertSound: "none"
      },
      chillTime: {
        notificationToggle: false,
        intervalArr: [5, 8, 10, 15],
        alertVolume: 0.5,
        alertSound: "none"
      },
      flowTime: {
        notificationToggle: false,
        suggestionMinutes: 90,
        alertVolume: 0.5,
        alertSound: "none",
        targetTimeReachedToggle: false
      },
      backgroundsThemes: {
        flowTimeBackground: "green-default",
        chillTimeBackground: "blue-default",
        darkThemeActivated: true,
        flowTimeAnimation: true,
        chillTimeAnimation: true
      },
      notes: {
        autoSwitchToggle: false
      },
      sounds: {
        transitionClockSound: false
      }
    };

    // Use $set to update or add the new settings structure
    const updateResult = await User.updateMany({}, { $set: { settings: newSettings } });

    // Log the number of modified documents
    console.log(`Number of users updated: ${updateResult.modifiedCount}`);
  } catch (error) {
    console.error('Failed to update all users:', error);
  }
}
// updateAllUsers().then(() => mongoose.disconnect());



/**
 * FUNCTION: Remove column for all users
 */
async function removePreferencesForAllUsers() {
    try {
      // Use $unset to remove the preferences field from all users
      const updateResult = await User.updateMany({}, { $unset: { preferences: "" } });
  
      // Log the number of modified documents
      console.log(`Number of users updated: ${updateResult.modifiedCount}`);
    } catch (error) {
      console.error('Failed to remove preferences field from all users:', error);
    }
}
// removePreferencesForAllUsers().then(() => mongoose.disconnect());

/**
 * FUNCTION: gives users report documents who don't already have them
 */
async function linkReportsToUsers() {
  try {
    // Fetch all users
    const users = await User.find();

    // Iterate through each user and create a report for them if not already exists
    for (const user of users) {
      const existingReport = await Report.findOne({ userId: user._id });

      if (!existingReport) {
        const report = new Report({
          userId: user._id,
          userEmail: user.email, // Ensure you have the email field in your user schema
          sessionCount: 0,
          sessionsArr: []
        });
        await report.save();
      }
    }

    console.log('Reports linked to all users successfully');
  } catch (error) {
    console.error('Error linking reports to users:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
// linkReportsToUsers().then(() => mongoose.disconnect());