const fs = require('fs');

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
const loginJsPath = './src/js/login-signup/login.js';
const googleSignInPath = './src/js/api/google-signin.js';
const pipJsPath = './src/js/api/pip.js';

const dailySessionsJsPath = './src/js/dashboard/daily-sessions.js';
const miniChartsJsPath = './src/js/utility/mini-charts.js';
const dayViewJsPath = './src/js/utility/day-view.js';

const summaryStatsJsPath = './src/js/dashboard/summary-stats.js';
const advChartsJsPath = './src/js/utility/adv-charts.js';
const metricChartsJsPath = './src/js/dashboard/metric-charts.js';
const populateDashboardJsPath = './src/js/dashboard/populate-dashboard.js';
const mainChartsJsPath = './src/js/utility/main-charts.js';

const updateLabelsJsPath = './src/js/state/update-labels.js';
const updateNotesEntryJsPath = './src/js/state/update-notes-entry.js';
const addNotesEntryJsPath = './src/js/state/add-notes-entry.js';
const deleteSessionJsPath = './src/js/state/delete-session.js';
const updateSessionSummaryDataJsPath = './src/js/state/update-session-summary-data.js';
const sessionViewJsPath = './src/js/utility/session-view.js';

// Define replacements for index.html
const indexHtmlReplacements = [
    { pattern: /\/js\/main\/index\.js/g, replacement: '/js/minified/index.min.js' },
    { pattern: /\/js\/main\/navigation\.js/g, replacement: '/js/minified/navigation.min.js' },
    { pattern: /\/js\/main\/notes\.js/g, replacement: '/js/minified/notes.min.js' },
    { pattern: /\/js\/main\/end-session\.js/g, replacement: '/js/minified/end-session.min.js' },
    { pattern: /\/js\/state\/state\.js/g, replacement: '/js/minified/state.min.js' },
    { pattern: /\/js\/api\/google-signin\.js/g, replacement: '/js/minified/google-signin.min.js' },
    { pattern: /\/js\/api\/pip\.js/g, replacement: '/js/minified/pip.min.js' },
    { pattern: /\/js\/utility\/preload\.js/g, replacement: '/js/minified/preload.min.js' },
    { pattern: /\/js\/utility\/session-summary-chart\.js/g, replacement: '/js/minified/session-summary-chart.min.js' },
    { pattern: /\/js\/utility\/main-charts\.js/g, replacement: '/js/minified/main-charts.min.js' },
    { pattern: /\/js\/utility\/adv-charts\.js/g, replacement: '/js/minified/adv-charts.min.js' },
    { pattern: /\/js\/utility\/mini-charts\.js/g, replacement: '/js/minified/mini-charts.min.js' },
    { pattern: /\/js\/utility\/day-view\.js/g, replacement: '/js/minified/day-view.min.js' },
    { pattern: /\/js\/utility\/session-view\.js/g, replacement: '/js/minified/session-view.min.js' },

    { pattern: /\/js\/dashboard\/daily-sessions\.js/g, replacement: '/js/minified/daily-sessions.min.js' },
    { pattern: /\/js\/dashboard\/label-distribution\.js/g, replacement: '/js/minified/label-distribution.min.js' },
    { pattern: /\/js\/dashboard\/metric-charts\.js/g, replacement: '/js/minified/metric-charts.min.js' },
    { pattern: /\/js\/dashboard\/summary-stats\.js/g, replacement: '/js/minified/summary-stats.min.js' }
];

const loginHtmlReplacements = [
    { pattern: /\/js\/login-signup\/login\.js/g, replacement: '/js/minified/login.min.js' },
    { pattern: /\/js\/api\/google-signin\.js/g, replacement: '/js/minified/google-signin.min.js' }
]

const signupHtmlReplacements = [
    { pattern: /\/js\/login-signup\/signup\.js/g, replacement: '/js/minified/signup.min.js' },
    { pattern: /\/js\/api\/google-signin\.js/g, replacement: '/js/minified/google-signin.min.js' }
]

const setPasswordHtmlReplacements = [
    { pattern: /\/js\/login-signup\/set-password\.js/g, replacement: '/js/minified/set-password.min.js' }
]

