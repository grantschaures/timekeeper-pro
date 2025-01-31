export const lightHtmlBackground = 'linear-gradient(90deg, #0cc1ce, #700cce, #b004c7)';
export const darkHtmlBackground = 'linear-gradient(270deg, #202020, #202020, #202020)';

export const selectedBackground = {
    "flowtime": 'linear-gradient(90deg, #00c510, #00c431, #00c59a)',
    "chilltime": 'linear-gradient(90deg, #0f0cce, #700cce, #b004c7)'
}

export const flowtimeBackgrounds = {
    "green-default": 'linear-gradient(90deg, #00c510, #00c431, #00c59a)',
    "red-flowtime": 'linear-gradient(90deg, #c42700, #c56900, #c58000)',
    "yellow-flowtime": 'linear-gradient(90deg, #e1ff00, #90c400, #00e908)',
    "blue-flowtime": 'linear-gradient(90deg, #0f0cce, #700cce, #b004c7)',
    "purple-flowtime": 'linear-gradient(90deg, #700cce, #b004c7, #f700ff)',
    "black-flowtime": 'linear-gradient(90deg, #202020, #202020, #202020)',
    "hyperchillSunset-flowtime": 'url("/images/environments/1253862403-mid-edit.jpg")',
    "hyperchillHands-flowtime": 'url("/images/environments/1306875579-mid.jpg")',
    "hyperchillTriangle-flowtime": 'url("/images/environments/1394258314-mid.jpg")',
}

export const chilltimeBackgrounds = {
    "green-chilltime": 'linear-gradient(90deg, #00c510, #00c431, #00c59a)',
    "red-chilltime": 'linear-gradient(90deg, #c42700, #c56900, #c58000)',
    "yellow-chilltime": 'linear-gradient(90deg, #e1ff00, #90c400, #00e908)',
    "blue-default": 'linear-gradient(90deg, #0f0cce, #700cce, #b004c7)',
    "purple-chilltime": 'linear-gradient(90deg, #700cce, #b004c7, #f700ff)',
    "black-chilltime": 'linear-gradient(90deg, #202020, #202020, #202020)',
    "hyperchillSunset-chilltime": 'url("/images/environments/1253862403-mid-orange.jpg")',
    "hyperchillHands-chilltime": 'url("/images/environments/1306875579-mid-orange.jpg")',
    "hyperchillTriangle-chilltime": 'url("/images/environments/1394258314-mid-green-pixelated.jpg")',
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
    main: null // progress bar interval
};

//START TIMES
export const startTimes = {
    hyperFocus: undefined, //startTime of current hyper focus session
    chillTime: undefined, //startTime of current chill time session
    local: undefined, //local start time for current display
    beginning: undefined, //very first start time of entire session
    lastPomNotification: undefined,
    lastFlowmodoroNotification: undefined,
    lastBreakSuggestionNotification: undefined
};

//RECOVERY
export const recoverBreakState = { // not used
    displayTime: null,
    pomodorosCompleted: null,
    hyperFocusElapsedTime: null,
    localStartTime: null,
    pomIntervalTime: null
}

export const recoverPomState = { // not used
    displayTime: null,
    pomodorosCompleted: null,
    hyperFocusElapsedTime: null,
    localStartTime: null,
    breakIntervalTime: null
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
    currentFlowmodoroNotification: 0, // holds int values representing minutes
    currentFlowmodoroBreakIndex: 0, // holds index of last selected input
    currentPomodoroNotification: 0,
    currentPomodoroIntervalIndex: 0,
    currentPomodoroIntervalOrderIndex: 0,
    pomodorosCompleted: 0,
    flowTimeIntervals: 0,
    chillTimeIntervals: 0,
    catIdsArrIndex: 0
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
    progressBarContainerIsSmall: true,
    flowmodoroThumbIsDragging: false,
    autoStartFlowTimeInterval: false,
    autoStartChillTimeInterval: false,
    showingPomodoroNotificationInfoWindow: false,
    showingFlowmodoroNotificationInfoWindow: false,
    showingFlowTimeBreakNotificationInfoWindow: false,
    showingIntervalTimeInfoWindow: false,
    showingTotalTimeInfoWindow: false,
    showingMuffinInfoWindow: false,
    showingNotesAutoSwitchInfoWindow: false,
    showingPropagateUnfinishedTasksInfoWindow: false,
    showingTimestampsInfoWindow: false,
    showingDailyTargetHoursInfoWindow: false,
    showingAdvChartsSampleSizeInfoWindow: false,
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
    darkThemeActivated: false,
    modeChangeExecuted: false,
    sentFlowmodoroNotification: false,
    sentSuggestionMinutesNotification: false,
    enterKeyDown: false,
    pomodoroCountIncremented: false,
    sessionInProgress: false,
    triggeredSilentAudio: false,
    canEndSession: false,
    canSubmitSummary: false,
    intervalTimeToggle: true,
    totalTimeToggle: true,
    muffinToggle: true,
    canTriggerZZZ: true,
    pipWindowOpen: false
}

export const pip = {
    window: null
}

export const tempStorage = {
    lastSettingsSelectionId: 'pomodoroBtnContainer'
}

export const settingsMappings = {
    'pomodoroBtnContainer': 'pomodoroSettingsContainer',
    'flowmodoroBtnContainer': 'flowmodoroSettingsContainer',
    'generalBtnContainer': 'generalSettingsContainer',
    'backgroundsBtnContainer': 'backgroundsSettingsContainer',
    'displayBtnContainer': 'displaySettingsContainer',
    'dashboardBtnContainer': 'dashboardSettingsContainer',
    'notesBtnContainer': 'notesSettingsContainer',
    'soundsBtnContainer': 'soundsSettingsContainer',
    'accountBtnContainer': 'accountSettingsContainer',
    'supportAndFeedbackBtnContainer': 'supportAndFeedbackSettingsContainer'
};

export const timeAmount = {
    targetTime: null, // in ms
    breakTimeSuggestionsArr: [5, 8, 10, 15],
    suggestionMinutes: 90,
    pomodoroIntervalArr: [25, 5, 15]
}

export const progressTextMod = {
    targetTimeLeftStr: null,
    defaultTimeStr: null,
    showingTimeLeft: false
}

//STORAGE
export const savedInterruptionsArr = []; // holds number of interruptions at each interval

export const intervalArrs = {
    flowTime: [],
    chillTime: [],
    transitionTime: [],
    interruptionTime: [],
    pipWindowEvent: []
}

export const catIds = [
    'sleepyCat1',
    'sleepyCat2',
    'sleepyCat3',
    'sleepyCat4',
    'sleepyCat5',
    'sleepyCat6',
    'sleepyCat7',
    'sleepyCat8',
    'sleepyCat9'
]

export const dashboardCatIds = [
    'dashboardCat1',
    'dashboardCat2',
    'dashboardCat3',
    'dashboardCat4',
    'dashboardCat5',
    'dashboardCat6',
    'dashboardCat7',
    'dashboardCat8',
    'dashboardCat9'
]

export const tempCounters = {
    catIdsArrIndex: 0,
    dashboardCatIdsArrIndex: 0
}

export const times = {
    start: null,
    end: null
}

export const perHourData = {};

// ---------------------
// HELPER FUNCTIONS
// ---------------------

export function detectBrowser() { //Returns user's broswer type
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
