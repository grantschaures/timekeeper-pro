import { flowtimeBackgrounds, chilltimeBackgrounds, selectedBackground, selectedBackgroundIdTemp, selectedBackgroundId, timeConvert, intervals, startTimes, recoverBreakState, recoverPomState, elapsedTime, alertVolumes, alertSounds, counters, flags, tempStorage, settingsMappings, savedInterruptionsArr, timeAmount, intervalArrs, progressTextMod, times, perHourData, catIds, lightHtmlBackground, darkHtmlBackground, tempCounters, pip } from '../modules/index-objects.js';

import { chimePath, bellPath, clock_tick, soundMap } from '../modules/sound-map.js';

import {
    start_stop_btn, submit_change_btn, end_session_btn, total_time_display, productivity_chill_mode, progressBarContainer, progressBar, progressContainer, display, hyperChillTitle, subMainContainer, interruptionsContainer, interruptionsSubContainer, decBtn, incBtn, interruptionsNum, suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, completedPomodorosContainer, completedPomodoros_label, completedPomodoros_min, targetHoursContainer, timekeepingContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, targetTimeReachedToggle, breakSuggestionToggle, suggestionMinutesInput, flowmodoroNotificationToggle,flowmodoroNotifications, flowmodoroNotificationInfoWindow, flowTimeBreakNotification, flowTimeBreakNotificationInfoWindow, pomodoroNotifications, pomodoroNotificationInfoWindow, notesAutoSwitch, notesAutoSwitchInfoWindow, pomodoroNotificationToggle, autoStartPomodoroIntervalToggle, autoStartBreakIntervalToggle, defaultThemeContainer, defaultTheme, darkThemeContainer, darkGrayTheme, transitionClockSoundToggle, flowTimeAnimationToggle, chillTimeAnimationToggle, pomodoroVolumeContainer, pomodoroVolumeBar, pomodoroVolumeThumb, flowmodoroVolumeContainer, flowmodoroVolumeBar, flowmodoroVolumeThumb, generalVolumeContainer, generalVolumeBar, generalVolumeThumb, pomodoroVolumeContainer2, pomodoroVolumeBar2, pomodoroVolumeThumb2, flowmodoroVolumeContainer2, flowmodoroVolumeBar2, flowmodoroVolumeThumb2, generalVolumeContainer2, generalVolumeBar2, generalVolumeThumb2, flowmodoroRadios, flowmodoroInputs, generalRadios, pomodoroInputs, pomodoroRadios,flowtimeBackgroundCells, chilltimeBackgroundCells, settings_menu_container, registerHereText, flowAnimation, chillAnimation,createLabelInput, updateLabelInput, emojiContainer, loginEmailInput, loginPasswordInput, loginBtn, logoutBtn, forgotPasswordSettings, propagateUnfinishedTasks, propagateUnfinishedTasksInfoWindow, flowtimeBackgroundWorldCells, chilltimeBackgroundWorldCells, popupOverlay, logoutBtn2, deepWorkBackground, breakBackground, streaksContainer, streaksLoginSuggestionPopup, previousSessionStartedOkBtn, previousSessionStartedPopup, invalidatePreviousSessionInput, quitCurrentSessionInput, toggleIntervalTime, intervalTimeInfoWindow, toggleTotalTime, totalTimeInfoWindow, intervalTimeToggle, totalTimeToggle, stopwatch, muffinInfoWindow, toggleMuffin, cats, zzz, darkContainer, lightContainer, flowmodoroBtnContainer,
    popupQuestionMenu,
    supportEmail,
    openEyeContainer,
    closedEyeContainer,
    timestampsHeader,
    timestampsInfoWindow,
    setDailyTargetHours,
    dailyTargetHoursInfoWindow,
    toggleAdvChartsSampleSize,
    advChartsSampleSizeInfoWindow,
    dailyTargetHoursDropdown,
    sessionIntervalsChartBoundsRadios,
    lowerBoundHourDropdown,
    upperBoundHourDropdown,
    advChartsSampleSizeToggle,
    feedbackFormBtn
} from '../modules/dom-elements.js';

import { flags as dashboardFlags, settings } from '../modules/dashboard-objects.js';

import { sessionState } from '../modules/state-objects.js';
import { state, flags as navFlags } from '../modules/navigation-objects.js';
import { labelFlags, labelArrs } from '../modules/notes-objects.js';

import { initializeGUI } from '../utility/initialize-gui.js'; // minified
import { userAgent, userDevice, userTimeZone } from '../utility/identification.js'; // minified
import { updateUserSettings } from '../state/update-settings.js'; // minified
import { updateTargetHours } from '../state/update-target-hours.js'; // minified
import { updateShowingTimeLeft } from '../state/update-showing-time-left.js'; // minified
import { lastIntervalSwitch } from '../state/last-interval-switch.js'; // minified
import { checkSession } from '../state/check-session.js'; // minified
import { updateInvaliDate } from '../state/update-invaliDate.js'; // minified
import { initialVisualReset, sessionReset } from './end-session.js'; // minified

import { setMetricCharts } from '../dashboard/metric-charts.js'; // minified
import { setInitialDate } from '../dashboard/daily-sessions.js'; // minified

export const pomodoroWorker = new Worker('/js/web-workers/pomodoroWorker.js');
export const suggestionWorker = new Worker('/js/web-workers/suggestionWorker.js');
export const flowmodoroWorker = new Worker('/js/web-workers/flowmodoroWorker.js');
export const displayWorker = new Worker('/js/web-workers/displayWorker.js');
export const totalDisplayWorker = new Worker('/js/web-workers/totalDisplayWorker.js');

// Create a new mutation observer to watch for changes to the #display div
export const observer = new MutationObserver(setTabTitleFromDisplay);

document.addEventListener("click", function(event) {
    if (event.target.classList.contains('finalized-hours')) {
        submit_change_btn.click();
    }
})

