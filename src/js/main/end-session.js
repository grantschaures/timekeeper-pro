import { timeConvert, intervals, startTimes, recoverBreakState, recoverPomState, elapsedTime, counters, flags, savedInterruptionsArr, timeAmount, intervalArrs, progressTextMod, lightHtmlBackground, darkHtmlBackground, times, perHourData, catIds, tempCounters, pip } from '../modules/index-objects.js';
import { start_stop_btn, end_session_btn, total_time_display, productivity_chill_mode, progressBar, progressContainer, display, interruptionsSubContainer, interruptionsNum, suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, completedPomodorosContainer, flowAnimation, chillAnimation, streaksCount, breakBackground, deepWorkBackground, commentsTextArea, sessionSummaryOkBtn, subjectiveFeedbackDropdown, sessionSummaryPopup, summaryStats, HC_icon_session_summary, commentsContainer, sessionSummarySignupPromptPopup, popupOverlay, HC_icon_signup_prompt, signupPromptPopupBtn, sessionSummaryKitty2, sessionSummaryKitty1, sessionSummaryKitty3, blogs, blog_exit, overlayExit, sessionSummaryChart, multiSeriesPiePlotContainer } from '../modules/dom-elements.js';
import { soundMap } from '../modules/sound-map.js';
import { sessionState } from '../modules/state-objects.js';
import { labelFlags, labelArrs, labelDict, notesFlags, flags as notesflags } from '../modules/notes-objects.js';
import { tempStorage, flags as summaryFlags } from '../modules/summary-stats.js';
import { flags as navFlags, state } from '../modules/navigation-objects.js';
import { dailyContainer } from '../modules/dashboard-objects.js';
import { flags as dashboardFlags } from '../modules/dashboard-objects.js';

import { animationsFadeIn, animationsFadeOut, getTotalElapsed, returnTotalTimeString, updateLabelArrs, setBackground, pauseAndResetAlertSounds, resetDisplay, updateProgressBar, totalTimeDisplay, setButtonTextAndMode, hideSuggestionBreakContainer, hidePomodorosCompletedContainer, showInterruptionsSubContainer, setFavicon, observer, pomodoroWorker, suggestionWorker, flowmodoroWorker, displayWorker, totalDisplayWorker, updateDataPerHour, hideCat } from './index.js'; // minified
import { checkInvaliDate } from '../state/check-invaliDate.js'; // minified
import { addSession } from '../state/add-session.js'; // minified
import { closeAboutContainer, closeBlogContainer, subMainContainerTransition } from './navigation.js'; // minified
import { populateDashboard } from '../dashboard/populate-dashboard.js'; // minified

const defaultFavicon = "/images/logo/HyperChillLogo_circular_white_border.png";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function isIpadCheck() {
    const userAgent = navigator.userAgent || window.opera;
    return /iPad/.test(userAgent) || (navigator.maxTouchPoints > 1);
}

const isIpad = isIpadCheck();

