export const flowtimeBackgrounds = {
    "green-default": "linear-gradient(270deg, #3ec500, #37c400, #00c59a)",
    "red-flowtime": "linear-gradient(270deg, #c42700, #c56900, #c58000)",
    "yellow-flowtime": "linear-gradient(270deg, #b8c500, #90c400, #5fc500)",
    "blue-flowtime": "linear-gradient(270deg, #3b8fe3, #1d60a3, #7f04c7)",
    "purple-flowtime": "linear-gradient(270deg, #7f04c7, #b004c7, #c004c7)",
    "black-flowtime": "linear-gradient(270deg, #202020, #202020, #202020)"
}

export const chilltimeBackgrounds = {
    "green-chilltime": "linear-gradient(270deg, #3ec500, #37c400, #00c59a)",
    "red-chilltime": "linear-gradient(270deg, #c42700, #c56900, #c58000)",
    "yellow-chilltime": "linear-gradient(270deg, #b8c500, #90c400, #5fc500)",
    "blue-default": "linear-gradient(270deg, #3b8fe3, #1d60a3, #7f04c7)",
    "purple-chilltime": "linear-gradient(270deg, #7f04c7, #b004c7, #c004c7)",
    "black-chilltime": "linear-gradient(270deg, #202020, #202020, #202020)"
}

export const selectedBackground = {
    "flowtime": "linear-gradient(270deg, #3ec500, #37c400, #00c59a)",
    "chilltime": "linear-gradient(270deg, #3b8fe3, #1d60a3, #7f04c7)"
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
export const alertVolumes = {
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
    breakSuggestionToggle: false,
    submittedSuggestionMinutes: false,
    transitionClockSoundToggle: false,
    flowmodoroNotificationToggle: false,
    progressBarContainerIsSmall: false,
    flowmodoroThumbIsDragging: false,
    autoStartFlowTimeInterval: false,
    autoStartChillTimeInterval: false,
    showingPomodoroNotificationInfoWindow: false,
    showingFlowmodoroNotificationInfoWindow: false,
    showingFlowTimeBreakNotificationInfoWindow: false,
    showingNotesAutoSwitchInfoWindow: false,
    generalThumbIsDragging: false,
    pomodoroThumbIsDragging: false,
    flowmodoroThumbIsDragging2: false,
    generalThumbIsDragging2: false,
    pomodoroThumbIsDragging2: false,
    pomodoroNotificationToggle: false,
    autoStartPomodoroInterval: false,
    autoStartBreakInterval: false,
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
    pomodoroCountIncremented: false
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