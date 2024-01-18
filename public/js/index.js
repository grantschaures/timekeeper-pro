//
//  JavaScript code for main event handling
//
const pomodoroWorker = new Worker('/js/pomodoroWorker.js');
const suggestionWorker = new Worker('/js/suggestionWorker.js');
const flowmodoroWorker = new Worker('/js/flowmodoroWorker.js');
const displayWorker = new Worker('/js/displayWorker.js');
const totalDisplayWorker = new Worker('/js/totalDisplayWorker.js');

document.addEventListener("DOMContentLoaded", function() {
    // ------------------------------
    // DOM ELEMENTS & INITIAL SETUP
    // ------------------------------
    const start_stop_btn = document.getElementById("start-stop");
    const submit_change_btn = document.getElementById("target-hours-submit");
    const end_session_btn = document.getElementById("end-session");
    const report_btn = document.getElementById("reportBtn");
    const total_time_display = document.getElementById("progress-text");
    const productivity_chill_mode = document.getElementById("productivity-chill-mode");
    const progressBarContainer = document.getElementById("progress-bar-container");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const display = document.getElementById("display");

    // INTERRUPTIONS CONTAINER
    const interruptionsContainer = document.getElementById("interruptions-container");
    const interruptionsSubContainer = document.getElementById("interruptions-sub-container");
    const decBtn = document.getElementById("decBtn");
    const incBtn = document.getElementById("incBtn");

    const interruptionsNum = document.getElementById("interruptions_num");

    const suggestionBreakContainer = document.getElementById("suggestionBreakContainer");
    const suggestionBreak_label = document.getElementById("suggestionBreak-label");
    const suggestionBreak_min = document.getElementById("suggestionBreak-min");

    const completedPomodorosContainer = document.getElementById("completedPomodorosContainer");
    const completedPomodoros_label = document.getElementById("completedPomodoros-label");
    const completedPomodoros_min = document.getElementById("completedPomodoros-min");

    const targetHoursContainer = document.getElementById("target-hours-container");

    const timekeepingContainer = document.getElementById("timekeeping-container");

    const popup_window = document.getElementById("popup-menu");

    const settingsContainer = document.getElementById("settingsContainer");

    const notesContainer = document.getElementById("notes-container");

    const aboutContainer = document.getElementById("aboutContainer");
    const blogContainer = document.getElementById("blogContainer");

    const blackFlowtimeBackground = document.getElementById("black-flowtime");
    const blackChilltimeBackground = document.getElementById("black-chilltime");

    // SETTINGS
    const targetTimeReachedToggle = document.getElementById("targetTimeReachedToggle");
    const breakSuggestionToggle = document.getElementById("breakSuggestionToggle");
    const suggestionMinutesInput = document.getElementById("suggestionMinutesInput");
    const flowmodoroNotificationToggle = document.getElementById("flowmodoroNotificationToggle");
    // const autoStartFlowTimeIntervalToggle = document.getElementById("autoStartFlowTimeIntervalToggle");
    const flowmodoroNotifications = document.getElementById("flowmodoroNotifications");
    const flowmodoroNotificationInfoWindow = document.getElementById("flowmodoroNotificationInfoWindow");
    const flowTimeBreakNotification = document.getElementById("flowTimeBreakNotification");
    const flowTimeBreakNotificationInfoWindow = document.getElementById("flowTimeBreakNotificationInfoWindow");
    const pomodoroNotifications = document.getElementById("pomodoroNotifications");
    const pomodoroNotificationInfoWindow = document.getElementById("pomodoroNotificationInfoWindow");

    const pomodoroNotificationToggle = document.getElementById("pomodoroNotificationToggle");
    const autoStartPomodoroIntervalToggle = document.getElementById("autoStartPomodoroIntervalToggle");
    const autoStartBreakIntervalToggle = document.getElementById("autoStartBreakIntervalToggle");

    const defaultThemeContainer = document.getElementById("defaultThemeContainer");
    const defaultTheme = document.getElementById("defaultTheme");

    const darkThemeContainer = document.getElementById("darkThemeContainer");
    const darkGrayTheme = document.getElementById("darkGrayTheme");

    let hoverTimer;
    const targetTimeReachedAlert = document.getElementById("targetTimeReachedAlert");
    const transitionClockSoundToggle = document.getElementById("transitionClockSoundToggle");

    const flowTimeAnimationToggle = document.getElementById("flowTimeAnimationToggle");
    const chillTimeAnimationToggle = document.getElementById("chillTimeAnimationToggle");

    const pomodoroVolumeContainer = document.getElementById("pomodoroVolumeContainer");
    const pomodoroVolumeBar = document.getElementById('pomodoroVolumeBar');
    const pomodoroVolumeThumb = document.getElementById('pomodoroVolumeThumb');

    const flowmodoroVolumeContainer = document.getElementById("flowmodoroVolumeContainer");
    const flowmodoroVolumeBar = document.getElementById('flowmodoroVolumeBar');
    const flowmodoroVolumeThumb = document.getElementById('flowmodoroVolumeThumb');

    const generalVolumeContainer = document.getElementById("generalVolumeContainer");
    const generalVolumeBar = document.getElementById('generalVolumeBar');
    const generalVolumeThumb = document.getElementById('generalVolumeThumb');

    const pomodoroVolumeContainer2 = document.getElementById("pomodoroVolumeContainer2");
    const pomodoroVolumeBar2 = document.getElementById('pomodoroVolumeBar2');
    const pomodoroVolumeThumb2 = document.getElementById('pomodoroVolumeThumb2');

    const flowmodoroVolumeContainer2 = document.getElementById("flowmodoroVolumeContainer2");
    const flowmodoroVolumeBar2 = document.getElementById('flowmodoroVolumeBar2');
    const flowmodoroVolumeThumb2 = document.getElementById('flowmodoroVolumeThumb2');

    const generalVolumeContainer2 = document.getElementById("generalVolumeContainer2");
    const generalVolumeBar2 = document.getElementById('generalVolumeBar2');
    const generalVolumeThumb2 = document.getElementById('generalVolumeThumb2');

    const flowmodoroRadios = document.querySelectorAll('.flowmodoroAlert');
    const flowmodoroInputs = document.querySelectorAll('.flowmodoroBreak');
    const generalRadios = document.querySelectorAll('.generalAlert');
    const pomodoroInputs = document.querySelectorAll('.pomodoroInterval')
    const pomodoroRadios = document.querySelectorAll('.pomodoroAlert');
    const flowtimeBackgroundCells = document.querySelectorAll('.flowtimeBackgroundCell');
    const chilltimeBackgroundCells = document.querySelectorAll('.chilltimeBackgroundCell');
    // const autoStartChillTimeIntervalToggle = document.getElementById("autoStartChillTimeIntervalToggle");

    // Audio
    const chime = new Audio('sounds/alerts/LEX_LM_77_bell_loop_vinyl_night_F.wav');
    const bell = new Audio('sounds/alerts/ESM_Christmas_Glockenspiel_Bell_Pluck_Hit_Single_9_Wet_Perc_Tonal.wav');
    const clock_tick = new Audio('sounds/new_clock_tick.wav');

    // Background Animations
    const flowAnimation = document.getElementById("flowAnimation");
    const chillAnimation = document.getElementById("chillAnimation");

    // Logo
    const hyperChillLogoImage = document.getElementById("hyperChillLogoImage");

    // NOTES
    const userInputTask = document.getElementById("userInputTask");

    // Favicons
    const greenFavicon = "/images/logo/HyperChillLogoGreen.png";
    const blueFavicon = "/images/logo/HyperChillLogoBlue.png";

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;

    const flowtimeBackgrounds = {
        "green-default": "linear-gradient(to bottom, #5dd44d, #50b350, #004400)",
        "red-flowtime": "linear-gradient(to bottom, #ff595e, #ff595e, #ff595e)",
        "yellow-flowtime": "linear-gradient(to bottom, #ffca3a, #ffca3a, #ffca3a)",
        "blue-flowtime": "linear-gradient(to bottom, #1982c4, #1982c4, #1982c4)",
        "purple-flowtime": "linear-gradient(to bottom, #6a4c93, #6a4c93, #6a4c93)",
        "black-flowtime": "linear-gradient(to bottom, #202020, #202020, #202020)"
    }

    const chilltimeBackgrounds = {
        "blue-default": "linear-gradient(to bottom, #3b8fe3, #1d60a3, #7f04c7)",
        "red-chilltime": "linear-gradient(to bottom, #ff595e, #ff595e, #ff595e)",
        "yellow-chilltime": "linear-gradient(to bottom, #ffca3a, #ffca3a, #ffca3a)",
        "green-chilltime": "linear-gradient(to bottom, #5dd44d, #5dd44d, #5dd44d)",
        "purple-chilltime": "linear-gradient(to bottom, #6a4c93, #6a4c93, #6a4c93)",
        "black-chilltime": "linear-gradient(to bottom, #202020, #202020, #202020)"
    }

    const selectedBackground = {
        "flowtime": "linear-gradient(to bottom, #5dd44d, #50b350, #004400)",
        "chilltime": "linear-gradient(to bottom, #3b8fe3, #1d60a3, #7f04c7)"
    }

    const selectedBackgroundIdTemp = {
        "flowtime": null,
        "chilltime": null
    }

    const selectedBackgroundId = {
        "flowtime": "green-default",
        "chilltime": "blue-default"
    }

    const timeConvert = {
        msPerHour: 3600000,
        msPerMin: 60000,
        msPerSec: 1000
    };

    //INTERVALS
    let intervals = {
        main: null, //progress bar interval
        total: null,
        local: null, //interval for time display
        suggestion: null,
        chillTimeBreak: null,
        pomodoro: null
    };
    
    //START TIMES
    let startTimes = {
        hyperFocus: undefined, //startTime of current hyper focus session
        chillTime: undefined, //startTime of current chill time session
        local: undefined, //local start time for current display
        beginning: undefined, //very first start time of entire session
        lastPomNotification: undefined,
        lastFlowmodoroNotification: 0, //not used
        lastBreakSuggestionNotification: 0 //not used
    };

    //RECOVERY
    let recoverBreakState = {
        displayTime: null,
        pomodorosCompleted: null,
        hyperFocusElapsedTime: null,
        localStartTime: null
    }

    let recoverPomState = {
        displayTime: null,
        pomodorosCompleted: null,
        hyperFocusElapsedTime: null,
        localStartTime: null
    }

    //TIME AMOUNTS
    let targetTime = null; //Target amount of time in ms
    let breakTimeSuggestionsArr = [5, 8, 10, 15];
    let suggestionMinutes = null; //Suggestion minutes
    let pomodoroIntervalArr = [25, 5, 15];

    // not used; initialized for reference
    let pomodoroIntervalOrderArr = ['pom1', 'shortbreak1', 'pom2', 'shortbreak2', 'pom3', 'shortbreak3', 'pom4', 'longbreak'];

    let elapsedTime = {
        hyperFocus: 0, //Accumulated time from each productivity interval
        chillTime: 0, //time elapsed during each Chill Time mode
        suggestionSeconds: 0,
        flowmodoroNotificationSeconds: 0,
        lastHyperFocusIntervalMin: 0,
        pomodoroNotificationSeconds: 0
    }

    //Alert volumes
    let alertVolumes = {
        pomodoro: 0.5,
        flowmodoro: 0.5,
        general: 0.5
    }

    let alertSounds = {
        pomodoro: 'none',
        flowmodoro: 'none',
        general: 'none'
    }

    //STATE-RELATED FLAGS AND COUNTERS
    let counters = {
        startStop: 0, //tracks number of times start/stop is pressed
        interruptions: 0,
        currentFlowmodoroNotification: 0,
        currentFlowmodoroBreakIndex: 0,
        currentPomodoroNotification: 0,
        currentPomodoroIntervalIndex: 0,
        currentPomodoroIntervalOrderIndex: 0,
        pomodorosCompleted: 0
    }

    //STORAGE
    savedInterruptionsArr = [];

    let flags = {
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
        inRecoveryBreak2: false,
        inRecoveryPom2: false,
        flowTimeAnimationToggle: true,
        chillTimeAnimationToggle: true,
        darkThemeActivated: false,
        modeChangeExecuted: false,
        sentFlowmodoroNotification: false,
        sentSuggestionMinutesNotification: false
    }

    tempStorage = {
        lastSettingsSelectionId: 'pomodoroBtnContainer'
    }

    const settingsMappings = {
        'pomodoroBtnContainer': 'pomodoroSettingsContainer',
        'flowmodoroBtnContainer': 'flowmodoroSettingsContainer',
        'generalBtnContainer': 'generalSettingsContainer',
        'backgroundsBtnContainer': 'backgroundsSettingsContainer',
        'soundsBtnContainer': 'soundsSettingsContainer',
        'accountBtnContainer': 'accountSettingsContainer',
        'supportAndFeedbackBtnContainer': 'supportAndFeedbackSettingsContainer' ,
    };

    // ----------------
    // MAIN CODE (Runs after DOM content is loaded)
    // ----------------

    //Safari on iPad Pro acts like mobile (no push notifications) but identifies as desktop

    // INITIAL DOMContentLoaded FUNCTION CALLS
    setInitialEndSessionBtnText(initialViewportWidth, end_session_btn);

    if (isMobile) {
        //
    }

    // ----------------
    // EVENT LISTENERS
    // ----------------
    document.addEventListener('keydown', (event) => handleEnter(event, start_stop_btn, submit_change_btn, userInputTask, flags));

    start_stop_btn.addEventListener("click", function() {

        playClick(clock_tick, flags);
        resetDisplay(display);

        counters.startStop++; //keep track of button presses (doesn't account for time recovery iterations)

        if (counters.startStop === 1) {
            veryStartActions(startTimes, hyperChillLogoImage, progressBarContainer, flags);
            startTimes.lastPomNotification = Date.now();
            // elapsedTime.hyperFocus += 180000;
        } else { // if not very first transition, and in pomodoro mode and not coming from non-pomodoro mode
            if ((flags.pomodoroNotificationToggle) && (productivity_chill_mode.textContent !== "Chill Time")) {
                iterateCurrentPomodoroIntervalOrderIndex(counters);
            }
        }

        //EDIT
        if (flags.inRecoveryBreak) {
            startTimes.local = recoverBreakState.localStartTime;
        } else if (flags.inRecoveryPom2) {
            startTimes.local = recoverPomState.localStartTime;
        } else {
            startTimes.local = Date.now();
        }

        displayWorker.postMessage("clearInterval");
        displayWorker.postMessage("startInterval");
        
        if (!intervals.main) { //executes when interval is undefined --> Flow Time
            flags.inHyperFocus = true;
            flags.sentFlowmodoroNotification = false;

            totalDisplayWorker.postMessage("startInterval");

            setFavicon(greenFavicon);

            if (counters.startStop > 1) {
                animationsFadeOut(chillAnimation);
            }
            
            if (flags.flowTimeAnimationToggle) {
                animationsFadeIn(flowAnimation, 'block');
            }

            hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min);
            hidePomodorosCompletedContainer(completedPomodorosContainer);
            showInterruptionsSubContainer(interruptionsSubContainer);

            //Console.log out the --> Hyper Focus Time (00:00 format)
            // console.log(getCurrentTime() + " --> Entering Flow Time");

            if (flags.pomodoroNotificationToggle) {
                let pomodoroString;
                if (counters.currentPomodoroIntervalOrderIndex === 0) {
                    pomodoroString = "Pomodoro #1 | " + (pomodoroIntervalArr[0]).toString() + " min";
                } else if (counters.currentPomodoroIntervalOrderIndex === 2) {
                    pomodoroString = "Pomodoro #2 | " + (pomodoroIntervalArr[0]).toString() + " min";
                } else if (counters.currentPomodoroIntervalOrderIndex === 4) {
                    pomodoroString = "Pomodoro #3 | " + (pomodoroIntervalArr[0]).toString() + " min";
                } else if (counters.currentPomodoroIntervalOrderIndex === 6) {
                    pomodoroString = "Pomodoro #4 | " + (pomodoroIntervalArr[0]).toString() + " min";
                }

                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop", pomodoroString);
            } else {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop","Flow Time");
            }

            if (flags.inRecoveryPom2) {
                elapsedTime.hyperFocus = recoverPomState.hyperFocusElapsedTime;
            }
            
            if (!flags.inRecoveryPom2) {
                startTimes.hyperFocus = Date.now();
            }

            intervals.main = setInterval(() => updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer), 1000); //repeatedly calls reference to updateProgressBar function every 1000 ms (1 second)
            
            setCurrentPomodoroNotification(counters, pomodoroIntervalArr);
            //if pomodoro notification toggle is set BEFORE entering Flow Time
            if (flags.pomodoroNotificationToggle) {

                if ((flags.inRecoveryPom2) && !((flags.autoStartPomodoroInterval) && (flags.autoStartBreakInterval))) {
                    elapsedTime.pomodoroNotificationSeconds = Math.round((counters.currentPomodoroNotification * 60) - ((recoverPomState.displayTime / 1000) - 1));
                } else {
                    elapsedTime.pomodoroNotificationSeconds = (counters.currentPomodoroNotification * 60);
                }
                pomodoroWorker.postMessage("clearInterval");
                pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
            }
            
            
            if (flags.breakSuggestionToggle) {
                elapsedTime.suggestionSeconds = (suggestionMinutes * 60);
                suggestionWorker.postMessage(elapsedTime.suggestionSeconds);
            }

            if (flags.flowmodoroNotificationToggle) {
                flowmodoroWorker.postMessage("clearInterval");
            }

            if (counters.startStop > 1) { // runs first during first chill time interval
                elapsedTime.chillTime += Date.now() - startTimes.chillTime;
            }
            setBackground(selectedBackground.flowtime);
            flags.autoSwitchedModes = false;
            setTimeout(() => {
                flags.modeChangeExecuted = false;
            }, 1000)
            // setBackground("url('../images/DALLE/DALLE7.png')");
        } else { //--> Chill Time
            flags.inHyperFocus = false;
            if (flags.inRecoveryBreak || (flags.inRecoveryPom && !flags.autoSwitchedModes)) {
                elapsedTime.hyperFocus = recoverBreakState.hyperFocusElapsedTime;
            }

            setFavicon(blueFavicon);

            animationsFadeOut(flowAnimation);

            if (flags.chillTimeAnimationToggle) {
                animationsFadeIn(chillAnimation, 'flex');
            }

            saveResetInterruptions(interruptionsNum, counters, savedInterruptionsArr);
            hideInterruptionsSubContainer(interruptionsSubContainer);

            flags.lastHyperFocusIntervalMin = Math.floor((Date.now() - startTimes.hyperFocus) / (1000 * 60));
            let previousHyperFocusElapsedTime = elapsedTime.hyperFocus;
            elapsedTime.hyperFocus += Date.now() - startTimes.hyperFocus;
            // console.log("--> Chill Time: " + elapsedTime.hyperFocus);
            if (flags.pomodoroNotificationToggle) {
                showPomodorosCompletedContainer(completedPomodorosContainer, completedPomodoros_label, completedPomodoros_min, counters);

                //rounds time to nearest second based on elapsed hyper focus milliseconds
                //potential (low probability) bug if ms goes below 500 in preceeding second or above 500 in the next second
                //find a more comprehensive solution if i have time in the future
                let predictedTime = previousHyperFocusElapsedTime + (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60 * 1000);
                if (flags.autoSwitchedModes) {
                    elapsedTime.hyperFocus = predictedTime;
                    // console.log("PREDICTED TIME: " + predictedTime);
                }
                var milliseconds = elapsedTime.hyperFocus;
                elapsedTime.hyperFocus = Math.round(milliseconds / 1000) * 1000; //see if this is necessary for manual transition
                totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
                if (flags.inRecoveryBreak) {
                    setTimeout(() => {
                        updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer);
                    }, 1000)

                    if (getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes) < targetTime) {
                        progressContainer.classList.remove("glowing-effect");
                        flags.hitTarget = false;
                    }
                }
            } else {
                showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, breakTimeSuggestionsArr, counters, flags);
            }
            flags.autoSwitchedModes = false;

            //if chill time break suggestion is set BEFORE entering Chill Time
            if (flags.flowmodoroNotificationToggle) {
                elapsedTime.flowmodoroNotificationSeconds = (counters.currentFlowmodoroNotification * 60);
                flowmodoroWorker.postMessage(elapsedTime.flowmodoroNotificationSeconds);
            }
            // console.log(getCurrentTime() + " --> Entering Chill Time");

            setCurrentPomodoroNotification(counters, pomodoroIntervalArr);
            //if pomodoro notification toggle is set BEFORE entering Flow Time

            //EDIT
            if (flags.pomodoroNotificationToggle) {
                if ((flags.inRecoveryBreak) && !((flags.autoStartPomodoroInterval) && (flags.autoStartBreakInterval))) {
                    elapsedTime.pomodoroNotificationSeconds = Math.round((counters.currentPomodoroNotification * 60) - ((recoverBreakState.displayTime / 1000) - 1));
                } else {
                    elapsedTime.pomodoroNotificationSeconds = (counters.currentPomodoroNotification * 60);
                }
                pomodoroWorker.postMessage("clearInterval");
                pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
            }
            
            // console.log("Interval Index: " + counters.currentPomodoroIntervalOrderIndex);
            if (flags.pomodoroNotificationToggle) {
                let breakString;
                if (counters.currentPomodoroIntervalOrderIndex === 1) {
                    breakString  = "Short Break #1 | " + (pomodoroIntervalArr[1]).toString() + " min";
                } else if (counters.currentPomodoroIntervalOrderIndex === 3) {
                    breakString  = "Short Break #2 | " + (pomodoroIntervalArr[1]).toString() + " min";
                } else if (counters.currentPomodoroIntervalOrderIndex === 5) {
                    breakString  = "Short Break #3 | " + (pomodoroIntervalArr[1]).toString() + " min";
                } else if (counters.currentPomodoroIntervalOrderIndex === 7) {
                    breakString  = "Long Break | " + (pomodoroIntervalArr[2]).toString() + " min";
                }
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start", breakString);
            } else {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start", "Chill Time");
            }
            startTimes.chillTime = Date.now();

            clearInterval(intervals.main);
            intervals.main = null;

            totalDisplayWorker.postMessage("clearInterval");

            //if flow time break notification is turned on
            if (flags.breakSuggestionToggle) {
                suggestionWorker.postMessage("clearInterval");
            }

            setBackground(selectedBackground.chilltime);
        }

        flags.inRecoveryBreak = false;
        flags.inRecoveryPom = false;
        flags.inRecoveryBreak2 = false;
        flags.inRecoveryPom2 = false;
        flags.sentSuggestionMinutesNotification = false;

        setTimeout(() => {
            flags.modeChangeExecuted = false;
        }, 1000)
    });
    
    submit_change_btn.addEventListener("click", function() {
        if (!flags.submittedTarget) { //When submitting target hours
            
            let inputHours = document.getElementById("target-hours").value;
            
            // Check if the input is empty or zero
            if(!targetHoursValidate(inputHours, timeConvert, startTimes, elapsedTime, flags, counters)) {
                return;
            }

            if (flags.hitTarget) { //remove glowing effect if we've hit the target time (regardless of mode)
                progressContainer.classList.remove("glowing-effect");
            }

            targetTime = replaceTargetHours(inputHours, targetTime, flags); //sets targetTime

            if (flags.progressBarContainerIsSmall) {
                progressBarContainer.classList.toggle("small"); // make progress container large
                flags.progressBarContainerIsSmall = false;
            }
            
            /* Update progress bar & percentage ONCE to demonstrate submitted change in Chill Time.
                In Flow Time, this code makes the change happen just a little bit faster. */
            updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer);
            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
            
            flags.hitTarget = false;
        }
        else if (flags.submittedTarget) { //When changing target hours
            if (flags.hitTarget) {
                progressContainer.classList.remove("glowing-effect");
            }

            changeTargetHours(flags);

            /* Update progress bar & percentage ONCE to demonstrate submitted change in Chill Time.
                In Flow Time, this code makes the change happen just a little bit faster. */
            updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer);
            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
            
            /* The reason for this is that we don't want to bombard the user with progress container animations at the very start of the program :P */
            if (counters.startStop > 0) { // only if session has been started
                if (!flags.progressBarContainerIsSmall) { // and progress bar container is large
                    progressBarContainer.classList.toggle("small"); // make progress container small
                    flags.progressBarContainerIsSmall = true;
                }
            }
        }
    });

    suggestionMinutesInput.addEventListener("change", function() {

        // Immediate actions w/ user's inputted value
        let inputSuggestionMinutes = suggestionMinutesInput.value;
        suggestionMinutes = Math.round(parseFloat(inputSuggestionMinutes));
        let validatedFinalInputVal = validateAndSetNotificationInput(suggestionMinutes);
        suggestionMinutesInput.value = validatedFinalInputVal;

        
        if (flags.breakSuggestionToggle) {
            setSuggestionMinutes(startTimes, flags, elapsedTime, validatedFinalInputVal, intervals, alertSounds, alertVolumes, chime, bell, start_stop_btn);
        }
    })

    decBtn.addEventListener("click", function() {
        if (counters.interruptions > 0) {
            counters.interruptions--;
            interruptionsNum.textContent = counters.interruptions;
        }
    })

    incBtn.addEventListener("click", function() {
        if (counters.interruptions < 1000) {
            counters.interruptions++;
            interruptionsNum.textContent = counters.interruptions;
        }
    })

    // Settings Menu Functionality (showing & hiding containers)
    for (const [buttonId, containerId] of Object.entries(settingsMappings)) {
        document.getElementById(buttonId).addEventListener('click', function() {
            hideAllSettingsContainers(settingsMappings);
            document.getElementById(containerId).style.display = 'block';
            this.classList.add('selected');
            tempStorage.lastSettingsSelectionId = buttonId;
        });
    }

    if (isMobile) {
        document.getElementById("notificationsHeaderContainer").style.display = 'none';
        document.getElementById("pomodoroBtnContainer").style.display = 'none';
        document.getElementById("flowmodoroBtnContainer").style.display = 'none';
        document.getElementById("generalBtnContainer").style.display = 'none';

        document.getElementById("pomodoroSettingsContainer").style.display = 'none';
        document.getElementById("flowmodoroSettingsContainer").style.display = 'none';
        document.getElementById("generalSettingsContainer").style.display = 'none';

        document.getElementById("pomodoroAlertSoundBlock2").style.display = 'none';
        document.getElementById("flowmodoroAlertSoundBlock2").style.display = 'none';
        document.getElementById("generalAlertSoundBlock2").style.display = 'none';

        tempStorage.lastSettingsSelectionId = 'backgroundsBtnContainer';
    }

    pomodoroNotifications.addEventListener('click', function() {
        toggleInfoWindow(pomodoroNotificationInfoWindow, 'showingPomodoroNotificationInfoWindow', flags);
    });

    flowmodoroNotifications.addEventListener('click', function() {
        toggleInfoWindow(flowmodoroNotificationInfoWindow, 'showingFlowmodoroNotificationInfoWindow', flags);
    });
    
    flowTimeBreakNotification.addEventListener('click', function() {
        toggleInfoWindow(flowTimeBreakNotificationInfoWindow, 'showingFlowTimeBreakNotificationInfoWindow', flags);
    });

    flowmodoroVolumeThumb.addEventListener('mousedown', (event) => {
        flags.flowmodoroThumbIsDragging = true;
        event.preventDefault();
    })

    generalVolumeThumb.addEventListener('mousedown', (event) => {
        flags.generalThumbIsDragging = true;
        event.preventDefault();
    })

    pomodoroVolumeThumb.addEventListener('mousedown', (event) => {
        flags.pomodoroThumbIsDragging = true;
        event.preventDefault();
    })

    flowmodoroVolumeThumb2.addEventListener('mousedown', (event) => {
        flags.flowmodoroThumbIsDragging2 = true;
        event.preventDefault();
    })

    generalVolumeThumb2.addEventListener('mousedown', (event) => {
        flags.generalThumbIsDragging2 = true;
        event.preventDefault();
    })

    pomodoroVolumeThumb2.addEventListener('mousedown', (event) => {
        flags.pomodoroThumbIsDragging2 = true;
        event.preventDefault();
    })

    document.addEventListener('mousemove', (event) => {
        if (flags.flowmodoroThumbIsDragging) {
            alertVolumeChange(flowmodoroVolumeContainer, alertVolumes, flowmodoroVolumeThumb, flowmodoroVolumeBar, flowmodoroVolumeThumb2, flowmodoroVolumeBar2, event, flags);
        } else if (flags.flowmodoroThumbIsDragging2) {
            alertVolumeChange(flowmodoroVolumeContainer2, alertVolumes, flowmodoroVolumeThumb, flowmodoroVolumeBar, flowmodoroVolumeThumb2, flowmodoroVolumeBar2, event, flags);
        } else if (flags.generalThumbIsDragging) {
            alertVolumeChange(generalVolumeContainer, alertVolumes, generalVolumeThumb, generalVolumeBar,  generalVolumeThumb2, generalVolumeBar2, event, flags);
        } else if (flags.generalThumbIsDragging2) {
            alertVolumeChange(generalVolumeContainer2, alertVolumes, generalVolumeThumb, generalVolumeBar,  generalVolumeThumb2, generalVolumeBar2, event, flags);
        } else if (flags.pomodoroThumbIsDragging) {
            alertVolumeChange(pomodoroVolumeContainer, alertVolumes, pomodoroVolumeThumb, pomodoroVolumeBar,  pomodoroVolumeThumb2, pomodoroVolumeBar2, event, flags)
        }  else if (flags.pomodoroThumbIsDragging2) {
            alertVolumeChange(pomodoroVolumeContainer2, alertVolumes, pomodoroVolumeThumb, pomodoroVolumeBar, pomodoroVolumeThumb2, pomodoroVolumeBar2, event, flags)
        }
    })

    document.addEventListener('mouseup', (event) => {
        if ((flags.flowmodoroThumbIsDragging) || (flags.flowmodoroThumbIsDragging2)) {
            if (alertSounds.flowmodoro === 'chime') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(chime, "flowmodoro", alertVolumes);
            } else if (alertSounds.flowmodoro === 'bell') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(bell, "flowmodoro", alertVolumes);
            }
            flags.flowmodoroThumbIsDragging = false;
            flags.flowmodoroThumbIsDragging2 = false;
        } else if ((flags.generalThumbIsDragging) || (flags.generalThumbIsDragging2)) {
            if (alertSounds.general === 'chime') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(chime, "general", alertVolumes);
            } else if (alertSounds.general === 'bell') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(bell, "general", alertVolumes);
            }
            flags.generalThumbIsDragging = false;
            flags.generalThumbIsDragging2 = false;
            
        } else if ((flags.pomodoroThumbIsDragging) || (flags.pomodoroThumbIsDragging2)) {
            if (alertSounds.pomodoro === 'chime') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(chime, "pomodoro", alertVolumes);
            } else if (alertSounds.pomodoro === 'bell') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(bell, "pomodoro", alertVolumes);
            }
            flags.pomodoroThumbIsDragging = false;
            flags.pomodoroThumbIsDragging2 = false;
            
        } else {
            if ((event.target.className !== 'flowmodoroAlert') && (event.target.className !== 'generalAlert') && (event.target.className !== 'pomodoroAlert') && (event.target.className !== 'volume-thumb') && (document.getElementById("settingsContainer").style.display === "block")) {
                pauseAndResetAlertSounds(bell, chime);
            }
        }
    })

    flowmodoroInputs.forEach(input => {
        input.addEventListener('change', function(event) {
            let finalInputVal = Math.round(event.target.value);
            let validatedFinalInputVal = validateAndSetNotificationInput(finalInputVal);
            document.getElementById(event.target.id).value = validatedFinalInputVal;
            
            setBreakTimeSuggestionsArr(event, breakTimeSuggestionsArr, validatedFinalInputVal, counters);
            setCurrentFlowmodoroNotification(flags, counters, breakTimeSuggestionsArr);

            if ((counters.startStop === 0) || (flags.inHyperFocus)) {
                elapsedTime.flowmodoroNotificationSeconds = (counters.currentFlowmodoroNotification * 60);
            } else {
                secondsPassed = Math.round((Date.now() - startTimes.chillTime) / 1000);
                elapsedTime.flowmodoroNotificationSeconds = ((counters.currentFlowmodoroNotification * 60) - secondsPassed);
                flowmodoroWorker.postMessage("clearInterval");
                flowmodoroWorker.postMessage(elapsedTime.flowmodoroNotificationSeconds);
            }
            

            suggestionBreak_min.textContent = counters.currentFlowmodoroNotification + " min";
        })
    })

    pomodoroInputs.forEach(input => {
        input.addEventListener('change', function(event) {
            let finalInputVal = Math.round(event.target.value);
            let validatedFinalInputVal = validateAndSetNotificationInput(finalInputVal);
            document.getElementById(event.target.id).value = validatedFinalInputVal;

            if (flags.inHyperFocus) {
                secondsPassed = Math.round((Date.now() - startTimes.hyperFocus) / 1000);
            } else {
                secondsPassed = Math.round((Date.now() - startTimes.chillTime) / 1000);
            }

            setPomodoroIntervalArr(event, pomodoroIntervalArr, validatedFinalInputVal, counters, productivity_chill_mode, flags);
            setCurrentPomodoroNotification(counters, pomodoroIntervalArr);

            if (counters.startStop === 0) {
                elapsedTime.pomodoroNotificationSeconds = (counters.currentPomodoroNotification * 60);
            } else if (flags.pomodoroNotificationToggle) {
                elapsedTime.pomodoroNotificationSeconds = ((counters.currentPomodoroNotification * 60) - secondsPassed);
                pomodoroWorker.postMessage("clearInterval");
                pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
            }

            suggestionBreak_min.textContent = counters.currentPomodoroNotification + " min";
        })
    })

    flowmodoroRadios.forEach(radio => {
        radio.addEventListener('change', function(event) {
            if ((event.target.id === 'flowmodoroNoAlertInput') || (event.target.id === 'flowmodoroNoAlertInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.flowmodoro = 'none';
                document.getElementById('flowmodoroNoAlertInput').checked = true;
                document.getElementById('flowmodoroNoAlertInput2').checked = true;
            } else if ((event.target.id === 'flowmodoroChimeInput') || (event.target.id === 'flowmodoroChimeInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.flowmodoro = 'chime';
                document.getElementById('flowmodoroChimeInput').checked = true;
                document.getElementById('flowmodoroChimeInput2').checked = true;
                playAlertSound(chime, 'flowmodoro', alertVolumes);
            } else if ((event.target.id === 'flowmodoroBellInput') || (event.target.id === 'flowmodoroBellInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.flowmodoro = 'bell';
                document.getElementById('flowmodoroBellInput').checked = true;
                document.getElementById('flowmodoroBellInput2').checked = true;
                playAlertSound(bell, 'flowmodoro', alertVolumes);
            }
        })
    })

    generalRadios.forEach(radio => {
        radio.addEventListener('change', function(event) {
            if ((event.target.id === 'generalNoAlertInput') || (event.target.id === 'generalNoAlertInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.general = 'none';
                document.getElementById('generalNoAlertInput').checked = true;
                document.getElementById('generalNoAlertInput2').checked = true;
            } else if ((event.target.id === 'generalChimeInput') || (event.target.id === 'generalChimeInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.general = 'chime';
                playAlertSound(chime, 'general', alertVolumes);
                document.getElementById('generalChimeInput').checked = true;
                document.getElementById('generalChimeInput2').checked = true;
            } else if ((event.target.id === 'generalBellInput') || (event.target.id === 'generalBellInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.general = 'bell';
                playAlertSound(bell, 'general', alertVolumes);
                document.getElementById('generalBellInput').checked = true;
                document.getElementById('generalBellInput2').checked = true;
            }
        })
    })

    pomodoroRadios.forEach(radio => {
        radio.addEventListener('change', function(event) {
            if ((event.target.id === 'pomodoroNoAlertInput') || (event.target.id === 'pomodoroNoAlertInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.pomodoro = 'none';
                document.getElementById('pomodoroNoAlertInput').checked = true;
                document.getElementById('pomodoroNoAlertInput2').checked = true;
            } else if ((event.target.id === 'pomodoroChimeInput') || (event.target.id === 'pomodoroChimeInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.pomodoro = 'chime';
                playAlertSound(chime, 'pomodoro', alertVolumes);
                document.getElementById('pomodoroChimeInput').checked = true;
                document.getElementById('pomodoroChimeInput2').checked = true;
            } else if ((event.target.id === 'pomodoroBellInput') || (event.target.id === 'pomodoroBellInput2')) {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.pomodoro = 'bell';
                playAlertSound(bell, 'pomodoro', alertVolumes);
                document.getElementById('pomodoroBellInput').checked = true;
                document.getElementById('pomodoroBellInput2').checked = true;
            }
        })
    })

    flowtimeBackgroundCells.forEach(background => {
        background.addEventListener('click', function(event) {
            let newId = event.target.id;
            let priorId = selectedBackgroundId["flowtime"];
            document.getElementById(priorId).classList.remove('selected-background');

            selectedBackground.flowtime = flowtimeBackgrounds[newId];
            selectedBackgroundId.flowtime = newId;
            document.getElementById(event.target.id).classList.add('selected-background');

            if (flags.inHyperFocus) {
                setBackground(selectedBackground.flowtime);
            }
        })
    })
    
    chilltimeBackgroundCells.forEach(background => {
        background.addEventListener('click', function(event) {
            let newId = event.target.id;
            let priorId = selectedBackgroundId["chilltime"];
            document.getElementById(priorId).classList.remove('selected-background');
            
            selectedBackground.chilltime = chilltimeBackgrounds[newId];
            selectedBackgroundId.chilltime = newId;
            document.getElementById(event.target.id).classList.add('selected-background');

            if ((!flags.inHyperFocus)) {
                setBackground(selectedBackground.chilltime);
            }
        })
    })

    //Toggle is set to true by default
    //Further clicks will render the targetReachToggle flag true or false
    targetTimeReachedToggle.addEventListener("click", function() {
        if (targetTimeReachedToggle.checked) {
            flags.targetReachedToggle = true;
        } else {
            flags.targetReachedToggle = false;
        }
    })

    breakSuggestionToggle.addEventListener("click", function() {
        if (breakSuggestionToggle.checked) {
            enableNotifications(breakSuggestionToggle, flowmodoroNotificationToggle, pomodoroNotificationToggle, flags);
            flags.breakSuggestionToggle = true;

            if (flags.inHyperFocus) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop","Flow Time");
            } else {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start","Chill Time");
            }

            resetPomodoroCounters(counters);

            if (pomodoroNotificationToggle.checked) {
                pomodoroNotificationToggle.click();
            }

            suggestionMinutes = suggestionMinutesInput.value;
            setSuggestionMinutes(startTimes, flags, elapsedTime, suggestionMinutes, intervals, alertSounds, alertVolumes, chime, bell, start_stop_btn);

        } else {
            suggestionWorker.postMessage("clearInterval");
        }
    })

    flowmodoroNotificationToggle.addEventListener("click", function() {
        if (flowmodoroNotificationToggle.checked) {
            enableNotifications(breakSuggestionToggle, flowmodoroNotificationToggle, pomodoroNotificationToggle, flags);

            resetPomodoroCounters(counters);

            if (pomodoroNotificationToggle.checked) {
                pomodoroNotificationToggle.click();
            }

            let elapsedTimeInChillTime = Math.floor((Date.now() - startTimes.chillTime) / 1000); //in seconds

            // When toggle for break notification is turned on whilst in chill time
            if (!flags.inHyperFocus && counters.startStop !== 0) {
                elapsedTime.flowmodoroNotificationSeconds = ((counters.currentFlowmodoroNotification * 60) - elapsedTimeInChillTime);
                flowmodoroWorker.postMessage("clearInterval");
                flowmodoroWorker.postMessage(elapsedTime.flowmodoroNotificationSeconds);
            }
            
            flags.flowmodoroNotificationToggle = true;
        } else {
            flags.flowmodoroNotificationToggle = false;
            flowmodoroWorker.postMessage("clearInterval");
        }

        changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters);
    })

    pomodoroNotificationToggle.addEventListener("click", function() {
        if (pomodoroNotificationToggle.checked) {
            enableNotifications(breakSuggestionToggle, flowmodoroNotificationToggle, pomodoroNotificationToggle, flags);
            resetPomodoroCounters(counters);

            // DISABLE GENERAL AND FLOWMODORO NOTIFICATIONS
            if (flowmodoroNotificationToggle.checked) {
                flowmodoroNotificationToggle.click();
            }
            if (breakSuggestionToggle.checked) {
                breakSuggestionToggle.click();
            }

            let elapsedTimeInHyperfocus = Math.floor((Date.now() - startTimes.hyperFocus) / 1000);

            // When toggle for break notification is turned on whilst in flow time
            if (flags.inHyperFocus) {
                let pomodoroString = "Pomodoro #1 | " + (pomodoroIntervalArr[0]).toString() + " min";
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop", pomodoroString);
                elapsedTime.pomodoroNotificationSeconds = ((counters.currentPomodoroNotification * 60) - elapsedTimeInHyperfocus);
                pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
            }

            flags.pomodoroNotificationToggle = true;
        } else {
            flags.pomodoroNotificationToggle = false;
            pomodoroWorker.postMessage("clearInterval");
            if (flags.inHyperFocus) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop","Flow Time");
            } else if (counters.startStop > 1) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start","Chill Time");
                hidePomodorosCompletedContainer(completedPomodorosContainer);
                showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, breakTimeSuggestionsArr, counters, flags);
            }
        }

        changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters);
    })

    // autoStartFlowTimeIntervalToggle.addEventListener("click", function() {
    //     if (!flags.autoStartFlowTimeInterval) {
    //         flags.autoStartFlowTimeInterval = true;
    //     } else if (flags.autoStartFlowTimeInterval) {
    //         flags.autoStartFlowTimeInterval = false;
    //     }
    // })
    
    // autoStartChillTimeIntervalToggle.addEventListener("click", function() {
    //     if (!flags.autoStartChillTimeInterval) {
    //         flags.autoStartChillTimeInterval = true;
    //     } else if (flags.autoStartChillTimeInterval) {
    //         flags.autoStartChillTimeInterval = false;
    //     }
    // })

    autoStartPomodoroIntervalToggle.addEventListener("click", function() {
        if (!flags.autoStartPomodoroInterval) {
            flags.autoStartPomodoroInterval = true;
        } else if (flags.autoStartPomodoroInterval) {
            flags.autoStartPomodoroInterval = false;
        }
    })
    
    autoStartBreakIntervalToggle.addEventListener("click", function() {
        if (!flags.autoStartBreakInterval) {
            flags.autoStartBreakInterval = true;
        } else if (flags.autoStartBreakInterval) {
            flags.autoStartBreakInterval = false;
        }
    })
    
    //FUTURE NOTE: could possibly make this a notification instead of an alert
    targetTimeReachedAlert.addEventListener("click", function() {
        alert("This is what you will see when you hit your target time!");
    })

    transitionClockSoundToggle.addEventListener("click", function() {
        if (transitionClockSoundToggle.checked) {
            flags.transitionClockSoundToggle = true;
        } else {
            flags.transitionClockSoundToggle = false;
        }
    })

    flowTimeAnimationToggle.addEventListener("click", function() {
        if (flowTimeAnimationToggle.checked) {
            flags.flowTimeAnimationToggle = true;
            if (flags.inHyperFocus) {
                animationsFadeIn(flowAnimation, 'block');
            } 

        } else {
            flags.flowTimeAnimationToggle = false;
            if (flags.inHyperFocus) {
                animationsFadeOut(flowAnimation);
            }
        }
    })

    chillTimeAnimationToggle.addEventListener("click", function() {
        if (chillTimeAnimationToggle.checked) {
            flags.chillTimeAnimationToggle = true;
            if (!flags.inHyperFocus) {
                animationsFadeIn(chillAnimation, 'flex');
            }
        } else {
            flags.chillTimeAnimationToggle = false;
            if (!flags.inHyperFocus) {
                animationsFadeOut(chillAnimation);
            }
        }
    })

    defaultThemeContainer.addEventListener("click", function() {
        darkGrayTheme.classList.remove('selected-background');
        defaultTheme.classList.add('selected-background');
        flags.darkThemeActivated = false;

        deactivateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popup_window, settingsContainer, notesContainer, aboutContainer, blogContainer, selectedBackgroundIdTemp, selectedBackgroundId);
    })

    darkThemeContainer.addEventListener("click", function() {
        defaultTheme.classList.remove('selected-background');
        darkGrayTheme.classList.add('selected-background');
        flags.darkThemeActivated = true;

        activateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popup_window, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, selectedBackgroundIdTemp, selectedBackgroundId);
    })

    window.addEventListener("resize", handleViewportWidthChange(settingsMappings, tempStorage, isMobile));

    window.addEventListener("resize", function() {
        handleViewportWidthChange(settingsMappings, tempStorage, isMobile);
    });

    document.addEventListener('visibilitychange', function() {
        //user clicks out of tab (or minimizes window)
        if (document.visibilityState === 'hidden') {
            if (flags.inHyperFocus) {
                flowAnimation.classList.remove('intoOpacityTransition');
                flowAnimation.style.display = 'none';
            } else {
                chillAnimation.classList.remove('intoOpacityTransition');
                chillAnimation.style.display = 'none';
            }
            
        } else if (document.visibilityState === 'visible') { //user returns to tab
            if (flags.inHyperFocus) {
                setTimeout(() => {
                    flowAnimation.style.display = 'block';
                    flowAnimation.classList.add('intoOpacityTransition');
                }, 500);
            } else {
                if (counters.startStop > 0) {
                    setTimeout(() => {
                        chillAnimation.style.display = 'flex';
                        chillAnimation.classList.add('intoOpacityTransition');
                    }, 500);
                }
            }
        }
    });

    report_btn.addEventListener("click", function() {
        alert("This feature is currently under development. Thank you for your patience.")
    })

    end_session_btn.addEventListener("click", function() { //temporary function
        location.reload();
    });

    pomodoroWorker.onmessage = function(message) {
        if (!flags.modeChangeExecuted) {
            console.log("POMODOROWORKER EXECUTING");
            flags.modeChangeExecuted = true;
    
            let notificationString;
            if (counters.currentPomodoroIntervalOrderIndex == 0 || counters.currentPomodoroIntervalOrderIndex == 2 || counters.currentPomodoroIntervalOrderIndex == 4) { // 1st-3rd pomodoro
                if (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
                    notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a short break?";
                } else {
                    notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a short break?";
                }
            } else if (counters.currentPomodoroIntervalOrderIndex == 6) { // 4th pomodoro
                if (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
                    notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a long break?";
                } else {
                    notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a long break?";
                }
            } else { // any of the breaks
                if (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
                    notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to start your Pomodoro Interval?";
                } else {
                    notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to start your Pomodoro Interval?";
                }
            }
            new Notification(notificationString);
            
            playAlertSoundCountdown(chime, bell, alertSounds.pomodoro, alertVolumes.pomodoro);
            
            if (counters.currentPomodoroIntervalIndex === 0) {
                counters.pomodorosCompleted++;
            }
    
            startTimes.lastPomNotification = Date.now();
            
            //IF AUTO START FLOW TIME INTERVAL OPTION IS SELECTED
            if (((flags.inHyperFocus) && (flags.autoStartBreakInterval)) || ((!flags.inHyperFocus) && (flags.autoStartPomodoroInterval))) {
                setTimeout(() => {
                    flags.autoSwitchedModes = true;
                    start_stop_btn.click();
                }, 0)
                return;
            }
        }
    }

    suggestionWorker.onmessage = function(message) {
        if (!flags.sentSuggestionMinutesNotification) {
            sendSuggestionBreakNotification(suggestionMinutes, startTimes, chime, bell, alertSounds, alertVolumes);
            flags.sentSuggestionMinutesNotification = true;
        }
    }
    
    flowmodoroWorker.onmessage = function(message) {
        if (!flags.sentFlowmodoroNotification) {
            sendFlowmodoroNotification(breakTimeSuggestionsArr, counters, startTimes, chime, bell, alertSounds, alertVolumes);
            flags.sentFlowmodoroNotification = true;
        }
    }
    
    displayWorker.onmessage = function(message) {
        const timeDiff = Date.now() - startTimes.local;
    
        let hours = Math.floor(timeDiff / timeConvert.msPerHour);
        let minutes = Math.floor((timeDiff - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
        let seconds = Math.floor((timeDiff - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);
        
        // Format the time values
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        
        display.textContent = `${hours}:${minutes}:${seconds}`;

        //if local interval time is more than the pomodoro or break time, call a function which compensates
        // console.log("Pomodoro Interval Index: " + counters.currentPomodoroIntervalIndex);
        // console.log("Current Pomodoro Order Index: " + counters.currentPomodoroIntervalOrderIndex);

        if (flags.pomodoroNotificationToggle) {
            if ((!flags.inHyperFocus) && ((counters.currentPomodoroNotification * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.modeChangeExecuted)) {
                flags.modeChangeExecuted = true;
                flags.autoSwitchedModes = false;
                chillTimeRecovery(flags, counters, elapsedTime, pomodoroIntervalArr, startTimes, start_stop_btn, recoverPomState, targetTime, total_time_display, timeConvert, progressBar, progressContainer, chime, bell, alertSounds, alertVolumes, completedPomodoros_label, completedPomodoros_min);
            } else if ((flags.inHyperFocus) && ((counters.currentPomodoroNotification * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.modeChangeExecuted)) {
                flags.modeChangeExecuted = true;
                flags.autoSwitchedModes = false;
                flowTimeRecovery(flags, counters, elapsedTime, pomodoroIntervalArr, startTimes, start_stop_btn, recoverBreakState, chime, bell, alertSounds, alertVolumes);
            }
            // console.log("Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000: " + ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000)));
        } else {
            if ((flags.flowmodoroNotificationToggle) && (!flags.inHyperFocus) && ((counters.currentFlowmodoroNotification * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.sentFlowmodoroNotification)) {
                console.log("TIME RECOVERY FOR FLOWMODORO")
                flowmodoroWorker.postMessage("clearInterval");
                sendFlowmodoroNotification(breakTimeSuggestionsArr, counters, startTimes, chime, bell, alertSounds, alertVolumes);
                flags.sentFlowmodoroNotification = true;
            }
            
            if ((flags.breakSuggestionToggle) && (flags.inHyperFocus) && ((suggestionMinutes * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.sentSuggestionMinutesNotification)) {
                console.log("TIME RECOVERY FOR SUGGESTION MINUTES")
                suggestionWorker.postMessage("clearInterval");
                sendSuggestionBreakNotification(suggestionMinutes, startTimes, chime, bell, alertSounds, alertVolumes);
                flags.sentSuggestionMinutesNotification = true;
            }
        }
    }

    totalDisplayWorker.onmessage = function(message) {
        totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
    }
});

// ---------------------
// HELPER FUNCTIONS
// ---------------------
function activateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popup_window, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, selectedBackgroundIdTemp, selectedBackgroundId) {
    let componentArr1 = [interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, notesContainer, aboutContainer, blogContainer];
    let componentArr2 = [popup_window, settingsContainer];

    let darkBackgroundTranslucent = "rgba(32, 32, 32, 0.9)";
    let darkBackground = "rgba(32, 32, 32, 1)";
    let border = "3px solid rgb(255, 255, 255)";

    componentArr1.forEach(function(component) {
        component.style.backgroundColor = darkBackgroundTranslucent;
        component.style.border = border;
    })

    componentArr2.forEach(function(component) {
        component.style.backgroundColor = darkBackground;
    })

    selectedBackgroundIdTemp["flowtime"] = selectedBackgroundId.flowtime;
    selectedBackgroundIdTemp["chilltime"] = selectedBackgroundId.chilltime;

    blackFlowtimeBackground.click();
    blackChilltimeBackground.click();
}

function deactivateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popup_window, settingsContainer, notesContainer, aboutContainer, blogContainer, selectedBackgroundIdTemp, selectedBackgroundId) {
    let componentArr1 = [interruptionsContainer, targetHoursContainer, timekeepingContainer, notesContainer, aboutContainer, blogContainer];
    let componentArr2 = [popup_window, settingsContainer];

    let darkBackgroundTranslucent = "rgba(0, 0, 0, 0.35)";
    let darkBackground = "rgb(0, 0, 0)";
    let progressBarBackground = "rgba(255, 255, 255, 0.25)";
    let progressBarBorder = "1px rgba(0, 0, 0, 0.25)";

    componentArr1.forEach(function(component) {
        component.style.backgroundColor = darkBackgroundTranslucent;
        component.style.border = null;
    })

    progressBarContainer.style.backgroundColor = progressBarBackground;
    progressBarContainer.style.border = progressBarBorder;

    componentArr2.forEach(function(component) {
        component.style.backgroundColor = darkBackground;
    })

    if ((selectedBackgroundId.flowtime === "black-flowtime") && (selectedBackgroundId.chilltime === "black-chilltime")) {
        document.getElementById(selectedBackgroundIdTemp.flowtime).click();
        document.getElementById(selectedBackgroundIdTemp.chilltime).click();
    }
}

function sendSuggestionBreakNotification(suggestionMinutes, startTimes, chime, bell, alertSounds, alertVolumes) {
    let notificationString;
    if (suggestionMinutes !== 1) {
        notificationString = "Need a break? You've been hard at work for " + suggestionMinutes.toString() + " minutes!";
    } else {
        notificationString = "Need a break? You've been hard at work for " + suggestionMinutes.toString() + " minute!";
    }
    new Notification(notificationString);
    startTimes.lastBreakSuggestionNotification = Date.now();

    playAlertSoundCountdown(chime, bell, alertSounds.general, alertVolumes.general);
    //IF AUTO START CHILL TIME INTERVAL OPTION IS SELECTED (Currently not implemented)
    // if (flags.autoStartChillTimeInterval) {
    //     setTimeout(() => {
    //         // flags.autoSwitchedModes = true;
    //         start_stop_btn.click();
    //     }, 0)
    //     return;
    // } 
}

function sendFlowmodoroNotification(breakTimeSuggestionsArr, counters, startTimes, chime, bell, alertSounds, alertVolumes) {
    let notificationString;
    if (breakTimeSuggestionsArr[counters.currentFlowmodoroBreakIndex] == 1) {
        notificationString = "It's been " + counters.currentFlowmodoroNotification + " minute! Are you ready to get back into Flow Time?";
    } else {
        notificationString = "It's been " + counters.currentFlowmodoroNotification + " minutes! Are you ready to get back into Flow Time?";
    }
    new Notification(notificationString);
    startTimes.lastFlowmodoroNotification = Date.now();
    
    playAlertSoundCountdown(chime, bell, alertSounds.flowmodoro, alertVolumes.flowmodoro);
    
    //IF AUTO START FLOW TIME INTERVAL OPTION IS SELECTED (Currently not implemented)
    // if (flags.autoStartFlowTimeInterval) {
        //     setTimeout(() => {
            //         // flags.autoSwitchedModes = true;
            //         start_stop_btn.click();
            //     }, 0)
            //     return;
            // }
        // }
}

function sendPomodoroDelayNotification(startTimes, counters, pomodoroIntervalArr, chime, bell, alertSounds, alertVolumes) {
    let notificationString;
    if (counters.currentPomodoroIntervalOrderIndex == 0 || counters.currentPomodoroIntervalOrderIndex == 2 || counters.currentPomodoroIntervalOrderIndex == 4) { // 1st-3rd pomodoro
        if (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a short break?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a short break?";
        }
    } else if (counters.currentPomodoroIntervalOrderIndex == 6) { // 4th pomodoro
        if (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a long break?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a long break?";
        }
    } else { // any of the breaks
        if (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to start your Pomodoro Interval?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to start your Pomodoro Interval?";
        }
    }
    new Notification(notificationString);
    
    playAlertSoundCountdown(chime, bell, alertSounds.pomodoro, alertVolumes.pomodoro);

    startTimes.lastPomNotification = Date.now();
}

function chillTimeRecovery(flags, counters, elapsedTime, pomodoroIntervalArr, startTimes, start_stop_btn, recoverPomState, targetTime, total_time_display, timeConvert, progressBar, progressContainer, chime, bell, alertSounds, alertVolumes, completedPomodoros_label, completedPomodoros_min) {
    // INITIALIZING VARS
    let displayTime = Date.now() - startTimes.local;
    const currentPomodoro = {
        intervalIndex: counters.currentPomodoroIntervalIndex,
        intervalOrderIndex: counters.currentPomodoroIntervalOrderIndex,
        notification: counters.currentPomodoroNotification
    }
    let pomodorosCompleted = counters.pomodorosCompleted;
    let hyperFocusElapsedTime = elapsedTime.hyperFocus;
    let localStartTime = startTimes.local;

    // When both auto start toggles are turned on
    if ((flags.autoStartPomodoroInterval) && ((((Math.round(displayTime / 1000)) - (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60)) <= 2) && (((Date.now() - startTimes.lastPomNotification) / 1000) > 30))) {
        sendPomodoroDelayNotification(startTimes, counters, pomodoroIntervalArr, chime, bell, alertSounds, alertVolumes);
    }

    if ((flags.autoStartPomodoroInterval) && (flags.autoStartBreakInterval)) {
        if (displayTime >= (pomodoroIntervalArr[currentPomodoro.intervalIndex] * 60 * 1000)) {
            displayTime -= pomodoroIntervalArr[currentPomodoro.intervalIndex] * 60 * 1000;

            if (currentPomodoro.intervalOrderIndex === 7) {
                currentPomodoro.intervalOrderIndex = 0;
            } else {
                currentPomodoro.intervalOrderIndex++;
            }

            setCurrentPomodoroNotificationRecovery(currentPomodoro, pomodoroIntervalArr);
        }

        // hyperFocusElapsedTime += displayTime;
        localStartTime = Date.now();
        startTimes.hyperFocus = localStartTime;
        
        setRecoverPomState(recoverPomState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn);
        setPomodoroIndexes(counters, currentPomodoro);

    } else if (flags.autoStartPomodoroInterval) {
        displayTime -= pomodoroIntervalArr[currentPomodoro.intervalIndex] * 60 * 1000;
        currentPomodoro.intervalOrderIndex++;
        setCurrentPomodoroNotificationRecovery(currentPomodoro, pomodoroIntervalArr);
        if (displayTime >= pomodoroIntervalArr[currentPomodoro.intervalIndex]) {
            pomodorosCompleted++;
        }
        localStartTime = Date.now() - displayTime;
        startTimes.hyperFocus = localStartTime;

        setRecoverPomState(recoverPomState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn);
        setPomodoroIndexes(counters, currentPomodoro);
    } else if ((((Math.round(displayTime / 1000)) - (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60)) <= 2) && (((Date.now() - startTimes.lastPomNotification) / 1000) > 30)) {
        // This evaluates when a the computer sleeps and then awakens during the same interval when autoswitchtobreak isn't turned on
        pomodoroWorker.postMessage("clearInterval");
        sendPomodoroDelayNotification(startTimes, counters, pomodoroIntervalArr, chime, bell, alertSounds, alertVolumes);
    }

    // recoveryDebuggingOutput(displayTime, currentPomodoro, pomodorosCompleted, hyperFocusElapsedTime, localStartTime);n
}

/* 
    This function deals w/ the situation where the computer goes to sleep during a pomodoro interval
    and calculates the future state of the program based on which intervals should have occured.
*/
function flowTimeRecovery(flags, counters, elapsedTime, pomodoroIntervalArr, startTimes, start_stop_btn, recoverBreakState, chime, bell, alertSounds, alertVolumes) {
    // INITIALIZING VARS
    let displayTime = Date.now() - startTimes.local;

    const currentPomodoro = {
        intervalIndex: counters.currentPomodoroIntervalIndex,
        intervalOrderIndex: counters.currentPomodoroIntervalOrderIndex,
        notification: counters.currentPomodoroNotification
    }
    let pomodorosCompleted = counters.pomodorosCompleted;
    let hyperFocusElapsedTime = elapsedTime.hyperFocus;
    let localStartTime = startTimes.local;

    // When both auto start toggles are turned on
    if ((flags.autoStartBreakInterval) && ((((Math.round(displayTime / 1000)) - (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60)) <= 2) && (((Date.now() - startTimes.lastPomNotification) / 1000) > 30))) {
        sendPomodoroDelayNotification(startTimes, counters, pomodoroIntervalArr, chime, bell, alertSounds, alertVolumes);
    }

    if ((flags.autoStartPomodoroInterval) && (flags.autoStartBreakInterval)) {
        if (displayTime >= (pomodoroIntervalArr[currentPomodoro.intervalIndex] * 60 * 1000)) {
            displayTime -= pomodoroIntervalArr[currentPomodoro.intervalIndex] * 60 * 1000;
            pomodorosCompleted++;
            currentPomodoro.intervalOrderIndex++;
            setCurrentPomodoroNotificationRecovery(currentPomodoro, pomodoroIntervalArr);
        }
        
        hyperFocusElapsedTime -= displayTime; //for total display in chill time
        localStartTime = Date.now(); //effectively resets display time

        setRecoverBreakState(recoverBreakState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn);
        setPomodoroIndexes(counters, currentPomodoro);
    } else if (flags.autoStartBreakInterval) { //pomodoro --> sleep --> break end state (only one jump ahead)
        displayTime -= pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60 * 1000;
        pomodorosCompleted++;
        hyperFocusElapsedTime -= displayTime;
        currentPomodoro.intervalOrderIndex++;
        localStartTime = Date.now() - displayTime;

        setCurrentPomodoroNotificationRecovery(currentPomodoro, pomodoroIntervalArr);
        setRecoverBreakState(recoverBreakState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn);
        setPomodoroIndexes(counters, currentPomodoro);
    } else if ((((Math.round(displayTime / 1000)) - (pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60)) <= 2) && (((Date.now() - startTimes.lastPomNotification) / 1000) > 30)) {
        // This evaluates when a the computer sleeps and then awakens during the same interval when autoswitchtobreak isn't turned on
        pomodoroWorker.postMessage("clearInterval");
        sendPomodoroDelayNotification(startTimes, counters, pomodoroIntervalArr, chime, bell, alertSounds, alertVolumes);
    }

    // recoveryDebuggingOutput(displayTime, currentPomodoro, pomodorosCompleted, hyperFocusElapsedTime, localStartTime);
}

function recoveryDebuggingOutput(displayTime, currentPomodoro, pomodorosCompleted, hyperFocusElapsedTime, localStartTime) {
    console.log(getCurrentTime());
    console.log("Display Time (in seconds): " + Math.round(displayTime / 1000));
    console.log("Current Pomodoro Interval Index: " + currentPomodoro.intervalIndex);
    console.log("Current Pomodoro Interval Order Index: " + currentPomodoro.intervalOrderIndex);
    console.log("Pomodoros Completed: " + pomodorosCompleted);
    console.log("Elapsed Time In Hyper Focus: " + hyperFocusElapsedTime);
    console.log("Local Start Time: " + localStartTime);
    console.log("");
}

function setRecoverBreakState(recoverBreakState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn) {
    recoverBreakState.displayTime = displayTime;
    recoverBreakState.pomodorosCompleted = pomodorosCompleted;
    recoverBreakState.hyperFocusElapsedTime = hyperFocusElapsedTime;
    recoverBreakState.localStartTime = localStartTime;
    
    counters.pomodorosCompleted = recoverBreakState.pomodorosCompleted;
    flags.inRecoveryBreak = true;
    start_stop_btn.click();
}

function setRecoverPomState(recoverPomState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn) {
    recoverPomState.displayTime = displayTime;
    recoverPomState.pomodorosCompleted = pomodorosCompleted;
    recoverPomState.hyperFocusElapsedTime = hyperFocusElapsedTime;
    recoverPomState.localStartTime = localStartTime;
    
    counters.pomodorosCompleted = recoverPomState.pomodorosCompleted;
    flags.inRecoveryPom2 = true;

    start_stop_btn.click();
}

function setPomodoroIndexes(counters, currentPomodoro) {
    counters.currentPomodoroIntervalIndex = currentPomodoro.intervalIndex;
    counters.currentPomodoroIntervalOrderIndex = currentPomodoro.intervalOrderIndex;
    counters.currentPomodoroNotification = currentPomodoro.notification;
}

function convertMinutesToTimeFormat(minutes) {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const seconds = Math.floor((minutes - Math.floor(minutes)) * 60);

    // Format the time components to have leading zeros if necessary
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(remainingMinutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Combine the components into the desired format
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function resetPomodoroCounters(counters) {
    counters.currentPomodoroIntervalIndex = 0;
    counters.currentPomodoroIntervalOrderIndex = 0;
}

function changeCompletedPomodorosContainerHeader(completedPomodoros_label, completedPomodoros_min, counters) {
    completedPomodoros_label.textContent = "Pomodoros";

    completedPomodoros_min.textContent = counters.pomodorosCompleted;
}

function showPomodorosCompletedContainer(completedPomodorosContainer, completedPomodoros_label, completedPomodoros_min, counters) {
    completedPomodorosContainer.style.display = 'flex';

    changeCompletedPomodorosContainerHeader(completedPomodoros_label, completedPomodoros_min, counters)
}

function hidePomodorosCompletedContainer(completedPomodorosContainer) {
    completedPomodorosContainer.style.display = 'none';
}

function iterateCurrentPomodoroIntervalOrderIndex(counters) {
    if (counters.currentPomodoroIntervalOrderIndex === 7) {
        counters.currentPomodoroIntervalOrderIndex = 0;
    } else {
        counters.currentPomodoroIntervalOrderIndex++;
    }
}

function setCurrentPomodoroNotification(counters, pomodoroIntervalArr) {
    if (counters.currentPomodoroIntervalOrderIndex === 0 || counters.currentPomodoroIntervalOrderIndex === 2 || counters.currentPomodoroIntervalOrderIndex === 4 || counters.currentPomodoroIntervalOrderIndex === 6) {
        counters.currentPomodoroIntervalIndex = 0;
        counters.currentPomodoroNotification = pomodoroIntervalArr[counters.currentPomodoroIntervalIndex];
    } else if (counters.currentPomodoroIntervalOrderIndex === 1 || counters.currentPomodoroIntervalOrderIndex === 3 || counters.currentPomodoroIntervalOrderIndex === 5) {
        counters.currentPomodoroIntervalIndex = 1;
        counters.currentPomodoroNotification = pomodoroIntervalArr[counters.currentPomodoroIntervalIndex];
    } else if (counters.currentPomodoroIntervalOrderIndex === 7) {
        counters.currentPomodoroIntervalIndex = 2;
        counters.currentPomodoroNotification = pomodoroIntervalArr[counters.currentPomodoroIntervalIndex];
    }
}

function setCurrentPomodoroNotificationRecovery(currentPomodoro, pomodoroIntervalArr) {
    if (currentPomodoro.intervalOrderIndex === 0 || currentPomodoro.intervalOrderIndex === 2 || currentPomodoro.intervalOrderIndex === 4 || currentPomodoro.intervalOrderIndex === 6) {
        currentPomodoro.intervalIndex = 0;
        currentPomodoro.notification = pomodoroIntervalArr[currentPomodoro.intervalIndex];
    } else if (currentPomodoro.intervalOrderIndex === 1 || currentPomodoro.intervalOrderIndex === 3 || currentPomodoro.intervalOrderIndex === 5) {
        currentPomodoro.intervalIndex = 1;
        currentPomodoro.notification = pomodoroIntervalArr[currentPomodoro.intervalIndex];
    } else if (currentPomodoro.intervalOrderIndex === 7) {
        currentPomodoro.intervalIndex = 2;
        currentPomodoro.notification = pomodoroIntervalArr[currentPomodoro.intervalIndex];
    }
}

function setPomodoroIntervalArr(event, pomodoroIntervalArr, validatedFinalInputVal, counters, productivity_chill_mode, flags) {
    if (event.target.id === 'pomodoroInput') {
        pomodoroIntervalArr[0] = validatedFinalInputVal;
        if ((counters.currentPomodoroIntervalIndex === 0) && (counters.startStop !== 0) && (flags.pomodoroNotificationToggle)) {
            if (counters.currentPomodoroIntervalOrderIndex === 0) {
                productivity_chill_mode.innerText = "Pomodoro #1 | " + (pomodoroIntervalArr[0]).toString() + " min";
            } else if (counters.currentPomodoroIntervalOrderIndex === 2) {
                productivity_chill_mode.innerText = "Pomodoro #2 | " + (pomodoroIntervalArr[0]).toString() + " min";
            } else if (counters.currentPomodoroIntervalOrderIndex === 4) {
                productivity_chill_mode.innerText = "Pomodoro #3 | " + (pomodoroIntervalArr[0]).toString() + " min";
            } else if (counters.currentPomodoroIntervalOrderIndex === 6) {
                productivity_chill_mode.innerText = "Pomodoro #4 | " + (pomodoroIntervalArr[0]).toString() + " min";
            }
        }
    } else if (event.target.id === 'shortBreakInput') {
        pomodoroIntervalArr[1] = validatedFinalInputVal;
        if ((counters.currentPomodoroIntervalIndex === 1) && (counters.startStop !== 0) && (flags.pomodoroNotificationToggle)) {
            if (counters.currentPomodoroIntervalOrderIndex === 1) {
                productivity_chill_mode.innerText  = "Short Break #1 | " + (pomodoroIntervalArr[1]).toString() + " min";
            } else if (counters.currentPomodoroIntervalOrderIndex === 3) {
                productivity_chill_mode.innerText  = "Short Break #2 | " + (pomodoroIntervalArr[1]).toString() + " min";
            } else if (counters.currentPomodoroIntervalOrderIndex === 5) {
                productivity_chill_mode.innerText  = "Short Break #3 | " + (pomodoroIntervalArr[1]).toString() + " min";
            }
        }
    } else if (event.target.id === 'longBreakInput') {
        pomodoroIntervalArr[2] = validatedFinalInputVal;
        if ((counters.currentPomodoroIntervalIndex === 2) && (counters.startStop !== 0) && (flags.pomodoroNotificationToggle)) {
            productivity_chill_mode.innerText = "Long Break | " + (pomodoroIntervalArr[2]).toString() + " min";
        }
    }
}

function animationsFadeIn(animationType, displayType) {
    // animationType.classList.remove('outOfOpacityTransition');
    animationType.classList.add('intoOpacityTransition');
    animationType.style.display = displayType;
}

function animationsFadeOut(animationType) {
    animationType.classList.remove('intoOpacityTransition');
    // animationType.classList.add('outOfOpacityTransition');
    setTimeout(() => {
        animationType.style.display = 'none';
    }, 0)
}

function toggleInfoWindow(infoWindowElement, flagKey, flags) {
    const isCurrentlyShowing = flags[flagKey];
    if (isCurrentlyShowing) {
        infoWindowElement.classList.remove('infoWindowOpacity');
    } else {
        infoWindowElement.classList.add('infoWindowOpacity');
    }
    flags[flagKey] = !isCurrentlyShowing;
}

function setSuggestionMinutes(startTimes, flags, elapsedTime, suggestionMinutes, intervals, alertSounds, alertVolumes, chime, bell, start_stop_btn) {
    let elapsedTimeInHyperfocus = Math.floor((Date.now() - startTimes.hyperFocus) / 1000); //unit: seconds
    if (!flags.inHyperFocus) {
        elapsedTime.suggestionSeconds = (suggestionMinutes * 60); //shallow copy suggestionMinutes to elapsedTime.suggestionSeconds (saves state)
    } else {
        elapsedTime.suggestionSeconds = ((suggestionMinutes * 60) - elapsedTimeInHyperfocus);
        suggestionWorker.postMessage("clearInterval");
        suggestionWorker.postMessage(elapsedTime.suggestionSeconds);
    }
}

function validateAndSetNotificationInput(finalInputVal) {
    if (finalInputVal > 720) {
        finalInputVal = 720;
    } else if (finalInputVal < 1 || isNaN(finalInputVal) || finalInputVal === undefined) {
        finalInputVal = 1;
    }
    return finalInputVal;
}

function playAlertSound(soundType, notificationSettingType, alertVolumes) {
    if (notificationSettingType === "flowmodoro") {
        soundType.volume = alertVolumes.flowmodoro;
    } else if (notificationSettingType === "general") {
        soundType.volume = alertVolumes.general;
    } else if (notificationSettingType === "pomodoro") {
        soundType.volume = alertVolumes.pomodoro;
    }
    soundType.play();
}

function pauseAndResetAlertSounds(bell, chime) {
    bell.pause();
    bell.currentTime = 0;
    chime.pause();
    chime.currentTime = 0;
}

// Function to hide all settings containers and remove 'selected' class from all buttons
function alertVolumeChange(volumeContainerType, alertVolumes, volumeThumbType, volumeBarType, volumeThumbType2, volumeBarType2, event, flags) {
    const rect = volumeContainerType.getBoundingClientRect();
    let volumeLevel = (event.clientX - rect.left) / rect.width;
    volumeLevel = Math.max(0, Math.min(1, volumeLevel)); // Constrain between 0 and 1

    // Update the thumb and bar positions
    volumeThumbType.style.left = `${volumeLevel * 100}%`;
    volumeBarType.style.width = `${volumeLevel * 100}%`;
    volumeThumbType2.style.left = `${volumeLevel * 100}%`;
    volumeBarType2.style.width = `${volumeLevel * 100}%`;

    if ((flags.flowmodoroThumbIsDragging) || (flags.flowmodoroThumbIsDragging2)) {
        alertVolumes.flowmodoro = volumeLevel;
    } else if ((flags.generalThumbIsDragging) || (flags.generalThumbIsDragging2)) {
        alertVolumes.general = volumeLevel;
    } else if ((flags.pomodoroThumbIsDragging) || (flags.pomodoroThumbIsDragging2)){
        alertVolumes.pomodoro = volumeLevel;
    }
}

function hideAllSettingsContainers(settingsMappings) {
    for (const [buttonId, containerId] of Object.entries(settingsMappings)) {
        document.getElementById(containerId).style.display = 'none';
        document.getElementById(buttonId).classList.remove('selected');
    }
}

function showAllSettingsContainers(settingsMappings) {
    for (const [buttonId, containerId] of Object.entries(settingsMappings)) {
        document.getElementById(containerId).style.display = 'block';
        // document.getElementById(buttonId).classList.remove('selected');
    }
}

function setInitialEndSessionBtnText(initialViewportWidth, end_session_btn) {
    if (initialViewportWidth <= 504) {
        end_session_btn.innerText = "End";
    } else {
        end_session_btn.innerText = "End Session";
    }
}

function handleViewportWidthChange(settingsMappings, tempStorage, isMobile) {
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    let end_session_btn = document.getElementById("end-session");
    if (viewportWidth <= 504) {
        end_session_btn.innerText = "End";
    } else {
        end_session_btn.innerText = "End Session";
    }

    if (viewportWidth <= 650) {
        showAllSettingsContainers(settingsMappings);
    } else {
        for (const [buttonId, containerId] of Object.entries(settingsMappings)) {
            document.getElementById(buttonId).addEventListener('click', function() {
                hideAllSettingsContainers(settingsMappings);
                document.getElementById(containerId).style.display = 'block';
                this.classList.add('selected');
            });
        }

        if (document.getElementById("settingsContainer").style.display === 'block') {
            document.getElementById(tempStorage.lastSettingsSelectionId).click();
        }
    }

    if (isMobile) {
        document.getElementById("pomodoroSettingsContainer").style.display = 'none';
        document.getElementById("flowmodoroSettingsContainer").style.display = 'none';
        document.getElementById("generalSettingsContainer").style.display = 'none';
    }
}

// Show suggestion break container AND sets current flowmodoro notification
function showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, breakTimeSuggestionsArr, counters, flags) {
    suggestionBreakContainer.style.display = 'flex';

    setCurrentFlowmodoroNotification(flags, counters, breakTimeSuggestionsArr);
    changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters);
}

function setCurrentFlowmodoroNotification(flags, counters, breakTimeSuggestionsArr) {
    if (flags.lastHyperFocusIntervalMin >= 90) {
        counters.currentFlowmodoroNotification = breakTimeSuggestionsArr[3];
    } else if (flags.lastHyperFocusIntervalMin >= 50) {
        counters.currentFlowmodoroNotification = breakTimeSuggestionsArr[2];
    } else if (flags.lastHyperFocusIntervalMin >= 25) {
        counters.currentFlowmodoroNotification = breakTimeSuggestionsArr[1];
    } else {
        counters.currentFlowmodoroNotification = breakTimeSuggestionsArr[0];
    }
}

function setBreakTimeSuggestionsArr(event, breakTimeSuggestionsArr, validatedFinalInputVal, counters) {
    if (event.target.id === 'flowmodoroBreakInput1') {
        breakTimeSuggestionsArr[0] = validatedFinalInputVal;
        counters.currentFlowmodoroBreakIndex = 0;
    } else if (event.target.id === 'flowmodoroBreakInput2') {
        breakTimeSuggestionsArr[1] = validatedFinalInputVal;
        counters.currentFlowmodoroBreakIndex = 1;
    } else if (event.target.id === 'flowmodoroBreakInput3') {
        breakTimeSuggestionsArr[2] = validatedFinalInputVal;
        counters.currentFlowmodoroBreakIndex = 2;
    } else if (event.target.id === 'flowmodoroBreakInput4') {
        breakTimeSuggestionsArr[3] = validatedFinalInputVal;
        counters.currentFlowmodoroBreakIndex = 3;
    }
}

function changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters) {
    if (flags.flowmodoroNotificationToggle) {
        suggestionBreak_label.textContent = "Break";
    } else {
        suggestionBreak_label.textContent = "Suggested Break";
    }
    suggestionBreak_min.textContent = counters.currentFlowmodoroNotification + " min";
}

function hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label) {
    suggestionBreakContainer.style.display = 'none';
}

function hideInterruptionsSubContainer(interruptionsSubContainer) {
    interruptionsSubContainer.style.display = 'none';
}

function showInterruptionsSubContainer(interruptionsSubContainer) {
    interruptionsSubContainer.style.display = 'block';
}

function saveResetInterruptions(interruptionsNum, counters, savedInterruptionsArr) {
    savedInterruptionsArr.push(counters.interruptions);
    counters.interruptions = 0;
    interruptionsNum.textContent = counters.interruptions;
}

function getCurrentTime() {
    // Get the current timestamp from Date.now()
    const timestamp = Date.now();

    // Convert the timestamp to a Date object
    const date = new Date(timestamp);

    // Format the time parts
    const hours = date.getHours() % 12 || 12; // convert 24h to 12h format and handle 0 as 12
    const minutes = date.getMinutes().toString().padStart(2, '0'); // ensure two digits
    const suffix = date.getHours() >= 12 ? 'PM' : 'AM';

    // Combine the parts into a time string
    const timeString = `${hours}:${minutes} ${suffix}`;

    return timeString;
}

function playAlertSoundCountdown(chime, bell, alertSoundType, alertVolumeType) {
    if (alertSoundType === 'chime') {
        chime.volume = alertVolumeType;
        chime.play();
    } else if (alertSoundType === 'bell') {
        bell.volume = alertVolumeType;
        bell.play();
    }
}

//Returns user's broswer type; (this function is not currently being used)
function detectBrowser() {
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

//For some reason, EDGE won't prompt the user to turn on notifications if they're set to default :/
async function enableNotifications(breakSuggestionToggle, flowmodoroNotificationToggle, pomodoroNotificationToggle, flags) {
    // Check if notifications are supported
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
        return false;
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        let permission = await Notification.requestPermission();
        if (permission === "granted") {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function changeTargetHours(flags) {
    document.getElementById("target-hours").remove();
        
    let enterHours = document.createElement('input');
    enterHours.type = "number";
    enterHours.id = "target-hours";
    enterHours.name = "hours";
    enterHours.min = "0";
    enterHours.value = "";
    document.getElementById("coolDiv").appendChild(enterHours);

    enterHours.focus();
    
    document.getElementById('target-hours-submit').textContent = "Submit";
    flags.submittedTarget = false;
};

function replaceTargetHours(inputHours, targetTime, flags) {

    let targetHours = Math.round((parseFloat(inputHours)) * 100) / 100; //return to 100 after testing
    targetTime = targetHours * 60 * 60 * 1000; //converting hours -> milliseconds
    document.getElementById("target-hours").remove();

    let submitTarget = document.createElement('h4');
    submitTarget.textContent = targetHours;
    submitTarget.id = "target-hours";
    submitTarget.className = "finalized-hours";
    submitTarget.style.backgroundColor = "#5c5c5c"; //dark grey finalized background color
    document.getElementById("coolDiv").appendChild(submitTarget);
    document.getElementById('target-hours-submit').textContent = "Change";
    flags.submittedTarget = true;

    return targetTime;
};

function targetHoursValidate(inputHours, timeConvert, startTimes, elapsedTime, flags, counters) {
    const roundedHours = Math.round((parseFloat(inputHours)) * 100) / 100;
    if (!inputHours || roundedHours <= 0 || roundedHours > 24 || (roundedHours * 60 * 60 * 1000) <= getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes)) {
        
        if (counters.startStop !== 0) { //if not very start of program
            if (flags.inHyperFocus) { //if not at very start and in hyper focus
                alert("Enter a valid target time between " + Math.ceil((parseFloat((elapsedTime.hyperFocus + (Date.now() - startTimes.local)) / timeConvert.msPerHour)) * 100) / 100 + " hours and 24 hours");
            }
            else if (!flags.inHyperFocus) { //if not at very start and in chill time
                alert("Enter a valid target time between " + Math.ceil((parseFloat(elapsedTime.hyperFocus / timeConvert.msPerHour)) * 100) / 100 + " hours and 24 hours");
            }
        }
        else if (counters.startStop === 0) { //if at very start
            alert("Enter a valid target time between 0.01 hours and 24 hours");
        }
        return false;
    }
    return true;
};

function setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, stop_start, hf_ct) {
    start_stop_btn.innerText = stop_start;
    productivity_chill_mode.innerText = hf_ct;
    flags.inHyperFocus = stop_start === "Stop";
};

function updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer) {
    let timeDiff;
    
    if (isNaN(targetTime) || targetTime === null || !flags.submittedTarget) { //if user doesn't input target time, break out
        if (progressBar.classList.contains('fullopacity1')) {
            progressBar.classList.remove('fullopacity1');
            setTimeout(() => {
                progressBar.style.width = (0) + '%';
            }, 500)
        }
        return;
    }

    if (!progressBar.classList.contains('fullopacity1')) {
        progressBar.classList.add('fullopacity1');
    }

    timeDiff = getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes);
    
    let percentage = timeDiff / targetTime;
    
    if (percentage > 1) {
        percentage = 1; //cap percentage at 100%
    }
    
    if (targetTime !== 0 && percentage >= 1 && !flags.hitTarget) { //when target time is hit
        flags.hitTarget = true;
        setTimeout(() => {
            if (flags.targetReachedToggle == true) {
                let notificationString = "Congrats! You've hit your target time!";
                new Notification(notificationString);
            }
        }, 1); //experiment w/ value to solve timing issues
        
        progressContainer.classList.add("glowing-effect"); //adds glowing effect to progress bar container
    }
    
    progressBar.style.width = (percentage * 100) + '%';
};