const resetPasswordHtmlReplacements = [
    { pattern: /\/js\/login-signup\/reset-password\.js/g, replacement: '/js/minified/reset-password.min.js' }
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
        pattern: /import { userTimeZone } from '..\/utility\/identification.js';/g,
        replacement: "import { userTimeZone } from '../minified/identification.min.js';"
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
    },
    {
        pattern: /import { setMetricCharts } from '..\/dashboard\/metric-charts.js';/g,
        replacement: "import { setMetricCharts } from '../minified/metric-charts.min.js';"
    },
    {
        pattern: /import { setInitialDate } from '..\/dashboard\/daily-sessions.js';/g,
        replacement: "import { setInitialDate } from '../minified/daily-sessions.min.js';"
    },
    {
        pattern: /import { hideDashboardCat } from '.\/daily-sessions.js';/g,
        replacement: "import { hideDashboardCat } from './minified/daily-sessions.min.js';"
    },
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
    {
        pattern: /import { addNotesEntry } from '..\/state\/add-notes-entry.js';/g,
        replacement: "import { addNotesEntry } from '../minified/add-notes-entry.min.js';"
    },
    {
        pattern: /import { updateNotesEntry } from '..\/state\/update-notes-entry.js';/g,
        replacement: "import { updateNotesEntry } from '../minified/update-notes-entry.min.js';"
    },
    {
        pattern: /import { userTimeZone } from '..\/utility\/identification.js';/g,
        replacement: "import { userTimeZone } from '../minified/identification.min.js';"
    },
];

