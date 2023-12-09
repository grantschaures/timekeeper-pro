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
    const body = document.querySelector("body");

    const total_time_display = document.getElementById("progress-text");

    const productivity_chill_mode = document.getElementById("productivity-chill-mode");
    const audio = document.getElementById("click-sound"); //plays sound effect when stop/start button hit
    const progressBarContainer = document.getElementById("progress-bar-container");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const display = document.getElementById("display");

    //INTERRUPTIONS CONTAINER
    const interruptionsContainer = document.getElementById("interruptions-container");
    const interruptionsSubContainer = document.getElementById("interruptions-sub-container");
    const interruptionsChangeContainer = document.getElementById("interruptions-change-container");
    const decBtn = document.getElementById("decBtn");
    const incBtn = document.getElementById("incBtn");

    const coolerDiv = document.getElementById("coolerDiv");
    const interruptionsNum = document.getElementById("interruptions_num");

    const suggestionBreakContainer = document.getElementById("suggestionBreakContainer");
    const suggestionBreak_label = document.getElementById("suggestionBreak-label");
    const suggestionBreak_min = document.getElementById("suggestionBreak-min");

    //SETTINGS
    const targetTimeReachedToggle = document.getElementById("targetTimeReachedToggle");
    const breakSuggestionToggle = document.getElementById("breakSuggestionToggle");
    const suggestionMinutesContainer = document.getElementById("suggestionMinutesContainer");
    const submit_suggestion_btn = document.getElementById("suggestion-minutes-submit");
    const breakSuggestionBlock = document.getElementById("breakSuggestionBlock");
    const breakSuggestionBlock2 = document.getElementById("breakSuggestionBlock2");
    const chillTimeBreakSuggestionToggle = document.getElementById("chillTimeBreakSuggestionToggle");
    const transitionClockSoundToggle = document.getElementById("transitionClockSoundToggle");
    let academicWeaponSelect = document.getElementById("academicWeaponSelect");

    //Background Animations
    const flowAnimation = document.getElementById("flowAnimation");
    const chillAnimation = document.getElementById("chillAnimation");

    //NOTES
    const userInputTask = document.getElementById("userInputTask");

    const redFavicon = "/images/RED.png";
    const blueFavicon = "/images/BLUE.png";
    const link = document.querySelector("link[rel~='icon']");

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;

    const timeConvert = {
        msPerHour: 3600000,
        msPerMin: 60000,
        msPerSec: 1000
    };

    //bundle these function together after getting a good understanding of them

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
        chillTimeSuggestionSeconds: 0
    }

    //STATE-RELATED FLAGS AND COUNTERS
    let counters = {
        startStop: 0, //tracks number of times start/stop is pressed
        interruptions: 0,
        currentChillTimeBreakSuggestion: 0
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
        isAcademicWeapon: false,
        chillTimeBreakSuggestionToggle: false,
        progressBarContainerIsSmall: false
    }

    // ----------------
    // MAIN CODE (Runs after DOM content is loaded)
    // ----------------

    //Safari on iPad Pro acts like mobile (no push notifications) but identifies as desktop
    /* This shouldn't be a huge deal, but iPad pro users will see the
    break suggestion toggle, but it won't do anything... We'll have to just
    live with this for now unfortunately */

    // INITIAL DOMContentLoaded FUNCTION CALLS
    if (isMobile) {
        removeBreakSuggestionBlock(breakSuggestionBlock, breakSuggestionBlock2);
    }

    setInitialEndSessionBtnText(initialViewportWidth, end_session_btn);

    // ----------------
    // EVENT LISTENERS
    // ----------------
    document.addEventListener('keydown', (event) => handleEnter(event, start_stop_btn, submit_change_btn, userInputTask, submit_suggestion_btn));

    start_stop_btn.addEventListener("click", function() {

        playClick(audio, flags);
        resetDisplay(display);

        counters.startStop++; //keep track of button presses

        if (counters.startStop === 1) {
            veryStartActions(startTimes);

            if (document.getElementById("target-hours").value == "") {
                progressBarContainer.classList.toggle("small");
                flags.progressBarContainerIsSmall = true;
            }
        }

        startTimes.local = Date.now();
        clearInterval(intervals.local);
        intervals.local = setInterval(() => timeDisplay(startTimes.local, display, timeConvert), 1000); //using arrow function so we can pass arguments
        
        if (!intervals.main) { //executes when interval is undefined --> Hyper Focus Mode
            setFavicon(link, redFavicon);

            //Remove circle animations

            //if not first transition
            if (counters.startStop > 1) {
                chillAnimation.classList.remove('intoOpacityTransition');
                chillAnimation.classList.add('outOfOpacityTransition');
            }

            //Fade in sine wave animations
            flowAnimation.classList.remove('outOfOpacityTransition');
            flowAnimation.classList.add('intoOpacityTransition');


            hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min);
            showInterruptionsSubContainer(interruptionsSubContainer);

            //Console.log out the --> Hyper Focus Time (00:00 format)
            console.log(getCurrentTime() + " --> Entering Flow Time");

            setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop","Flow Time");
            startTimes.hyperFocus = Date.now();
            intervals.total = setInterval(() => totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime), 1000);
            intervals.main = setInterval(() => updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer), 1000); //repeatedly calls reference to updateProgressBar function every 1000 ms (1 second)
            
            if (flags.submittedSuggestionMinutes) {
                intervals.suggestion = setInterval(() => suggestionMinutesCountdown(elapsedTime, suggestionMinutes, flags), 1000);
            }

            if (flags.chillTimeBreakSuggestionToggle) {
                clearInterval(intervals.chillTimeBreak);
            }

            if (counters.startStop > 1) { // runs first during first chill time interval
                elapsedTime.chillTime += Date.now() - startTimes.chillTime;
            }
            setBackground("linear-gradient(to bottom, #5dd44d, #50b350, #004400)"); //Green gradient
        } else { //--> Chill Time
            setFavicon(link, blueFavicon);

            //Remove sine wave animations
            flowAnimation.classList.remove('intoOpacityTransition');
            flowAnimation.classList.add('outOfOpacityTransition');

            //Add circle animations
            chillAnimation.classList.add('intoOpacityTransition');
            chillAnimation.classList.remove('outOfOpacityTransition');

            saveResetInterruptions(interruptionsNum, counters, savedInterruptionsArr);
            hideInterruptionsSubContainer(interruptionsSubContainer);

            let lastHyperFocusIntervalMin = Math.floor((Date.now() - startTimes.hyperFocus) / (1000 * 60));
            
            showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, breakTimeSuggestionsArr, lastHyperFocusIntervalMin, counters);
            
            if (flags.chillTimeBreakSuggestionToggle) {
                elapsedTime.chillTimeSuggestionSeconds = counters.currentChillTimeBreakSuggestion * 60;
                intervals.chillTimeBreak = setInterval(() => chillTimeSuggestionCountdown(elapsedTime, counters, flags), 1000);
            }
            //Console.log out the --> Chill Time (00:00 format)
            console.log(getCurrentTime() + " --> Entering Chill Time");
            
            setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start", "Chill Time");
            startTimes.chillTime = Date.now();

            clearInterval(intervals.main);
            intervals.main = null;

            clearInterval(intervals.total);
            intervals.total = null;

            if (flags.submittedSuggestionMinutes) {
                clearInterval(intervals.suggestion);
                intervals.suggestion = null;
                elapsedTime.suggestionSeconds = suggestionMinutes * 60;
            }

            elapsedTime.hyperFocus += Date.now() - startTimes.hyperFocus;
            
            //TESTING
            // console.log("Logged: " + Math.floor((Date.now() - startTimes.hyperFocus) / 1000) + " seconds of Hyper Focus.");
            // console.log("Logged: " + Math.floor((elapsedTime.hyperFocus) / 1000) + " seconds of elapsed Hyper Focus.");
            // console.log("----------------");
            
            // setBackground(("url('../images/shroomtower.png')"));
            setBackground("linear-gradient(to bottom, #3b8fe3, #1d60a3, #7f04c7)"); //Blue-Purple gradient
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
            
            if (!flags.inHyperFocus) { //if we're in chill time
                
                /* Update progress bar & percentage ONCE to demonstrate submitted change in Chill Time */
                updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer);
                totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
            } else {
                /* This code is (kind of) optional, it makes the progress bar fade in happen a bit faster in flow
                time because otherwise, the speed of the fade in is determined by the next interval after the submit btn
                is pressed */
                updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer);
                totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
            }
            
            flags.hitTarget = false;
        }
        else if (flags.submittedTarget) { //When changing target hours
            changeTargetHours(flags);

            if (!flags.inHyperFocus) { //if we're in chill time
                
                /* Update progress bar & percentage ONCE to demonstrate submitted change in Chill Time */
                updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer);
                totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
            } else {
                /* This code is (kind of) optional, it makes the progress bar fade out happen a bit faster in chill
                time because otherwise, the speed of the fade in is determined by the next interval after the submit btn
                is pressed */
                updateProgressBar(targetTime, startTimes, elapsedTime, flags, progressBar, progressContainer);
                totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, targetTime);
            }
            
            /* The reason for this is that we don't want to bombard the user with progress container animations at the very start of the program :P */
            if (counters.startStop > 0) { // only if session has been started
                if (!flags.progressBarContainerIsSmall) { // and progress bar container is large
                    progressBarContainer.classList.toggle("small"); // make progress container small
                    flags.progressBarContainerIsSmall = true;
                }
            }
        }
    });

    submit_suggestion_btn.addEventListener("click", function() {
        if (!flags.submittedSuggestionMinutes) {

            let inputSuggestionMinutes = document.getElementById("suggestionMinutesInput").value;

            //Validate input (no decimals or negative numbers or numbers above 720)
            if(!suggestionMinutesValidate(inputSuggestionMinutes)) {
                return;
            }

            //set suggestion minutes w/ replaceSuggestionMinutes(inputSuggestionMinutes, suggestionMinutes, flags)
            suggestionMinutes = replaceSuggestionMinutes(inputSuggestionMinutes, suggestionMinutes, flags);
            elapsedTime.suggestionSeconds = suggestionMinutes * 60; //shallow copy suggestionMinutes to elapsedTime.suggestionSeconds (saves state)
            
            if (flags.inHyperFocus) {
                intervals.suggestion = setInterval(() => suggestionMinutesCountdown(elapsedTime, suggestionMinutes, flags), 1000);
            }
        }
        else if (flags.submittedSuggestionMinutes) {
            //change suggestion minutes input back to blank state and clear interval (repeated code; refactor later)
            changeSuggestionMinutes(flags);
            clearInterval(intervals.suggestion);
            intervals.suggestion = null;
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

            if (Notification.permission === "denied") {
                alert("Enable notifications in the browser window")
                breakSuggestionToggle.checked = false;
                console.log("Notifications Denied");
                return;
            }
            if (!enableNotifications(breakSuggestionToggle, chillTimeBreakSuggestionToggle, flags, suggestionMinutesContainer)) {
                return;
            }

            flags.breakSuggestionToggle = true;
            //Show option to enter how long you'd like to stay in hyper focus mode before getting a suggestion to take break
            showSuggestionMinutesContainer(suggestionMinutesContainer);
        } else {
            flags.breakSuggestionToggle = false;
            hideSuggestionMinutesContainer(suggestionMinutesContainer);

            //change suggestion minutes input back to blank state and clear interval (repeated code; refactor later)
            changeSuggestionMinutes(flags);
            clearInterval(intervals.suggestion);
            intervals.suggestion = null;
        }
    })

    chillTimeBreakSuggestionToggle.addEventListener("click", function() {
        if (chillTimeBreakSuggestionToggle.checked) {
            if (Notification.permission === "denied") {
                alert("Enable notifications in the browser window")
                chillTimeBreakSuggestionToggle.checked = false;
                console.log("Notifications Denied");
                return;
            }
            if (!enableNotifications(breakSuggestionToggle, chillTimeBreakSuggestionToggle, flags, suggestionMinutesContainer)) {
                return;
            }

            if (!flags.inHyperFocus && counters.startStop !== 0) {
                elapsedTime.chillTimeSuggestionSeconds = counters.currentChillTimeBreakSuggestion * 60;
                intervals.chillTimeBreak = setInterval(() => chillTimeSuggestionCountdown(elapsedTime, counters, flags), 1000);
            }

            flags.chillTimeBreakSuggestionToggle = true;
        } else {
            flags.chillTimeBreakSuggestionToggle = false;
            clearInterval(intervals.chillTimeBreak);
            intervals.chillTimeBreak = null
        }
    })

    transitionClockSoundToggle.addEventListener("click", function() {
        if (transitionClockSoundToggle.checked) {
            flags.transitionClockSoundToggle = true;
        } else {
            flags.transitionClockSoundToggle = false;
        }
    })
    
    academicWeaponSelect.addEventListener("click", function() {
        let value = academicWeaponSelect.value;
    
        if (value == "yes") {
            flags.isAcademicWeapon = true;
        } else {
            flags.isAcademicWeapon = false;
        }
    })

    window.addEventListener("resize", handleViewportWidthChange);

    end_session_btn.addEventListener("click", function() { //temporary function
        location.reload();
    });
});