document.addEventListener("stateUpdated", function() {
    end_session_btn.addEventListener("click", async function() {
        if ((flags.sessionInProgress) && (flags.canEndSession)) {
            flags.canEndSession = false; // immediately block another end_session_btn click before rest of flags are reset
            times.end = Date.now();
            tempCounters.catIdsArrIndex = counters.catIdsArrIndex;

            // if any overlay popups are showing, close those first before session summary popup shows (MAKE SURE TO UPDATE THIS IF MORE OVERLAY POPUP WINDOWS ARE ADDED)
            // (necessary due to pip end btn click)
            if ((navFlags.deleteAccountWindowShowing) || (navFlags.accountWindowShowing) || (navFlags.shortcutsWindowShowing) || (navFlags.sessionIntervalsBoundsDemoPopupShowing) || (notesflags.confirmLabelDeletionWindowShowing) || (dashboardFlags.confirmSessionDeletionPopupShowing)) {
                popupOverlay.click();
            }

            let logSessionActivity;
            if (sessionState.loggedIn) {
                // IF START OF SESSION IS BEFORE invaliDate, RESET GUI BUT DON'T LOG SESSION
                logSessionActivity = await checkInvaliDate(times.start); // T or F
                if (logSessionActivity) {
                    await logSession(); // (1) Collect all necessary information about the session
                    setTimeout(() => { // reset displays after popup
                        initialVisualReset(tempCounters)
                    }, 500)
                } else {
                    initialVisualReset(tempCounters)
                }
            } else {
                await logSession(); // "logs session"
                setTimeout(() => { // reset displays after popup
                    initialVisualReset(tempCounters)
                    summaryFlags.canSubmitSessionSummary = true;
                }, 500)
            }

            // (2) Reset everything to the default state
            sessionReset(logSessionActivity);
        }
    });
    
    // Session Summary Behavior
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && navFlags.sessionSummaryPopupShowing) {
            insertNewLine(event, commentsTextArea);
        }
    });

    sessionSummaryOkBtn.addEventListener("click", async function() {
        if (isMoreThan10000Chars(commentsTextArea.value)) {
            alert("Please keep your comments 10000 characters or less. Thanks!");
            commentsTextArea.focus();
            return;
        }

        if (summaryFlags.canSubmitSessionSummary) {
            // hide sessionSummaryCats
            hideSessionSummaryCats();

            // hide summary popup
            hideSessionSummaryPopup();

            // show main elements if in home view + settings, blog, or about windows open (necessary due to pip end btn click)
            if (state.lastSelectedMode === 'home') {
                if (navFlags.settingsContainerShowing) {
                    subMainContainerTransition('flex');
                } else if (navFlags.blogContainerShowing) {
                    closeBlogContainer();
                } else if (navFlags.aboutContainerShowing) {
                    closeAboutContainer();
                }
            }
            
            if (sessionState.loggedIn) {
                hidePopupOverlay();
                await updateSessionSummary(tempStorage, commentsTextArea, subjectiveFeedbackDropdown);
            } else {
                displaySessionSummarySignupPromptPopup();
            }
            
            // reset session summary
            resetSessionSummary();
            
            // clear tempStorage in summary-stats.js
            resetPropertiesToNull(tempStorage);

            summaryFlags.canSubmitSessionSummary = false;

            // Reset session summary HC icon depth
            HC_icon_session_summary.style.zIndex = 2;

            overlayExit.style.display = 'flex';
        }
    })

    signupPromptPopupBtn.addEventListener("click", function() {
        window.location.href = "/signup";
    })
})

// -----------------
// MAIN FUNCTIONS
// -----------------

function isMoreThan10000Chars(inputStr) {
    if (inputStr.length > 10000) {
        return true;
    } else {
        return false;
    }
}

// corresonding hide function defined in navigation.js
function displaySessionSummarySignupPromptPopup() {
    navFlags.sessionSummarySignupPromptPopupShowing = true;
    sessionSummarySignupPromptPopup.style.display = "flex";

    menuBtn.style.display = 'none';
    menuBtn.style.opacity = '0';
    
    HC_icon_signup_prompt.classList.add('hyperChillSlowRotate');
    setTimeout(() => {
        sessionSummarySignupPromptPopup.style.opacity = 1;
    }, 100)
}

// reset comments and rating elements
function resetSessionSummary() {
    document.getElementById('deepWorkTime').innerHTML = "";
    document.getElementById('focusPercentage').innerHTML = "";
    
    commentsTextArea.value = "";
    subjectiveFeedbackDropdown.value = "";
}

// hide popup and overlay (immediately)
function hideSessionSummaryPopup() {
    sessionSummaryPopup.style.display = 'none';
    navFlags.sessionSummaryPopupShowing = false;

    sessionSummaryPopup.style.opacity = 0;
    multiSeriesPiePlotContainer.style.opacity = 0;
    sessionSummaryChart.style.opacity = 0;
    summaryStats.forEach(container => {
        container.style.opacity = 0;
    })
    document.body.style.overflowY = "scroll"; // stop scrolling
}

