export const flowtimeBackgrounds = {
    "green-default": 'url("/images/hyperchill_gradients/blue-green-gradient.jpg")',
    "red-flowtime": 'url("/images/hyperchill_gradients/red-orange-gradient.jpg")',
    "yellow-flowtime": 'url("/images/hyperchill_gradients/lemon-lime-gradient.jpg")',
    "blue-flowtime": 'url("/images/hyperchill_gradients/blue-purple-gradient.jpg")',
    "purple-flowtime": 'url("/images/hyperchill_gradients/purple-pink-gradient.jpg")',
    "black-flowtime": 'url("/images/hyperchill_gradients/black-gradient.jpg")',
    "hyperchillSunset-flowtime": 'url("/images/iStock/iStock-1253862403-mid-edit.jpg")',
    "hyperchillHands-flowtime": 'url("/images/iStock/iStock-1306875579-mid.jpg")',
    "hyperchillTriangle-flowtime": 'url("/images/iStock/iStock-1394258416-mid-edit.jpg")',
}

export const chilltimeBackgrounds = {
    "green-chilltime": 'url("/images/hyperchill_gradients/blue-green-gradient.jpg")',
    "red-chilltime": 'url("/images/hyperchill_gradients/red-orange-gradient.jpg")',
    "yellow-chilltime": 'url("/images/hyperchill_gradients/lemon-lime-gradient.jpg")',
    "blue-default": 'url("/images/hyperchill_gradients/blue-purple-gradient.jpg")',
    "purple-chilltime": 'url("/images/hyperchill_gradients/purple-pink-gradient.jpg")',
    "black-chilltime": 'url("/images/hyperchill_gradients/black-gradient.jpg")',
    "hyperchillSunset-chilltime": 'url("/images/iStock/iStock-1253862403-mid-orange.jpg")',
    "hyperchillHands-chilltime": 'url("/images/iStock/iStock-1306875579-mid-invert.jpg")',
    "hyperchillTriangle-chilltime": 'url("/images/iStock/iStock-1394258416-mid-edit.jpg")',
}

export const selectedBackground = {
    "flowtime": 'url("/images/hyperchill_gradients/blue-green-gradient.jpg")',
    "chilltime": 'url("/images/hyperchill_gradients/blue-purple-gradient.jpg")'
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
    flowTimeAnimationToggle: false,
    chillTimeAnimationToggle: false,
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