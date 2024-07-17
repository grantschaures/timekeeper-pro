const fs = require('fs');
const path = require('path');

// Function to read a file and replace its content
function readFileAndReplace(filePath, replacements, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let result = data;
        replacements.forEach(({ pattern, replacement }) => {
            result = result.replace(pattern, replacement);
        });

        fs.writeFile(filePath, result, 'utf8', (err) => {
            if (err) return console.log(err);
            console.log(`${filePath} updated successfully.`);
            if (callback) callback();
        });
    });
}

// Define the file paths and replacements
const indexHtmlPath = './public/index.html';
const loginHtmlPath = './public/login.html';
const signupHtmlPath = './public/signup.html';
const setPasswordHtmlPath = './public/set-password.html';
const resetPasswordHtmlPath = './public/reset-password.html';

const stateJsPath = './src/js/state/state.js';
const indexJsPath = './src/js/main/index.js';
const notesJsPath = './src/js/main/notes.js';
const endSessionJsPath = './src/js/main/end-session.js';
const navigationJsPath = './src/js/main/navigation.js';
const loginJsPath = './src/js/login_signup/login.js';
const googleSignInPath = './src/js/api/google-signin.js';

// Define replacements for index.html
const indexHtmlReplacements = [
    { pattern: /\/js\/main\/index\.js/g, replacement: '/js/minified/index.min.js' },
    { pattern: /\/js\/main\/navigation\.js/g, replacement: '/js/minified/navigation.min.js' },
    { pattern: /\/js\/main\/notes\.js/g, replacement: '/js/minified/notes.min.js' },
    { pattern: /\/js\/state\/state\.js/g, replacement: '/js/minified/state.min.js' },
    { pattern: /\/js\/api\/google-signin\.js/g, replacement: '/js/minified/google-signin.min.js' },
    { pattern: /\/js\/utility\/preload\.js/g, replacement: '/js/minified/preload.min.js' }
];

const loginHtmlReplacements = [
    { pattern: /\/js\/login_signup\/login\.js/g, replacement: '/js/minified/login.min.js' },
    { pattern: /\/js\/api\/google-signin\.js/g, replacement: '/js/minified/google-signin.min.js' }
]

const signupHtmlReplacements = [
    { pattern: /\/js\/login_signup\/signup\.js/g, replacement: '/js/minified/signup.min.js' },
    { pattern: /\/js\/api\/google-signin\.js/g, replacement: '/js/minified/google-signin.min.js' }
]

const setPasswordHtmlReplacements = [
    { pattern: /\/js\/login_signup\/set-password\.js/g, replacement: '/js/minified/set-password.min.js' }
]

const resetPasswordHtmlReplacements = [
    { pattern: /\/js\/login_signup\/reset-password\.js/g, replacement: '/js/minified/reset-password.min.js' }
]

// Define replacements for state.js
const stateReplacements = [
    {
        pattern: /import { setInitialBackgroundCellSelection, setBackground, deactivateDarkTheme, activateDarkTheme, replaceTargetHours, totalTimeDisplay } from '..\/main\/index.js';/g,
        replacement: "import { setInitialBackgroundCellSelection, setBackground, deactivateDarkTheme, activateDarkTheme, replaceTargetHours, totalTimeDisplay } from '../minified/index.min.js';"
    },
    {
        pattern: /import { appendEditRemoveContainer, createCheckElements, getLastNumberFromId, addLabelInputContainerTagDivider, addLabelInitialActions, removeTagSelectionDivider, adjustLabelFontSize } from '..\/main\/notes.js';/g,
        replacement: "import { appendEditRemoveContainer, createCheckElements, getLastNumberFromId, addLabelInputContainerTagDivider, addLabelInitialActions, removeTagSelectionDivider, adjustLabelFontSize } from '../minified/notes.min.js';"
    },
    {
        pattern: /import { updateStreak } from '..\/utility\/update_streaks.js';/g,
        replacement: "import { updateStreak } from '../minified/update_streaks.min.js';"
    }
];

const indexReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize_gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize_gui.min.js';"
    },
    {
        pattern: /import { updateUserSettings } from '..\/state\/update-settings.js';/g,
        replacement: "import { updateUserSettings } from '../minified/update-settings.min.js';"
    },
    {
        pattern: /import { updateTargetHours } from '..\/state\/update-target-hours.js';/g,
        replacement: "import { updateTargetHours } from '../minified/update-target-hours.min.js';"
    },
    {
        pattern: /import { updateShowingTimeLeft } from '..\/state\/update-showing-time-left.js';/g,
        replacement: "import { updateShowingTimeLeft } from '../minified/update-showing-time-left.min.js';"
    },
    {
        pattern: /import { lastIntervalSwitch } from '..\/state\/last-interval-switch.js';/g,
        replacement: "import { lastIntervalSwitch } from '../minified/last-interval-switch.min.js';"
    },
    {
        pattern: /import { userAgent, userDevice } from '..\/utility\/identification.js';/g,
        replacement: "import { userAgent, userDevice } from '../minified/identification.min.js';"
    }
];

const notesReplacements = [
    {
        pattern: /import { updateUserSettings } from '..\/state\/update-settings.js';/g,
        replacement: "import { updateUserSettings } from '../minified/update-settings.min.js';"
    },
    {
        pattern: /import { updateLabels } from '..\/state\/update-labels.js';/g,
        replacement: "import { updateLabels } from '../minified/update-labels.min.js';"
    },
    {
        pattern: /import { updateNotes } from '..\/state\/update-notes.js';/g,
        replacement: "import { updateNotes } from '../minified/update-notes.min.js';"
    },
];

const navigationReplacements = [
    {
        pattern: /import { deleteUserAccount } from '..\/state\/delete-account.js';/g,
        replacement: "import { deleteUserAccount } from '../minified/delete-account.min.js';"
    },
    {
        pattern: /import { animationsFadeIn, animationsFadeOut, triggerSilentAlertAudioMobile } from '..\/main\/index.js';/g,
        replacement: "import { animationsFadeIn, animationsFadeOut, triggerSilentAlertAudioMobile } from '../minified/index.min.js';"
    }
]

const googleSignInReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize_gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize_gui.min.js';"
    },
    {
        pattern: /import { userAgent, userDevice } from '..\/utility\/identification.js';/g,
        replacement: "import { userAgent, userDevice } from '../minified/identification.min.js';"
    }
];

const loginReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize_gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize_gui.min.js';"
    },
    {
        pattern: /import { userAgent, userDevice } from '..\/utility\/identification.js';/g,
        replacement: "import { userAgent, userDevice } from '../minified/identification.min.js';"
    }
];

const endSessionReplacements = [
    {
        pattern: /import { userActivity } from '..\/state\/user-activity.js';/g,
        replacement: "import { userActivity } from '../minified/user-activity.min.js';"
    },
    {
        pattern: /import { animationsFadeIn, animationsFadeOut, getTotalElapsed, returnTotalTimeString, updateLabelArrs, setBackground, pauseAndResetAlertSounds, resetDisplay, updateProgressBar, totalTimeDisplay, setButtonTextAndMode, hideSuggestionBreakContainer, hidePomodorosCompletedContainer, showInterruptionsSubContainer, setFavicon, observer, pomodoroWorker, suggestionWorker, flowmodoroWorker, displayWorker, totalDisplayWorker } from '..\/main\/index.js';/g,
        replacement: "import { animationsFadeIn, animationsFadeOut, getTotalElapsed, returnTotalTimeString, updateLabelArrs, setBackground, pauseAndResetAlertSounds, resetDisplay, updateProgressBar, totalTimeDisplay, setButtonTextAndMode, hideSuggestionBreakContainer, hidePomodorosCompletedContainer, showInterruptionsSubContainer, setFavicon, observer, pomodoroWorker, suggestionWorker, flowmodoroWorker, displayWorker, totalDisplayWorker } from '../minified/index.min.js';"
    }
]

// Update index.html
readFileAndReplace(indexHtmlPath, indexHtmlReplacements);

// Update login.html
readFileAndReplace(loginHtmlPath, loginHtmlReplacements);

// Update signup.html
readFileAndReplace(signupHtmlPath, signupHtmlReplacements);

// Update set-password.html
readFileAndReplace(setPasswordHtmlPath, setPasswordHtmlReplacements);

// Update reset-password.html
readFileAndReplace(resetPasswordHtmlPath, resetPasswordHtmlReplacements);

// JS updates
readFileAndReplace(stateJsPath, stateReplacements);
readFileAndReplace(indexJsPath, indexReplacements);
readFileAndReplace(notesJsPath, notesReplacements);
readFileAndReplace(navigationJsPath, navigationReplacements);
readFileAndReplace(googleSignInPath, googleSignInReplacements);
readFileAndReplace(loginJsPath, loginReplacements);
readFileAndReplace(endSessionJsPath, endSessionReplacements);