document.addEventListener("stateUpdated", function() {
    // Favicons
    const greenFavicon = "/images/logo/HyperChillLogoGreen.png";
    const blueFavicon = "/images/logo/HyperChillLogoBlue.png";

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let isIpad = isIpadCheck();
    let usingSafari = usingSafariCheck();
    const initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;

    // not used; initialized for reference
    let pomodoroIntervalOrderArr = ['pom1', 'shortbreak1', 'pom2', 'shortbreak2', 'pom3', 'shortbreak3', 'pom4', 'longbreak'];

    const radioGroups = [
        { radios: flowmodoroRadios, type: 'flowmodoro' },
        { radios: generalRadios, type: 'general' },
        { radios: pomodoroRadios, type: 'pomodoro' }
    ];

    // This may actually detect all mobile + iPad devices
    function isIpadCheck() {
        const userAgent = navigator.userAgent || window.opera;
        return /iPad/.test(userAgent) || (navigator.maxTouchPoints > 1);
    }

    function usingSafariCheck() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
        // Check for Safari on Mac (excluding Chrome and Firefox) 
        return /^((?!chrome|android).)*safari/i.test(userAgent);
    }

    // if using iPad or mobile devices
    if ((isIpad) || (usingSafari)) {
        popupQuestionMenu.style.background = 'rgb(50, 50, 50)';
        accountPopup.style.background = 'rgb(50, 50, 50)';
        deleteAccountPopup.style.background = 'rgb(50, 50, 50)';
        shortcutsPopup.style.background = 'rgb(50, 50, 50)';
    }

    // ----------------
    // MAIN CODE (Runs after DOM content is loaded)
    // ----------------

    //Safari on iPad Pro acts like mobile (no push notifications) but identifies as desktop

    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top

    if (isMobile) {
        popupMenu.style.backgroundColor = "rgb(0, 0, 0)"; // black
    }

    setInitialBackgroundCellSelection();

    const threeWayToggle = document.getElementById('threeWayToggle');

    // Initial Animations
    if ((!isMobile) && (initialViewportWidth > 504)) {
        setTimeout(() => {
            hyperChillTitle.style.opacity = '1'; // increases opacity
            hyperChillTitle.classList.add('hyperChillTitleAnimationTranslate'); // moves it down
        }, 0)
        
        setTimeout(() => {
            subMainContainer.style.opacity = '1';
            hyperChillTitle.classList.add('hyperChillTitleAnimationScale'); // makes it W I D E
        }, 1000)
        
        setTimeout(() => {
            subMainContainer.style.transition = 'opacity 0.5s ease-in-out';
    
            hyperChillTitle.classList.remove('hyperChillTitleAnimationTranslate');
            hyperChillTitle.style.opacity = '0';
            setTimeout(() => {
                hyperChillTitle.style.display = 'none';
                threeWayToggle.style.display = 'inline-flex';
                threeWayToggle.classList.add('threeWayToggleAnimation');
                setTimeout(() => {
                    threeWayToggle.style.opacity = '1';
                }, 100)
            }, 1000)
        }, 2000)
    } else if (isMobile || (initialViewportWidth <= 504)) {
        setTimeout(() => {
            hyperChillTitle.style.display = 'none';
            subMainContainer.style.opacity = '1';
            subMainContainer.style.transition = 'opacity 0.5s ease-in-out';
            threeWayToggle.style.display = 'inline-flex';
            setTimeout(() => {
                threeWayToggle.style.opacity = '1';
            }, 100)
        }, 1000)
    }

    setTimeout(() => {
        if (counters.startStop === 0) {
            animationsFadeIn(chillAnimation, 'flex');
        }
    }, 3000)

    // ----------------
    // EVENT LISTENERS
    // ----------------
    document.addEventListener('keydown', (event) => handleEnter(event, start_stop_btn, submit_change_btn, createLabelInput, updateLabelInput, flags));
    document.addEventListener('keyup', (event) => handleKeyUp(event, flags));

    start_stop_btn.addEventListener("click", function() {

        let transitionTime = Date.now();
        counters.startStop++; //keep track of button presses (doesn't account for time recovery iterations)
        playClick(clock_tick, flags);
        resetDisplay(display);
        updateLabelArrs(transitionTime, labelFlags, labelArrs);

        if (counters.startStop === 1) {
            veryStartActions(startTimes, flags, times, counters, interruptionsNum);
            triggerSilentAlertAudioMobile(soundMap.Chime, soundMap.Bell, chimePath, bellPath, flags);
            animationsFadeOut(chillAnimation);
            startTimes.lastPomNotification = Date.now();

            // randomize cat order
            reorderArray(catIds);
            
            setTimeout(() => {
                document.documentElement.style.backgroundSize = '100%';
                flags.canEndSession = true;
            }, 1000)
        } else {
            chillTimeToFirstPomodoro(flags, productivity_chill_mode, counters);
        }
        
        checkSessionIntervalSwitch();
        setLocalStartTime(flags, startTimes, recoverBreakState, recoverPomState);

        displayWorker.postMessage("clearInterval");
        displayWorker.postMessage("startInterval");

        start_stop_btn.classList.remove('glowing-effect');
        flags.pomodoroCountIncremented = false;

        intervalArrs.transitionTime.push(transitionTime);
        
        if (!intervals.main) { // --> DEEP WORK
            // console.log(getCurrentTime() + " --> Entering Deep Work");
            flags.inHyperFocus = true;
            flags.sentFlowmodoroNotification = false;
            counters.flowTimeIntervals++;
            
            let lastChillTimeInterval
            startTimes.hyperFocus = Date.now();
            lastChillTimeInterval = startTimes.hyperFocus - startTimes.chillTime;

            if (counters.startStop > 2) { // if 2nd round of deep work (1 round of break has already happened)
                intervalArrs.chillTime.push(lastChillTimeInterval);
            }

            totalDisplayWorker.postMessage("startInterval");
            setFavicon(greenFavicon);
            flowTimeAnimationActions(counters, flags, chillAnimation, flowAnimation);
            hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min);
            hidePomodorosCompletedContainer(completedPomodorosContainer);
            showInterruptionsSubContainer(interruptionsSubContainer);
            setCurrentPomodoroNotification(counters, timeAmount);
            setBackground(selectedBackground.flowtime, 1);
            flowmodoroAndBreakSuggestionActions(flags, elapsedTime, counters, timeAmount, flowmodoroWorker, suggestionWorker);
            intervals.main = setInterval(() => updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer), 1000); //repeatedly calls reference to updateProgressBar function every 1000 ms (1 second)

            if (!flags.autoStartPomodoroInterval) { // we know the user clicked the start btn, and that it didn't happen programmatically
                pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);
            }

            if (flags.pomodoroNotificationToggle) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch", setPomodoroIntervalText(counters, timeAmount));
                setPomodoroWorker(flags, elapsedTime, counters, recoverPomState, pomodoroWorker);
            } else {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch","Deep Work");
            }

            if (counters.startStop > 1) { // runs first during first break interval
                elapsedTime.chillTime += Date.now() - startTimes.chillTime;
                hideCat(catIds, counters);
            }

            // backgroundVideoSource.src = "videos/cyan_gradient_480p.mp4";
            // backgroundVideo.load();

        } else { // --> BREAK
            // console.log(getCurrentTime() + " --> Entering Break");
            flags.inHyperFocus = false;
            flags.lastHyperFocusIntervalMin = Math.floor((Date.now() - startTimes.hyperFocus) / (1000 * 60));
            startTimes.chillTime = Date.now();
            counters.chillTimeIntervals++;
            setFavicon(blueFavicon);
            chillTimeAnimationActions(flags, flowAnimation, chillAnimation);
            displayCat(catIds, counters);
            
            // EDIT: temporary change to see total interruptions for my own data collection
            saveResetInterruptions(interruptionsNum, counters, savedInterruptionsArr);
            
            hideInterruptionsSubContainer(interruptionsSubContainer);
            setBackground(selectedBackground.chilltime, 1);
            
            // There's an automatic transition to Break either starting at Date.now() (if both toggles are on)
            // or starting at Date.now() - displayTime (only auto start break is on)

            let lastFlowTimeInterval;
            lastFlowTimeInterval = Date.now() - startTimes.hyperFocus;
            intervalArrs.flowTime.push(lastFlowTimeInterval);
                
            let previousHyperFocusElapsedTime = elapsedTime.hyperFocus;
            elapsedTime.hyperFocus += Date.now() - startTimes.hyperFocus;

            if (!flags.autoStartBreakInterval) { // we know the user clicked the stop btn, and that it didn't happen programmatically
                pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);
            }

            if (flags.pomodoroNotificationToggle) {
                showPomodorosCompletedContainer(completedPomodorosContainer, completedPomodoros_label, completedPomodoros_min, counters);
                setCurrentPomodoroNotification(counters, timeAmount);
                setPomodoroNotificationSeconds(flags, elapsedTime, counters, recoverBreakState, pomodoroWorker);
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch", setBothBreakIntervalText(counters, timeAmount));
            } else {
                showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, timeAmount, counters, flags);
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch", "Break");
            }

            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod);
            flowmodoroAndBreakSuggestionActions(flags, elapsedTime, counters, timeAmount, flowmodoroWorker, suggestionWorker);
            
            clearInterval(intervals.main);
            intervals.main = null;

            totalDisplayWorker.postMessage("clearInterval");
        }

        // console.log(savedInterruptionsArr);
        // console.log(intervalArrs.flowTime);
        // console.log(intervalArrs.chillTime);

        flags.sentSuggestionMinutesNotification = false;

        setTimeout(() => {
            flags.modeChangeExecuted = false;
        }, 1000)
    });
    
    submit_change_btn.addEventListener("click", async function() {
        if (!flags.submittedTarget) { //When submitting target hours
            
            let inputHours = document.getElementById("target-hours").value;
            // Check if the input is empty or zero
            if(!targetHoursValidate(inputHours, timeConvert, startTimes, elapsedTime, flags, counters)) {
                return;
            }

            if (flags.hitTarget) { //remove glowing effect if we've hit the target time (regardless of mode)
                progressContainer.classList.remove("glowing-effect");
            }
                
            let targetHours = replaceTargetHours(inputHours, timeAmount, flags); //sets targetTime
            if (sessionState.loggedIn) {
                await updateTargetHours(targetHours);
            }
            
            if (flags.progressBarContainerIsSmall) {
                progressBarContainer.classList.toggle("small"); // make progress container large
                flags.progressBarContainerIsSmall = false;
            }
                
            /* Update progress bar & percentage ONCE to demonstrate submitted change in Break.
            In Deep Work, this code makes the change happen just a little bit faster. */
            updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer);
            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod);
            
            flags.hitTarget = false;

        } else if (flags.submittedTarget) { //When changing target hours
            if (flags.hitTarget) {
                progressContainer.classList.remove("glowing-effect");
            }

            changeTargetHours(flags, sessionState, timeAmount);

            /* Update progress bar & percentage ONCE to demonstrate submitted change in Break.
                In Deep Work, this code makes the change happen just a little bit faster. */
            updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer);
            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod);
            
            if (!flags.progressBarContainerIsSmall) { // and progress bar container is large
                progressBarContainer.classList.toggle("small"); // make progress container small
                flags.progressBarContainerIsSmall = true;
            }
        }
    });

    suggestionMinutesInput.addEventListener("change", async function() {
        // Immediate actions w/ user's inputted value
        let inputSuggestionMinutes = suggestionMinutesInput.value;
        let roundedInput = Math.round(parseFloat(inputSuggestionMinutes));
        let validatedFinalInputVal = validateAndSetNotificationInput(roundedInput);
        suggestionMinutesInput.value = validatedFinalInputVal;
        timeAmount.suggestionMinutes = validatedFinalInputVal;
        let secondsPassed;

        if (counters.startStop === 0) {
            secondsPassed = 0;
        } else {
            secondsPassed = Math.round((Date.now() - startTimes.hyperFocus) / 1000);
        }

        flags.sentSuggestionMinutesNotification = false;
        
        if (flags.breakSuggestionToggle) {
            setSuggestionMinutes(startTimes, flags, elapsedTime, timeAmount);
            
            if ((validatedFinalInputVal * 60 ) > (secondsPassed)) {
                flags.sentSuggestionMinutesNotification = false;
                start_stop_btn.classList.remove('glowing-effect');
            } else {
                flags.sentSuggestionMinutesNotification = true;
                start_stop_btn.classList.add('glowing-effect');
            }
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                flowTime: {
                    suggestionMinutes: validatedFinalInputVal
                }
            });
        }
    })

    // DASHBOARD SETTINGS

    dailyTargetHoursDropdown.addEventListener('change', async function() {

        let dailyTargetHoursInput = dailyTargetHoursDropdown.value;

        // Programmatic changes
        // mini charts
        // day view doughnut chart
        // main chart deep work threshold line
        settings.dailyTargetHours = dailyTargetHoursInput;

        // Note: We'll probably have to repopulate dashboared data after receiving response from server
        if (sessionState.loggedIn) {
            await updateUserSettings({
                dashboard: {
                    dailyTargetHours: dailyTargetHoursInput
                }
            });

            flags.remainOnSelectedDate = true;
            setInitialDate();
        }
    })

    sessionIntervalsChartBoundsRadios.forEach(radio => {
        radio.addEventListener('change', event => handleSessionIntervalsChartBoundsRadioChange(event));
    })

    lowerBoundHourDropdown.addEventListener('change', async function() {

        let lowerBoundHourInput = lowerBoundHourDropdown.value;

        settings.manualBounds.lowerBound = lowerBoundHourInput;

        if (sessionState.loggedIn) {
            await updateUserSettings({
                dashboard: {
                    manualBounds: {
                        lowerBound: settings.manualBounds.lowerBound,
                        upperBound: settings.manualBounds.upperBound
                    }
                }
            });

            setMetricCharts();
        }
    })
    
    upperBoundHourDropdown.addEventListener('change', async function() {
        
        let upperBoundHourInput = upperBoundHourDropdown.value;

        settings.manualBounds.upperBound = upperBoundHourInput;

        if (sessionState.loggedIn) {
            await updateUserSettings({
                dashboard: {
                    manualBounds: {
                        lowerBound: settings.manualBounds.lowerBound,
                        upperBound: settings.manualBounds.upperBound
                    }
                }
            });

            setMetricCharts();
        }
    })

    advChartsSampleSizeToggle.addEventListener('click', async function() {
        if (!settings.relSampleSizeVis) {
            settings.relSampleSizeVis = true;
        } else {
            settings.relSampleSizeVis = false;
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                dashboard: {
                    relSampleSizeVis: settings.relSampleSizeVis
                }
            });

            setMetricCharts();
        }
    })




    decBtn.addEventListener("click", function() {
        if (counters.interruptions > 0) {
            counters.interruptions--;
            interruptionsNum.textContent = counters.interruptions;

            if (flags.sessionInProgress) {
                intervalArrs.interruptionTime.pop();
            }
        }
    })
    
    incBtn.addEventListener("click", function() {
        
        if (counters.interruptions < 1000) {
            counters.interruptions++;
            interruptionsNum.textContent = counters.interruptions;
            
            if (flags.sessionInProgress) {
                let currentTime = Date.now();
                intervalArrs.interruptionTime.push(currentTime);
            }
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

    pomodoroNotifications.addEventListener('mouseover', function() {
        toggleInfoWindow(pomodoroNotificationInfoWindow, 'showingPomodoroNotificationInfoWindow', flags);
    });
    pomodoroNotifications.addEventListener('mouseout', function() {
        toggleInfoWindow(pomodoroNotificationInfoWindow, 'showingPomodoroNotificationInfoWindow', flags);
    });
    
    flowmodoroNotifications.addEventListener('mouseover', function() {
        toggleInfoWindow(flowmodoroNotificationInfoWindow, 'showingFlowmodoroNotificationInfoWindow', flags);
    });
    flowmodoroNotifications.addEventListener('mouseout', function() {
        toggleInfoWindow(flowmodoroNotificationInfoWindow, 'showingFlowmodoroNotificationInfoWindow', flags);
    });
    
    flowTimeBreakNotification.addEventListener('mouseover', function() {
        toggleInfoWindow(flowTimeBreakNotificationInfoWindow, 'showingFlowTimeBreakNotificationInfoWindow', flags);
    });
    flowTimeBreakNotification.addEventListener('mouseout', function() {
        toggleInfoWindow(flowTimeBreakNotificationInfoWindow, 'showingFlowTimeBreakNotificationInfoWindow', flags);
    });
    
    toggleIntervalTime.addEventListener('mouseover', function() {
        toggleInfoWindow(intervalTimeInfoWindow, 'showingIntervalTimeInfoWindow', flags);
    });
    toggleIntervalTime.addEventListener('mouseout', function() {
        toggleInfoWindow(intervalTimeInfoWindow, 'showingIntervalTimeInfoWindow', flags);
    });
    
    toggleTotalTime.addEventListener('mouseover', function() {
        toggleInfoWindow(totalTimeInfoWindow, 'showingTotalTimeInfoWindow', flags);
    });
    toggleTotalTime.addEventListener('mouseout', function() {
        toggleInfoWindow(totalTimeInfoWindow, 'showingTotalTimeInfoWindow', flags);
    });
    
    toggleMuffin.addEventListener('mouseover', function() {
        toggleInfoWindow(muffinInfoWindow, 'showingMuffinInfoWindow', flags);
    });
    toggleMuffin.addEventListener('mouseout', function() {
        toggleInfoWindow(muffinInfoWindow, 'showingMuffinInfoWindow', flags);
    });
    
    notesAutoSwitch.addEventListener('mouseover', function() {
        toggleInfoWindow(notesAutoSwitchInfoWindow, 'showingNotesAutoSwitchInfoWindow', flags);
    });
    notesAutoSwitch.addEventListener('mouseout', function() {
        toggleInfoWindow(notesAutoSwitchInfoWindow, 'showingNotesAutoSwitchInfoWindow', flags);
    });
    
    propagateUnfinishedTasks.addEventListener('mouseover', function() {
        toggleInfoWindow(propagateUnfinishedTasksInfoWindow, 'showingPropagateUnfinishedTasksInfoWindow', flags);
    });
    propagateUnfinishedTasks.addEventListener('mouseout', function() {
        toggleInfoWindow(propagateUnfinishedTasksInfoWindow, 'showingPropagateUnfinishedTasksInfoWindow', flags);
    });
    
    timestampsHeader.addEventListener('mouseover', function() {
        toggleInfoWindow(timestampsInfoWindow, 'showingTimestampsInfoWindow', flags);
    });
    timestampsHeader.addEventListener('mouseout', function() {
        toggleInfoWindow(timestampsInfoWindow, 'showingTimestampsInfoWindow', flags);
    });

    setDailyTargetHours.addEventListener('mouseover', function() {
        toggleInfoWindow(dailyTargetHoursInfoWindow, 'showingDailyTargetHoursInfoWindow', flags);
    })
    setDailyTargetHours.addEventListener('mouseout', function() {
        toggleInfoWindow(dailyTargetHoursInfoWindow, 'showingDailyTargetHoursInfoWindow', flags);
    })

    toggleAdvChartsSampleSize.addEventListener('mouseover', function() {
        toggleInfoWindow(advChartsSampleSizeInfoWindow, 'showingAdvChartsSampleSizeInfoWindow', flags);
    })
    toggleAdvChartsSampleSize.addEventListener('mouseout', function() {
        toggleInfoWindow(advChartsSampleSizeInfoWindow, 'showingAdvChartsSampleSizeInfoWindow', flags);
    })
    



    // ALERT VOLUME TOGGLING FUNCTIONALITY
    flowmodoroVolumeThumb.addEventListener('mousedown', (event) => handleMouseDown(event, 'flowmodoroThumbIsDragging'));
    flowmodoroVolumeThumb.addEventListener('touchstart', (event) => handleMouseDown(event, 'flowmodoroThumbIsDragging'));
    
    generalVolumeThumb.addEventListener('mousedown', (event) => handleMouseDown(event, 'generalThumbIsDragging'));
    generalVolumeThumb.addEventListener('touchstart', (event) => handleMouseDown(event, 'generalThumbIsDragging'));
    
    pomodoroVolumeThumb.addEventListener('mousedown', (event) => handleMouseDown(event, 'pomodoroThumbIsDragging'));
    pomodoroVolumeThumb.addEventListener('touchstart', (event) => handleMouseDown(event, 'pomodoroThumbIsDragging'));
    
    flowmodoroVolumeThumb2.addEventListener('mousedown', (event) => handleMouseDown(event, 'flowmodoroThumbIsDragging2'));
    flowmodoroVolumeThumb2.addEventListener('touchstart', (event) => handleMouseDown(event, 'flowmodoroThumbIsDragging2'));
    
    generalVolumeThumb2.addEventListener('mousedown', (event) => handleMouseDown(event, 'generalThumbIsDragging2'));
    generalVolumeThumb2.addEventListener('touchstart', (event) => handleMouseDown(event, 'generalThumbIsDragging2'));
    
    pomodoroVolumeThumb2.addEventListener('mousedown', (event) => handleMouseDown(event, 'pomodoroThumbIsDragging2'));
    pomodoroVolumeThumb2.addEventListener('touchstart', (event) => handleMouseDown(event, 'pomodoroThumbIsDragging2'));
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    // ALERT VOLUME TOGGLING FUNCTIONALITY

    function removeGlowingEffect(flags, timeAmount, secondsPassed, start_stop_btn) {
        if ((flags.flowmodoroNotificationToggle) && (counters.startStop > 1) && (!flags.inHyperFocus)) {
            if ((timeAmount.breakTimeSuggestionsArr[counters.currentFlowmodoroBreakIndex] * 60) > (secondsPassed)) {
                start_stop_btn.classList.remove('glowing-effect');
                flags.sentFlowmodoroNotification = false;
            } else {
                start_stop_btn.classList.add('glowing-effect');
                flags.sentFlowmodoroNotification = true;
            }
        }
    }

    flowmodoroInputs.forEach(input => {
        input.addEventListener('change', function(event) {
            let finalInputVal = Math.round(event.target.value);
            let validatedFinalInputVal = validateAndSetNotificationInput(finalInputVal);
            document.getElementById(event.target.id).value = validatedFinalInputVal;
            let secondsPassed;
            let newIntervalArr = [...timeAmount.breakTimeSuggestionsArr];
            
            setBreakTimeSuggestionsArr(event, timeAmount, validatedFinalInputVal, counters, newIntervalArr);
            setCurrentFlowmodoroNotification(flags, counters, timeAmount);

            if ((counters.startStop === 0) || (flags.inHyperFocus)) {
                elapsedTime.flowmodoroNotificationSeconds = (counters.currentFlowmodoroNotification * 60);
                secondsPassed = 0;
            } else {
                secondsPassed = Math.round((Date.now() - startTimes.chillTime) / 1000);
                elapsedTime.flowmodoroNotificationSeconds = ((counters.currentFlowmodoroNotification * 60) - secondsPassed);
                flowmodoroWorker.postMessage("clearInterval");
                flowmodoroWorker.postMessage(elapsedTime.flowmodoroNotificationSeconds);
            }

            if ((counters.currentFlowmodoroBreakIndex === 0) && (event.target.id === "flowmodoroBreakInput1")) {
                removeGlowingEffect(flags, timeAmount, secondsPassed, start_stop_btn);
            } else if ((counters.currentFlowmodoroBreakIndex === 1) && (event.target.id === "flowmodoroBreakInput2")) {
                removeGlowingEffect(flags, timeAmount, secondsPassed, start_stop_btn);
            } else if ((counters.currentFlowmodoroBreakIndex === 2) && (event.target.id === "flowmodoroBreakInput3")) {
                removeGlowingEffect(flags, timeAmount, secondsPassed, start_stop_btn);
            } else if ((counters.currentFlowmodoroBreakIndex === 3) && (event.target.id === "flowmodoroBreakInput4")) {
                removeGlowingEffect(flags, timeAmount, secondsPassed, start_stop_btn);
            }

            suggestionBreak_min.textContent = counters.currentFlowmodoroNotification + " min";
        })
    })

    function addRemoveGlowingEffect(validatedFinalInputVal, secondsPassed, start_stop_btn) {
        if ((validatedFinalInputVal * 60) > (secondsPassed)) {
            start_stop_btn.classList.remove('glowing-effect');
        } else {
            start_stop_btn.classList.add('glowing-effect');
        }
    }
        
    pomodoroInputs.forEach(input => {
        input.addEventListener('change', async function(event) {
            let finalInputVal = Math.round(event.target.value);
            let validatedFinalInputVal = validateAndSetNotificationInput(finalInputVal);
            document.getElementById(event.target.id).value = validatedFinalInputVal;
            let secondsPassed;
            let newIntervalArr = [...timeAmount.pomodoroIntervalArr];

            if (flags.inHyperFocus) {
                secondsPassed = Math.round((Date.now() - startTimes.hyperFocus) / 1000);
                // console.log(secondsPassed);

                if ((event.target.id === "pomodoroInput")) { //and new time is higher than current time
                    flags.modeChangeExecuted = false;
                    addRemoveGlowingEffect(validatedFinalInputVal, secondsPassed, start_stop_btn);
                }
            } else {
                secondsPassed = Math.round((Date.now() - startTimes.chillTime) / 1000);

                if ((event.target.id === "shortBreakInput") && (counters.currentPomodoroIntervalIndex === 1)) {
                    flags.modeChangeExecuted = false;
                    addRemoveGlowingEffect(validatedFinalInputVal, secondsPassed, start_stop_btn);
                } else if ((event.target.id === "longBreakInput") && (counters.currentPomodoroIntervalIndex === 2)) { // long break
                    flags.modeChangeExecuted = false;
                    addRemoveGlowingEffect(validatedFinalInputVal, secondsPassed, start_stop_btn);
                }
            }

            setPomodoroIntervalArr(event, timeAmount, validatedFinalInputVal, counters, productivity_chill_mode, flags, newIntervalArr);
            setCurrentPomodoroNotification(counters, timeAmount);

            if (counters.startStop === 0) {
                elapsedTime.pomodoroNotificationSeconds = (counters.currentPomodoroNotification * 60);
            } else if (flags.pomodoroNotificationToggle) {
                elapsedTime.pomodoroNotificationSeconds = ((counters.currentPomodoroNotification * 60) - secondsPassed);
                pomodoroWorker.postMessage("clearInterval");
                pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
            }
        })
    })

    radioGroups.forEach(group => {
        group.radios.forEach(radio => {
            radio.addEventListener('change', event => handleRadioChange(event, group.type, soundMap, alertSounds, alertVolumes));
        });
    });

    let combinedFlowtimeBackgroundCell = [...flowtimeBackgroundCells, ...flowtimeBackgroundWorldCells];
    combinedFlowtimeBackgroundCell.forEach(background => {
        background.addEventListener('click', async function(event) {
            let newId = event.target.id;
            let priorId = selectedBackgroundId["flowtime"];
            document.getElementById(priorId).classList.remove('selected-background');

            selectedBackground.flowtime = flowtimeBackgrounds[newId];
            selectedBackgroundId.flowtime = newId;
            document.getElementById(event.target.id).classList.add('selected-background');

            if ((flags.inHyperFocus) && (!flags.darkThemeActivated)) {
                setBackground(selectedBackground.flowtime, 1);
            }

            if (sessionState.loggedIn) {
                await updateUserSettings({
                    backgroundsThemes: {
                        flowTimeBackground: selectedBackgroundId.flowtime
                    }
                });
            }
        })
    })
    
    let combinedChilltimeBackgroundCell = [...chilltimeBackgroundCells, ...chilltimeBackgroundWorldCells];
    combinedChilltimeBackgroundCell.forEach(background => {
        background.addEventListener('click', async function(event) {
            let newId = event.target.id;
            let priorId = selectedBackgroundId["chilltime"];
            document.getElementById(priorId).classList.remove('selected-background');
            
            selectedBackground.chilltime = chilltimeBackgrounds[newId];
            selectedBackgroundId.chilltime = newId;
            document.getElementById(event.target.id).classList.add('selected-background');

            // if we're in chilltime (and not pre-session)
            if ((!flags.inHyperFocus) && (counters.startStop >= 1) && (!flags.darkThemeActivated)) {
                setBackground(selectedBackground.chilltime, 1);
            }

            if (sessionState.loggedIn) {
                await updateUserSettings({
                    backgroundsThemes: {
                        chillTimeBackground: selectedBackgroundId.chilltime
                    }
                });
            }
        })

    })

    //Toggle is set to true by default
    //Further clicks will render the targetReachToggle flag true or false
    targetTimeReachedToggle.addEventListener("click", async function() {
        if (targetTimeReachedToggle.checked) {
            enableNotifications();
            flags.targetReachedToggle = true;
        } else {
            flags.targetReachedToggle = false;
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                flowTime: {
                    targetTimeReachedToggle: flags.targetReachedToggle
                }
            });
        }
    })

    breakSuggestionToggle.addEventListener("click", async function() {
        if (breakSuggestionToggle.checked) {
            enableNotifications();
            flags.breakSuggestionToggle = true;

            if (flags.inHyperFocus) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch", "Deep Work");
            } else {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch","Break");
            }

            resetPomodoroCounters(counters);

            if (pomodoroNotificationToggle.checked) {
                pomodoroNotificationToggle.click();
            }

            timeAmount.suggestionMinutes = suggestionMinutesInput.value;
            setSuggestionMinutes(startTimes, flags, elapsedTime, timeAmount);

        } else {
            flags.breakSuggestionToggle = false;
            suggestionWorker.postMessage("clearInterval");
            start_stop_btn.classList.remove('glowing-effect');
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                flowTime: {
                    notificationToggle: flags.breakSuggestionToggle
                }
            });
        }
    })

    flowmodoroNotificationToggle.addEventListener("click", async function() {
        if (flowmodoroNotificationToggle.checked) {
            enableNotifications();

            resetPomodoroCounters(counters);

            if (pomodoroNotificationToggle.checked) {
                pomodoroNotificationToggle.click();
            }

            let elapsedTimeInChillTime = Math.floor((Date.now() - startTimes.chillTime) / 1000); //in seconds

            // When toggle for break notification is turned on whilst in break
            if (!flags.inHyperFocus && counters.startStop !== 0) {
                elapsedTime.flowmodoroNotificationSeconds = ((counters.currentFlowmodoroNotification * 60) - elapsedTimeInChillTime);
                flowmodoroWorker.postMessage("clearInterval");
                flowmodoroWorker.postMessage(elapsedTime.flowmodoroNotificationSeconds);
            }
            
            flags.flowmodoroNotificationToggle = true;
        } else {
            flags.flowmodoroNotificationToggle = false;
            flowmodoroWorker.postMessage("clearInterval");
            start_stop_btn.classList.remove('glowing-effect');
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                chillTime: {
                    notificationToggle: flags.flowmodoroNotificationToggle
                }
            });
        }

        changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters);
    })

    pomodoroNotificationToggle.addEventListener("click", async function() {
        if (pomodoroNotificationToggle.checked) {
            enableNotifications();
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
                let pomodoroString = "Pomodoro #1 | " + String(timeAmount.pomodoroIntervalArr[0]) + " min";
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch", pomodoroString);
                elapsedTime.pomodoroNotificationSeconds = ((counters.currentPomodoroNotification * 60) - elapsedTimeInHyperfocus);
                pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
            }
            
            flags.pomodoroNotificationToggle = true;

        } else {
            flags.pomodoroNotificationToggle = false;
            pomodoroWorker.postMessage("clearInterval");
            start_stop_btn.classList.remove('glowing-effect');
            if (flags.inHyperFocus) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch","Deep Work");
            } else if (counters.startStop > 1) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, "Switch","Break");
                hidePomodorosCompletedContainer(completedPomodorosContainer);
                showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, timeAmount, counters, flags);
            }
        }

        changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters);

        // Send asynchronous request to server to store user data if user logged in
        if (sessionState.loggedIn) {
            await updateUserSettings({
                pomodoro: {
                    notificationToggle: flags.pomodoroNotificationToggle
                }
            });
        }
    })

    autoStartPomodoroIntervalToggle.addEventListener("click", async function() {
        if (!flags.autoStartPomodoroInterval) {
            flags.autoStartPomodoroInterval = true;
            flags.modeChangeExecuted = false;
        } else if (flags.autoStartPomodoroInterval) {
            flags.autoStartPomodoroInterval = false;
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                pomodoro: {
                    autoStartPomToggle: flags.autoStartPomodoroInterval
                }
            });
        }
    })
    
    autoStartBreakIntervalToggle.addEventListener("click", async function() {
        if (!flags.autoStartBreakInterval) {
            flags.autoStartBreakInterval = true;
            flags.modeChangeExecuted = false;
        } else if (flags.autoStartBreakInterval) {
            flags.autoStartBreakInterval = false;
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                pomodoro: {
                    autoStartBreakToggle: flags.autoStartBreakInterval
                }
            });
        }
    })

    transitionClockSoundToggle.addEventListener("click", async function() {
        if (transitionClockSoundToggle.checked) {
            flags.transitionClockSoundToggle = true;
        } else {
            flags.transitionClockSoundToggle = false;
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                sounds: {
                    transitionClockSound: flags.transitionClockSoundToggle
                }
            });
        }
    })

    flowTimeAnimationToggle.addEventListener("click", async function() {
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

        if (sessionState.loggedIn) {
            await updateUserSettings({
                backgroundsThemes: {
                    flowTimeAnimation: flags.flowTimeAnimationToggle
                }
            });
        }
    })

    chillTimeAnimationToggle.addEventListener("click", async function() {
        if (chillTimeAnimationToggle.checked) {
            flags.chillTimeAnimationToggle = true;
            if ((!flags.inHyperFocus) && (counters.startStop > 1)) {
                animationsFadeIn(chillAnimation, 'flex');
            }
        } else {
            flags.chillTimeAnimationToggle = false;
            if (!flags.inHyperFocus) {
                animationsFadeOut(chillAnimation);
            }
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                backgroundsThemes: {
                    chillTimeAnimation: flags.chillTimeAnimationToggle
                }
            });
        }
    })

    defaultThemeContainer.addEventListener("click", async function() {
        triggerLightMode(isMobile);
    })

    darkThemeContainer.addEventListener("click", async function() {
        triggerDarkMode(isMobile);
    })

    darkContainer.addEventListener("click", async function() {
        triggerDarkMode(isMobile);
    })

    openEyeContainer.addEventListener("click", function() {
        hideDisplays();
    })

    closedEyeContainer.addEventListener("click", function() {
        showDisplays();
    })

    lightContainer.addEventListener("click", async function() {
        triggerLightMode(isMobile);
    })

    window.addEventListener("resize", function() {
        handleViewportWidthChange(settingsMappings, tempStorage);
    });

    registerHereText.addEventListener('click', function() {
        window.location.href = "/signup";
    });

    // similar function in navigation.js
    function logoutUser() {
        fetch('/api/state/logout', {
            method: 'POST'
        })
        .then(() => {
            sessionState.loggedIn = false;
            window.location.href = "/";
            // console.log("Logged out successfully.");
        })
        .catch(error => console.error('Logout failed', error));
    }

    logoutBtn.addEventListener("click", async function() {
        logoutUser(sessionState);
    })
    
    logoutBtn2.addEventListener("click", function() {
        logoutUser(sessionState);
    })

    // similar function present in login.js
    function addUser() {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        const user = {
            email: email,
            password: password
        };

        fetch("/api/api/validateUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: user, userAgent: userAgent, userDevice: userDevice, userTimeZone: userTimeZone })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 429) {
                    // Handle rate limit exceeded error
                    return response.json().then(data => {
                        alert(data.message); // Display the rate limit exceeded message to the user
                        throw new Error(`HTTP error! Status: ${response.status} - ${data.message}`);
                    });
                } else {
                    alert("Your email or password is incorrect. Please try again.");
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            return response.json();  // Assuming you want to process JSON response
        })
        .then(data => {
            // console.log("Server response:", data);
            if (data.loginSuccess === true) {
                console.log("Login was successful!")
                initializeGUI();
            } else {
                alert("An error occured on the server. We apologize for the inconvenience. Please try again later.")
            }
        })
        .catch(error => {
            console.error(error);
            // Handle the error (e.g., display an error message to the user).
        });
    }
    
    loginBtn.addEventListener("click", async function() {

        if (isValidEmail(loginEmailInput.value)) {
            addUser(loginEmailInput.value, loginPasswordInput.value);
        } else {
            alert("Invalid email address. Please try again.");
        }

    })

    function isValidEmail(email) {
        // You can add your email validation logic here
        // For a simple check, you can use a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    forgotPasswordSettings.addEventListener("click", function() {
        window.location.href = "/reset-password";
    })

    progressContainer.addEventListener("mouseover", function() {
        if (((!progressBarContainer.classList.contains('small')) && (counters.startStop >= 1)) || ((counters.startStop === 0) && (flags.submittedTarget))) {
            progressContainer.style.cursor = 'pointer';
        }
    });
    
    progressContainer.addEventListener("mouseout", function() {
        if (((!progressBarContainer.classList.contains('small')) && (counters.startStop >= 1)) || ((counters.startStop === 0) && (flags.submittedTarget))) {
            progressContainer.style.cursor = 'default';
        }
    });

    progressContainer.addEventListener("click", async function() {
        if ((((!progressBarContainer.classList.contains('small')) && (counters.startStop >= 1)) || ((counters.startStop === 0) && (flags.submittedTarget))) && (flags.totalTimeToggle)) {
            if (!progressTextMod.showingTimeLeft) {
                progressTextMod.showingTimeLeft = true; // show time left
                total_time_display.textContent = progressTextMod.targetTimeLeftStr; // for immediate change
            } else {
                progressTextMod.showingTimeLeft = false; // hide time left
                total_time_display.textContent = progressTextMod.defaultTimeStr; // for immediate change
            }

            if (sessionState.loggedIn) {
                await updateShowingTimeLeft(progressTextMod.showingTimeLeft);
            }
        }
    });

    streaksContainer.addEventListener("mouseover", function() {
        // for non logged in user and question popup menu isn't open
        // Show log in suggestion container
        // "You have one "You've got a one day streak! Log in to save your progress."

        if ((!sessionState.loggedIn) && (!navFlags.popupQuestionWindowShowing)) {
            streaksContainer.style.cursor = 'pointer';
            streaksLoginSuggestionPopup.style.opacity = 1;
            streaksLoginSuggestionPopup.style.zIndex = 35;
        }
    })
    
    streaksContainer.addEventListener("mouseout", function() {
        // for non logged in user and question popup menu isn't open
        // remove log in suggestion window
        
        if ((!sessionState.loggedIn) && (!navFlags.popupQuestionWindowShowing)) {
            streaksLoginSuggestionPopup.style.opacity = 0;
            streaksLoginSuggestionPopup.style.zIndex = 0;
        }
    })

    streaksContainer.addEventListener("click", function() {
        if ((!sessionState.loggedIn) && (!navFlags.popupQuestionWindowShowing)) {
            window.location.href = "/login";
        }
    })

    // CURRENTLY OMITTED
    previousSessionStartedOkBtn.addEventListener("click", function() {
        popupOverlay.style.display = "none";
        previousSessionStartedPopup.style.display = "none";
        previousSessionStartedPopup.style.opacity = '0';

        if (invalidatePreviousSessionInput.checked) {
            // update invaliDate value in db w/ Date.now() of new session start
            console.log("invalidate previous session and continue was selected");
            updateInvaliDate(startTimes.beginning);
        } else {
            initialVisualReset(tempCounters);
            sessionReset(false); // false implies no delay for resetting progress bar & total time display

            quitCurrentSessionInput.checked = false;
            invalidatePreviousSessionInput.checked = true;
        }
    })

    intervalTimeToggle.addEventListener("click", async function() {
        intervalTimeToggleGUIUpdate();

        if (sessionState.loggedIn) {
            await updateUserSettings({
                display: {
                    intervalTime: flags.intervalTimeToggle
                }
            });
        }
    })

    totalTimeToggle.addEventListener("click", async function() {
        totalTimeToggleGUIUpdate();

        if (sessionState.loggedIn) {
            await updateUserSettings({
                display: {
                    totalTime: flags.totalTimeToggle
                }
            });
        }
    });

    muffinToggle.addEventListener("click", async function() {
        if (muffinToggle.checked) {
            flags.muffinToggle = true;
            displayCat(catIds, counters);
            
        } else {
            flags.muffinToggle = false;
            
            // hide muffin if in break mode
            if (!flags.inHyperFocus) {
                hideMuffin(catIds, counters);
            }
            
        }

        if (sessionState.loggedIn) {
            await updateUserSettings({
                display: {
                    muffinToggle: flags.muffinToggle
                }
            });
        }
    })

    cats.forEach(cat => {
        cat.addEventListener("click", function() {
            if (flags.canTriggerZZZ) {
                flags.canTriggerZZZ = false;
                let rotationStr = `rotateZ(-${Math.floor(Math.random() * 30)}deg)`;
                zzz.style.transform = rotationStr;
                zzz.style.display = "block";
                setTimeout(() => {
                    zzz.style.opacity = 1;
                    setTimeout(() => {
                        zzz.style.opacity = 0;
                        setTimeout(() => {
                            zzz.style.display = "none";
                            flags.canTriggerZZZ = true;
                        }, 250);
                    }, 1000);
                }, 0);
            }
        });
    });

    suggestionBreak_min.addEventListener("click", function() {
        // open up break notifications in settings
        settings_menu_container.click();
        setTimeout(() => {
            flowmodoroBtnContainer.click();
        }, 0)

        if (flags.pipWindowOpen) {
            window.focus(); // get back to the tab
        }
    })

    supportEmail.addEventListener('click', function() {
        const email = "support@hyperchill.io";

        // Clipboard API
        navigator.clipboard.writeText(email).then(function() {
            alert("'support@hyperchill.io' has been copied to clipboard");

        }).catch(function(error) {
            console.error("Could not copy text: ", error);

        });
    })

    feedbackFormBtn.addEventListener('click', function() {
        if (!feedbackFormBtn.classList.contains('no-click')) {
            window.open('https://forms.gle/ZvKZ6SxskLD43nqd9', '_blank');
        }
    })

    // ---------------------
    // DISPLAY WORKERS
    // ---------------------
    pomodoroWorker.onmessage = function(message) {
        console.log("pomodoroWorker.onmessage")
        pomodoroTransition(isMobile, isIpad);
    }

    suggestionWorker.onmessage = function(message) {
        if (!flags.sentSuggestionMinutesNotification) {
            sendSuggestionBreakNotification(timeAmount, startTimes, alertSounds, alertVolumes, isMobile, isIpad);
            flags.sentSuggestionMinutesNotification = true;
            start_stop_btn.classList.add('glowing-effect');
        }
    }
    
    flowmodoroWorker.onmessage = function(message) {
        if (!flags.sentFlowmodoroNotification) {
            sendFlowmodoroNotification(timeAmount, counters, startTimes, alertSounds, alertVolumes, isMobile, isIpad);
            flags.sentFlowmodoroNotification = true;
            start_stop_btn.classList.add('glowing-effect');
        }
    }
    
    displayWorker.onmessage = function(message) {
        const timeDiff = Math.round((Date.now() - startTimes.local) / 1000) * 1000;
        
        let hours = Math.floor(timeDiff / timeConvert.msPerHour);
        let minutes = Math.floor((timeDiff - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
        let seconds = Math.floor((timeDiff - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);
        // Format the time values
        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');
        
        display.textContent = `${hours}:${minutes}:${seconds}`;

        updateDataPerHourCheck();

        timeRecovery(flags, counters, startTimes, start_stop_btn, timeAmount, alertSounds, alertVolumes, flowmodoroWorker, suggestionWorker, isMobile, isIpad);
    }

    totalDisplayWorker.onmessage = function(message) {
        totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod);
    }
});

