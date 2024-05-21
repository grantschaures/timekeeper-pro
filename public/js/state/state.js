import { pomodoroNotificationToggle, pomodoroInputs, autoStartPomodoroIntervalToggle, autoStartBreakIntervalToggle, pomodoroVolumeThumb, pomodoroVolumeThumb2, pomodoroRadios, flowmodoroNotificationToggle, flowmodoroInputs, flowmodoroVolumeThumb, flowmodoroVolumeThumb2, flowmodoroRadios, breakSuggestionToggle, suggestionMinutesInput, generalRadios, targetTimeReachedToggle, darkGrayTheme, defaultTheme, interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, emojiContainer, flowTimeAnimationToggle, chillTimeAnimationToggle, transitionClockSoundToggle } from '../modules/dom-elements.js';

import { sessionState } from '../modules/state-objects.js';

import { flags, timeAmount, alertVolumes, alertSounds, selectedBackgroundId, selectedBackground, flowtimeBackgrounds, chilltimeBackgrounds, selectedBackgroundIdTemp } from '../modules/index-objects.js';

import { flags as notesflags } from '../modules/notes-objects.js';

import { setInitialBackgroundCellSelection, setBackground, deactivateDarkTheme } from '../main/index.js';
import { setInitialBackgroundCellSelection, setBackground, deactivateDarkTheme } from '../minified/index.min.js';

document.addEventListener('defaultSettingsApplied', () => {
    checkUserSession();
});

function checkUserSession() {
    // Make a request to a server endpoint that will validate the session
    fetch('/api/state/sessionValidation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.isLoggedIn) {
            sessionState.loggedIn = true;
            updateGUIForLoggedInUser(data.user);
        }
    })
    .catch(error => console.error('Error validating user session:', error));
}

function updateGUIForLoggedInUser(userData) {
    
    // menu container (--> logged in version)
    updateMenuContainer(userData);
    
    // account settings page (--> logged in version)
    updateAccountSettingsTab(userData);

    // settings (--> logged in version)
    updateSettings(userData);
}

function updateMenuContainer(userData) {
    document.getElementById('loginIcon').style.display = "none";
    document.getElementById('logoutIcon').style.display = "flex";
    document.getElementById('logInOutBtn').innerText = "Log Out";
}

function updateAccountSettingsTab(userData) {
    const hideElements = ['noAccountText', 'accountOr1', 'settingsGoogleLogin', 'accountOr2', 'emailPasswordLoginMainContainer', 'loginBtnContainer'];
    const showElements = ['userEmailContainer', 'logoutBtnContainer'];

    hideElements.forEach(id => document.getElementById(id).style.display = "none");
    showElements.forEach(id => document.getElementById(id).style.display = "flex");

    document.getElementById('userEmail').innerText = userData.email;
}

function updateSettings(userData) {
    updatePomodoro(userData);
    updateChillTime(userData);
    updateFlowTime(userData);

    updateBackgroundsThemes(userData);
    updateNotes(userData);
    updateSounds(userData);
}

// POMODORO
function updatePomodoro(userData) {
    updatePomodoroNotificationToggle(userData);
    updatePomodoroIntervalArr(userData);
    updateAutoStartIntervals(userData);
    updatePomodoroAlertVolume(userData);
    updatePomodoroAlertSound(userData);
}

function updatePomodoroNotificationToggle(userData) {
    const { notificationToggle } = userData.settings.pomodoro;

    // programmatic update
    flags.pomodoroNotificationToggle = notificationToggle;

    // GUI update
    pomodoroNotificationToggle.checked = notificationToggle;
}

function updatePomodoroIntervalArr(userData) {
    const { intervalArr } = userData.settings.pomodoro;

    // programmatic update
    timeAmount.pomodoroIntervalArr = intervalArr;

    // GUI update
    pomodoroInputs.forEach((input, index) => {
        input.value = intervalArr[index];
    });
}