const navigationReplacements = [
    {
        pattern: /import { deleteUserAccount } from '..\/state\/delete-account.js';/g,
        replacement: "import { deleteUserAccount } from '../minified/delete-account.min.js';"
    },
    {
        pattern: /import { animationsFadeIn, animationsFadeOut, handleViewportWidthChange, triggerSilentAlertAudioMobile } from '.\/index.js';/g,
        replacement: "import { animationsFadeIn, animationsFadeOut, handleViewportWidthChange, triggerSilentAlertAudioMobile } from '../minified/index.min.js';"
    },
    {
        pattern: /import { hideConfirmSessionDeletionPopup } from '..\/utility\/session-view.js';/g,
        replacement: "import { hideConfirmSessionDeletionPopup } from '../minified/session-view.min.js';"
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

const pipReplacements = [
    {
        pattern: /import { displayCat, setBackground } from '..\/main\/index.js';/g,
        replacement: "import { displayCat, setBackground } from '../minified/index.min.js';"
    }
];

const loginReplacements = [
    {
        pattern: /import { initializeGUI } from '..\/utility\/initialize-gui.js';/g,
        replacement: "import { initializeGUI } from '../minified/initialize-gui.min.js';"
    },
    {
        pattern: /import { userAgent, userDevice, userTimeZone } from '..\/utility\/identification.js';/g,
        replacement: "import { userAgent, userDevice, userTimeZone } from '../minified/identification.min.js';"
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
        pattern: /import { closeAboutContainer, closeBlogContainer, subMainContainerTransition } from '.\/navigation.js';/g,
        replacement: "import { closeAboutContainer, closeBlogContainer, subMainContainerTransition } from '../minified/navigation.min.js';"
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

const updateNotesEntryReplacements = [
    {
        pattern: /import { populateDashboard } from '..\/dashboard\/populate-dashboard.js';/g,
        replacement: "import { populateDashboard } from '../minified/populate-dashboard.min.js';"
    }
]

const addNotesEntryReplacements = [
    {
        pattern: /import { populateDashboard } from '..\/dashboard\/populate-dashboard.js';/g,
        replacement: "import { populateDashboard } from '../minified/populate-dashboard.min.js';"
    }
]

const miniChartsReplacements = [
    {
        pattern: /import { getDeepWork, getFocusQuality, getTargetHours } from '.\/session-summary-chart.js';/g,
        replacement: "import { getDeepWork, getFocusQuality, getTargetHours } from '../minified/session-summary-chart.min.js';"
    }
]

// DASHBOARD

const dailySessionsReplacements = [
    {
        pattern: /import { setBounds, alterBounds, setRightArrowType } from '.\/label-distribution.js';/g,
        replacement: "import { setBounds, alterBounds, setRightArrowType } from '../minified/label-distribution.min.js';"
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
        pattern: /import { setMetricCharts } from '.\/metric-charts.js';/g,
        replacement: "import { setMetricCharts } from '../minified/metric-charts.min.js';"
    },
    {
        pattern: /import { userTimeZone } from '..\/utility\/identification.js';/g,
        replacement: "import { userTimeZone } from '../minified/identification.min.js';"
    },
    {
        pattern: /import { setInitialDate } from '.\/daily-sessions.js';/g,
        replacement: "import { setInitialDate } from '../minified/daily-sessions.min.js';"
    },
    {
        pattern: /import { calculateTotalDuration } from '..\/utility\/session-view.js';/g,
        replacement: "import { calculateTotalDuration } from '../minified/session-view.min.js';"
    }
]

const metricChartsReplacements = [
    {
        pattern: /import { setBounds, alterBounds, displayTimeFrame } from '.\/label-distribution.js';/g,
        replacement: "import { setBounds, alterBounds, displayTimeFrame } from '../minified/label-distribution.min.js';"
    }
]

const advChartsReplacements = [
    {
        pattern: /import { calculateDistractionsPerHour, focusQualityCalculation } from '..\/dashboard\/populate-dashboard.js';/g,
        replacement: "import { calculateDistractionsPerHour, focusQualityCalculation } from '../minified/populate-dashboard.min.js';"
    }
]

const mainChartsReplacements = [
    {
        pattern: /import { updateDailyContainer } from '..\/dashboard\/daily-sessions.js';/g,
        replacement: "import { updateDailyContainer } from '../minified/daily-sessions.min.js';"
    }
]

const summaryStatsReplacements = [
    {
        pattern: /import { initializeHourlyData } from '..\/utility\/adv-charts.js';/g,
        replacement: "import { initializeHourlyData } from '../minified/adv-charts.min.js';"
    }
]

const dayViewReplacements = [
    {
        pattern: /import { getDeepWork, getFocusQuality, getTargetHours } from '.\/session-summary-chart.js';/g,
        replacement: "import { getDeepWork, getFocusQuality, getTargetHours } from '../minified/session-summary-chart.min.js';"
    },
    {
        pattern: /import { userTimeZone } from '.\/identification.js';/g,
        replacement: "import { userTimeZone } from '../minified/identification.min.js';"
    },
    {
        pattern: /import { initializeSessionView } from '.\/session-view.js';/g,
        replacement: "import { initializeSessionView } from '../minified/session-view.min.js';"
    }
]

const deleteSessionReplacements = [
    {
        pattern: /import { populateDashboard } from '..\/dashboard\/populate-dashboard.js';/g,
        replacement: "import { populateDashboard } from '../minified/populate-dashboard.min.js';"
    }
]

const updateSessionSummaryDataReplacements = [
    {
        pattern: /import { populateDashboard } from '..\/dashboard\/populate-dashboard.js';/g,
        replacement: "import { populateDashboard } from '../minified/populate-dashboard.min.js';"
    }
]

const sessionViewReplacements = [
    {
        pattern: /import { updateSessionSummaryData } from '..\/state\/update-session-summary-data.js';/g,
        replacement: "import { updateSessionSummaryData } from '../minified/update-session-summary-data.min.js';"
    },
    {
        pattern: /import { deleteSession } from '..\/state\/delete-session.js';/g,
        replacement: "import { deleteSession } from '../minified/delete-session.min.js';"
    },
    {
        pattern: /import { getDeepWork } from '.\/session-summary-chart.js';/g,
        replacement: "import { getDeepWork } from '../minified/session-summary-chart.min.js';"
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
readFileAndReplace(populateDashboardJsPath, populateDashboardReplacements);
readFileAndReplace(updateLabelsJsPath, updateLabelsReplacements);
readFileAndReplace(metricChartsJsPath, metricChartsReplacements);
readFileAndReplace(advChartsJsPath, advChartsReplacements);
readFileAndReplace(summaryStatsJsPath, summaryStatsReplacements);
readFileAndReplace(pipJsPath, pipReplacements);
readFileAndReplace(dailySessionsJsPath, dailySessionsReplacements);
readFileAndReplace(miniChartsJsPath, miniChartsReplacements);
readFileAndReplace(dayViewJsPath, dayViewReplacements);
readFileAndReplace(updateNotesEntryJsPath, updateNotesEntryReplacements);
readFileAndReplace(addNotesEntryJsPath, addNotesEntryReplacements);
readFileAndReplace(mainChartsJsPath, mainChartsReplacements);
readFileAndReplace(deleteSessionJsPath, deleteSessionReplacements);
readFileAndReplace(updateSessionSummaryDataJsPath, updateSessionSummaryDataReplacements);
readFileAndReplace(sessionViewJsPath, sessionViewReplacements);