// ---------------------
// HELPER FUNCTIONS
// ---------------------
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

function showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, breakTimeSuggestionsArr, lastHyperFocusIntervalMin, counters) {
    suggestionBreakContainer.style.display = 'flex';

    if (lastHyperFocusIntervalMin >= 90) {
        counters.currentChillTimeBreakSuggestion = breakTimeSuggestionsArr[3];
    } else if (lastHyperFocusIntervalMin >= 50) {
        counters.currentChillTimeBreakSuggestion = breakTimeSuggestionsArr[2];
    } else if (lastHyperFocusIntervalMin >= 25) {
        counters.currentChillTimeBreakSuggestion = breakTimeSuggestionsArr[1];
    } else {
        counters.currentChillTimeBreakSuggestion = breakTimeSuggestionsArr[0];
    }

    suggestionBreak_label.textContent = "Suggested Break";
    suggestionBreak_min.textContent = counters.currentChillTimeBreakSuggestion + " min";
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

function suggestionMinutesCountdown(elapsedTime, suggestionMinutes, flags) {
    // console.log(elapsedTime.suggestionSeconds); //testing
    if (elapsedTime.suggestionSeconds === 0) {
        let notificationString;
        if (suggestionMinutes !== 1) {
            notificationString = "Need a break? You've been hard at work for " + suggestionMinutes.toString() + " minutes!";
        } else {
            notificationString = "Need a break? You've been hard at work for " + suggestionMinutes.toString() + " minute!";
        }
        new Notification(notificationString);
        //elapsedTime.suggestionSeconds = suggestionMinutes * 60; //uncomment if you want notification to repeat in hyper focus mode
    }
    elapsedTime.suggestionSeconds--;
    // console.log(elapsedTime.suggestionSeconds);
}

function chillTimeSuggestionCountdown(elapsedTime, counters, flags) {
    if (elapsedTime.chillTimeSuggestionSeconds === 0) {
        let notificationString = "It's been " + counters.currentChillTimeBreakSuggestion + " minutes! Are you ready to get back into Flow Time?";
        new Notification(notificationString);
    }
    elapsedTime.chillTimeSuggestionSeconds--;
    // console.log(elapsedTime.chillTimeSuggestionSeconds);
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
async function enableNotifications(breakSuggestionToggle, chillTimeBreakSuggestionToggle, flags, suggestionMinutesContainer) {
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

            chillTimeBreakSuggestionToggle.checked = false;
            flags.chillTimeBreakSuggestionToggle = false;
            hideSuggestionMinutesContainer(suggestionMinutesContainer);
            return false;
        }
    }
    return true;
}