// ------------------
// HELPER FUNCTIONS
// ------------------
async function handleSessionIntervalsChartBoundsRadioChange(event) {
    let targetId = event.target.id;

    // may need to make this a global object ??
    // figure this out when modifying state.js
    const boundsObj = {
        'default24HoursBoundsInput': '24hours',
        'manualBoundsInput': 'manual',
        'automaticBoundsInput': 'auto'
    }

    // programmatically set the settings.boundsType field
    settings.boundsType = boundsObj[targetId];

    if (sessionState.loggedIn) {
        await updateUserSettings({
            dashboard: {
                boundsType: settings.boundsType
            }
        });

        setMetricCharts();
    }
}

async function hideDisplays() {
    intervalTimeToggle.checked = false;

    intervalTimeToggleGUIUpdate();

    if (sessionState.loggedIn) {
        await updateUserSettings({
            display: {
                intervalTime: flags.intervalTimeToggle
            }
        });
    }
}

async function showDisplays() {
    intervalTimeToggle.checked = true;

    intervalTimeToggleGUIUpdate();

    if (sessionState.loggedIn) {
        await updateUserSettings({
            display: {
                intervalTime: flags.intervalTimeToggle
            }
        });
    }
}

async function triggerLightMode(isMobile) {
    // adjust settings container selection & flag
    darkGrayTheme.classList.remove('selected-background');
    defaultTheme.classList.add('selected-background');
    flags.darkThemeActivated = false;

    deactivateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer, isMobile, streaksContainer, lightHtmlBackground);
    lightContainer.style.display = "none";
    darkContainer.style.display = "flex";

    if (sessionState.loggedIn) {
        await updateUserSettings({
            backgroundsThemes: {
                darkThemeActivated: flags.darkThemeActivated // false
            }
        });
    }
}