function hidePopupOverlay() {
    popupOverlay.style.display = 'none';
    popupOverlay.style.opacity = 1;
}

async function updateSessionSummary(tempStorage, commentsTextArea, subjectiveFeedbackDropdown) {
    let userComments = commentsTextArea.value;
    let sessionRating = subjectiveFeedbackDropdown.value;
    let sessionId = tempStorage.sessionId;

    try {
        const response = await fetch('/api/data/update-session-summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userComments, sessionRating, sessionId })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("Session summary updated successfully:", data);

        populateDashboard(data.noteSessionData.sessions, data.noteSessionData.note, data.noteSessionData.notesEntries);
        dailyContainer.miniChartsSeen = false;
        
    } catch (error) {
        console.error('Failed to update session summary:', error);
    }
}

function insertNewLine(event, textarea) {
    // Prevent default behavior of Enter key
    event.preventDefault();

    // Insert a new line at the current cursor position
    const cursorPosition = textarea.selectionStart;
    const value = textarea.value;
    textarea.value = value.slice(0, cursorPosition) + '\n' + value.slice(cursorPosition);

    // Move the cursor to the new position
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;

    // Scroll the textarea to the bottom to make the new line visible
    textarea.scrollTop = textarea.scrollHeight;
}

async function logSession() {
    subMainContainerTransition("none");

    let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // determine moment they end session
    updateStreaks(sessionState, streaksCount); // for non-logged in user

    // total time in deep work
    let totalTime = getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes);
    
    // total distractions
    let totalDistractions = calculateTotalInterruptions(flags, savedInterruptionsArr, counters);

    // update perHourDate object
    finalPerHourDataUpdate(intervalArrs, perHourData);
    
    // focus quality calculation
    let focusQualityFractionV2 = focusQualityCalculation(timeConvert, totalTime, totalDistractions, 0.2);
    let focusQualityFractionV5 = focusQualityCalculation(timeConvert, totalTime, totalDistractions, 0.5);

    // quality adjusted deep work
    let qualityAdjustedDeepWorkV2 = totalTime * focusQualityFractionV2;
    let qualityAdjustedDeepWorkV5 = totalTime * focusQualityFractionV5;
        
    // update interval arrays
    finalUpdateOfIntervalArrs(flags, startTimes, intervalArrs);
    
    // average length of Intervals
    let avgFlowTimeInterval = calculateAvgIntervalTime(intervalArrs.flowTime);
    let avgChillTimeInterval = calculateAvgIntervalTime(intervalArrs.chillTime);

    // add final labelArr value
    finalLabelArrsUpdate(flags, labelFlags, labelArrs);

    let labelTimeSum = sumTotalLabelTime(labelArrs, labelDict);

    // FILL TEMP STORAGE FOR SESSION SUMMARY POPUP
    fillTempStorage(totalTime, focusQualityFractionV2, timeAmount.targetTime, tempStorage);

    if (sessionState.loggedIn) {
        // SENDING DATA TO BE PROCESSED BY BACKEND
        finalizeSession(times, userTimeZone, totalTime, focusQualityFractionV2, focusQualityFractionV5, qualityAdjustedDeepWorkV2, qualityAdjustedDeepWorkV5, totalDistractions, intervalArrs, savedInterruptionsArr, avgFlowTimeInterval, avgChillTimeInterval, counters, timeAmount, flags, labelTimeSum, perHourData);
    }
    
    // SHOW SUMMARY POPUP
    displaySessionSummaryPopup();
}

