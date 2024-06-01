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
const stateJsPath = './src/js/state/state.js';
const googleSignInPath = './src/js/api/google-signin.js';

// Define replacements for index.html
const htmlReplacements = [
    { pattern: /\/js\/main\/index\.js/g, replacement: '/js/minified/index.min.js' },
    { pattern: /\/js\/main\/navigation\.js/g, replacement: '/js/minified/navigation.min.js' },
    { pattern: /\/js\/main\/notes\.js/g, replacement: '/js/minified/notes.min.js' },
    { pattern: /\/js\/state\/state\.js/g, replacement: '/js/minified/state.min.js' },
    { pattern: /\/js\/api\/google-signin\.js/g, replacement: '/js/minified/google-signin.min.js' }
];

// Define replacements for state.js
const stateReplacements = [
    {
        pattern: /import { setInitialBackgroundCellSelection, setBackground, deactivateDarkTheme } from '..\/main\/index.js';/g,
        replacement: "import { setInitialBackgroundCellSelection, setBackground, deactivateDarkTheme } from '../minified/index.min.js';"
    }
];

const googleSignInReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize_gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize_gui.min.js';"
    }
];

// Update index.html
readFileAndReplace(indexHtmlPath, htmlReplacements, () => {
    // Update state.js after index.html is updated
    readFileAndReplace(stateJsPath, googleSignInReplacements);
});
