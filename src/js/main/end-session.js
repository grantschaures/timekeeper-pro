import { timeConvert, intervals, startTimes, recoverBreakState, recoverPomState, elapsedTime, counters, flags, savedInterruptionsArr, timeAmount, intervalArrs, progressTextMod, homeBackground } from '../modules/index-objects.js';
import { start_stop_btn, end_session_btn, total_time_display, productivity_chill_mode, progressBar, progressContainer, display, interruptionsSubContainer, interruptionsNum, suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, completedPomodorosContainer, flowAnimation, chillAnimation, hyperChillLogoImage, streaksCount, breakBackground, deepWorkBackground } from '../modules/dom-elements.js';
import { soundMap } from '../modules/sound-map.js';
import { sessionState } from '../modules/state-objects.js';
import { labelFlags, labelArrs } from '../modules/notes-objects.js';

import { userActivity } from '../state/user-activity.js'; // minified
import { animationsFadeIn, animationsFadeOut, getTotalElapsed, returnTotalTimeString, updateLabelArrs, setBackground, pauseAndResetAlertSounds, resetDisplay, updateProgressBar, totalTimeDisplay, setButtonTextAndMode, hideSuggestionBreakContainer, hidePomodorosCompletedContainer, showInterruptionsSubContainer, setFavicon, observer, pomodoroWorker, suggestionWorker, flowmodoroWorker, displayWorker, totalDisplayWorker } from '../main/index.js'; // minified

const defaultFavicon = "/images/logo/HyperChillLogo_circular_white_border.png";

document.addEventListener("stateUpdated", function() {
    end_session_btn.addEventListener("click", function() { //temporary function
        if ((flags.sessionInProgress) && (flags.canEndSession)) {
            // (1) Collect all necessary information about the session


            let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // determine moment they end session
            if (sessionState.loggedIn) {
                logUserActivity(userTimeZone);
            } else { // non-logged in user
                streaksCount.innerText = 1;
            }
            
            // total time in deep work
            let totalTime = getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes);
            let totalTimeStr = returnTotalTimeString(totalTime, timeConvert);
            console.log("Total Time: " + totalTimeStr);
            
            // total interruptions
            if (flags.inHyperFocus) {
                savedInterruptionsArr.push(counters.interruptions);
            }
            let totalInterruptions = savedInterruptionsArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            console.log("Total Distractions: " + totalInterruptions);
            
            // focus score calculation
            let totalMin = totalTime / timeConvert.msPerMin;
            let result = (1 - (((totalInterruptions) / (totalMin)) / (0.2))) * 100; // positive values start w/ < 1 distraction / 5 min of deep work
            let focusPercent = Math.floor(result);
            if (focusPercent > 0) {
                console.log('Focus Score: ' + focusPercent + '%');
            } else {
                console.log('Focus Score: ' + 0 + '%');
            }
            
            // deep work & break intervals
            console.log("Deep Work Intervals: " + counters.flowTimeIntervals);
            console.log("Break Intervals: " + counters.chillTimeIntervals);
            
            // average length of flowTime Intervals
            let timeInterval;
            if (flags.inHyperFocus) {
                timeInterval = Date.now() - startTimes.hyperFocus;
                intervalArrs.flowTime.push(timeInterval);
            } else {
                timeInterval = Date.now() - startTimes.chillTime;
                intervalArrs.chillTime.push(timeInterval);
            }
            console.log(intervalArrs.flowTime)
            console.log(intervalArrs.chillTime)

            let flowTimeIntervalArrSum = (intervalArrs.flowTime).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            let flowTimeArrLength = (intervalArrs.flowTime).length;
            let avgFlowTimeInterval = (flowTimeIntervalArrSum / flowTimeArrLength);
            let avgFlowTimeIntervalStr = returnTotalTimeString(avgFlowTimeInterval, timeConvert);
            console.log("Average Flow Time Interval Length: " + avgFlowTimeIntervalStr);

            console.log("transition time Arr: " + intervalArrs.transitionTime);

            // add final labelArr value (at some point later, we need to reset label Arrs after sending label time data to database)
            let endTime = Date.now();
            if (flags.inHyperFocus) {
                updateLabelArrs(endTime, labelFlags, labelArrs);
            }
            displayTotalLabelTime(labelArrs);

            console.log(""); // new line






            // (2) Reset everything to the default state
            sessionReset();
        }
    });
})

// ---------------------
// MAIN FUNCTIONS
// ---------------------
function sessionReset() {
    // reset labelArrs
    // resetLabelArrs(labelArrs);

    // reset background to default
    resetBackgrounds(deepWorkBackground, breakBackground);
    resetHtmlBackground(homeBackground);
    document.documentElement.style.backgroundSize = '400% 400%';

    // reset alerts
    pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);

    // reset internal logic
    resetActions(hyperChillLogoImage, flags, intervals, recoverBreakState, recoverPomState, startTimes, elapsedTime, counters, savedInterruptionsArr, intervalArrs);

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

function resetActions(hyperChillLogoImage, flags, intervals, recoverBreakState, recoverPomState, startTimes, elapsedTime, counters, savedInterruptionsArr, intervalArrs) {
    observer.disconnect();
    document.title = "HyperChill.io | Online Productivity Time Tracker";
    hyperChillLogoImage.classList.remove('hyperChillLogoRotate'); // currently invisible FYI

    clearAllIntervals(intervals);
    resetPropertiesToNull(recoverBreakState);
    resetPropertiesToNull(recoverPomState);
    resetPropertiesToUndefined(startTimes);
    resetPropertiesToZero(elapsedTime);
    resetPropertiesToZero(counters);
    resetFlags(flags);
    savedInterruptionsArr.splice(0, savedInterruptionsArr.length);
    (intervalArrs.flowTime).splice(0, (intervalArrs.flowTime).length);
    (intervalArrs.chillTime).splice(0, (intervalArrs.chillTime).length);
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
    flags.canEndSession = false;
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

function displayTotalLabelTime(labelArrs) {
    for (let key in labelArrs) {
        let arr = labelArrs[key];
        let timeSum = 0;

        for (let i = 1; i < arr.length; i += 2) {
            timeSum += arr[i] - arr[i-1];
        }

        let totalLabelTimeStr = returnTotalTimeString(timeSum, timeConvert);

        let labelName = key;
        console.log(labelName + ": " + totalLabelTimeStr);
    }
}

async function logUserActivity(userTimeZone) { // logging when user ends session
    await userActivity(userTimeZone);

    // Eventually, we'll want to update the GUI
    document.dispatchEvent(new Event('updateStreak'));
}

function resetHtmlBackground(homeBackground) {
    document.documentElement.style.backgroundImage = homeBackground;
}