// ?? commentsContainer expansion is slightly different on subsequent popup display (not sure why)
function displaySessionSummaryPopup() {
    displaySessionSummaryCat();

    // this is the only time we set opacity to 0 and then transition to 1 in order to get popupOverlay to fade in
    overlayExit.style.display = 'none'; // we want to hide the x in order to encourage the user to click on the OK btn
    popupOverlay.style.opacity = 0;
    popupOverlay.style.display = 'flex';
    setTimeout(() => {
        popupOverlay.style.opacity = 1;
        setTimeout(() => {
            HC_icon_session_summary.style.zIndex = 0;
        }, 1000);
    }, 0)
    sessionSummaryPopup.style.display = 'flex';
    navFlags.sessionSummaryPopupShowing = true;

    if ((!isMobile) && (!isIpad)) {
        commentsTextArea.focus();
    }

    setTimeout(() => {
        sessionSummaryPopup.style.opacity = 1;
        multiSeriesPiePlotContainer.style.opacity = 1;
        sessionSummaryChart.style.opacity = 1;
        summaryStats.forEach(container => {
            container.style.opacity = 1;
        })
        document.body.style.overflowY = "hidden"; // stop scrolling

        document.dispatchEvent(new Event('triggerSessionSummaryChartAnimation'));
    }, 100);
}

function displaySessionSummaryCat() {
    let sessionSummaryKittyArr = [sessionSummaryKitty1, sessionSummaryKitty2, sessionSummaryKitty3];

    // if random number from 1 - 10 is 1, then show a random kitty
    let num = Math.floor(Math.random() * 10) + 1;

    if ((num === 1) && (flags.muffinToggle)) {
        let index = Math.floor(Math.random() * 3);
        sessionSummaryKittyArr[index].style.display = 'flex';
    }
}

function hideSessionSummaryCats() {
    let sessionSummaryKittyArr = [sessionSummaryKitty1, sessionSummaryKitty2, sessionSummaryKitty3];
    sessionSummaryKittyArr.forEach(cat => {
        cat.style.display = 'none';
    });
}

export function sessionReset(logSessionActivity) {
    // reset labelArrs
    resetLabelArrs(labelArrs);

    // reset background to default
    resetBackgrounds(deepWorkBackground, breakBackground);
    resetHtmlBackground(lightHtmlBackground, darkHtmlBackground);
    document.documentElement.style.backgroundSize = '400% 400%';

    // reset alerts
    pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);

    // reset internal logic
    resetActions(flags, intervals, recoverBreakState, recoverPomState, startTimes, elapsedTime, counters, savedInterruptionsArr, intervalArrs, times);

    // clear all intervals
    pomodoroWorker.postMessage("clearInterval");
    suggestionWorker.postMessage("clearInterval");
    flowmodoroWorker.postMessage("clearInterval");
    displayWorker.postMessage("clearInterval");
    totalDisplayWorker.postMessage("clearInterval");

    // fade out animations
    animationsFadeOut(flowAnimation);

    // get rid of glowing green on start/ stop btn and progress bar
    start_stop_btn.classList.remove('glowing-effect');
    progressContainer.classList.remove("glowing-effect");

    if ((logSessionActivity) || (!sessionState.loggedIn)) { // if we can log session activity (session is valid) OR user not logged in
        setTimeout(() => { // reset progress bar and total time w/ delay
            updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer);
            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod);
        }, 500);
    } else { // reset progress bar and total time wout/ delay
        updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer);
        totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod);
    }

    // reset containers
    hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min);
    hidePomodorosCompletedContainer(completedPomodorosContainer);
    showInterruptionsSubContainer(interruptionsSubContainer);

    // fade in animation (if not already faded in)
    setTimeout(() => {
        animationsFadeIn(chillAnimation, 'flex');
    }, 100); // delay fixed hitch between hitting end-session and resetting background

    // reset favicon
    setFavicon(defaultFavicon);
}

// ---------------------
// HELPER FUNCTIONS
// ---------------------
function fillTempStorage(deepWork, focusQuality, targetHours, tempStorage) {
    tempStorage.deepWork = deepWork;
    tempStorage.focusQuality = focusQuality;
    tempStorage.targetHours = targetHours;
}

function resetBackgrounds(deepWorkBackground, breakBackground) {
    deepWorkBackground.style.opacity = 0;
    breakBackground.style.opacity = 0;

    if (flags.pipWindowOpen) {
        pip.window.document.body.style.backgroundImage = '';
        pip.window.document.body.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    }
}

