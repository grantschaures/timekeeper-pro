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
        pattern: /import { setInitialBackgroundCellSelection, setBackground, deactivateDarkTheme, activateDarkTheme } from '..\/main\/index.js';/g,
        replacement: "import { setInitialBackgroundCellSelection, setBackground, deactivateDarkTheme, activateDarkTheme } from '../minified/index.min.js';"
    },
    {
        pattern: /import { appendEditRemoveContainer, createCheckElements, getLastNumberFromId } from '..\/main\/notes.js';/g,
        replacement: "import { appendEditRemoveContainer, createCheckElements, getLastNumberFromId } from '../minified/notes.min.js';"
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

const googleSignInReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize_gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize_gui.min.js';"
    }
];

const loginReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize_gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize_gui.min.js';"
    }
];

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
readFileAndReplace(googleSignInPath, googleSignInReplacements);
readFileAndReplace(loginJsPath, loginReplacements);