async function triggerDarkMode(isMobile) {
    // adjust settings container selection & flag
    darkGrayTheme.classList.add('selected-background');
    defaultTheme.classList.remove('selected-background');
    flags.darkThemeActivated = true;

    activateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer, streaksContainer, darkHtmlBackground);
    darkContainer.style.display = "none";
    lightContainer.style.display = "flex";

    if (sessionState.loggedIn) {
        await updateUserSettings({
            backgroundsThemes: {
                darkThemeActivated: flags.darkThemeActivated // true
            }
        });
    }
}

export function hideCat(catIds, counters) {
    if (flags.muffinToggle) {
        hideMuffin(catIds, counters);
        updateCatIdsArrIndex(counters);
    }
}

function hideMuffin(catIds, counters) {
    document.getElementById([catIds[counters.catIdsArrIndex]]).style.display = "none";
    document.getElementById([catIds[counters.catIdsArrIndex]]).style.opacity = '0';
}

function updateCatIdsArrIndex(counters) {
    if (counters.catIdsArrIndex === 8) {
        counters.catIdsArrIndex = 0;
    } else {
        counters.catIdsArrIndex++;
    }
}

export function displayCat(catIds, counters) {
    if ((flags.muffinToggle) && (!flags.pipWindowOpen) && (!flags.inHyperFocus) && (counters.startStop > 0)) {
        document.getElementById([catIds[counters.catIdsArrIndex]]).style.display = "block";
        setTimeout(() => {
            document.getElementById([catIds[counters.catIdsArrIndex]]).style.opacity = '1';
        }, 0)
    }
}

function reorderArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function totalTimeToggleGUIUpdate() {
    if (totalTimeToggle.checked) {
        flags.totalTimeToggle = true;

        // show total time text
        total_time_display.style.display = 'block';

    } else {
        flags.totalTimeToggle = false;

        // hide total time text
        total_time_display.style.display = 'none';
    }

    editDisplayGUIContainer();
}

export function intervalTimeToggleGUIUpdate() {
    if (intervalTimeToggle.checked) {
        flags.intervalTimeToggle = true;

        // show interval time display
        timekeepingContainer.style.height = '350px';
        stopwatch.style.display = 'block';

    } else {
        flags.intervalTimeToggle = false;

        // hide interval time display
        timekeepingContainer.style.height = '150px';
        stopwatch.style.display = 'none';
    }

    editDisplayGUIContainer();
}

function editDisplayGUIContainer() {
    if (!flags.intervalTimeToggle) {
        openEyeContainer.style.display = "none";
        closedEyeContainer.style.display = "flex";
    } else {
        openEyeContainer.style.display = "flex";
        closedEyeContainer.style.display = "none";
    }
}

function pomodoroTransition(isMobile, isIpad) {
    if (!flags.modeChangeExecuted) {
        flags.modeChangeExecuted = true;

        if (!(isMobile || isIpad)) {
            new Notification(getPomodoroNotificationString(counters, timeAmount));
        }
        
        playAlertSoundCountdown(soundMap.Chime, soundMap.Bell, alertSounds.pomodoro, alertVolumes.pomodoro);
        
        if ((counters.currentPomodoroIntervalIndex === 0) && (!flags.pomodoroCountIncremented)) {
            counters.pomodorosCompleted++;
            flags.pomodoroCountIncremented = true;
        }

        startTimes.lastPomNotification = Date.now();
        
        //IF AUTO START FLOW TIME INTERVAL OPTION IS SELECTED
        if (((flags.inHyperFocus) && (flags.autoStartBreakInterval)) || ((!flags.inHyperFocus) && (flags.autoStartPomodoroInterval))) {
            setTimeout(() => {
                start_stop_btn.click();
            }, 0)
            return;
        } else {
            start_stop_btn.classList.add('glowing-effect');
        }
    }
}

function updateDataPerHourCheck() {
    let currentTime = Date.now();
    let now = new Date(currentTime);
    
    // Calculate the start of the current hour
    let startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()); // final date
    let hourBeforeStartOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1); // initial date

    if (checkStartOfHour(currentTime, startOfHour)) {

        // We are now going to check every hour from the current time to the start if necessary
        updateDataPerHour(intervalArrs, startOfHour, hourBeforeStartOfHour, perHourData);
    }
}

// conditional to check if current time is 1 second or less after the start of an hour
function checkStartOfHour(currentTime, startOfHour) {
    // Get the timestamp for the start of the current hour
    const startOfHourTimestamp = startOfHour.getTime();

    // Calculate the difference between the current timestamp and the start of the hour
    const difference = currentTime - startOfHourTimestamp;

    // Check if the difference is one second (1000 milliseconds) or less
    return difference <= 1000;
}

// First practical use for recursion in the program !!
export function updateDataPerHour(intervalArrs, finalDate, initialDate, perHourData) {

    // Base Case
    if ((finalDate <= new Date(startTimes.beginning)) || (perHourData[initialDate.toISOString()])) {
        return;
    }

    let deepWorkTime = calculateDeepWorkPerHour(intervalArrs.transitionTime, finalDate, initialDate);
    let distractions = calculateDistractionsPerHour(intervalArrs.interruptionTime, finalDate, initialDate);

    let inDeepWork;
    if (deepWorkTime > 0) {
        inDeepWork = true;
    } else {
        inDeepWork = false;
    }

    let perHourDataObj = {
        "inDeepWork": inDeepWork,
        "distractions": distractions,
        "deepWorkTime": deepWorkTime
    }

    let currentDateKey = initialDate.toISOString();
    perHourData[currentDateKey] = perHourDataObj;

    // check previous hour time slots
    let previousFinalDate = initialDate;

    let previousInitialDate = new Date(initialDate);
    previousInitialDate.setHours(previousInitialDate.getHours() - 1);

    updateDataPerHour(intervalArrs, previousFinalDate, previousInitialDate, perHourData);
}

// needs more testing
function calculateDeepWorkPerHour(transitionTimes, finalDate, initialDate) {
    
    let breakInterval = false;
    let deepWorkSumArr = [];

    let finalTime = finalDate.getTime();
    let initialTime = initialDate.getTime();

    let i = 0;
    let lastIndex = 0;
    while ((transitionTimes[i] < finalTime) && (i < transitionTimes.length)) {
        if (transitionTimes[i] >= initialTime) {
            if (i % 2 === 1) { // if i is odd (--> Break)
                if (breakInterval) {
                    deepWorkSumArr.push(transitionTimes[i] - transitionTimes[i-1])
                    breakInterval = false;
                } else {
                    deepWorkSumArr.push(transitionTimes[i] - initialTime)
                }
            } else { // if i is even (--> DW)
                breakInterval = true;
            }
        }
        lastIndex = i;
        i++;
    }

    // essentially this deals w/ ending session in middle of hour
    if ((transitionTimes[lastIndex] < finalTime) && (lastIndex % 2 === 0)) {
        if (transitionTimes[lastIndex] < initialTime) {
            deepWorkSumArr.push(finalTime - initialTime);
        } else {
            deepWorkSumArr.push(finalTime - transitionTimes[lastIndex]);
        }
    }

    const sum = deepWorkSumArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return sum; // should be total deep work in ms
}

function calculateDistractionsPerHour(interruptionTimes, finalDate, initialDate) {
    let finalTime = finalDate.getTime();
    let initialTime = initialDate.getTime();
    let distractionsCounter = 0;

    let i = 0;
    while ((interruptionTimes[i] < finalTime) && (i < interruptionTimes.length)) {
        if (interruptionTimes[i] >= initialTime) {
            distractionsCounter++;
        }
        i++;
    }

    return distractionsCounter;
}

async function checkSessionIntervalSwitch() {
    if (sessionState.loggedIn) {
        if (counters.startStop === 1) {
            await checkSession();
        }
        await logLastIntervalSwitch(counters.startStop, times.start);
    }
}

export function updateLabelArrs(timeStamp, labelFlags, labelArrs) {
    for (let key in labelFlags) {
        if (!labelArrs[key]) {
            labelArrs[key] = [];
        }

        if (labelFlags[key]) {
            labelArrs[key].push(timeStamp);
        }
    }
    // console.log(labelArrs);
}