function resetActions(flags, intervals, recoverBreakState, recoverPomState, startTimes, elapsedTime, counters, savedInterruptionsArr, intervalArrs, times) {
    observer.disconnect();
    document.title = "Hyperchill.io: Digital Productivity Journal";

    clearAllIntervals(intervals);
    resetPropertiesToNull(recoverBreakState);
    resetPropertiesToNull(recoverPomState);
    resetPropertiesToNull(times);
    resetPropertiesToUndefined(startTimes);
    resetPropertiesToZero(elapsedTime);
    resetPropertiesToZero(counters);
    resetFlags(flags);
    resetArrays(savedInterruptionsArr);
    resetArrays(intervalArrs);
    resetPerHourData(perHourData);
}

function resetPerHourData(perHourData) {
    for (let key in perHourData) {
        if (perHourData.hasOwnProperty(key)) {
            delete perHourData[key];
        }
    }
}

function resetArrays(input) {
    if (Array.isArray(input)) {
        // If the input is a single array, reset it
        input.splice(0, input.length);
    } else if (typeof input === 'object' && input !== null) {
        // If the input is an object, iterate through each key
        for (const key in input) {
            if (Array.isArray(input[key])) {
                input[key].splice(0, input[key].length);
            }
        }
    }
}

function clearAllIntervals(intervals) {
    for (let key in intervals) {
        if (intervals[key] !== null) {
            clearInterval(intervals[key]);
            intervals[key] = null;
        }
    }
}

function resetFlags(flags) {
    flags.hitTarget = false;
    flags.inHyperFocus = false;
    flags.autoSwitchedModes = false;
    flags.inRecoveryBreak = false;
    flags.inRecoveryPom = false;
    flags.modeChangeExecuted = false;
    flags.sentFlowmodoroNotification = false;
    flags.sentSuggestionMinutesNotification = false;
    flags.pomodoroCountIncremented = false;
    flags.sessionInProgress = false;
}

function resetPropertiesToZero(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = 0;
        }
    }
}

function resetPropertiesToUndefined(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = undefined;
        }
    }
}

function resetPropertiesToNull(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = null;
        }
    }
}

function resetLabelArrs(labelArrs) {
    for (let key in labelArrs) {
        labelArrs[key] = [];
    }
}

function sumTotalLabelTime(labelArrs, labelDict) {
    let labelTimeSum = {};
    for (let key in labelArrs) {
        let arr = labelArrs[key];
        let timeSum = 0;

        for (let i = 1; i < arr.length; i += 2) {
            timeSum += arr[i] - arr[i-1];
        }

        let labelTimesKey = getKeyByValue(labelDict, key);
        labelTimeSum[labelTimesKey] = timeSum;

        // PRINTING OUT LABEL TIMES
        let totalLabelTimeStr = returnTotalTimeString(timeSum, timeConvert);
        let labelName = key;
    }

    return labelTimeSum;
}

function resetHtmlBackground(lightHtmlBackground, darkHtmlBackground) {
    if (flags.darkThemeActivated) {
        document.documentElement.style.backgroundImage = darkHtmlBackground;
    } else {
        document.documentElement.style.backgroundImage = lightHtmlBackground;
    }
}

function getKeyByValue(obj, targetValue) {
    for (const [key, value] of Object.entries(obj)) {
        if (value === targetValue) {
            return key;
        }
    }
    return null; // Return null if no key with the given value is found
}

// fix timing later
async function updateStreaks(sessionState, streaksCount) {
    if (!sessionState.loggedIn) {
        streaksCount.innerText = 1;
    }
}

function calculateTotalInterruptions() {
    if (flags.inHyperFocus) {
        savedInterruptionsArr.push(counters.interruptions);
    }
    let totalInterruptions = savedInterruptionsArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return totalInterruptions;
}