function resetDisplay(display) {
    display.innerText = "00:00:00"; //immediately resets display w/ no lag time
};

function veryStartActions(startTimes, hyperChillLogoImage, progressBarContainer, flags) {
    startTimes.beginning = Date.now();
    setBrowserTabTitle(); //sets browser tab title to the stopwatch time '00:00:00'
    document.getElementById("target-hours").classList.remove("glowing-effect");
    hyperChillLogoImage.classList.add("hyperChillLogoRotate");

    if ((document.getElementById("target-hours").value == "") || ((!document.getElementById("target-hours").value == "") && (!flags.submittedTarget))) {
        progressBarContainer.classList.toggle("small");
        flags.progressBarContainerIsSmall = true;
    }
};

function setBackground(background_color) {
    document.body.style.backgroundImage = background_color;  // Set the background color back to red when started
    document.documentElement.style.backgroundImage = background_color;
};

function playClick(clock_tick, flags) {
    if (flags.transitionClockSoundToggle == true) {
        clock_tick.volume = 0.25; //lowering volume of soundgetTotalElapsed
        clock_tick.play();
    }
};

function handleEnter(event, start_stop_btn, submit_change_btn, userInputTask, flags) {

    if (event.key === 'Enter') {
        event.preventDefault();
        
        if (document.activeElement.id === 'target-hours') {
            submit_change_btn.click();
        } else if (document.activeElement === userInputTask) {
            // DO NOTHING - code for this event is implemented in notes.js instead
        }  else if (document.activeElement.className == "noteInput") {
            // DO NOTHING - code for this event is implemented in notes.js instead
        } else {
            flags.autoSwitchedModes = false;
            start_stop_btn.click();
        }
    }
};

function totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime) {
    
    let timeDiff = getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes);
    
    let hours = Math.floor(timeDiff / timeConvert.msPerHour);
    let minutes = Math.floor((timeDiff - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
    let seconds = Math.floor((timeDiff - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);

    // Format the time values
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    if (flags.submittedTarget) {
        let percentage = timeDiff / targetTime;
        
        if (percentage > 1) {
            percentage = 1; //cap percentage at 100%
        }

        total_time_display.textContent = `${hours}:${minutes}:${seconds}` + " (" + Math.trunc(percentage * 100) + "%)";
    } else {
        total_time_display.textContent = `${hours}:${minutes}:${seconds}`;
    }
};

function getTotalElapsed(flags, elapsedTime, startTimes) { //return current total hyper focus time
    // console.log("Elapsed Time: " + elapsedTime);
    // console.log("Date.now() - startTimes: " + (Date.now() - startTimes));
    
    return flags.inHyperFocus ? (elapsedTime + (Date.now() - startTimes.local)) : elapsedTime;
};

function setBrowserTabTitle() {
    // Function to set the browser tab title based on the content of the #display div
    function setTabTitleFromDisplay() {
        document.title = document.getElementById("display").innerText;
    };

    // Initially set the browser tab title
    document.title = document.getElementById("display").innerText;

    // Create a new mutation observer to watch for changes to the #display div
    const observer = new MutationObserver(setTabTitleFromDisplay);

    // Start observing the #display div for changes to its child nodes or subtree
    observer.observe(document.getElementById("display"), {
        childList: true,
        subtree: true,
        characterData: true
    });
};

function setFavicon(faviconPath) {
    let favicon1 = document.getElementById("favicon1");
    let favicon2 = document.getElementById("favicon2");

    favicon1.href = faviconPath;
    favicon2.href = faviconPath;
}