function updateAutoStartIntervals(userData) {
    const { autoStartPomToggle, autoStartBreakToggle } = userData.settings.pomodoro;

    // auto start pom interval programmatic & GUI update
    flags.autoStartPomodoroInterval = autoStartPomToggle;
    autoStartPomodoroIntervalToggle.checked = autoStartPomToggle;
    
    // auto start break interval programmatic & GUI update
    flags.autoStartBreakInterval = autoStartBreakToggle;
    autoStartBreakIntervalToggle.checked = autoStartBreakToggle;
}

function updatePomodoroAlertVolume(userData) {
    const { alertVolume } = userData.settings.pomodoro;

    // programmatic update
    alertVolumes.pomodoro = alertVolume;

    // GUI update
    pomodoroVolumeThumb.style.left = (alertVolume * 100) + "%";
    pomodoroVolumeThumb2.style.left = (alertVolume * 100) + "%";
}

function updatePomodoroAlertSound(userData) {
    const { alertSound } = userData.settings.pomodoro;

    // programmatic update
    alertSounds.pomodoro = alertSound;

    // GUI update
    if (alertSound === "none") {
        pomodoroRadios[0].checked = true;
        pomodoroRadios[3].checked = true;
    } else if (alertSound === "chime") {
        pomodoroRadios[1].checked = true;
        pomodoroRadios[4].checked = true;
    } else if (alertSound === "bell") {
        pomodoroRadios[2].checked = true;
        pomodoroRadios[5].checked = true;
    }
}

// CHILL TIME
function updateChillTime(userData) {
    updateChillTimeNotificationToggle(userData);
    updateChillTimeIntervalArr(userData);
    updateChillTimeAlertVolume(userData);
    updateChillTimeAlertSound(userData);
}

function updateChillTimeNotificationToggle(userData) {
    const { notificationToggle } = userData.settings.chillTime;

    // programmatic update
    flags.flowmodoroNotificationToggle = notificationToggle;

    // GUI update
    flowmodoroNotificationToggle.checked = notificationToggle;
}

function updateChillTimeIntervalArr(userData) {
    const { intervalArr } = userData.settings.chillTime;

    // programmatic update
    timeAmount.breakTimeSuggestionsArr = intervalArr;

    // GUI update
    flowmodoroInputs.forEach((input, index) => {
        input.value = intervalArr[index];
    });
}

function updateChillTimeAlertVolume(userData) {
    const { alertVolume } = userData.settings.chillTime;

    // programmatic update
    alertVolumes.flowmodoro = alertVolume;

    // GUI update
    flowmodoroVolumeThumb.style.left = (alertVolume * 100) + "%";
    flowmodoroVolumeThumb2.style.left = (alertVolume * 100) + "%";
}

function updateChillTimeAlertSound(userData) {
    const { alertSound } = userData.settings.chillTime;

    // programmatic update
    alertSounds.flowmodoro = alertSound;

    // GUI update
    if (alertSound === "none") {
        flowmodoroRadios[0].checked = true;
        flowmodoroRadios[3].checked = true;
    } else if (alertSound === "chime") {
        flowmodoroRadios[1].checked = true;
        flowmodoroRadios[4].checked = true;
    } else if (alertSound === "bell") {
        flowmodoroRadios[2].checked = true;
        flowmodoroRadios[5].checked = true;
    }
}

// FLOW TIME
function updateFlowTime(userData) {
    updateFlowTimeNotificationToggle(userData);
    updateSuggestionMinutes(userData);
    updateFlowTimeAlertVolume(userData);
    updateFlowTimeAlertSound(userData);
    updateTargetTimeReachedToggle(userData, targetTimeReachedToggle);
}

function updateFlowTimeNotificationToggle(userData) {
    const { notificationToggle } = userData.settings.flowTime;

    // programmatic update
    flags.breakSuggestionToggle = notificationToggle;

    // GUI update
    breakSuggestionToggle.checked = notificationToggle;
}

