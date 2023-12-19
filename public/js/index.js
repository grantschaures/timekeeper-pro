//
//  JavaScript code for main event handling
//

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
    const interruptionsSubContainer = document.getElementById("interruptions-sub-container");
    const decBtn = document.getElementById("decBtn");
    const incBtn = document.getElementById("incBtn");

    const interruptionsNum = document.getElementById("interruptions_num");

    const suggestionBreakContainer = document.getElementById("suggestionBreakContainer");
    const suggestionBreak_label = document.getElementById("suggestionBreak-label");
    const suggestionBreak_min = document.getElementById("suggestionBreak-min");

    // SETTINGS
    const targetTimeReachedToggle = document.getElementById("targetTimeReachedToggle");
    const breakSuggestionToggle = document.getElementById("breakSuggestionToggle");
    const suggestionMinutesContainer = document.getElementById("suggestionMinutesContainer");
    const breakSuggestionBlock = document.getElementById("breakSuggestionBlock");
    const breakSuggestionBlock2 = document.getElementById("breakSuggestionBlock2");
    const suggestionMinutesInput = document.getElementById("suggestionMinutesInput");
    const flowmodoroNotificationToggle = document.getElementById("flowmodoroNotificationToggle");
    const autoStartFlowTimeIntervalToggle = document.getElementById("autoStartFlowTimeIntervalToggle");
    const flowmodoroNotifications = document.getElementById("flowmodoroNotifications");
    const flowmodoroNotificationInfoWindow = document.getElementById("flowmodoroNotificationInfoWindow");
    const flowTimeBreakNotification = document.getElementById("flowTimeBreakNotification");
    const flowTimeBreakNotificationInfoWindow = document.getElementById("flowTimeBreakNotificationInfoWindow");
    let hoverTimer;
    const targetTimeReachedAlert = document.getElementById("targetTimeReachedAlert");
    const transitionClockSoundToggle = document.getElementById("transitionClockSoundToggle");
    const flowmodoroVolumeContainer = document.getElementById("flowmodoroVolumeContainer");
    const flowmodoroVolumeBar = document.getElementById('flowmodoroVolumeBar');
    const flowmodoroVolumeThumb = document.getElementById('flowmodoroVolumeThumb');
    const generalVolumeContainer = document.getElementById("generalVolumeContainer");
    const generalVolumeBar = document.getElementById('generalVolumeBar');
    const generalVolumeThumb = document.getElementById('generalVolumeThumb');
    const flowmodoroRadios = document.querySelectorAll('.flowmodoroAlert');
    const flowmodoroInputs = document.querySelectorAll('.flowmodoroBreak');
    const generalRadios = document.querySelectorAll('.generalAlert');
    const autoStartChillTimeIntervalToggle = document.getElementById("autoStartChillTimeIntervalToggle")

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
        chillTimeBreak: null
    };
    
    //START TIMES
    let startTimes = {
        hyperFocus: undefined, //startTime of current hyper focus session
        chillTime: undefined, //startTime of current chill time session
        local: undefined, //local start time for current display
        beginning: undefined //very first start time of entire session
    };

    //TIME AMOUNTS
    let targetTime = null; //Target amount of time in ms
    let suggestionMinutes = null; //Suggestion minutes
    let breakTimeSuggestionsArr = [5, 8, 10, 15];

    let elapsedTime = {
        hyperFocus: 0, //Accumulated time from each productivity interval
        chillTime: 0, //time elapsed during each Chill Time mode
        suggestionSeconds: 0,
        flowmodoroNotificationSeconds: 0,
        lastHyperFocusIntervalMin: 0
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
        currentFlowmodoroBreakIndex: 0
    }

    //STORAGE
    savedInterruptionsArr = [];

    let flags = {
        hitTarget: false, //Flag: target time has been reached
        submittedTarget: false, //Flag: if target time has been submitted
        inHyperFocus: false, //Flag: check if in hyper focus mode
        targetReachedToggle: true, //Flag: changes based on user setting (alerts user when target reached)
        breakSuggestionToggle: false,
        submittedSuggestionMinutes: false,
        transitionClockSoundToggle: false,
        flowmodoroNotificationToggle: false,
        progressBarContainerIsSmall: false,
        flowmodoroThumbIsDragging: false,
        autoStartFlowTimeInterval: false,
        autoStartChillTimeInterval: false,
        showingFlowmodoroNotificationInfoWindow: false,
        showingFlowTimeBreakNotificationInfoWindow: false,
        generalThumbIsDragging: false
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

    if (isMobile) {
        removeBreakSuggestionBlock(breakSuggestionBlock, breakSuggestionBlock2);
    }

    setInitialEndSessionBtnText(initialViewportWidth, end_session_btn);

    // ----------------
    // EVENT LISTENERS
    // ----------------
    document.addEventListener('keydown', (event) => handleEnter(event, start_stop_btn, submit_change_btn, userInputTask));

    start_stop_btn.addEventListener("click", function() {

        playClick(clock_tick, flags);
        resetDisplay(display);

        counters.startStop++; //keep track of button presses

        if (counters.startStop === 1) {
            veryStartActions(startTimes, hyperChillLogoImage, progressBarContainer, flags);
        }

        startTimes.local = Date.now();
        clearInterval(intervals.local);
        intervals.local = setInterval(() => timeDisplay(startTimes.local, display, timeConvert), 1000); //using arrow function so we can pass arguments
        
        if (!intervals.main) { //executes when interval is undefined --> Flow Time
            setFavicon(greenFavicon);

            if (counters.startStop > 1) {
                animationsFadeOut(chillAnimation);
            }
            animationsFadeIn(flowAnimation, 'block');


            hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min);
            showInterruptionsSubContainer(interruptionsSubContainer);

            //Console.log out the --> Hyper Focus Time (00:00 format)
            console.log(getCurrentTime() + " --> Entering Flow Time");

            setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop","Flow Time");
            startTimes.hyperFocus = Date.now();
            intervals.total = setInterval(() => totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime), 1000);
            intervals.main = setInterval(() => updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer), 1000); //repeatedly calls reference to updateProgressBar function every 1000 ms (1 second)
            
            if (flags.breakSuggestionToggle) {
                intervals.suggestion = setInterval(() => suggestionMinutesCountdown(elapsedTime, suggestionMinutes, flags, alertSounds, alertVolumes, chime, bell, start_stop_btn), 1000);
            }

            if (flags.flowmodoroNotificationToggle) {
                clearInterval(intervals.chillTimeBreak);
            }

            if (counters.startStop > 1) { // runs first during first chill time interval
                elapsedTime.chillTime += Date.now() - startTimes.chillTime;
            }
            setBackground("linear-gradient(to bottom, #5dd44d, #50b350, #004400)");
            // setBackground("url('../images/DALLE/DALLE7.png')");
        } else { //--> Chill Time
            setFavicon(blueFavicon);

            animationsFadeOut(flowAnimation);
            animationsFadeIn(chillAnimation, 'flex');

            saveResetInterruptions(interruptionsNum, counters, savedInterruptionsArr);
            hideInterruptionsSubContainer(interruptionsSubContainer);

            flags.lastHyperFocusIntervalMin = Math.floor((Date.now() - startTimes.hyperFocus) / (1000 * 60));
            
            showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, breakTimeSuggestionsArr, counters, flags);
            
            //if chill time break suggestion is set BEFORE entering Chill Time
            if (flags.flowmodoroNotificationToggle) {
                elapsedTime.flowmodoroNotificationSeconds = (counters.currentFlowmodoroNotification * 60) - 1;
                intervals.chillTimeBreak = setInterval(() => flowmodoroNotificationCountdown(elapsedTime, counters, flags, alertSounds, alertVolumes, chime, bell, start_stop_btn, breakTimeSuggestionsArr), 1000);
            }
            //Console.log out the --> Chill Time (00:00 format)
            console.log(getCurrentTime() + " --> Entering Chill Time");
            
            setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start", "Chill Time");
            startTimes.chillTime = Date.now();

            clearInterval(intervals.main);
            intervals.main = null;

            clearInterval(intervals.total);
            intervals.total = null;

            //if flow time break notification is turned on
            if (flags.breakSuggestionToggle) {
                clearInterval(intervals.suggestion);
                intervals.suggestion = null;
                elapsedTime.suggestionSeconds = (suggestionMinutes * 60);
            }

            elapsedTime.hyperFocus += Date.now() - startTimes.hyperFocus;
            
            setBackground("linear-gradient(to bottom, #3b8fe3, #1d60a3, #7f04c7)");
        }
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
            clearInterval(intervals.suggestion);
            intervals.suggestion = null;

            setSuggestionMinutes(startTimes, flags, elapsedTime, suggestionMinutes, intervals, alertSounds, alertVolumes, chime, bell, start_stop_btn);
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
        });
    }

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

    document.addEventListener('mousemove', (event) => {
        if (flags.flowmodoroThumbIsDragging) {
            alertVolumeChange(flowmodoroVolumeContainer, alertVolumes, flowmodoroVolumeThumb, flowmodoroVolumeBar, event, flags);
        } else if (flags.generalThumbIsDragging) {
            alertVolumeChange(generalVolumeContainer, alertVolumes, generalVolumeThumb, generalVolumeBar, event, flags);
        }
    })

    document.addEventListener('mouseup', (event) => {
        if (flags.flowmodoroThumbIsDragging) {
            if (alertSounds.flowmodoro === 'chime') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(chime, "flowmodoro", alertVolumes);
            } else if (alertSounds.flowmodoro === 'bell') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(bell, "flowmodoro", alertVolumes);
            }
            flags.flowmodoroThumbIsDragging = false;
        } else if (flags.generalThumbIsDragging) {
            if (alertSounds.general === 'chime') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(chime, "general", alertVolumes);
            } else if (alertSounds.general === 'bell') {
                pauseAndResetAlertSounds(bell, chime);
                playAlertSound(bell, "general", alertVolumes);
            }
            flags.generalThumbIsDragging = false;
            
        } else {
            if ((event.target.className !== 'flowmodoroAlert') && (event.target.className !== 'volume-thumb') && (document.getElementById("settingsContainer").style.display === "block")) {
                pauseAndResetAlertSounds(bell, chime);
            }
        }
    })

    flowmodoroInputs.forEach(input => {
        input.addEventListener('change', function(event) {
            let finalInputVal = Math.round(event.target.value);
            let validatedFinalInputVal = validateAndSetNotificationInput(finalInputVal);
            document.getElementById(event.target.id).value = validatedFinalInputVal;
            
            let secondsPassed = (breakTimeSuggestionsArr[counters.currentFlowmodoroBreakIndex] * 60) - elapsedTime.flowmodoroNotificationSeconds;
            setBreakTimeSuggestionsArr(event, breakTimeSuggestionsArr, validatedFinalInputVal, counters);
            setCurrentFlowmodoroNotification(flags, counters, breakTimeSuggestionsArr);

            if ((counters.startStop === 0) || (flags.inHyperFocus)) {
                elapsedTime.flowmodoroNotificationSeconds = ((counters.currentFlowmodoroNotification * 60) - secondsPassed) - 1;
            } else {
                elapsedTime.flowmodoroNotificationSeconds = ((counters.currentFlowmodoroNotification * 60) - secondsPassed);
            }

            suggestionBreak_min.textContent = counters.currentFlowmodoroNotification + " min";
        })
    }) 

    flowmodoroRadios.forEach(radio => {
        radio.addEventListener('change', function(event) {
            if (event.target.id === 'flowmodoroNoAlertInput') {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.flowmodoro = 'none';
            } else if (event.target.id === 'flowmodoroChimeInput') {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.flowmodoro = 'chime';
                playAlertSound(chime, 'flowmodoro', alertVolumes);
            } else if (event.target.id === 'flowmodoroBellInput') {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.flowmodoro = 'bell';
                playAlertSound(bell, 'flowmodoro', alertVolumes);
            }
        })
    })

    generalRadios.forEach(radio => {
        radio.addEventListener('change', function(event) {
            if (event.target.id === 'generalNoAlertInput') {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.general = 'none';
            } else if (event.target.id === 'generalChimeInput') {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.general = 'chime';
                playAlertSound(chime, 'general', alertVolumes);
            } else if (event.target.id === 'generalBellInput') {
                pauseAndResetAlertSounds(bell, chime);
                alertSounds.general = 'bell';
                playAlertSound(bell, 'general', alertVolumes);
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
            //Check if notifications are disabled already, if they are alert user, uncheck, and return
            //console.log(Notification.permission);

            //SECTION 1: DEALING W/ NOTIFICATIONS
            if (Notification.permission === "denied") {
                alert("Enable notifications in the browser window")
                breakSuggestionToggle.checked = false;
                console.log("Notifications Denied");
                return;
            }
            if (!enableNotifications(breakSuggestionToggle, flowmodoroNotificationToggle, flags, suggestionMinutesContainer)) {
                return;
            }
            flags.breakSuggestionToggle = true;

            suggestionMinutes = suggestionMinutesInput.value;
            setSuggestionMinutes(startTimes, flags, elapsedTime, suggestionMinutes, intervals, alertSounds, alertVolumes, chime, bell, start_stop_btn);

        } else {
            flags.breakSuggestionToggle = false;
            clearInterval(intervals.suggestion);
            intervals.suggestion = null;
        }
    })

    flowmodoroNotificationToggle.addEventListener("click", function() {
        if (flowmodoroNotificationToggle.checked) {
            if (Notification.permission === "denied") {
                alert("Enable notifications in the browser window")
                flowmodoroNotificationToggle.checked = false;
                console.log("Notifications Denied");
                return;
            }
            if (!enableNotifications(breakSuggestionToggle, flowmodoroNotificationToggle, flags, suggestionMinutesContainer)) {
                return;
            }

            let elapsedTimeInChillTime = Math.floor((Date.now() - startTimes.chillTime) / 1000); //in seconds

            // When toggle for break notification is turned on whilst in chill time
            if (!flags.inHyperFocus && counters.startStop !== 0) {
                elapsedTime.flowmodoroNotificationSeconds = ((counters.currentFlowmodoroNotification * 60) - elapsedTimeInChillTime) - 1;
                intervals.chillTimeBreak = setInterval(() => flowmodoroNotificationCountdown(elapsedTime, counters, flags, alertSounds, alertVolumes, chime, bell, start_stop_btn, breakTimeSuggestionsArr), 1000);
            }

            flags.flowmodoroNotificationToggle = true;
        } else {
            flags.flowmodoroNotificationToggle = false;
            clearInterval(intervals.chillTimeBreak);
            intervals.chillTimeBreak = null
        }

        changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters);
    })

    autoStartFlowTimeIntervalToggle.addEventListener("click", function() {
        if (!flags.autoStartFlowTimeInterval) {
            flags.autoStartFlowTimeInterval = true;
        } else if (flags.autoStartFlowTimeInterval) {
            flags.autoStartFlowTimeInterval = false;
        }
    })
    
    autoStartChillTimeIntervalToggle.addEventListener("click", function() {
        if (!flags.autoStartChillTimeInterval) {
            flags.autoStartChillTimeInterval = true;
        } else if (flags.autoStartChillTimeInterval) {
            flags.autoStartChillTimeInterval = false;
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

    window.addEventListener("resize", handleViewportWidthChange);

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
});

// ---------------------
// HELPER FUNCTIONS
// ---------------------
function animationsFadeIn(animationType, displayType) {
    animationType.classList.remove('outOfOpacityTransition');
    animationType.classList.add('intoOpacityTransition');
    animationType.style.display = displayType;
}

function animationsFadeOut(animationType) {
    animationType.classList.remove('intoOpacityTransition');
    animationType.classList.add('outOfOpacityTransition');
    setTimeout(() => {
        animationType.style.display = 'none';
    }, 500)
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
        elapsedTime.suggestionSeconds = (suggestionMinutes * 60) - 1; //shallow copy suggestionMinutes to elapsedTime.suggestionSeconds (saves state)
    } else {
        elapsedTime.suggestionSeconds = ((suggestionMinutes * 60) - elapsedTimeInHyperfocus) - 1;
        intervals.suggestion = setInterval(() => suggestionMinutesCountdown(elapsedTime, suggestionMinutes, flags, alertSounds, alertVolumes, chime, bell, start_stop_btn), 1000);
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
function alertVolumeChange(volumeContainerType, alertVolumes, volumeThumbType, volumeBarType, event, flags) {
    const rect = volumeContainerType.getBoundingClientRect();
    let volumeLevel = (event.clientX - rect.left) / rect.width;
    volumeLevel = Math.max(0, Math.min(1, volumeLevel)); // Constrain between 0 and 1

    // Update the thumb and bar positions
    volumeThumbType.style.left = `${volumeLevel * 100}%`;
    volumeBarType.style.width = `${volumeLevel * 100}%`;

    if (flags.flowmodoroThumbIsDragging) {
        alertVolumes.flowmodoro = volumeLevel;
    } else if (flags.generalThumbIsDragging) {
        alertVolumes.general = volumeLevel;
    }
}

function hideAllSettingsContainers(settingsMappings) {
    for (const [buttonId, containerId] of Object.entries(settingsMappings)) {
        document.getElementById(containerId).style.display = 'none';
        document.getElementById(buttonId).classList.remove('selected');
    }
}

function setInitialEndSessionBtnText(initialViewportWidth, end_session_btn) {
    if (initialViewportWidth <= 504) {
        end_session_btn.innerText = "End";
    } else {
        end_session_btn.innerText = "End Session";
    }
}

function handleViewportWidthChange() {
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    let end_session_btn = document.getElementById("end-session");
    if (viewportWidth <= 504) {
        end_session_btn.innerText = "End";
    } else {
        end_session_btn.innerText = "End Session";
    }
}

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

function suggestionMinutesCountdown(elapsedTime, suggestionMinutes, flags, alertSounds, alertVolumes, chime, bell, start_stop_btn) {
    // console.log(elapsedTime.suggestionSeconds); //testing
    if (elapsedTime.suggestionSeconds === 0) {
        let notificationString;
        if (suggestionMinutes !== 1) {
            notificationString = "Need a break? You've been hard at work for " + suggestionMinutes.toString() + " minutes!";
        } else {
            notificationString = "Need a break? You've been hard at work for " + suggestionMinutes.toString() + " minute!";
        }
        new Notification(notificationString);

        if (alertSounds.general === 'chime') {
            chime.volume = alertVolumes.general;
            chime.play();
        } else if (alertSounds.general === 'bell') {
            bell.volume = alertVolumes.general;
            bell.play();
        }
        //IF AUTO START CHILL TIME INTERVAL OPTION IS SELECTED
        if (flags.autoStartChillTimeInterval) {
            start_stop_btn.click();
        }
    }
    elapsedTime.suggestionSeconds--;
    console.log(elapsedTime.suggestionSeconds);
}

function flowmodoroNotificationCountdown(elapsedTime, counters, flags, alertSounds, alertVolumes, chime, bell, start_stop_btn, breakTimeSuggestionsArr) {
    if (elapsedTime.flowmodoroNotificationSeconds === 0) {

        let notificationString;
        if (breakTimeSuggestionsArr[counters.currentFlowmodoroBreakIndex] == 1) {
            notificationString = "It's been " + counters.currentFlowmodoroNotification + " minute! Are you ready to get back into Flow Time?";
        } else {
            notificationString = "It's been " + counters.currentFlowmodoroNotification + " minutes! Are you ready to get back into Flow Time?";
        }
        new Notification(notificationString);

        if (alertSounds.flowmodoro === 'chime') {
            chime.volume = alertVolumes.flowmodoro;
            chime.play();
        } else if (alertSounds.flowmodoro === 'bell') {
            bell.volume = alertVolumes.flowmodoro;
            bell.play();
        }
        //IF AUTO START FLOW TIME INTERVAL OPTION IS SELECTED
        if (flags.autoStartFlowTimeInterval) {
            start_stop_btn.click();
        }
    }
    elapsedTime.flowmodoroNotificationSeconds--;
    console.log(elapsedTime.flowmodoroNotificationSeconds);
}

function removeBreakSuggestionBlock(breakSuggestionBlock, breakSuggestionBlock2) {
    breakSuggestionBlock.style.display = "none";
    breakSuggestionBlock2.style.display = "none";
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
async function enableNotifications(breakSuggestionToggle, flowmodoroNotificationToggle, flags, suggestionMinutesContainer) {
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
            breakSuggestionToggle.checked = false;
            flags.breakSuggestionToggle = false;

            flowmodoroNotificationToggle.checked = false;
            flags.flowmodoroNotificationToggle = false;
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
    if (!inputHours || roundedHours <= 0 || roundedHours > 24 || (roundedHours * 60 * 60 * 1000) <= getTotalElapsed(flags.inHyperFocus, elapsedTime.hyperFocus, startTimes.local)) {
        
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

    
    if (flags.inHyperFocus) { //if in flow time
        timeDiff = Date.now() - startTimes.hyperFocus + elapsedTime.hyperFocus;
    }
    else if (!flags.inHyperFocus) { //if in chill time
        timeDiff = elapsedTime.hyperFocus;
    }
    
    let percentage = timeDiff / targetTime;
    
    if (percentage > 1) {
        percentage = 1; //cap percentage at 100%
    }
    
    if (targetTime !== 0 && percentage >= 1 && !flags.hitTarget) { //when target time is hit
        flags.hitTarget = true;
        setTimeout(() => {
            console.log("Congrats! You've hit your target time!");
            if (flags.targetReachedToggle == true) {
                alert("Congrats! You've hit your target time!");
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
        clock_tick.volume = 0.25; //lowering volume of sound
        clock_tick.play();
    }
};

function handleEnter(event, start_stop_btn, submit_change_btn, userInputTask) {

    if (event.key === 'Enter') {
        event.preventDefault();
        
        if (document.activeElement.id === 'target-hours') {
            submit_change_btn.click();
        } else if (document.activeElement === userInputTask) {
            // DO NOTHING - code for this event is implemented in notes.js instead
        }  else if (document.activeElement.className == "noteInput") {
            // DO NOTHING - code for this event is implemented in notes.js instead
        } else {
            start_stop_btn.click();
        }
    }
};

function timeDisplay(local_startTime, display, timeConvert) {
    const timeDiff = Date.now() - local_startTime;
    
    let hours = Math.floor(timeDiff / timeConvert.msPerHour);
    let minutes = Math.floor((timeDiff - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
    let seconds = Math.floor((timeDiff - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);
    
    // Format the time values
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    
    display.textContent = `${hours}:${minutes}:${seconds}`;
};

function totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime) {
    
    let timeDiff = getTotalElapsed(flags.inHyperFocus, elapsedTime.hyperFocus, startTimes.local);
    
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

function getTotalElapsed(inHyperFocus, elapsedTime, local_startTime) { //return current total hyper focus time
    return inHyperFocus ? (elapsedTime + (Date.now() - local_startTime)) : elapsedTime;
};

function setBrowserTabTitle() {
    // Function to set the browser tab title based on the content of the #display div
    function setTabTitleFromDisplay() {
        document.title = document.getElementById("display").innerText;
    };

    // Initially set the browser tab title
    setTabTitleFromDisplay();

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