function timeRecovery(flags, counters, startTimes, start_stop_btn, timeAmount, alertSounds, alertVolumes, flowmodoroWorker, suggestionWorker, isMobile, isIpad) {
    if (flags.pomodoroNotificationToggle) {
        if (((counters.currentPomodoroNotification * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.modeChangeExecuted)) {
            pomodoroTimeRecovery(isMobile, isIpad);
        }
        
    } else {
        if ((flags.flowmodoroNotificationToggle) && (!flags.inHyperFocus) && ((counters.currentFlowmodoroNotification * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.sentFlowmodoroNotification)) {
            // console.log("TIME RECOVERY FOR FLOWMODORO")
            flowmodoroWorker.postMessage("clearInterval");
            sendFlowmodoroNotification(timeAmount, counters, startTimes, alertSounds, alertVolumes, isMobile, isIpad);
            flags.sentFlowmodoroNotification = true;
            start_stop_btn.classList.add('glowing-effect');

        }
        if ((flags.breakSuggestionToggle) && (flags.inHyperFocus) && ((timeAmount.suggestionMinutes * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.sentSuggestionMinutesNotification)) {
            // console.log("TIME RECOVERY FOR SUGGESTION MINUTES")
            suggestionWorker.postMessage("clearInterval");
            sendSuggestionBreakNotification(timeAmount, startTimes, alertSounds, alertVolumes, isMobile, isIpad);
            flags.sentSuggestionMinutesNotification = true;
            start_stop_btn.classList.add('glowing-effect');

        }
    }
}

function getPomodoroNotificationString(counters, timeAmount) {
    let notificationString;
    if ((flags.inHyperFocus) && (counters.currentPomodoroIntervalOrderIndex !== 6)) { // 1st-3rd pomodoro
        if (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a short break?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a short break?";
        }
    } else if (counters.currentPomodoroIntervalOrderIndex == 6) { // 4th pomodoro
        if (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a long break?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a long break?";
        }
    } else { // any of the breaks
        if (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to start your Pomodoro Interval?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to start your Pomodoro Interval?";
        }
    }

    return notificationString;
}

function handleRadioChange(event, alertType, soundMap, alertSounds, alertVolumes) {
    const { target } = event;
    const soundTypes = Object.keys(soundMap); // ['NoAlert', 'Chime', 'Bell']

    soundTypes.forEach(soundType => {
        if (target.id === `${alertType}${soundType}Input` || target.id === `${alertType}${soundType}Input2`) {
            pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);

            if (soundType === 'NoAlert') {
                alertSounds[alertType] = 'none';
            } else {
                alertSounds[alertType] = soundType.toLowerCase(); //effectively turns key into value (except for NoAlert key)
            }

            if (soundType !== 'NoAlert') {
                playAlertSound(soundMap[soundType], alertType, alertVolumes);
                document.getElementById(`${alertType}${soundType}Input`).checked = true;
                document.getElementById(`${alertType}${soundType}Input2`).checked = true;
            } else {
                document.getElementById(`${alertType}NoAlertInput`).checked = true;
                document.getElementById(`${alertType}NoAlertInput2`).checked = true;
            }

            setUserAlertSound(alertType, soundType);
        }
    });
}

async function setUserAlertSound(alertType, soundType) {
    let newSoundType;

    if ((soundType.toLowerCase() === "bell") || (soundType.toLowerCase() === "chime")) {
        newSoundType = soundType.toLowerCase();
    } else {
        newSoundType = "none";
    }

    if (sessionState.loggedIn) {
        if (alertType === "flowmodoro") {
            await updateUserSettings({
                chillTime: {
                    alertSound: newSoundType
                }
            });
        } else if (alertType === "general") {
            await updateUserSettings({
                flowTime: {
                    alertSound: newSoundType
                }
            });
        } else {
            await updateUserSettings({
                pomodoro: {
                    alertSound: newSoundType
                }
            });
        }
    }
}

function setPomodoroNotificationSeconds(flags, elapsedTime, counters, recoverBreakState, pomodoroWorker) {
    elapsedTime.pomodoroNotificationSeconds = (counters.currentPomodoroNotification * 60);
    pomodoroWorker.postMessage("clearInterval");
    pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
}

function flowmodoroAndBreakSuggestionActions(flags, elapsedTime, counters, timeAmount, flowmodoroWorker, suggestionWorker) {
    if (flags.inHyperFocus) {
        if (flags.breakSuggestionToggle) {
            elapsedTime.suggestionSeconds = (timeAmount.suggestionMinutes * 60);
            suggestionWorker.postMessage(elapsedTime.suggestionSeconds);
        }
        if (flags.flowmodoroNotificationToggle) {
            flowmodoroWorker.postMessage("clearInterval");
        }
    } else {
        if (flags.flowmodoroNotificationToggle) {
            elapsedTime.flowmodoroNotificationSeconds = (counters.currentFlowmodoroNotification * 60);
            flowmodoroWorker.postMessage(elapsedTime.flowmodoroNotificationSeconds);
        }
        if (flags.breakSuggestionToggle) {
            suggestionWorker.postMessage("clearInterval");
        }
    }
}

// Set both short and long break
function setBothBreakIntervalText(counters, timeAmount) {
    let breakString;
    if (counters.currentPomodoroIntervalOrderIndex === 1) {
        breakString  = "Short Break #1 | " + String(timeAmount.pomodoroIntervalArr[1]) + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 3) {
        breakString  = "Short Break #2 | " + String(timeAmount.pomodoroIntervalArr[1]) + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 5) {
        breakString  = "Short Break #3 | " + String(timeAmount.pomodoroIntervalArr[1]) + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 7) {
        breakString  = "Long Break | " + String(timeAmount.pomodoroIntervalArr[2]) + " min";
    } else {
        breakString = "Break Mode"; // catch all
    }

    // console.log(counters.currentFlowmodoroBreakIndex);

    return breakString;
}

// If pomodoro notification toggle is set BEFORE entering Flow Time
function setPomodoroWorker(flags, elapsedTime, counters, recoverPomState, pomodoroWorker) {
    elapsedTime.pomodoroNotificationSeconds = (counters.currentPomodoroNotification * 60);
    pomodoroWorker.postMessage("clearInterval");
    pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
}

function setBreakIntervalText(counters, timeAmount) {
    let breakString;
    if (counters.currentPomodoroIntervalOrderIndex === 1) {
        breakString  = "Short Break #1 | " + String(timeAmount.pomodoroIntervalArr[1]) + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 3) {
        breakString  = "Short Break #2 | " + String(timeAmount.pomodoroIntervalArr[1]) + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 5) {
        breakString  = "Short Break #3 | " + String(timeAmount.pomodoroIntervalArr[1]) + " min";
    } else {
        breakString = "Break Mode"; // catch all
    }

    return breakString;
}

function setPomodoroIntervalText(counters, timeAmount) {
    let pomodoroString;
    if (counters.currentPomodoroIntervalOrderIndex === 0) {
        pomodoroString = "Pomodoro #1 | " + String(timeAmount.pomodoroIntervalArr[0]) + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 2) {
        pomodoroString = "Pomodoro #2 | " + String(timeAmount.pomodoroIntervalArr[0]) + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 4) {
        pomodoroString = "Pomodoro #3 | " + String(timeAmount.pomodoroIntervalArr[0]) + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 6) {
        pomodoroString = "Pomodoro #4 | " + String(timeAmount.pomodoroIntervalArr[0]) + " min";
    } else {
        pomodoroString = "Pomodoro Mode"; // catch all
    }

    return pomodoroString;
}

function chillTimeAnimationActions(flags, flowAnimation, chillAnimation) {
    animationsFadeOut(flowAnimation);
    if (flags.chillTimeAnimationToggle) {
        animationsFadeIn(chillAnimation, 'flex');
    }
}

function flowTimeAnimationActions(counters, flags, chillAnimation, flowAnimation) {
    if (counters.startStop > 1) {
        animationsFadeOut(chillAnimation);
    }
    if (flags.flowTimeAnimationToggle) {
        animationsFadeIn(flowAnimation, 'block');
    }
}

// Sets local start time depending on notification mode
function setLocalStartTime(flags, startTimes, recoverBreakState, recoverPomState) {
    startTimes.local = Date.now();
}

// If in pomodoro mode AND not coming from non-pomodoro mode,
// then we iterate the CurrentPomodoroIntervalOrderIndex
function chillTimeToFirstPomodoro(flags, productivity_chill_mode, counters) {
    if ((flags.pomodoroNotificationToggle) && (productivity_chill_mode.textContent !== "Break")) {
        iterateCurrentPomodoroIntervalOrderIndex(counters);
    } 
}

function sendSuggestionBreakNotification(timeAmount, startTimes, alertSounds, alertVolumes, isMobile, isIpad) {
    let notificationString;
    if (timeAmount.suggestionMinutes > 1) {
        notificationString = "Need a break? You've been hard at work for " + String(timeAmount.suggestionMinutes) + " minutes!";
    } else {
        notificationString = "Need a break? You've been hard at work for " + String(timeAmount.suggestionMinutes) + " minute!";
    }

    if (!(isMobile || isIpad)) {
        new Notification(notificationString);
    }

    startTimes.lastBreakSuggestionNotification = Date.now();
    playAlertSoundCountdown(soundMap.Chime, soundMap.Bell, alertSounds.general, alertVolumes.general);
}

function sendFlowmodoroNotification(timeAmount, counters, startTimes, alertSounds, alertVolumes, isMobile, isIpad) {
    let notificationString;
    if (timeAmount.breakTimeSuggestionsArr[counters.currentFlowmodoroBreakIndex] == 1) {
        notificationString = "It's been " + counters.currentFlowmodoroNotification + " minute! Are you ready to get back into Flow Time?";
    } else {
        notificationString = "It's been " + counters.currentFlowmodoroNotification + " minutes! Are you ready to get back into Flow Time?";
    }

    if (!(isMobile || isIpad)) {
        new Notification(notificationString);
    }

    startTimes.lastFlowmodoroNotification = Date.now();
    playAlertSoundCountdown(soundMap.Chime, soundMap.Bell, alertSounds.flowmodoro, alertVolumes.flowmodoro);
}

function sendPomodoroDelayNotification(startTimes, counters, timeAmount, alertSounds, alertVolumes, flags, isMobile, isIpad) {
    let notificationString;
    if (counters.currentPomodoroIntervalOrderIndex == 0 || counters.currentPomodoroIntervalOrderIndex == 2 || counters.currentPomodoroIntervalOrderIndex == 4) { // 1st-3rd pomodoro
        if (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a short break?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a short break?";
        }
        if (!flags.pomodoroCountIncremented) {
            counters.pomodorosCompleted++;
            flags.pomodoroCountIncremented = true;
        }
    } else if (counters.currentPomodoroIntervalOrderIndex == 6) { // 4th pomodoro
        if (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a long break?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a long break?";
        }
        if (!flags.pomodoroCountIncremented) {
            counters.pomodorosCompleted++;
            flags.pomodoroCountIncremented = true;
        }
    } else { // any of the breaks
        if (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to start your Pomodoro Interval?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to start your Pomodoro Interval?";
        }
    }

    if (!(isMobile || isIpad)) {
        new Notification(notificationString);
    }
    
    playAlertSoundCountdown(soundMap.Chime, soundMap.Bell, alertSounds.pomodoro, alertVolumes.pomodoro);

    startTimes.lastPomNotification = Date.now();
}

function pomodoroTimeRecovery(isMobile, isIpad) {
    console.log("pomodoro time recovery initiated");
    pomodoroTransition(isMobile, isIpad);
    pomodoroWorker.postMessage("clearInterval");
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

export function hidePomodorosCompletedContainer(completedPomodorosContainer) {
    completedPomodorosContainer.style.display = 'none';
}

function iterateCurrentPomodoroIntervalOrderIndex(counters) {
    if (counters.currentPomodoroIntervalOrderIndex === 7) {
        counters.currentPomodoroIntervalOrderIndex = 0;
    } else {
        counters.currentPomodoroIntervalOrderIndex++;
    }
}

function setCurrentPomodoroNotification(counters, timeAmount) {
    if (counters.currentPomodoroIntervalOrderIndex === 0 || counters.currentPomodoroIntervalOrderIndex === 2 || counters.currentPomodoroIntervalOrderIndex === 4 || counters.currentPomodoroIntervalOrderIndex === 6) {
        counters.currentPomodoroIntervalIndex = 0;
        counters.currentPomodoroNotification = timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex];
    } else if (counters.currentPomodoroIntervalOrderIndex === 1 || counters.currentPomodoroIntervalOrderIndex === 3 || counters.currentPomodoroIntervalOrderIndex === 5) {
        counters.currentPomodoroIntervalIndex = 1;
        counters.currentPomodoroNotification = timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex];
    } else if (counters.currentPomodoroIntervalOrderIndex === 7) {
        counters.currentPomodoroIntervalIndex = 2;
        counters.currentPomodoroNotification = timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex];
    }
}

