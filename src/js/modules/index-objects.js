export var selectedBackground;
export var flowtimeBackgrounds;
export var chilltimeBackgrounds;

if (detectBrowser() === "Firefox") {
    selectedBackground = {
        "flowtime": 'linear-gradient(270deg, #00c510, #00c431, #00c59a)',
        "chilltime": 'linear-gradient(270deg, #0f0cce, #700cce, #b004c7)'
    }

    flowtimeBackgrounds = {
        "green-default": 'linear-gradient(270deg, #00c510, #00c431, #00c59a)',
        "red-flowtime": 'linear-gradient(270deg, #c42700, #c56900, #c58000)',
        "yellow-flowtime": 'linear-gradient(270deg, #e1ff00, #90c400, #00e908)',
        "blue-flowtime": 'linear-gradient(270deg, #0f0cce, #700cce, #b004c7)',
        "purple-flowtime": 'linear-gradient(270deg, #700cce, #b004c7, #f700ff)',
        "black-flowtime": 'linear-gradient(270deg, #202020, #202020, #202020)',
        "hyperchillSunset-flowtime": 'url("/images/iStock/iStock-1253862403-mid-edit.jpg")',
        "hyperchillHands-flowtime": 'url("/images/iStock/iStock-1306875579-mid.jpg")',
        "hyperchillTriangle-flowtime": 'url("/images/iStock/iStock-1394258314-mid.jpg")',
    }

    chilltimeBackgrounds = {
        "green-chilltime": 'linear-gradient(270deg, #00c510, #00c431, #00c59a)',
        "red-chilltime": 'linear-gradient(270deg, #c42700, #c56900, #c58000)',
        "yellow-chilltime": 'linear-gradient(270deg, #e1ff00, #90c400, #00e908)',
        "blue-default": 'linear-gradient(270deg, #0f0cce, #700cce, #b004c7)',
        "purple-chilltime": 'linear-gradient(270deg, #700cce, #b004c7, #f700ff)',
        "black-chilltime": 'linear-gradient(270deg, #202020, #202020, #202020)',
        "hyperchillSunset-chilltime": 'url("/images/iStock/iStock-1253862403-mid-orange.jpg")',
        "hyperchillHands-chilltime": 'url("/images/iStock/iStock-1306875579-mid-invert.jpg")',
        "hyperchillTriangle-chilltime": 'url("/images/iStock/iStock-1394258314-mid-green-pixelated.jpg")',
    }

} else {
    selectedBackground = {
        "flowtime": 'url("/images/hyperchill_gradients/blue-green-gradient.jpg")',
        "chilltime": 'url("/images/hyperchill_gradients/blue-purple-gradient.jpg")'
    }

    flowtimeBackgrounds = {
        "green-default": 'url("/images/hyperchill_gradients/blue-green-gradient.jpg")',
        "red-flowtime": 'url("/images/hyperchill_gradients/red-orange-gradient.jpg")',
        "yellow-flowtime": 'url("/images/hyperchill_gradients/lemon-lime-gradient.jpg")',
        "blue-flowtime": 'url("/images/hyperchill_gradients/blue-purple-gradient.jpg")',
        "purple-flowtime": 'url("/images/hyperchill_gradients/purple-pink-gradient.jpg")',
        "black-flowtime": 'url("/images/hyperchill_gradients/black-gradient.jpg")',
        "hyperchillSunset-flowtime": 'url("/images/iStock/iStock-1253862403-mid-edit.jpg")',
        "hyperchillHands-flowtime": 'url("/images/iStock/iStock-1306875579-mid.jpg")',
        "hyperchillTriangle-flowtime": 'url("/images/iStock/iStock-1394258314-mid.jpg")',
    }

    chilltimeBackgrounds = {
        "green-chilltime": 'url("/images/hyperchill_gradients/blue-green-gradient.jpg")',
        "red-chilltime": 'url("/images/hyperchill_gradients/red-orange-gradient.jpg")',
        "yellow-chilltime": 'url("/images/hyperchill_gradients/lemon-lime-gradient.jpg")',
        "blue-default": 'url("/images/hyperchill_gradients/blue-purple-gradient.jpg")',
        "purple-chilltime": 'url("/images/hyperchill_gradients/purple-pink-gradient.jpg")',
        "black-chilltime": 'url("/images/hyperchill_gradients/black-gradient.jpg")',
        "hyperchillSunset-chilltime": 'url("/images/iStock/iStock-1253862403-mid-orange.jpg")',
        "hyperchillHands-chilltime": 'url("/images/iStock/iStock-1306875579-mid-invert.jpg")',
        "hyperchillTriangle-chilltime": 'url("/images/iStock/iStock-1394258314-mid-green-pixelated.jpg")',
    }
}

export const selectedBackgroundIdTemp = {
    "flowtime": null,
    "chilltime": null
}

export const selectedBackgroundId = {
    "flowtime": "green-default",
    "chilltime": "blue-default"
}

export const timeConvert = {
    msPerHour: 3600000,
    msPerMin: 60000,
    msPerSec: 1000
};

//INTERVALS
export const intervals = {
    main: null, //progress bar interval
    total: null,
    local: null, //interval for time display
    suggestion: null,
    chillTimeBreak: null,
    pomodoro: null
};