function finalPerHourDataUpdate(intervalArrs, perHourData) {
    let currentTime = Date.now();
    let now = new Date(currentTime);
    let startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()); // initial date
    let currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()); // final date
    updateDataPerHour(intervalArrs, currentHour, startOfHour, perHourData);
}

export function focusQualityCalculation(timeConvert, totalTime, totalDistractions, constant) {
    let totalMin = totalTime / timeConvert.msPerMin;
    let focusQualityFraction = 1 - ((totalDistractions / totalMin) / (constant));

    if (focusQualityFraction < 0) {
        focusQualityFraction = 0;
    } else if (isNaN(focusQualityFraction)) { // edge case: if user has 0ms of deep work + no distractions (which shouldn't happen, but just in case)
        focusQualityFraction = 1;
    }

    return focusQualityFraction;
}

function finalUpdateOfIntervalArrs(flags, startTimes, intervalArrs) {
    let timeInterval;
    if (flags.inHyperFocus) {
        timeInterval = Date.now() - startTimes.hyperFocus;
        intervalArrs.flowTime.push(timeInterval);
    } else {
        timeInterval = Date.now() - startTimes.chillTime;
        intervalArrs.chillTime.push(timeInterval);
    }
}

function calculateAvgIntervalTime(intervalArrType) {
    let intervalArrSum = (intervalArrType).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let intervalArrLength = (intervalArrType).length;
    let avgInterval = (intervalArrSum / intervalArrLength);

    return avgInterval;
}

function finalLabelArrsUpdate(flags, labelFlags, labelArrs) {
    let endTime = Date.now();
    if (flags.inHyperFocus) {
        updateLabelArrs(endTime, labelFlags, labelArrs);
    }
}

async function finalizeSession(times, userTimeZone, totalTime, focusQualityFractionV2, focusQualityFractionV5, qualityAdjustedDeepWorkV2, qualityAdjustedDeepWorkV5, totalDistractions, intervalArrs, savedInterruptionsArr, avgFlowTimeInterval, avgChillTimeInterval, counters, timeAmount, flags, labelTimeSum, perHourData) {
    
    const session = {
        startTime: times.start,
        endTime: times.end,
        timeZone: userTimeZone,
        totalDeepWork: totalTime,
        focusQualityV2: focusQualityFractionV2, // w/ for score > 0%, less than 1 distraction per 5 minutes
        focusQualityV5: focusQualityFractionV5, // w/ for score > 0%, less than 1 distraction per 2 minutes
        qualityAdjustedDeepWorkV2: qualityAdjustedDeepWorkV2,
        qualityAdjustedDeepWorkV5: qualityAdjustedDeepWorkV5,
        totalDistractions: totalDistractions,
        distractionTimesArr: intervalArrs.interruptionTime,
        distractionsPerIntervalArr: savedInterruptionsArr,
        deepWorkIntervals: intervalArrs.flowTime,
        breakIntervals: intervalArrs.chillTime,
        avgDeepWorkInterval: avgFlowTimeInterval,
        avgBreakInterval: avgChillTimeInterval,
        deepWorkIntervalCount: counters.flowTimeIntervals,
        breakIntervalCount: counters.chillTimeIntervals,
        targetHours: timeAmount.targetTime,
        hitTarget: flags.hitTarget,
        pomodorosCompleted: counters.pomodorosCompleted,
        pipWindowEvents: intervalArrs.pipWindowEvent,
        labelTimes: labelTimeSum,
        perHourData: perHourData
    }

    await addSession(session);
}

export function initialVisualReset(tempCounters) {
    // reset displays
    resetDisplay(display);

    // reset header text
    if (flags.pipWindowOpen) {
        setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Start", "Press 'Start'");
    } else {
        setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Start", "Press 'Start' to begin session");
    }

    // remove cats
    hideCat(catIds, tempCounters);

    // reset tempCounters
    resetPropertiesToZero(tempCounters);
    
    // reset interruptions text to counters.interruptions, which has already been reset to 0
    interruptionsNum.textContent = 0;
}