async function setPomodoroIntervalArr(event, timeAmount, validatedFinalInputVal, counters, productivity_chill_mode, flags, newIntervalArr) {
    if (event.target.id === 'pomodoroInput') {
        newIntervalArr[0] = validatedFinalInputVal;
        timeAmount.pomodoroIntervalArr[0] = validatedFinalInputVal;
        if ((counters.currentPomodoroIntervalIndex === 0) && (counters.startStop !== 0) && (flags.pomodoroNotificationToggle) && (flags.inHyperFocus)) {
            productivity_chill_mode.innerText = setPomodoroIntervalText(counters, timeAmount);
        }
    } else if (event.target.id === 'shortBreakInput') {
        newIntervalArr[1] = validatedFinalInputVal;
        timeAmount.pomodoroIntervalArr[1] = validatedFinalInputVal;
        if ((counters.currentPomodoroIntervalIndex === 1) && (counters.startStop !== 0) && (flags.pomodoroNotificationToggle)) {
            productivity_chill_mode.innerText = setBreakIntervalText(counters, timeAmount);
        }
    } else if (event.target.id === 'longBreakInput') {
        newIntervalArr[2] = validatedFinalInputVal;
        timeAmount.pomodoroIntervalArr[2] = validatedFinalInputVal;
        if ((counters.currentPomodoroIntervalIndex === 2) && (counters.startStop !== 0) && (flags.pomodoroNotificationToggle)) {
            productivity_chill_mode.innerText = "Long Break | " + String(timeAmount.pomodoroIntervalArr[2]) + " min";
        }
    }

    if (sessionState.loggedIn) {
        await updateUserSettings({
            pomodoro: {
                intervalArr: newIntervalArr
            }
        });
    }
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

function setSuggestionMinutes(startTimes, flags, elapsedTime, timeAmount) {
    let elapsedTimeInHyperfocus = Math.floor((Date.now() - startTimes.hyperFocus) / 1000); //unit: seconds
    if (!flags.inHyperFocus) {
        elapsedTime.suggestionSeconds = (timeAmount.suggestionMinutes * 60); //shallow copy suggestionMinutes to elapsedTime.suggestionSeconds (saves state)
    } else {
        elapsedTime.suggestionSeconds = ((timeAmount.suggestionMinutes * 60) - elapsedTimeInHyperfocus);
        suggestionWorker.postMessage("clearInterval");
        suggestionWorker.postMessage(elapsedTime.suggestionSeconds);
    }
}

function validateAndSetNotificationInput(finalInputVal) {
    if (finalInputVal > 720) {
        finalInputVal = 720; // 720 minutes === 12 hours
    } else if (finalInputVal < 1 || isNaN(finalInputVal) || finalInputVal === undefined) {
        finalInputVal = 1;
    }
    return finalInputVal;
}

// Volume toggle doesn't affect volume on mobile
function playAlertSound(soundType, notificationSettingType, alertVolumes) {
    if (notificationSettingType === "flowmodoro") {
        soundType.volume = alertVolumes.flowmodoro;
    } else if (notificationSettingType === "general") {
        soundType.volume = alertVolumes.general;
    } else if (notificationSettingType === "pomodoro") {
        soundType.volume = alertVolumes.pomodoro;
    }
    soundType.play();
    // alert(soundType.volume);
}

export function pauseAndResetAlertSounds(bell, chime) {
    bell.pause();
    bell.currentTime = 0;
    chime.pause();
    chime.currentTime = 0;
}

// Function to hide all settings containers and remove 'selected' class from all buttons
async function alertVolumeChange(volumeContainerType, alertVolumes, volumeThumbType, volumeBarType, volumeThumbType2, volumeBarType2, event, flags) {
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

function handleMouseDown(event, flagKey) {
    flags[flagKey] = true;
    event.preventDefault();
}

function handleMouseMove(event) {
    // Convert touch event to mouse event
    if (event.type === 'touchmove') {
        event = event.touches[0];
    }

    if (flags.flowmodoroThumbIsDragging) {
        alertVolumeChange(flowmodoroVolumeContainer, alertVolumes, flowmodoroVolumeThumb, flowmodoroVolumeBar, flowmodoroVolumeThumb2, flowmodoroVolumeBar2, event, flags);
    } else if (flags.flowmodoroThumbIsDragging2) {
        alertVolumeChange(flowmodoroVolumeContainer2, alertVolumes, flowmodoroVolumeThumb, flowmodoroVolumeBar, flowmodoroVolumeThumb2, flowmodoroVolumeBar2, event, flags);
    } else if (flags.generalThumbIsDragging) {
        alertVolumeChange(generalVolumeContainer, alertVolumes, generalVolumeThumb, generalVolumeBar, generalVolumeThumb2, generalVolumeBar2, event, flags);
    } else if (flags.generalThumbIsDragging2) {
        alertVolumeChange(generalVolumeContainer2, alertVolumes, generalVolumeThumb, generalVolumeBar, generalVolumeThumb2, generalVolumeBar2, event, flags);
    } else if (flags.pomodoroThumbIsDragging) {
        alertVolumeChange(pomodoroVolumeContainer, alertVolumes, pomodoroVolumeThumb, pomodoroVolumeBar, pomodoroVolumeThumb2, pomodoroVolumeBar2, event, flags);
    } else if (flags.pomodoroThumbIsDragging2) {
        alertVolumeChange(pomodoroVolumeContainer2, alertVolumes, pomodoroVolumeThumb, pomodoroVolumeBar, pomodoroVolumeThumb2, pomodoroVolumeBar2, event, flags);
    }
}

function handleMouseUp(event) {
    // Convert touch event to mouse event
    if (event.type === 'touchend') {
        event = event.changedTouches[0];
    }

    if (flags.flowmodoroThumbIsDragging || flags.flowmodoroThumbIsDragging2) {
        handleAlertSoundAndUpdate('flowmodoro', 'flowmodoroThumbIsDragging', 'flowmodoroThumbIsDragging2');
    } else if (flags.generalThumbIsDragging || flags.generalThumbIsDragging2) {
        handleAlertSoundAndUpdate('general', 'generalThumbIsDragging', 'generalThumbIsDragging2');
    } else if (flags.pomodoroThumbIsDragging || flags.pomodoroThumbIsDragging2) {
        handleAlertSoundAndUpdate('pomodoro', 'pomodoroThumbIsDragging', 'pomodoroThumbIsDragging2');
    } else {
        if (event.target.className !== 'flowmodoroAlert' && event.target.className !== 'generalAlert' && event.target.className !== 'pomodoroAlert' && event.target.className !== 'volume-thumb' && document.getElementById("settingsContainer").style.display === "block") {
            pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);
        }
    }
}

async function handleAlertSoundAndUpdate(type, draggingFlag, draggingFlag2) {
    if (alertSounds[type] === 'chime') {
        pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);
        playAlertSound(soundMap.Chime, type, alertVolumes);
    } else if (alertSounds[type] === 'bell') {
        pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);
        playAlertSound(soundMap.Bell, type, alertVolumes);
    }
    flags[draggingFlag] = false;
    flags[draggingFlag2] = false;

    if (sessionState.loggedIn) {
        let update = {};
        update[type === 'pomodoro' ? 'pomodoro' : type === 'general' ? 'flowTime' : 'chillTime'] = {
            alertVolume: alertVolumes[type]
        };
        await updateUserSettings(update);
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

export function handleViewportWidthChange(settingsMappings, tempStorage) {
    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    if (viewportWidth <= 650) {
        showAllSettingsContainers(settingsMappings);
    } else {
        for (const [buttonId, containerId] of Object.entries(settingsMappings)) {
            document.getElementById(buttonId).addEventListener('click', function() {
                // console.log(buttonId);
                hideAllSettingsContainers(settingsMappings);
                document.getElementById(containerId).style.display = 'block';
                this.classList.add('selected');
            });
        }

        // console.log(document.getElementById("settingsContainer").style.display);
        if (document.getElementById("settingsContainer").style.display === 'block') {
            document.getElementById(tempStorage.lastSettingsSelectionId).click();
        }
    }

    if (tempCounters.dashboardCatIdsArrIndex === 5) {
        if ((viewportWidth <= 670) && (dashboardFlags.calendarPopupShowing)) {
            document.getElementById('dashboardCat6').style.display = 'none';
        } else {
            document.getElementById('dashboardCat6').style.display = 'flex';
        }
    }
}


// Show suggestion break container AND sets current flowmodoro notification
function showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, timeAmount, counters, flags) {
    suggestionBreakContainer.style.display = 'flex';

    setCurrentFlowmodoroNotification(flags, counters, timeAmount);
    changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters);
}

function setCurrentFlowmodoroNotification(flags, counters, timeAmount) {
    if (flags.lastHyperFocusIntervalMin >= 90) {
        counters.currentFlowmodoroNotification = timeAmount.breakTimeSuggestionsArr[3];
    } else if (flags.lastHyperFocusIntervalMin >= 50) {
        counters.currentFlowmodoroNotification = timeAmount.breakTimeSuggestionsArr[2];
    } else if (flags.lastHyperFocusIntervalMin >= 25) {
        counters.currentFlowmodoroNotification = timeAmount.breakTimeSuggestionsArr[1];
    } else {
        counters.currentFlowmodoroNotification = timeAmount.breakTimeSuggestionsArr[0];
    }
}

async function setBreakTimeSuggestionsArr(event, timeAmount, validatedFinalInputVal, counters, newIntervalArr) {
    if (event.target.id === 'flowmodoroBreakInput1') {
        newIntervalArr[0] = validatedFinalInputVal;
        timeAmount.breakTimeSuggestionsArr[0] = validatedFinalInputVal;
        counters.currentFlowmodoroBreakIndex = 0;
    } else if (event.target.id === 'flowmodoroBreakInput2') {
        newIntervalArr[1] = validatedFinalInputVal;
        timeAmount.breakTimeSuggestionsArr[1] = validatedFinalInputVal;
        counters.currentFlowmodoroBreakIndex = 1;
    } else if (event.target.id === 'flowmodoroBreakInput3') {
        newIntervalArr[2] = validatedFinalInputVal;
        timeAmount.breakTimeSuggestionsArr[2] = validatedFinalInputVal;
        counters.currentFlowmodoroBreakIndex = 2;
    } else if (event.target.id === 'flowmodoroBreakInput4') {
        newIntervalArr[3] = validatedFinalInputVal;
        timeAmount.breakTimeSuggestionsArr[3] = validatedFinalInputVal;
        counters.currentFlowmodoroBreakIndex = 3;
    }

    if (sessionState.loggedIn) {
        await updateUserSettings({
            chillTime: {
                intervalArr: newIntervalArr
            }
        });
    }
}

function changeSuggestionBreakContainerHeader(flags, suggestionBreak_label, suggestionBreak_min, counters) {
    if (flags.flowmodoroNotificationToggle) {
        suggestionBreak_label.textContent = "🔔 Break";
    } else {
        suggestionBreak_label.textContent = "Suggested Break";
    }
    suggestionBreak_min.textContent = counters.currentFlowmodoroNotification + " min";
}

export function hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label) {
    suggestionBreakContainer.style.display = 'none';
}

function hideInterruptionsSubContainer(interruptionsSubContainer) {
    interruptionsSubContainer.style.display = 'none';
}

export function showInterruptionsSubContainer(interruptionsSubContainer) {
    interruptionsSubContainer.style.display = 'flex';
}

function saveResetInterruptions(interruptionsNum, counters, savedInterruptionsArr) {
    savedInterruptionsArr.push(counters.interruptions);
    resetInterruptions(counters, interruptionsNum);
}

function resetInterruptions(counters, interruptionsNum) {
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
    const minutes = String(date.getMinutes()).padStart(2, '0'); // ensure two digits
    const suffix = date.getHours() >= 12 ? 'PM' : 'AM';

    // Combine the parts into a time string
    const timeString = `${hours}:${minutes} ${suffix}`;

    return timeString;
}

function playAlertSoundCountdown(chime, bell, alertSoundType, alertVolumeType) {
    pauseAndResetAlertSounds(soundMap.Bell, soundMap.Chime);
    if (alertSoundType === 'chime') {
        chime.volume = alertVolumeType;
        chime.play().then(() => {
            console.log('Playback started successfully');
        }).catch(error => {
            console.error('Playback was prevented:', error);
        });
    } else if (alertSoundType === 'bell') {
        bell.volume = alertVolumeType;
        bell.play().then(() => {
            console.log('Playback started successfully');
        }).catch(error => {
            console.error('Playback was prevented:', error);
        });
    }
}