function updateSuggestionMinutes(userData) {
    const { suggestionMinutes } = userData.settings.flowTime;

    // programmatic update
    timeAmount.suggestionMinutes = suggestionMinutes;

    // GUI update
    suggestionMinutesInput.value = suggestionMinutes;
}

function updateFlowTimeAlertVolume(userData) {
    const { alertVolume } = userData.settings.flowTime;

    // programmatic update
    alertVolumes.general = alertVolume;

    // GUI update
    generalVolumeThumb.style.left = (alertVolume * 100) + "%";
    generalVolumeThumb2.style.left = (alertVolume * 100) + "%";
}

function updateFlowTimeAlertSound(userData) {
    const { alertSound } = userData.settings.flowTime;

    // programmatic update
    alertSounds.general = alertSound;

    // GUI update
    if (alertSound === "none") {
        generalRadios[0].checked = true;
        generalRadios[3].checked = true;
    } else if (alertSound === "chime") {
        generalRadios[1].checked = true;
        generalRadios[4].checked = true;
    } else if (alertSound === "bell") {
        generalRadios[2].checked = true;
        generalRadios[5].checked = true;
    }
}

function updateTargetTimeReachedToggle(userData, targetReachedToggle) {
    const { targetTimeReachedToggle } = userData.settings.flowTime;

    // programmatic update
    flags.targetReachedToggle = targetTimeReachedToggle;

    // GUI update
    targetReachedToggle.checked = targetTimeReachedToggle;
}

// BACKGROUNDS & THEMES
function updateBackgroundsThemes(userData) {
    updateBackgrounds(userData);
    updateThemes(userData);
    updateAnimations(userData);
}

function updateBackgrounds(userData) {
    const { flowTimeBackground, chillTimeBackground } = userData.settings.backgroundsThemes;

    // programmatic updates
    selectedBackgroundId.flowtime = flowTimeBackground;
    selectedBackground.flowtime = flowtimeBackgrounds[flowTimeBackground];

    selectedBackgroundId.chilltime = chillTimeBackground;
    selectedBackground.chilltime = chilltimeBackgrounds[chillTimeBackground];

    setBackground(selectedBackground.flowtime);
    setBackground(selectedBackground.chilltime);

    // GUI updates

    document.getElementById("green-default").classList.remove('selected-background');
    document.getElementById("blue-default").classList.remove('selected-background');
    setInitialBackgroundCellSelection();
}

function updateThemes(userData) {
    const { darkThemeActivated } = userData.settings.backgroundsThemes;

    // programmatic updates
    flags.darkThemeActivated = darkThemeActivated;

    // GUI updates (removing hardcoded class)
    if (!flags.darkThemeActivated) {
        darkGrayTheme.classList.remove('selected-background');
        defaultTheme.classList.add('selected-background');
        deactivateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer);
    }
}

function updateAnimations(userData) {
    const { flowTimeAnimation, chillTimeAnimation } = userData.settings.backgroundsThemes;

    // programmatic updates
    flags.flowTimeAnimationToggle = flowTimeAnimation;
    flowTimeAnimationToggle.checked = flowTimeAnimation;

    flags.chillTimeAnimationToggle = chillTimeAnimation;
    chillTimeAnimationToggle.checked = chillTimeAnimation;
}

// NOTES
function updateNotes(userData) {
    updateAutoSwitchToggle(userData);
}

function updateAutoSwitchToggle(userData) {
    const { autoSwitchToggle } = userData.settings.notes;

    notesflags.transitionNotesAutoSwitchToggle = autoSwitchToggle;

    transitionNotesAutoSwitchToggle.checked = autoSwitchToggle;
}

// Sounds
function updateSounds(userData) {
    updateTransitionClockSound(userData);
}

function updateTransitionClockSound(userData) {
    const { transitionClockSound } = userData.settings.sounds;

    flags.transitionClockSoundToggle = transitionClockSound;

    transitionClockSoundToggle.checked = transitionClockSound;
}