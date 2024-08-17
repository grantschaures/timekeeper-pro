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

const dailySessionsJsPath = './src/js/dashboard/daily-sessions.js';
const metricChartsJsPath = './src/js/dashboard/metric-charts.js';
const labelDistributionJsPath = './src/js/dashboard/label-distribution.js';
const summaryStatsJsPath = './src/js/dashboard/summary-stats.js';
const populateDashboardJsPath = './src/js/dashboard/populate-dashboard.js';

const updateLabelsJsPath = './src/js/state/update-labels.js';

// Define replacements for index.html
const indexHtmlReplacements = [
    { pattern: /\/js\/main\/index\.js/g, replacement: '/js/minified/index.min.js' },
    { pattern: /\/js\/main\/navigation\.js/g, replacement: '/js/minified/navigation.min.js' },
    { pattern: /\/js\/main\/notes\.js/g, replacement: '/js/minified/notes.min.js' },
    { pattern: /\/js\/main\/end-session\.js/g, replacement: '/js/minified/end-session.min.js' },
    { pattern: /\/js\/state\/state\.js/g, replacement: '/js/minified/state.min.js' },
    { pattern: /\/js\/api\/google-signin\.js/g, replacement: '/js/minified/google-signin.min.js' },
    { pattern: /\/js\/utility\/preload\.js/g, replacement: '/js/minified/preload.min.js' },
    { pattern: /\/js\/utility\/session-summary-chart\.js/g, replacement: '/js/minified/session-summary-chart.min.js' },
    { pattern: /\/js\/utility\/main-charts\.js/g, replacement: '/js/minified/main-charts.min.js' },

    { pattern: /\/js\/dashboard\/daily-sessions\.js/g, replacement: '/js/minified/daily-sessions.min.js' },
    { pattern: /\/js\/dashboard\/label-distribution\.js/g, replacement: '/js/minified/label-distribution.min.js' },
    { pattern: /\/js\/dashboard\/metric-charts\.js/g, replacement: '/js/minified/metric-charts.min.js' },
    { pattern: /\/js\/dashboard\/summary-stats\.js/g, replacement: '/js/minified/summary-stats.min.js' }
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

const stateReplacements = [
    {
        pattern: /import { setInitialBackgroundCellSelection, deactivateDarkTheme, activateDarkTheme, replaceTargetHours, totalTimeDisplay, intervalTimeToggleGUIUpdate, totalTimeToggleGUIUpdate } from '..\/main\/index.js';/g,
        replacement: "import { setInitialBackgroundCellSelection, deactivateDarkTheme, activateDarkTheme, replaceTargetHours, totalTimeDisplay, intervalTimeToggleGUIUpdate, totalTimeToggleGUIUpdate } from '../minified/index.min.js';"
    },
    {
        pattern: /import { appendEditRemoveContainer, createCheckElements, getLastNumberFromId, addLabelInputContainerTagDivider, addLabelInitialActions, removeTagSelectionDivider, adjustLabelFontSize } from '..\/main\/notes.js';/g,
        replacement: "import { appendEditRemoveContainer, createCheckElements, getLastNumberFromId, addLabelInputContainerTagDivider, addLabelInitialActions, removeTagSelectionDivider, adjustLabelFontSize } from '../minified/notes.min.js';"
    },
    {
        pattern: /import { updateStreak } from '..\/utility\/update-streaks.js';/g,
        replacement: "import { updateStreak } from '../minified/update-streaks.min.js';"
    },
    {
        pattern: /import { populateDashboard } from '..\/dashboard\/populate-dashboard.js';/g,
        replacement: "import { populateDashboard } from '../minified/populate-dashboard.min.js';"
    }
];

const indexReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize-gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize-gui.min.js';"
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
        pattern: /import { userAgent, userDevice, userTimeZone } from '..\/utility\/identification.js';/g,
        replacement: "import { userAgent, userDevice, userTimeZone } from '../minified/identification.min.js';"
    },
    {
        pattern: /import { checkSession } from '..\/state\/check-session.js';/g,
        replacement: "import { checkSession } from '../minified/check-session.min.js';"
    },
    {
        pattern: /import { updateInvaliDate } from '..\/state\/update-invaliDate.js';/g,
        replacement: "import { updateInvaliDate } from '../minified/update-invaliDate.min.js';"
    },
    {
        pattern: /import { initialVisualReset, sessionReset } from '.\/end-session.js';/g,
        replacement: "import { initialVisualReset, sessionReset } from '../minified/end-session.min.js';"
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
        pattern: /import { updateDeletedLabels } from '..\/state\/update-deleted-labels.js';/g,
        replacement: "import { updateDeletedLabels } from '../minified/update-deleted-labels.min.js';"
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
        pattern: /import { animationsFadeIn, animationsFadeOut, triggerSilentAlertAudioMobile } from '.\/index.js';/g,
        replacement: "import { animationsFadeIn, animationsFadeOut, triggerSilentAlertAudioMobile } from '../minified/index.min.js';"
    }
]

const googleSignInReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize-gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize-gui.min.js';"
    },
    {
        pattern: /import { userAgent, userDevice, userTimeZone } from '..\/utility\/identification.js';/g,
        replacement: "import { userAgent, userDevice, userTimeZone } from '../minified/identification.min.js';"
    }
];

const loginReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize-gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize-gui.min.js';"
    },
    {
        pattern: /import { userAgent, userDevice } from '..\/utility\/identification.js';/g,
        replacement: "import { userAgent, userDevice } from '../minified/identification.min.js';"
    }
];

const endSessionReplacements = [
    {
        pattern: /import { animationsFadeIn, animationsFadeOut, getTotalElapsed, returnTotalTimeString, updateLabelArrs, setBackground, pauseAndResetAlertSounds, resetDisplay, updateProgressBar, totalTimeDisplay, setButtonTextAndMode, hideSuggestionBreakContainer, hidePomodorosCompletedContainer, showInterruptionsSubContainer, setFavicon, observer, pomodoroWorker, suggestionWorker, flowmodoroWorker, displayWorker, totalDisplayWorker, updateDataPerHour, hideCat } from '.\/index.js';/g,
        replacement: "import { animationsFadeIn, animationsFadeOut, getTotalElapsed, returnTotalTimeString, updateLabelArrs, setBackground, pauseAndResetAlertSounds, resetDisplay, updateProgressBar, totalTimeDisplay, setButtonTextAndMode, hideSuggestionBreakContainer, hidePomodorosCompletedContainer, showInterruptionsSubContainer, setFavicon, observer, pomodoroWorker, suggestionWorker, flowmodoroWorker, displayWorker, totalDisplayWorker, updateDataPerHour, hideCat } from '../minified/index.min.js';"
    },
    {
        pattern: /import { checkInvaliDate } from '..\/state\/check-invaliDate.js';/g,
        replacement: "import { checkInvaliDate } from '../minified/check-invaliDate.min.js';"
    },
    {
        pattern: /import { addSession } from '..\/state\/add-session.js';/g,
        replacement: "import { addSession } from '../minified/add-session.min.js';"
    },
    {
        pattern: /import { subMainContainerTransition } from '.\/navigation.js';/g,
        replacement: "import { subMainContainerTransition } from '../minified/navigation.min.js';"
    },
    {
        pattern: /import { populateDashboard } from '..\/dashboard\/populate-dashboard.js';/g,
        replacement: "import { populateDashboard } from '../minified/populate-dashboard.min.js';"
    }
]

const updateLabelsReplacements = [
    {
        pattern: /import { populateDashboard } from '..\/dashboard\/populate-dashboard.js';/g,
        replacement: "import { populateDashboard } from '../minified/populate-dashboard.min.js';"
    }
]

// DASHBOARD

const summaryStatsReplacements = [
    {
        pattern: /import { focusQualityCalculation } from '.\/populate-dashboard.js';/g,
        replacement: "import { focusQualityCalculation } from '../minified/populate-dashboard.min.js';"
    }
]

const populateDashboardReplacements = [
    {
        pattern: /import { populateDashboardSummaryStats } from '.\/summary-stats.js';/g,
        replacement: "import { populateDashboardSummaryStats } from '../minified/summary-stats.min.js';"
    },
    {
        pattern: /import { populateLabelDistContainer } from '.\/label-distribution.js';/g,
        replacement: "import { populateLabelDistContainer } from '../minified/label-distribution.min.js';"
    },
    {
        pattern: /import { populateMainChartsContainer } from '.\/metric-charts.js';/g,
        replacement: "import { populateMainChartsContainer } from '../minified/metric-charts.min.js';"
    }
]

const labelDistributionReplacements = [
    {
        pattern: /import { userTimeZone } from '..\/utility\/identification.js';/g,
        replacement: "import { userTimeZone } from '../minified/identification.min.js';"
    }
]

const metricChartsReplacements = [
    {
        pattern: /import { setBounds, alterBounds, checkViewportWidth } from '.\/label-distribution.js';/g,
        replacement: "import { setBounds, alterBounds, checkViewportWidth } from '../minified/label-distribution.min.js';"
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
readFileAndReplace(summaryStatsJsPath, summaryStatsReplacements);
readFileAndReplace(populateDashboardJsPath, populateDashboardReplacements);
readFileAndReplace(labelDistributionJsPath, labelDistributionReplacements);
readFileAndReplace(updateLabelsJsPath, updateLabelsReplacements);
readFileAndReplace(metricChartsJsPath, metricChartsReplacements);