//For some reason, EDGE won't prompt the user to turn on notifications if they're set to default :/
async function enableNotifications() {
    // Check if notifications are supported
    if (!("Notification" in window)) {
        alert("This browser does not support push notifications");
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

async function changeTargetHours(flags, sessionState, timeAmount) {
    flags.submittedTarget = false;
    timeAmount.targetTime = null;
    
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
    
    if (sessionState.loggedIn) {
        await updateTargetHours(0);
    }
};

function targetHoursValidate(inputHours, timeConvert, startTimes, elapsedTime, flags, counters) {
    const roundedHours = Math.round((parseFloat(inputHours)) * 100) / 100;
    if (!inputHours || roundedHours <= 0 || roundedHours > 24 || (roundedHours * 60 * 60 * 1000) <= getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes)) {
        
        if (counters.startStop !== 0) { //if not very start of program
            if (flags.inHyperFocus) { //if not at very start and in hyper focus
                alert("Enter a valid target time between " + Math.ceil((parseFloat((elapsedTime.hyperFocus + (Date.now() - startTimes.local)) / timeConvert.msPerHour)) * 100) / 100 + " hours and 24 hours");
            }
            else if (!flags.inHyperFocus) { //if not at very start and in break
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

// Latest edit: removed flags.inHyperFocus = stop_start === "Stop";
export function setButtonTextAndMode(start_stop_btn, productivity_chill_mode, stop_start, hf_ct) {
    start_stop_btn.innerText = stop_start;
    productivity_chill_mode.innerHTML = `<b>${hf_ct}</b>`;
};

export function updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer) {
    let timeDiff;
    // console.log(timeDiff)
    
    if (isNaN(timeAmount.targetTime) || timeAmount.targetTime === null || !flags.submittedTarget) { //if user doesn't input target time, break out
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
    
    let percentage = timeDiff / timeAmount.targetTime;
    
    if (percentage > 1) {
        percentage = 1; //cap percentage at 100%
    }
    
    if (timeAmount.targetTime !== 0 && percentage >= 1 && !flags.hitTarget) { //when target time is hit
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

export function resetDisplay(display) {
    display.innerText = "00:00:00"; //immediately resets display w/ no lag time
};

function veryStartActions(startTimes, flags, times, counters, interruptionsNum) {
    let currentTime = Date.now();
    resetInterruptions(counters, interruptionsNum); // reset distractions
    startTimes.beginning = currentTime;
    times.start = currentTime;
    flags.sessionInProgress = true;
    setBrowserTabTitle(); //sets browser tab title to the stopwatch time '00:00:00'
    document.getElementById("target-hours").classList.remove("glowing-effect");
};


function playClick(clock_tick, flags) {
    if (flags.transitionClockSoundToggle == true) {
        clock_tick.volume = 0.25; //lowering volume of soundgetTotalElapsed
        clock_tick.play();
    }
};

function handleEnter(event, start_stop_btn, submit_change_btn, createLabelInput, updateLabelInput, flags) {

    if ((event.key === 'Enter') && (!flags.enterKeyDown) && (state.lastSelectedMode === 'home')) {
        event.preventDefault();
        flags.enterKeyDown = true;
        
        if (document.activeElement.id === 'target-hours') {
            submit_change_btn.click();
        } else if (document.activeElement === loginPasswordInput) {
            loginBtn.click();
        } else if (document.activeElement === createLabelInput) {
            // DO NOTHING - code for this event is implemented in notes.js instead
        } else if (document.activeElement === updateLabelInput) {
            // DO NOTHING - code for this event is implemented in notes.js instead
        } else if (document.activeElement.className == "noteInput") {
            // DO NOTHING - code for this event is implemented in notes.js instead
        } else if (document.activeElement.id == "note-task-input-text") {
            // DO NOTHING - code for this event is implemented in notes.js instead  
        } else if (document.activeElement.id === "note-task-input-text-edit") {
            // DO NOTHING - code for this event is implemented in notes.js instead  
        } else if ((navFlags.sessionSummaryPopupShowing) || (navFlags.sessionSummarySignupPromptPopupShowing)) {
            // DO NOTHING
        } else {
            start_stop_btn.click();
        }
    } else if (event.key === 'ArrowLeft') {
        // DO NOTHING - code for this event is implemented in notes.js instead
    } else if (event.key === 'ArrowRight') {
        // DO NOTHING - code for this event is implemented in notes.js instead
    }
};

function handleKeyUp(event, flags) {
    if ((event.key === 'Enter') && (flags.enterKeyDown)) {
        flags.enterKeyDown = false;
    }
}

export function returnTotalTimeString(totalMilliseconds, timeConvert) {
    let hours = Math.floor(totalMilliseconds / timeConvert.msPerHour);
    let minutes = Math.floor((totalMilliseconds - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
    let seconds = Math.floor((totalMilliseconds - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);

    // Format the time values
    hours = String(hours);
    minutes = String(minutes);
    seconds = String(seconds);

    let combinedStr = hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
 
    return combinedStr;
}

export function getTotalElapsed(flags, elapsedTime, startTimes) { //return current total hyper focus time
    // console.log("Elapsed Time: " + elapsedTime);
    // console.log("Date.now() - startTimes: " + (Date.now() - startTimes));
    
    return flags.inHyperFocus ? (elapsedTime + (Date.now() - startTimes.local)) : elapsedTime;
};

function setTabTitleFromDisplay() {
    if (flags.pipWindowOpen) {
        document.title = pip.window.document.getElementById('display').innerText;
    } else {
        document.title = document.getElementById("display").innerText;
    }
};

function setBrowserTabTitle() {
    // Function to set the browser tab title based on the content of the #display div

    // Initially set the browser tab title
    if (flags.pipWindowOpen) {
        document.title = pip.window.document.getElementById('display').innerText;
        // Start observing the #display div for changes to its child nodes or subtree
        observer.observe(pip.window.document.getElementById("display"), {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        document.title = document.getElementById("display").innerText;
        // Start observing the #display div for changes to its child nodes or subtree
        observer.observe(document.getElementById("display"), {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

};

export function setFavicon(faviconPath) {
    let favicon1 = document.getElementById("favicon1");
    let favicon2 = document.getElementById("favicon2");

    favicon1.href = faviconPath;
    favicon2.href = faviconPath;
}

function debuggingPopup(color) {
    let mainContainer = document.getElementById('mainContainer');

    // Create a new div element
    var newDiv = document.createElement('div');

    // Set the style properties of the new div
    newDiv.style.width = '50px';
    newDiv.style.height = '50px';
    newDiv.style.backgroundColor = color;
    newDiv.style.position = 'absolute';
    newDiv.style.innerText = 'Debugging Square';

    // Optionally, set the position of the div on the screen
    newDiv.style.top = '500px'; // adjust as needed
    newDiv.style.left = '100px'; // adjust as needed

    // Append the new div to the body
    mainContainer.appendChild(newDiv);
}

async function logLastIntervalSwitch(intervalSwitchCount, sessionStartTime) {
    await lastIntervalSwitch(intervalSwitchCount, sessionStartTime);
}

// ---------------------
// EXPORTED FUNCTIONS
// ---------------------

// needed to unlock the audio context to play the alert automatically on mobile
export function triggerSilentAlertAudioMobile(chime, bell, chimePath, bellPath, flags) {
    if (!flags.triggeredSilentAudio) {
        // Set volume to 0
        chime.volume = 0;
        bell.volume = 0;
    
        // Ensure the audio is muted
        chime.muted = true;
        bell.muted = true;
    
        // Play the audio and ensure it is silent
        chime.play().then(() => {
            chime.pause(); // Immediately pause it to ensure it's loaded
            chime.muted = false; // Unmute for future plays
            chime.currentTime = 0; // Reset to start
        }).catch(error => {
            console.error('Chime playback error:', error);
        });
    
        bell.play().then(() => {
            bell.pause(); // Immediately pause it to ensure it's loaded
            bell.muted = false; // Unmute for future plays
            bell.currentTime = 0; // Reset to start
        }).catch(error => {
            console.error('Bell playback error:', error);
        });

        const Chime = new Audio(chimePath);
        const Bell = new Audio(bellPath);
    
        soundMap.Chime = Chime;
        soundMap.Bell = Bell;

        flags.triggeredSilentAudio = true;
    }
}

export function setInitialBackgroundCellSelection() {
    document.getElementById(selectedBackgroundId.flowtime).classList.add('selected-background');
    document.getElementById(selectedBackgroundId.chilltime).classList.add('selected-background');
}

export function setBackground(background_color, opacity) {
    if (flags.inHyperFocus) {
        breakBackground.style.opacity = 0; // alt fades out, revealing dw background

        deepWorkBackground.style.backgroundImage = background_color;
        deepWorkBackground.style.opacity = opacity; // 1 (permenant for rest of session

        if (flags.pipWindowOpen) {
            pip.window.document.body.style.backgroundImage = background_color;
        }

    } else {
        breakBackground.style.backgroundImage = background_color;
        breakBackground.style.opacity = 1; // alt fades in (on top of dw background)

        if (flags.pipWindowOpen) {
            pip.window.document.body.style.backgroundImage = background_color;
        }
    }
}


export function deactivateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer, isMobile, streaksContainer, lightHtmlBackground) {
    let componentArr1 = [interruptionsContainer, targetHoursContainer, timekeepingContainer, notesContainer, aboutContainer, blogContainer, streaksContainer];

    let darkBackgroundTranslucent = "rgba(0, 0, 0, 0.9)"; // changed from 0.8 alpha value
    let darkBackground = "rgb(0, 0, 0)";
    let progressBarBackground = "rgba(255, 255, 255, 0.25)";
    let progressBarBorder = "1px rgba(0, 0, 0, 0.25)";
    let emojiContainerBlackBackground = "#000000";

    componentArr1.forEach(function(component) {
        component.style.backgroundColor = darkBackgroundTranslucent;

        if (component !== streaksContainer) {
            component.style.border = null;
        }
    })

    // dealing w/ popup menu
    if (!isMobile) {
        popupMenu.style.backgroundColor = darkBackgroundTranslucent;
    } else {
        popupMenu.style.backgroundColor = darkBackground;
    }
    popupMenu.style.border = null;

    notesContainer.style.marginTop = "0px";

    progressBarContainer.style.backgroundColor = progressBarBackground;
    progressBarContainer.style.border = progressBarBorder;

    settingsContainer.style.backgroundColor = darkBackground;

    emojiContainer.style.backgroundColor = emojiContainerBlackBackground;
    emojiContainer.style.border = "5px solid #FFFFFF";

    document.documentElement.style.backgroundImage = lightHtmlBackground; // set html background

    if (flags.pipWindowOpen) {
        pip.window.document.body.style.backgroundImage = ''; // removing body image
    }

    if ((selectedBackgroundId.flowtime === "black-flowtime") && (selectedBackgroundId.chilltime === "black-chilltime")) {
        document.getElementById(selectedBackgroundIdTemp.flowtime).click();
        document.getElementById(selectedBackgroundIdTemp.chilltime).click();
    }
};

export async function activateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer, streaksContainer, darkHtmlBackground) {
    let componentArr1 = [interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, notesContainer, aboutContainer, blogContainer, streaksContainer];
    let componentArr2 = [popupMenu, settingsContainer, emojiContainer];

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

    emojiContainer.style.border = "5px solid white";

    notesContainer.style.marginTop = "-3px"; // fixed issue w/ notes container location being affected by dark mode

    document.documentElement.style.backgroundImage = darkHtmlBackground; // set html background

    if (!sessionState.updatingState) {
        selectedBackgroundIdTemp["flowtime"] = selectedBackgroundId.flowtime;
        selectedBackgroundIdTemp["chilltime"] = selectedBackgroundId.chilltime;
    
        // want to trigger visual change (immediately) - no delay
        let darkBackgroundStr = 'linear-gradient(90deg, #202020, #202020, #202020)';
        if (flags.inHyperFocus) {
            setBackground(darkBackgroundStr, 1);
        } else if ((!flags.inHyperFocus) && (counters.startStop >= 1)) {
            setBackground(darkBackgroundStr, 1);
        }

        if (flags.pipWindowOpen) {
            pip.window.document.body.style.backgroundImage = 'linear-gradient(90deg, #202020, #202020, #202020)';
        }

        // update database
        if (sessionState.loggedIn) {
            await updateUserSettings({
                backgroundsThemes: {
                    flowTimeBackgroundTemp: selectedBackgroundId.flowtime,
                    chillTimeBackgroundTemp: selectedBackgroundId.chilltime
                }
            });
        }

        // update program state after updating database
        blackFlowtimeBackground.click();
        blackChilltimeBackground.click();
    }
}

export function replaceTargetHours(inputHours, timeAmount, flags) {

    let targetHours = Math.round((parseFloat(inputHours)) * 100) / 100; //return to 100 after testing
    timeAmount.targetTime = targetHours * 60 * 60 * 1000; //converting hours -> milliseconds
    document.getElementById("target-hours").remove();

    let submitTarget = document.createElement('h4');
    submitTarget.textContent = targetHours;
    submitTarget.id = "target-hours";
    submitTarget.className = "finalized-hours";
    submitTarget.style.backgroundColor = "#5c5c5c"; //dark grey finalized background color
    document.getElementById("coolDiv").appendChild(submitTarget);
    document.getElementById('target-hours-submit').textContent = "Change";

    flags.submittedTarget = true;

    return targetHours;
};

export function totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod) {
    let timeDiff = Math.round(getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes) / 1000) * 1000;

    // if 24 hours reached, end session
    if (timeDiff >= 86400000) {
        setTimeout(() => {
            end_session_btn.click();
        }, 0)
    }
    
    let hours = Math.floor(timeDiff / timeConvert.msPerHour);
    let minutes = Math.floor((timeDiff - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
    let seconds = Math.floor((timeDiff - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);

    // Format the time values
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    // console.log(flags.submittedTarget);

    if (flags.submittedTarget) {

        let percentage = timeDiff / timeAmount.targetTime;
        if (percentage > 1) {
            percentage = 1; //cap percentage at 100%
        }

        let defaultStr = `${hours}:${minutes}:${seconds}` + " (" + Math.trunc(percentage * 100) + "%) completed";
        progressTextMod.defaultTimeStr = defaultStr;

        // NEW STUFF
        let timeLeft = timeAmount.targetTime - timeDiff;
        let timeLeftHours = Math.floor(timeLeft / timeConvert.msPerHour);
        let timeLeftMinutes = Math.floor((timeLeft - timeLeftHours * timeConvert.msPerHour) / timeConvert.msPerMin);
        let timeLeftSeconds = Math.ceil((timeLeft - timeLeftHours * timeConvert.msPerHour - timeLeftMinutes * timeConvert.msPerMin) / timeConvert.msPerSec);

        // Format the time values
        timeLeftHours = String(timeLeftHours).padStart(2, '0');
        timeLeftMinutes = String(timeLeftMinutes).padStart(2, '0');
        timeLeftSeconds = String(timeLeftSeconds).padStart(2, '0');
        
        let timeLeftString;
        let timeLeftPercentage = timeLeft / timeAmount.targetTime;
        if (flags.hitTarget) {
            timeLeftString = `00:00:00 (0%) remaining`;
        } else {
            timeLeftString = `${timeLeftHours}:${timeLeftMinutes}:${timeLeftSeconds} (${Math.ceil(timeLeftPercentage * 100)}%) remaining`;
        }
        
        progressTextMod.targetTimeLeftStr = timeLeftString;
        // NEW STUFF

        if (progressTextMod.showingTimeLeft) {
            total_time_display.textContent = timeLeftString;
        } else {
            total_time_display.textContent = defaultStr;
        }

    } else {
        total_time_display.textContent = `${hours}:${minutes}:${seconds}`;
    }
};

export async function animationsFadeIn(animationType, displayType) {
    if (state.lastSelectedMode === 'home') {
        animationType.classList.add('intoOpacityTransition');
        animationType.style.display = displayType;
    }
};

export function animationsFadeOut(animationType) {
    animationType.classList.remove('intoOpacityTransition');
    setTimeout(() => {
        animationType.style.display = 'none';
    }, 0)
};