function suggestionMinutesValidate(inputSuggestionMinutes) {
    const roundedMinutes = Math.round(parseFloat(inputSuggestionMinutes));

    if (!roundedMinutes || roundedMinutes <= 0 || roundedMinutes > 720) { //720 minutes = 12 hours
        
        alert("Enter a valid time from 1 minute to 720 minutes");
        return false;
    }
    return true;
}

function showSuggestionMinutesContainer(suggestionMinutesContainer) {
    suggestionMinutesContainer.style.display = "flex";
}

function hideSuggestionMinutesContainer(suggestionMinutesContainer) {
    suggestionMinutesContainer.style.display = "none";
}

function changeSuggestionMinutes(flags) {
    document.getElementById("suggestionMinutesInput").remove();
        
    let enterSuggestionMinutes = document.createElement('input');
    enterSuggestionMinutes.type = "number";
    enterSuggestionMinutes.id = "suggestionMinutesInput";
    enterSuggestionMinutes.name = "minutes";
    enterSuggestionMinutes.min = "0";
    document.getElementById("coolDiv2").appendChild(enterSuggestionMinutes);
    
    document.getElementById('suggestion-minutes-submit').textContent = "Submit";
    flags.submittedSuggestionMinutes = false;
}

function replaceSuggestionMinutes(inputSuggestionMinutes, suggestionMinutes, flags) {
    //Insert a new number input box
    let targetSuggestionMinutes = Math.round(parseFloat(inputSuggestionMinutes)); //return to 100 after testing
    suggestionMinutes = targetSuggestionMinutes;
    document.getElementById("suggestionMinutesInput").remove();

    let submitMinutes = document.createElement('h4');
    submitMinutes.textContent = targetSuggestionMinutes;
    submitMinutes.id = "suggestionMinutesInput";
    submitMinutes.className = "finalized-suggestion-minutes";
    submitMinutes.style.backgroundColor = "#5c5c5c"; //dark grey finalized background color
    submitMinutes.style.marginTop = "0px";
    submitMinutes.style.marginBottom = "0px";
    document.getElementById("coolDiv2").appendChild(submitMinutes);
    document.getElementById('suggestion-minutes-submit').textContent = "Change";
    flags.submittedSuggestionMinutes = true;

    return suggestionMinutes;
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

function veryStartActions(startTimes) {
    startTimes.beginning = Date.now();
    setBrowserTabTitle(); //sets browser tab title to the stopwatch time '00:00:00'
    document.getElementById("target-hours").classList.remove("glowing-effect");
};

function setBackground(background_color) {
    document.body.style.backgroundImage = background_color;  // Set the background color back to red when started
    document.documentElement.style.backgroundImage = background_color;
};

function playClick(audio, flags) {
    if (flags.transitionClockSoundToggle == true)
    {
        audio.volume = 0.25; //lowering volume of sound
        audio.play().catch(error => {
            console.error("Audio playback error:", error);
        });
    }
};

function handleEnter(event, start_stop_btn, submit_change_btn, userInputTask, submit_suggestion_btn) {

    if (event.key === 'Enter') {
        event.preventDefault();
        
        if (document.activeElement.id === 'target-hours') {
            submit_change_btn.click();
        } else if (document.activeElement === userInputTask) {
            // DO NOTHING - code for this event is implemented in notes.js instead
        }  else if (document.activeElement.className == "noteInput") {
            // DO NOTHING - code for this event is implemented in notes.js instead
        } else if (document.activeElement.id === 'suggestionMinutesInput') {
            submit_suggestion_btn.click();
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

function setFavicon(link, faviconPath) {
    // If it doesn't exist, create it and append to the head
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    link.href = faviconPath;
}