//START TIMES
export const startTimes = {
    hyperFocus: undefined, //startTime of current hyper focus session
    chillTime: undefined, //startTime of current chill time session
    local: undefined, //local start time for current display
    beginning: undefined, //very first start time of entire session
    lastPomNotification: undefined,
    lastFlowmodoroNotification: 0, //not used
    lastBreakSuggestionNotification: 0 //not used
};

//RECOVERY
export const recoverBreakState = {
    displayTime: null,
    pomodorosCompleted: null,
    hyperFocusElapsedTime: null,
    localStartTime: null
}

export const recoverPomState = {
    displayTime: null,
    pomodorosCompleted: null,
    hyperFocusElapsedTime: null,
    localStartTime: null
}

export const elapsedTime = {
    hyperFocus: 0, //Accumulated time from each productivity interval
    chillTime: 0, //time elapsed during each Chill Time mode
    suggestionSeconds: 0,
    flowmodoroNotificationSeconds: 0,
    lastHyperFocusIntervalMin: 0,
    pomodoroNotificationSeconds: 0
}

//Alert volumes
export const alertVolumes = { // settings
    pomodoro: 0.5,
    flowmodoro: 0.5,
    general: 0.5
}

// values include 'none', 'bell', and 'chime'
export const alertSounds = {
    pomodoro: 'none',
    flowmodoro: 'none',
    general: 'none'
}

//STATE-RELATED FLAGS AND COUNTERS
export const counters = {
    startStop: 0, //tracks number of times start/stop is pressed
    interruptions: 0,
    currentFlowmodoroNotification: 0,
    currentFlowmodoroBreakIndex: 0,
    currentPomodoroNotification: 0,
    currentPomodoroIntervalIndex: 0,
    currentPomodoroIntervalOrderIndex: 0,
    pomodorosCompleted: 0
}

export const flags = {
    hitTarget: false, //Flag: target time has been reached
    submittedTarget: false, //Flag: if target time has been submitted
    inHyperFocus: false, //Flag: check if in hyper focus mode
    targetReachedToggle: false, //Flag: changes based on user setting (alerts user when target reached)
    breakSuggestionToggle: false, // settings
    submittedSuggestionMinutes: false,
    transitionClockSoundToggle: false,
    flowmodoroNotificationToggle: false, // settings
    progressBarContainerIsSmall: false,
    flowmodoroThumbIsDragging: false,
    autoStartFlowTimeInterval: false,
    autoStartChillTimeInterval: false,
    showingPomodoroNotificationInfoWindow: false,
    showingFlowmodoroNotificationInfoWindow: false,
    showingFlowTimeBreakNotificationInfoWindow: false,
    showingNotesAutoSwitchInfoWindow: false,
    showingPropagateUnfinishedTasksInfoWindow: false,
    generalThumbIsDragging: false,
    pomodoroThumbIsDragging: false,
    flowmodoroThumbIsDragging2: false,
    generalThumbIsDragging2: false,
    pomodoroThumbIsDragging2: false,
    pomodoroNotificationToggle: false, // settings
    autoStartPomodoroInterval: false, // settings
    autoStartBreakInterval: false, // settings
    autoSwitchedModes: false,
    inRecoveryBreak: false,
    inRecoveryPom: false,
    flowTimeAnimationToggle: true,
    chillTimeAnimationToggle: true,
    darkThemeActivated: true,
    modeChangeExecuted: false,
    sentFlowmodoroNotification: false,
    sentSuggestionMinutesNotification: false,
    enterKeyDown: false,
    pomodoroCountIncremented: false,
    sessionInProgress: false
}

export const tempStorage = {
    lastSettingsSelectionId: 'pomodoroBtnContainer'
}

export const settingsMappings = {
    'pomodoroBtnContainer': 'pomodoroSettingsContainer',
    'flowmodoroBtnContainer': 'flowmodoroSettingsContainer',
    'generalBtnContainer': 'generalSettingsContainer',
    'backgroundsBtnContainer': 'backgroundsSettingsContainer',
    'notesBtnContainer': 'notesSettingsContainer',
    'soundsBtnContainer': 'soundsSettingsContainer',
    'accountBtnContainer': 'accountSettingsContainer',
    'supportAndFeedbackBtnContainer': 'supportAndFeedbackSettingsContainer'
};

//STORAGE
export const savedInterruptionsArr = [];

export const timeAmount = {
    targetTime: null,
    breakTimeSuggestionsArr: [5, 8, 10, 15],
    suggestionMinutes: 90,
    pomodoroIntervalArr: [25, 5, 15]
}

// ---------------------
// HELPER FUNCTIONS
// ---------------------

function detectBrowser() { //Returns user's broswer type
    var userAgent = navigator.userAgent;

    if (userAgent.indexOf("Firefox") > -1) {
        // alert("You are using Mozilla Firefox");
        return "Firefox";
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) {
        // alert("You are using Safari");
        return "Safari"
    } else if (userAgent.indexOf("Edg") > -1) {
        // alert("You are using the Chromium-based Microsoft Edge");
        return "Chromium-Edge";
    } else if (userAgent.indexOf("Edge") > -1) {
        // alert("You are using the Legacy Microsoft Edge");
        return "Legacy Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
        // alert("You are using Chrome")
        return "Chrome"
    } else {
        // alert("You are using another browser");
        return "Another browser"
    }
}
