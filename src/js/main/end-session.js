import { timeConvert, intervals, startTimes, recoverBreakState, recoverPomState, elapsedTime, counters, flags, savedInterruptionsArr, timeAmount, intervalArrs, progressTextMod, homeBackground, times, perHourData } from '../modules/index-objects.js';
import { start_stop_btn, end_session_btn, total_time_display, productivity_chill_mode, progressBar, progressContainer, display, interruptionsSubContainer, interruptionsNum, suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, completedPomodorosContainer, flowAnimation, chillAnimation, hyperChillLogoImage, streaksCount, breakBackground, deepWorkBackground } from '../modules/dom-elements.js';
import { soundMap } from '../modules/sound-map.js';
import { sessionState } from '../modules/state-objects.js';
import { labelFlags, labelArrs, labelDict } from '../modules/notes-objects.js';

import { sessionCompletion } from '../state/session-completion.js'; // minified
import { animationsFadeIn, animationsFadeOut, getTotalElapsed, returnTotalTimeString, updateLabelArrs, setBackground, pauseAndResetAlertSounds, resetDisplay, updateProgressBar, totalTimeDisplay, setButtonTextAndMode, hideSuggestionBreakContainer, hidePomodorosCompletedContainer, showInterruptionsSubContainer, setFavicon, observer, pomodoroWorker, suggestionWorker, flowmodoroWorker, displayWorker, totalDisplayWorker, updateDataPerHour } from '../main/index.js'; // minified
import { checkInvaliDate } from '../state/check-invaliDate.js'; // minified
import { addSession } from '../state/add-session.js'; // minified

const defaultFavicon = "/images/logo/HyperChillLogo_circular_white_border.png";

document.addEventListener("stateUpdated", function() {
    end_session_btn.addEventListener("click", async function() {
        if ((flags.sessionInProgress) && (flags.canEndSession)) {
            flags.canEndSession = false; // immediately block another end_session_btn click before rest of flags are reset
            times.end = Date.now();

            if (sessionState.loggedIn) {
                // IF START OF SESSION IS BEFORE invaliDate, RESET GUI BUT DON'T LOG SESSION
                let logSessionActivity = await checkInvaliDate(times.start); // T or F
                if (logSessionActivity) {
                    await logSession(); // (1) Collect all necessary information about the session
                }
            }

            // (2) Reset everything to the default state
            await sessionReset();
        }
    });    
})

// -----------------
// MAIN FUNCTIONS
// -----------------
async function logSession() {
    let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // determine moment they end session
    updateStreaks(sessionState, userTimeZone, streaksCount);
    
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

    // SENDING DATA TO BE PROCESSED BY BACKEND
    finalizeSession(times, userTimeZone, totalTime, focusQualityFractionV2, focusQualityFractionV5, qualityAdjustedDeepWorkV2, qualityAdjustedDeepWorkV5, totalDistractions, intervalArrs, savedInterruptionsArr, avgFlowTimeInterval, avgChillTimeInterval, counters, timeAmount, flags, labelTimeSum, perHourData);
}

export async function sessionReset() {
    // reset labelArrs
    resetLabelArrs(labelArrs);

    // reset background to default
    resetBackgrounds(deepWorkBackground, breakBackground);
    resetHtmlBackground(homeBackground);
    document.documentElement.style.backgroundSize = '400% 400%';

    // reset alerts
    pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);

    // reset internal logic
    resetActions(hyperChillLogoImage, flags, intervals, recoverBreakState, recoverPomState, startTimes, elapsedTime, counters, savedInterruptionsArr, intervalArrs, times);

    // clear all intervals
    pomodoroWorker.postMessage("clearInterval");
    suggestionWorker.postMessage("clearInterval");
    flowmodoroWorker.postMessage("clearInterval");
    displayWorker.postMessage("clearInterval");
    totalDisplayWorker.postMessage("clearInterval");

    // fade out animations
    animationsFadeOut(flowAnimation);

    // reset displays
    resetDisplay(display);
    updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer);
    totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod);

    // reset header text
    setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start", "Press 'Start' to begin session");

    // get rid of glowing green on start/ stop btn and progress bar
    start_stop_btn.classList.remove('glowing-effect');
    progressContainer.classList.remove("glowing-effect");

    // reset containers
    hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min);
    hidePomodorosCompletedContainer(completedPomodorosContainer);
    showInterruptionsSubContainer(interruptionsSubContainer);

    // reset interruptions text to counters.interruptions, which has already been reset to 0
    interruptionsNum.textContent = counters.interruptions;

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
function resetBackgrounds(deepWorkBackground, breakBackground) {
    deepWorkBackground.style.opacity = 0;
    breakBackground.style.opacity = 0;
}

function resetActions(hyperChillLogoImage, flags, intervals, recoverBreakState, recoverPomState, startTimes, elapsedTime, counters, savedInterruptionsArr, intervalArrs, times) {
    observer.disconnect();
    document.title = "Hyperchill.io";
    hyperChillLogoImage.classList.remove('hyperChillLogoRotate'); // currently invisible FYI

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

        // console.log(labelArrs);

        for (let i = 1; i < arr.length; i += 2) {
            timeSum += arr[i] - arr[i-1];
        }

        let labelTimesKey = getKeyByValue(labelDict, key);
        labelTimeSum[labelTimesKey] = timeSum;

        // PRINTING OUT LABEL TIMES
        // let totalLabelTimeStr = returnTotalTimeString(timeSum, timeConvert);
        // let labelName = key;
        // console.log(labelName + ": " + totalLabelTimeStr);
    }

    return labelTimeSum;
}

async function logSessionCompletion(userTimeZone) { // logging when user ends session
    await sessionCompletion(userTimeZone);

    // Eventually, we'll want to update the GUI
    document.dispatchEvent(new Event('updateStreak'));
}

function resetHtmlBackground(homeBackground) {
    document.documentElement.style.backgroundImage = homeBackground;
}

function getKeyByValue(obj, targetValue) {
    for (const [key, value] of Object.entries(obj)) {
        if (value === targetValue) {
            return key;
        }
    }
    return null; // Return null if no key with the given value is found
}

async function updateStreaks(sessionState, userTimeZone, streaksCount) {
    if (sessionState.loggedIn) {
        logSessionCompletion(userTimeZone);
    } else { // non-logged in user
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

function focusQualityCalculation(timeConvert, totalTime, totalDistractions, constant) {
    let totalMin = totalTime / timeConvert.msPerMin;
    let focusQualityFraction = 1 - ((totalDistractions / totalMin) / (constant));
    if (focusQualityFraction < 0) {
        focusQualityFraction = 0;
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
        labelTimes: labelTimeSum,
        perHourData: perHourData
    }

    await addSession(session);
}