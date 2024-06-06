import { flowtimeBackgrounds, chilltimeBackgrounds, selectedBackground, selectedBackgroundIdTemp, selectedBackgroundId, timeConvert, intervals, startTimes, recoverBreakState, recoverPomState, elapsedTime, alertVolumes, alertSounds, counters, flags, tempStorage, settingsMappings, savedInterruptionsArr, timeAmount } from '../modules/index-objects.js';

import { chime, bell, clock_tick, soundMap } from '../modules/sound-map.js';

import {
    start_stop_btn, submit_change_btn, end_session_btn, report_btn, total_time_display, productivity_chill_mode, progressBarContainer, progressBar, progressContainer, display, hyperChillTitle, subMainContainer, interruptionsContainer, interruptionsSubContainer, decBtn, incBtn, interruptionsNum, suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, completedPomodorosContainer, completedPomodoros_label, completedPomodoros_min, targetHoursContainer, timekeepingContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, targetTimeReachedToggle, breakSuggestionToggle, suggestionMinutesInput, flowmodoroNotificationToggle,flowmodoroNotifications, flowmodoroNotificationInfoWindow, flowTimeBreakNotification, flowTimeBreakNotificationInfoWindow, pomodoroNotifications, pomodoroNotificationInfoWindow, notesAutoSwitch, notesAutoSwitchInfoWindow, pomodoroNotificationToggle, autoStartPomodoroIntervalToggle, autoStartBreakIntervalToggle, defaultThemeContainer, defaultTheme, darkThemeContainer, darkGrayTheme, targetTimeReachedAlert, transitionClockSoundToggle, flowTimeAnimationToggle, chillTimeAnimationToggle, pomodoroVolumeContainer, pomodoroVolumeBar, pomodoroVolumeThumb, flowmodoroVolumeContainer, flowmodoroVolumeBar, flowmodoroVolumeThumb, generalVolumeContainer, generalVolumeBar, generalVolumeThumb, pomodoroVolumeContainer2, pomodoroVolumeBar2, pomodoroVolumeThumb2, flowmodoroVolumeContainer2, flowmodoroVolumeBar2, flowmodoroVolumeThumb2, generalVolumeContainer2, generalVolumeBar2, generalVolumeThumb2, flowmodoroRadios, flowmodoroInputs, generalRadios, pomodoroInputs, pomodoroRadios,flowtimeBackgroundCells, chilltimeBackgroundCells, settings_menu_container, registerHereText, backgroundVideoSource, backgroundVideo, flowAnimation, chillAnimation, hyperChillLogoImage,createLabelInput, updateLabelInput, emojiContainer, loginEmailInput, loginPasswordInput, forgotPasswordContainer, loginBtnContainer, loginBtn, logoutBtn, forgotPasswordSettings, propagateUnfinishedTasks, propagateUnfinishedTasksInfoWindow
} from '../modules/dom-elements.js';

import { initializeGUI } from '../utility/initialize_gui.js';
import { sessionState } from '../modules/state-objects.js';
import { updateUserSettings } from '../modules/update-settings.js';

const pomodoroWorker = new Worker('/js/displayWorkers/pomodoroWorker.js');
const suggestionWorker = new Worker('/js/displayWorkers/suggestionWorker.js');
const flowmodoroWorker = new Worker('/js/displayWorkers/flowmodoroWorker.js');
const displayWorker = new Worker('/js/displayWorkers/displayWorker.js');
const totalDisplayWorker = new Worker('/js/displayWorkers/totalDisplayWorker.js');

document.addEventListener("DOMContentLoaded", function() {

    document.documentElement.requestFullscreen();

    // Favicons
    const greenFavicon = "/images/logo/HyperChillLogoGreen.png";
    const blueFavicon = "/images/logo/HyperChillLogoBlue.png";

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;

    // not used; initialized for reference
    let pomodoroIntervalOrderArr = ['pom1', 'shortbreak1', 'pom2', 'shortbreak2', 'pom3', 'shortbreak3', 'pom4', 'longbreak'];

    const radioGroups = [
        { radios: flowmodoroRadios, type: 'flowmodoro' },
        { radios: generalRadios, type: 'general' },
        { radios: pomodoroRadios, type: 'pomodoro' }
    ];

    // ----------------
    // MAIN CODE (Runs after DOM content is loaded)
    // ----------------

    //Safari on iPad Pro acts like mobile (no push notifications) but identifies as desktop

    // INITIAL DOMContentLoaded FUNCTION CALLS
    setInitialEndSessionBtnText(initialViewportWidth, end_session_btn);

    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top

    if (isMobile) {
        // TBD
    }

    setInitialBackgroundCellSelection();

    setTimeout(() => {
        hyperChillTitle.style.opacity = '1';
        hyperChillTitle.classList.add('hyperChillTitleAnimation');

    }, 0)
    
    const threeWayToggle = document.getElementById('threeWayToggle');

    setTimeout(() => {
        subMainContainer.style.opacity = '1';
    }, 1000)
    
    setTimeout(() => {
        hyperChillTitle.classList.remove('hyperChillTitleAnimation');
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

    // ----------------
    // EVENT LISTENERS
    // ----------------
    document.addEventListener('keydown', (event) => handleEnter(event, start_stop_btn, submit_change_btn, createLabelInput, updateLabelInput, flags));
    document.addEventListener('keyup', (event) => handleKeyUp(event, flags));

    start_stop_btn.addEventListener("click", function() {
        
        counters.startStop++; //keep track of button presses (doesn't account for time recovery iterations)
        playClick(clock_tick, flags);
        resetDisplay(display);

        if (counters.startStop === 1) {
            veryStartActions(startTimes, hyperChillLogoImage, progressBarContainer, flags);
            startTimes.lastPomNotification = Date.now();
        } else {
            chillTimeToFirstPomodoro(flags, productivity_chill_mode, counters);
        }

        setLocalStartTime(flags, startTimes, recoverBreakState, recoverPomState);

        displayWorker.postMessage("clearInterval");
        displayWorker.postMessage("startInterval");

        start_stop_btn.classList.remove('glowing-effect');
        flags.pomodoroCountIncremented = false;
        
        if (!intervals.main) { // --> FLOW TIME
            // console.log(getCurrentTime() + " --> Entering Flow Time");
            flags.inHyperFocus = true;
            flags.sentFlowmodoroNotification = false;

            if (!flags.inRecoveryPom) {
                startTimes.hyperFocus = Date.now();
            }

            totalDisplayWorker.postMessage("startInterval");
            setFavicon(greenFavicon);
            flowTimeAnimationActions(counters, flags, chillAnimation, flowAnimation);
            hideSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min);
            hidePomodorosCompletedContainer(completedPomodorosContainer);
            showInterruptionsSubContainer(interruptionsSubContainer);
            setCurrentPomodoroNotification(counters, timeAmount);
            setBackground(selectedBackground.flowtime);
            flowmodoroAndBreakSuggestionActions(flags, elapsedTime, counters, timeAmount, flowmodoroWorker, suggestionWorker);
            intervals.main = setInterval(() => updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer), 1000); //repeatedly calls reference to updateProgressBar function every 1000 ms (1 second)

            if (flags.pomodoroNotificationToggle) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop", setPomodoroIntervalText(counters, timeAmount));
                setPomodoroWorker(flags, elapsedTime, counters, recoverPomState, pomodoroWorker);
            } else {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop","Flow Time");
            }

            if (counters.startStop > 1) { // runs first during first chill time interval
                elapsedTime.chillTime += Date.now() - startTimes.chillTime;
            }

            // backgroundVideoSource.src = "videos/cyan_gradient_480p.mp4";
            // backgroundVideo.load();

        } else { // --> CHILL TIME
            // console.log(getCurrentTime() + " --> Entering Chill Time");
            flags.inHyperFocus = false;
            flags.lastHyperFocusIntervalMin = Math.floor((Date.now() - startTimes.hyperFocus) / (1000 * 60));
            startTimes.chillTime = Date.now();
            setFavicon(blueFavicon);
            chillTimeAnimationActions(flags, flowAnimation, chillAnimation);

            // EDIT: temporary change to see total interruptions for my own data collection
            // saveResetInterruptions(interruptionsNum, counters, savedInterruptionsArr);

            hideInterruptionsSubContainer(interruptionsSubContainer);
            setBackground(selectedBackground.chilltime);

            // There's an automatic transition to Chill Time either starting at Date.now() (if both toggles are on)
            // or starting at Date.now() - displayTime (only auto start break is on)
            if (flags.inRecoveryBreak) {
                elapsedTime.hyperFocus = recoverBreakState.hyperFocusElapsedTime;
            }

            let previousHyperFocusElapsedTime = elapsedTime.hyperFocus;
            elapsedTime.hyperFocus += Date.now() - startTimes.hyperFocus;

            // console.log("startTimes.local: " + startTimes.local)

            if (flags.pomodoroNotificationToggle) {
                showPomodorosCompletedContainer(completedPomodorosContainer, completedPomodoros_label, completedPomodoros_min, counters);
                setHyperFocusElapsedTime(previousHyperFocusElapsedTime, timeAmount, counters, flags, elapsedTime);
                setCurrentPomodoroNotification(counters, timeAmount);
                recoverToBreakUpdateProgressBarAndTotalElapsed(flags, timeAmount, startTimes, elapsedTime, progressBar, progressContainer);
                setPomodoroNotificationSeconds(flags, elapsedTime, counters, recoverBreakState, pomodoroWorker);
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start", setBothBreakIntervalText(counters, timeAmount));
            } else {
                showSuggestionBreakContainer(suggestionBreakContainer, suggestionBreak_label, suggestionBreak_min, timeAmount, counters, flags);
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start", "Chill Time");
            }

            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount);
            flowmodoroAndBreakSuggestionActions(flags, elapsedTime, counters, timeAmount, flowmodoroWorker, suggestionWorker);
            
            clearInterval(intervals.main);
            intervals.main = null;

            totalDisplayWorker.postMessage("clearInterval");
        }

        flags.inRecoveryBreak = false;
        flags.inRecoveryPom = false;
        flags.sentSuggestionMinutesNotification = false;
        flags.autoSwitchedModes = false;

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

            timeAmount.targetTime = replaceTargetHours(inputHours, timeAmount, flags); //sets targetTime

            if (flags.progressBarContainerIsSmall) {
                progressBarContainer.classList.toggle("small"); // make progress container large
                flags.progressBarContainerIsSmall = false;
            }
            
            /* Update progress bar & percentage ONCE to demonstrate submitted change in Chill Time.
                In Flow Time, this code makes the change happen just a little bit faster. */
            updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer);
            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount);
            
            flags.hitTarget = false;
        }
        else if (flags.submittedTarget) { //When changing target hours
            if (flags.hitTarget) {
                progressContainer.classList.remove("glowing-effect");
            }

            changeTargetHours(flags);

            /* Update progress bar & percentage ONCE to demonstrate submitted change in Chill Time.
                In Flow Time, this code makes the change happen just a little bit faster. */
            updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer);
            totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount);
            
            /* The reason for this is that we don't want to bombard the user with progress container animations at the very start of the program :P */
            if (counters.startStop > 0) { // only if session has been started
                if (!flags.progressBarContainerIsSmall) { // and progress bar container is large
                    progressBarContainer.classList.toggle("small"); // make progress container small
                    flags.progressBarContainerIsSmall = true;
                }
            }
        }
    });

    suggestionMinutesInput.addEventListener("change", async function() {
        // Immediate actions w/ user's inputted value
        let inputSuggestionMinutes = suggestionMinutesInput.value;
        timeAmount.suggestionMinutes = Math.round(parseFloat(inputSuggestionMinutes));
        let validatedFinalInputVal = validateAndSetNotificationInput(timeAmount.suggestionMinutes);
        suggestionMinutesInput.value = validatedFinalInputVal;
        let secondsPassed;

        if (counters.startStop === 0) {
            secondsPassed = 0;
        } else {
            secondsPassed = Math.round((Date.now() - startTimes.hyperFocus) / 1000);
        }

        flags.sentSuggestionMinutesNotification = false;
        
        if (flags.breakSuggestionToggle) {
            setSuggestionMinutes(startTimes, flags, elapsedTime, validatedFinalInputVal, intervals, alertSounds, alertVolumes, chime, bell, start_stop_btn);
            
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

    notesAutoSwitch.addEventListener('click', function() {
        toggleInfoWindow(notesAutoSwitchInfoWindow, 'showingNotesAutoSwitchInfoWindow', flags);
    })

    propagateUnfinishedTasks.addEventListener('click', function() {
        toggleInfoWindow(propagateUnfinishedTasksInfoWindow, 'showingPropagateUnfinishedTasksInfoWindow', flags);
    })

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

    document.addEventListener('mouseup', async (event) => {
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

            if (sessionState.loggedIn) {
                await updateUserSettings({
                    chillTime: {
                        alertVolume: alertVolumes.flowmodoro
                    }
                });
            }
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

            if (sessionState.loggedIn) {
                await updateUserSettings({
                    flowTime: {
                        alertVolume: alertVolumes.general
                    }
                });
            }
            
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

            if (sessionState.loggedIn) {
                await updateUserSettings({
                    pomodoro: {
                        alertVolume: alertVolumes.pomodoro
                    }
                });
            }
            
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

    function addRemoveGlowingEffect(validatedFinalInputVal, secondsPassed, start_stop_btn) {
        if ((validatedFinalInputVal * 60) > (secondsPassed)) {
            start_stop_btn.classList.remove('glowing-effect');
        } else {
            start_stop_btn.classList.add('glowing-effect');
        }
    }

    radioGroups.forEach(group => {
        group.radios.forEach(radio => {
            radio.addEventListener('change', event => handleRadioChange(event, group.type, soundMap, bell, chime, alertSounds, alertVolumes));
        });
    });

    flowtimeBackgroundCells.forEach(background => {
        background.addEventListener('click', async function(event) {
            let newId = event.target.id;
            let priorId = selectedBackgroundId["flowtime"];
            document.getElementById(priorId).classList.remove('selected-background');

            selectedBackground.flowtime = flowtimeBackgrounds[newId];
            selectedBackgroundId.flowtime = newId;
            document.getElementById(event.target.id).classList.add('selected-background');

            if (flags.inHyperFocus) {
                setBackground(selectedBackground.flowtime);
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
    
    chilltimeBackgroundCells.forEach(background => {
        background.addEventListener('click', async function(event) {
            let newId = event.target.id;
            let priorId = selectedBackgroundId["chilltime"];
            document.getElementById(priorId).classList.remove('selected-background');
            
            selectedBackground.chilltime = chilltimeBackgrounds[newId];
            selectedBackgroundId.chilltime = newId;
            document.getElementById(event.target.id).classList.add('selected-background');

            if ((!flags.inHyperFocus)) {
                setBackground(selectedBackground.chilltime);
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

            timeAmount.suggestionMinutes = suggestionMinutesInput.value;
            setSuggestionMinutes(startTimes, flags, elapsedTime, timeAmount, intervals, alertSounds, alertVolumes, chime, bell, start_stop_btn);

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
                let pomodoroString = "Pomodoro #1 | " + (timeAmount.pomodoroIntervalArr[0]).toString() + " min";
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop", pomodoroString);
                elapsedTime.pomodoroNotificationSeconds = ((counters.currentPomodoroNotification * 60) - elapsedTimeInHyperfocus);
                pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
            }
            
            flags.pomodoroNotificationToggle = true;

        } else {
            flags.pomodoroNotificationToggle = false;
            pomodoroWorker.postMessage("clearInterval");
            start_stop_btn.classList.remove('glowing-effect');
            if (flags.inHyperFocus) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Stop","Flow Time");
            } else if (counters.startStop > 1) {
                setButtonTextAndMode(start_stop_btn, productivity_chill_mode, flags, "Start","Chill Time");
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
            if (!flags.inHyperFocus) {
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
        darkGrayTheme.classList.remove('selected-background');
        defaultTheme.classList.add('selected-background');
        flags.darkThemeActivated = false;

        deactivateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer);

        if (sessionState.loggedIn) {
            await updateUserSettings({
                backgroundsThemes: {
                    darkThemeActivated: flags.darkThemeActivated // false
                }
            });
        }
    })

    darkThemeContainer.addEventListener("click", async function() {
        defaultTheme.classList.remove('selected-background');
        darkGrayTheme.classList.add('selected-background');
        flags.darkThemeActivated = true;

        activateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer);

        if (sessionState.loggedIn) {
            await updateUserSettings({
                backgroundsThemes: {
                    darkThemeActivated: flags.darkThemeActivated // true
                }
            });
        }
    })

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
            if ((flags.inHyperFocus) && (flags.flowTimeAnimationToggle)) {
                setTimeout(() => {
                    flowAnimation.style.display = 'block';
                    flowAnimation.classList.add('intoOpacityTransition');
                }, 500);
            } else if ((!flags.inHyperFocus) && (flags.chillTimeAnimationToggle)) {
                if (counters.startStop > 0) {
                    setTimeout(() => {
                        chillAnimation.style.display = 'flex';
                        chillAnimation.classList.add('intoOpacityTransition');
                    }, 500);
                }
            }
        }
    });

    /**
     * setTimeout delay of 0 allows the event listener callback function in menu.js
     * dealing with opening the settings menu to execute first before
     * handleViewportWidthChange() is called so that handleViewportWidthChange()
     * recognizes that the display style of settingsContainer is === "block"
     */
    settings_menu_container.addEventListener("click", function() {
        setTimeout(() => {
            handleViewportWidthChange(settingsMappings, tempStorage, isMobile);
        }, 0);
    });

    registerHereText.addEventListener('click', function() {
        window.location.href = "/signup";
    });

    // report_btn.addEventListener("click", function() {
    //     alert("This feature is currently under development. Thank you for your patience.")
    // })

    end_session_btn.addEventListener("click", function() { //temporary function
        flags.sessionInProgress = false;

        // reset everything


        location.reload();
    });

    logoutBtn.addEventListener("click", async function() {
        logoutUser(sessionState);
    })

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

    loginBtn.addEventListener("click", async function() {
        addUser();
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
            body: JSON.stringify(user)
        })
        .then(response => {
            if (!response.ok) {
                alert("Your email or password is incorrect. Please try again.");
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // console.log("Server response:", response);
            return response.json();  // Assuming you want to process JSON response
        })
        .then(data => {
            
            // console.log("Server response:", data);
            if (data.loginSuccess === true) {
                // console.log("Login was successful")
                initializeGUI();
            }
        })
        .catch(error => {
            console.error(error);
            // Handle the error (e.g., display an error message to the user).
        });
    }

    forgotPasswordSettings.addEventListener("click", function() {
        window.location.href = "/reset-password";
    })

    // DISPLAY WORKERS

    pomodoroWorker.onmessage = function(message) {
        // console.log("pomodoroWorker.onmessage")
        if (!flags.modeChangeExecuted) {
            flags.modeChangeExecuted = true;
    
            new Notification(getPomodoroNotificationString(counters, timeAmount));
            
            playAlertSoundCountdown(chime, bell, alertSounds.pomodoro, alertVolumes.pomodoro);
            
            if ((counters.currentPomodoroIntervalIndex === 0) && (!flags.pomodoroCountIncremented)) {
                counters.pomodorosCompleted++;
                flags.pomodoroCountIncremented = true;
            }
    
            startTimes.lastPomNotification = Date.now();
            
            //IF AUTO START FLOW TIME INTERVAL OPTION IS SELECTED
            if (((flags.inHyperFocus) && (flags.autoStartBreakInterval)) || ((!flags.inHyperFocus) && (flags.autoStartPomodoroInterval))) {
                setTimeout(() => {
                    flags.autoSwitchedModes = true;
                    start_stop_btn.click();
                }, 0)
                return;
            } else {
                start_stop_btn.classList.add('glowing-effect');
            }
        }
    }

    suggestionWorker.onmessage = function(message) {
        if (!flags.sentSuggestionMinutesNotification) {
            sendSuggestionBreakNotification(timeAmount, startTimes, chime, bell, alertSounds, alertVolumes);
            flags.sentSuggestionMinutesNotification = true;
            start_stop_btn.classList.add('glowing-effect');
        }
    }
    
    flowmodoroWorker.onmessage = function(message) {
        if (!flags.sentFlowmodoroNotification) {
            sendFlowmodoroNotification(timeAmount, counters, startTimes, chime, bell, alertSounds, alertVolumes);
            flags.sentFlowmodoroNotification = true;
            start_stop_btn.classList.add('glowing-effect');
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

        timeRecovery(flags, counters, startTimes, elapsedTime, start_stop_btn, recoverPomState, recoverBreakState, timeAmount, total_time_display, timeConvert, progressBar, progressContainer, chime, bell, alertSounds, alertVolumes, completedPomodoros_label, completedPomodoros_min, flowmodoroWorker, suggestionWorker);
    }

    totalDisplayWorker.onmessage = function(message) {
        totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount);
    }

    document.dispatchEvent(new Event('defaultSettingsApplied'));
});

// ---------------------
// HELPER FUNCTIONS
// ---------------------

function timeRecovery(flags, counters, startTimes, elapsedTime, start_stop_btn, recoverPomState, recoverBreakState, timeAmount, total_time_display, timeConvert, progressBar, progressContainer, chime, bell, alertSounds, alertVolumes, completedPomodoros_label, completedPomodoros_min, flowmodoroWorker, suggestionWorker) {
    if (flags.pomodoroNotificationToggle) {
        if ((!flags.inHyperFocus) && ((counters.currentPomodoroNotification * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.modeChangeExecuted)) {
            flags.modeChangeExecuted = true;
            flags.autoSwitchedModes = false;
            chillTimeRecovery(flags, counters, elapsedTime, startTimes, start_stop_btn, recoverPomState, timeAmount, total_time_display, timeConvert, progressBar, progressContainer, chime, bell, alertSounds, alertVolumes, completedPomodoros_label, completedPomodoros_min);
        } else if ((flags.inHyperFocus) && ((counters.currentPomodoroNotification * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.modeChangeExecuted)) {
            flags.modeChangeExecuted = true;
            flags.autoSwitchedModes = false;
            flowTimeRecovery(flags, counters, elapsedTime, timeAmount, startTimes, start_stop_btn, recoverBreakState, chime, bell, alertSounds, alertVolumes);
        }
        
        // console.log("Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000: " + ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000)));
    } else {
        if ((flags.flowmodoroNotificationToggle) && (!flags.inHyperFocus) && ((counters.currentFlowmodoroNotification * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.sentFlowmodoroNotification)) {
            // console.log("TIME RECOVERY FOR FLOWMODORO")
            flowmodoroWorker.postMessage("clearInterval");
            sendFlowmodoroNotification(timeAmount, counters, startTimes, chime, bell, alertSounds, alertVolumes);
            flags.sentFlowmodoroNotification = true;
            start_stop_btn.classList.add('glowing-effect');
        }
        if ((flags.breakSuggestionToggle) && (flags.inHyperFocus) && ((timeAmount.suggestionMinutes * 60 * 1000) < ((Math.floor((Date.now() - startTimes.local) / 1000) * 1000) + 1000)) && (!flags.sentSuggestionMinutesNotification)) {
            // console.log("TIME RECOVERY FOR SUGGESTION MINUTES")
            suggestionWorker.postMessage("clearInterval");
            sendSuggestionBreakNotification(timeAmount, startTimes, chime, bell, alertSounds, alertVolumes);
            flags.sentSuggestionMinutesNotification = true;
            start_stop_btn.classList.add('glowing-effect');
        }
    }
}

function getPomodoroNotificationString(counters, timeAmount) {
    let notificationString;
    if (counters.currentPomodoroIntervalOrderIndex == 0 || counters.currentPomodoroIntervalOrderIndex == 2 || counters.currentPomodoroIntervalOrderIndex == 4) { // 1st-3rd pomodoro
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

function handleRadioChange(event, alertType, soundMap, bell, chime, alertSounds, alertVolumes) {
    const { target } = event;
    const soundTypes = Object.keys(soundMap); // ['NoAlert', 'Chime', 'Bell']

    soundTypes.forEach(soundType => {
        if (target.id === `${alertType}${soundType}Input` || target.id === `${alertType}${soundType}Input2`) {
            pauseAndResetAlertSounds(bell, chime);

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
    if ((flags.inRecoveryBreak) && !(flags.autoStartPomodoroInterval)) {
        elapsedTime.pomodoroNotificationSeconds = Math.round((counters.currentPomodoroNotification * 60) - ((recoverBreakState.displayTime / 1000) - 1));
    } else {
        elapsedTime.pomodoroNotificationSeconds = (counters.currentPomodoroNotification * 60);
    }
    pomodoroWorker.postMessage("clearInterval");
    pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
}

function recoverToBreakUpdateProgressBarAndTotalElapsed(flags, timeAmount, startTimes, elapsedTime, progressBar, progressContainer) {
    if (flags.inRecoveryBreak) {
        setTimeout(() => {
            updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer);
        }, 1000)

        if (getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes) < timeAmount.targetTime) {
            progressContainer.classList.remove("glowing-effect");
            flags.hitTarget = false;
        }
    }
}

function setHyperFocusElapsedTime(previousHyperFocusElapsedTime, timeAmount, counters, flags, elapsedTime) {
    let predictedTime = previousHyperFocusElapsedTime + (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60 * 1000);
    if (flags.autoSwitchedModes) {
        elapsedTime.hyperFocus = predictedTime;
    }
    // console.log(predictedTime);
    var milliseconds = elapsedTime.hyperFocus;
    elapsedTime.hyperFocus = Math.round(milliseconds / 1000) * 1000;   
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
        breakString  = "Short Break #1 | " + (timeAmount.pomodoroIntervalArr[1]).toString() + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 3) {
        breakString  = "Short Break #2 | " + (timeAmount.pomodoroIntervalArr[1]).toString() + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 5) {
        breakString  = "Short Break #3 | " + (timeAmount.pomodoroIntervalArr[1]).toString() + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 7) {
        breakString  = "Long Break | " + (timeAmount.pomodoroIntervalArr[2]).toString() + " min";
    } else {
        breakString = "Break Mode"; // catch all
    }

    // console.log(counters.currentFlowmodoroBreakIndex);

    return breakString;
}

// If pomodoro notification toggle is set BEFORE entering Flow Time
function setPomodoroWorker(flags, elapsedTime, counters, recoverPomState, pomodoroWorker) {
    if ((flags.inRecoveryPom) && !((flags.autoStartPomodoroInterval) && (flags.autoStartBreakInterval))) {
        elapsedTime.pomodoroNotificationSeconds = Math.round((counters.currentPomodoroNotification * 60) - ((recoverPomState.displayTime / 1000) - 1));
    } else {
        elapsedTime.pomodoroNotificationSeconds = (counters.currentPomodoroNotification * 60);
    }
    pomodoroWorker.postMessage("clearInterval");
    pomodoroWorker.postMessage(elapsedTime.pomodoroNotificationSeconds);
}

function setBreakIntervalText(counters, timeAmount) {
    let breakString;
    if (counters.currentPomodoroIntervalOrderIndex === 1) {
        breakString  = "Short Break #1 | " + (timeAmount.pomodoroIntervalArr[1]).toString() + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 3) {
        breakString  = "Short Break #2 | " + (timeAmount.pomodoroIntervalArr[1]).toString() + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 5) {
        breakString  = "Short Break #3 | " + (timeAmount.pomodoroIntervalArr[1]).toString() + " min";
    } else {
        breakString = "Break Mode"; // catch all
    }

    return breakString;
}

function setPomodoroIntervalText(counters, timeAmount) {
    let pomodoroString;
    if (counters.currentPomodoroIntervalOrderIndex === 0) {
        pomodoroString = "Pomodoro #1 | " + (timeAmount.pomodoroIntervalArr[0]).toString() + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 2) {
        pomodoroString = "Pomodoro #2 | " + (timeAmount.pomodoroIntervalArr[0]).toString() + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 4) {
        pomodoroString = "Pomodoro #3 | " + (timeAmount.pomodoroIntervalArr[0]).toString() + " min";
    } else if (counters.currentPomodoroIntervalOrderIndex === 6) {
        pomodoroString = "Pomodoro #4 | " + (timeAmount.pomodoroIntervalArr[0]).toString() + " min";
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
    if (flags.inRecoveryBreak) {
        startTimes.local = recoverBreakState.localStartTime; //could be equal to Date.now() or Date.now() - displayTime
    } else if (flags.inRecoveryPom) {
        startTimes.local = recoverPomState.localStartTime; //could be equal to Date.now() or Date.now() - displayTime
    } else {
        startTimes.local = Date.now();
    }
}

// If in pomodoro mode AND not coming from non-pomodoro mode,
// then we iterate the CurrentPomodoroIntervalOrderIndex
function chillTimeToFirstPomodoro(flags, productivity_chill_mode, counters) {
    if ((flags.pomodoroNotificationToggle) && (productivity_chill_mode.textContent !== "Chill Time")) {
        iterateCurrentPomodoroIntervalOrderIndex(counters);
    } 
}

function activateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer) {
    let componentArr1 = [interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, notesContainer, aboutContainer, blogContainer];
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

    selectedBackgroundIdTemp["flowtime"] = selectedBackgroundId.flowtime;
    selectedBackgroundIdTemp["chilltime"] = selectedBackgroundId.chilltime;

    blackFlowtimeBackground.click();
    blackChilltimeBackground.click();
}

function sendSuggestionBreakNotification(timeAmount, startTimes, chime, bell, alertSounds, alertVolumes) {
    let notificationString;
    if (timeAmount.suggestionMinutes > 1) {
        notificationString = "Need a break? You've been hard at work for " + timeAmount.suggestionMinutes.toString() + " minutes!";
    } else {
        notificationString = "Need a break? You've been hard at work for " + timeAmount.suggestionMinutes.toString() + " minute!";
    }
    new Notification(notificationString);
    startTimes.lastBreakSuggestionNotification = Date.now();

    playAlertSoundCountdown(chime, bell, alertSounds.general, alertVolumes.general);
}

function sendFlowmodoroNotification(timeAmount, counters, startTimes, chime, bell, alertSounds, alertVolumes) {
    let notificationString;
    if (timeAmount.breakTimeSuggestionsArr[counters.currentFlowmodoroBreakIndex] == 1) {
        notificationString = "It's been " + counters.currentFlowmodoroNotification + " minute! Are you ready to get back into Flow Time?";
    } else {
        notificationString = "It's been " + counters.currentFlowmodoroNotification + " minutes! Are you ready to get back into Flow Time?";
    }
    new Notification(notificationString);
    startTimes.lastFlowmodoroNotification = Date.now();
    
    playAlertSoundCountdown(chime, bell, alertSounds.flowmodoro, alertVolumes.flowmodoro);
}

function sendPomodoroDelayNotification(startTimes, counters, timeAmount, chime, bell, alertSounds, alertVolumes, flags) {
    let notificationString;
    if (counters.currentPomodoroIntervalOrderIndex == 0 || counters.currentPomodoroIntervalOrderIndex == 2 || counters.currentPomodoroIntervalOrderIndex == 4) { // 1st-3rd pomodoro
        if (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] == 1) {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minute! Are you ready to take a short break?";
        } else {
            notificationString = "It's been " + counters.currentPomodoroNotification + " minutes! Are you ready to take a short break?";
        }
        if (!flags.pomodoroCountIncremented) {
            counters.pomodorosCompleted++;
            // console.log(counters.pomodorosCompleted);
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
    new Notification(notificationString);
    
    playAlertSoundCountdown(chime, bell, alertSounds.pomodoro, alertVolumes.pomodoro);

    startTimes.lastPomNotification = Date.now();
}

function chillTimeRecovery(flags, counters, elapsedTime, startTimes, start_stop_btn, recoverPomState, timeAmount, total_time_display, timeConvert, progressBar, progressContainer, chime, bell, alertSounds, alertVolumes, completedPomodoros_label, completedPomodoros_min) {
    // INITIALIZING VARS
    // console.log("chilltime recovery initiated")
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
    if ((flags.autoStartPomodoroInterval) && ((((Math.round(displayTime / 1000)) - (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60)) <= 2) && (((Date.now() - startTimes.lastPomNotification) / 1000) > 30))) {
        sendPomodoroDelayNotification(startTimes, counters, timeAmount, chime, bell, alertSounds, alertVolumes, flags);
    }

    if ((flags.autoStartPomodoroInterval) && (flags.autoStartBreakInterval)) {
        displayTime -= timeAmount.pomodoroIntervalArr[currentPomodoro.intervalIndex] * 60 * 1000;

        if (currentPomodoro.intervalOrderIndex === 7) {
            currentPomodoro.intervalOrderIndex = 0;
        } else {
            currentPomodoro.intervalOrderIndex++;
        }

        setCurrentPomodoroNotificationRecovery(currentPomodoro, timeAmount);

        localStartTime = Date.now();
        startTimes.hyperFocus = localStartTime;
        
        setRecoverPomState(recoverPomState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn);
        setPomodoroIndexes(counters, currentPomodoro);

    } else if (flags.autoStartPomodoroInterval) {
        displayTime -= timeAmount.pomodoroIntervalArr[currentPomodoro.intervalIndex] * 60 * 1000;
        currentPomodoro.intervalOrderIndex++;
        setCurrentPomodoroNotificationRecovery(currentPomodoro, timeAmount);

        localStartTime = Date.now() - displayTime;
        // console.log(Date.now() - (Date.now() - displayTime))
        startTimes.hyperFocus = localStartTime;

        setRecoverPomState(recoverPomState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn);
        setPomodoroIndexes(counters, currentPomodoro);
    } else if ((((Math.round(displayTime / 1000)) - (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60)) <= 2) && (((Date.now() - startTimes.lastPomNotification) / 1000) > 30)) {
        // This evaluates when a the computer sleeps and then awakens during the same interval when autoswitchtobreak isn't turned on
        pomodoroWorker.postMessage("clearInterval");
        sendPomodoroDelayNotification(startTimes, counters, timeAmount, chime, bell, alertSounds, alertVolumes, flags);
        start_stop_btn.classList.add('glowing-effect');
    } else {
        start_stop_btn.classList.add('glowing-effect');
    }

    // recoveryDebuggingOutput(displayTime, currentPomodoro, pomodorosCompleted, hyperFocusElapsedTime, localStartTime);
}

/* 
    This function deals w/ the situation where the computer goes to sleep during a pomodoro interval
    and calculates the future state of the program based on which intervals should have occured.
*/
function flowTimeRecovery(flags, counters, elapsedTime, timeAmount, startTimes, start_stop_btn, recoverBreakState, chime, bell, alertSounds, alertVolumes) {
    // INITIALIZING VARS
    // console.log("flowtime recovery initiated")
    let displayTime = Date.now() - startTimes.local; // display time in milliseconds

    const currentPomodoro = {
        intervalIndex: counters.currentPomodoroIntervalIndex,
        intervalOrderIndex: counters.currentPomodoroIntervalOrderIndex,
        notification: counters.currentPomodoroNotification
    }
    let pomodorosCompleted = counters.pomodorosCompleted;
    let hyperFocusElapsedTime = elapsedTime.hyperFocus; // documented hyper focus time not including previous interval
    let localStartTime = startTimes.local;

    // if autoStartBreakInterval toggled on, and display time is 2s or less past the set interval time, and there's been at least 30s since the last pomodoro notification
    // console.log((timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60));
    if ((flags.autoStartBreakInterval) && ((((Math.round(displayTime / 1000)) - (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60)) <= 2) && (((Date.now() - startTimes.lastPomNotification) / 1000) > 30))) {
        sendPomodoroDelayNotification(startTimes, counters, timeAmount, chime, bell, alertSounds, alertVolumes, flags);
    }

    if ((flags.autoStartPomodoroInterval) && (flags.autoStartBreakInterval)) {
        displayTime -= timeAmount.pomodoroIntervalArr[currentPomodoro.intervalIndex] * 60 * 1000;
        if (!flags.pomodoroCountIncremented) {
            pomodorosCompleted++;
            flags.pomodoroCountIncremented = true;
        }
        currentPomodoro.intervalOrderIndex++;
        setCurrentPomodoroNotificationRecovery(currentPomodoro, timeAmount);
        
        hyperFocusElapsedTime -= displayTime; //for total display in chill time
        localStartTime = Date.now(); //effectively resets display time
        
        setRecoverBreakState(recoverBreakState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn);
        setPomodoroIndexes(counters, currentPomodoro);
    } else if (flags.autoStartBreakInterval) { //pomodoro --> sleep --> break end state (only one jump ahead)
        displayTime -= timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60 * 1000;
        if (!flags.pomodoroCountIncremented) {
            pomodorosCompleted++;
            flags.pomodoroCountIncremented = true;
        }
        currentPomodoro.intervalOrderIndex++;
        setCurrentPomodoroNotificationRecovery(currentPomodoro, timeAmount);
        
        hyperFocusElapsedTime -= displayTime;
        localStartTime = Date.now() - displayTime;
        // console.log(Date.now() - (Date.now() - displayTime))

        setRecoverBreakState(recoverBreakState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn);
        setPomodoroIndexes(counters, currentPomodoro);
    } else if ((((Math.round(displayTime / 1000)) - (timeAmount.pomodoroIntervalArr[counters.currentPomodoroIntervalIndex] * 60)) <= 2) && (((Date.now() - startTimes.lastPomNotification) / 1000) > 30)) {
        // This evaluates when a the computer sleeps and then awakens during the same interval when autoswitchtobreak isn't turned on
        pomodoroWorker.postMessage("clearInterval");
        sendPomodoroDelayNotification(startTimes, counters, timeAmount, chime, bell, alertSounds, alertVolumes, flags);
        start_stop_btn.classList.add('glowing-effect');
    } else { // when pom toggle turned after after time has passed pom interval time
        start_stop_btn.classList.add('glowing-effect');
        if (!flags.pomodoroCountIncremented) {
            counters.pomodorosCompleted++;
            flags.pomodoroCountIncremented = true;
        }
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
    
    if ((counters.pomodorosCompleted) < (recoverBreakState.pomodorosCompleted)) {
        counters.pomodorosCompleted = recoverBreakState.pomodorosCompleted;
    }
    flags.inRecoveryBreak = true;
    start_stop_btn.click();
}

function setRecoverPomState(recoverPomState, displayTime, pomodorosCompleted, hyperFocusElapsedTime, localStartTime, counters, flags, start_stop_btn) {
    recoverPomState.displayTime = displayTime;
    recoverPomState.pomodorosCompleted = pomodorosCompleted;
    recoverPomState.hyperFocusElapsedTime = hyperFocusElapsedTime;
    recoverPomState.localStartTime = localStartTime;
    
    counters.pomodorosCompleted = recoverPomState.pomodorosCompleted;
    flags.inRecoveryPom = true;

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

function setCurrentPomodoroNotificationRecovery(currentPomodoro, timeAmount) {
    if (currentPomodoro.intervalOrderIndex === 0 || currentPomodoro.intervalOrderIndex === 2 || currentPomodoro.intervalOrderIndex === 4 || currentPomodoro.intervalOrderIndex === 6) {
        currentPomodoro.intervalIndex = 0;
        currentPomodoro.notification = timeAmount.pomodoroIntervalArr[currentPomodoro.intervalIndex];
    } else if (currentPomodoro.intervalOrderIndex === 1 || currentPomodoro.intervalOrderIndex === 3 || currentPomodoro.intervalOrderIndex === 5) {
        currentPomodoro.intervalIndex = 1;
        currentPomodoro.notification = timeAmount.pomodoroIntervalArr[currentPomodoro.intervalIndex];
    } else if (currentPomodoro.intervalOrderIndex === 7) {
        currentPomodoro.intervalIndex = 2;
        currentPomodoro.notification = timeAmount.pomodoroIntervalArr[currentPomodoro.intervalIndex];
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
            productivity_chill_mode.innerText = "Long Break | " + (timeAmount.pomodoroIntervalArr[2]).toString() + " min";
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

function setSuggestionMinutes(startTimes, flags, elapsedTime, timeAmount, intervals, alertSounds, alertVolumes, chime, bell, start_stop_btn) {
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

    if (isMobile) {
        document.getElementById("pomodoroSettingsContainer").style.display = 'none';
        document.getElementById("flowmodoroSettingsContainer").style.display = 'none';
        document.getElementById("generalSettingsContainer").style.display = 'none';
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
        alert("This browser does not support desktop notifications or auto start functionality");
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

function replaceTargetHours(inputHours, timeAmount, flags) {

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

    return timeAmount.targetTime;
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

function updateProgressBar(timeAmount, startTimes, elapsedTime, flags, progressBar, progressContainer) {
    let timeDiff;
    
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

function resetDisplay(display) {
    display.innerText = "00:00:00"; //immediately resets display w/ no lag time
};

function veryStartActions(startTimes, hyperChillLogoImage, progressBarContainer, flags) {
    startTimes.beginning = Date.now();
    flags.sessionInProgress = true;
    setBrowserTabTitle(); //sets browser tab title to the stopwatch time '00:00:00'
    document.getElementById("target-hours").classList.remove("glowing-effect");
    hyperChillLogoImage.classList.add("hyperChillLogoRotate");

    if ((document.getElementById("target-hours").value == "") || ((!document.getElementById("target-hours").value == "") && (!flags.submittedTarget))) {
        progressBarContainer.classList.toggle("small");
        flags.progressBarContainerIsSmall = true;
    }
};

function playClick(clock_tick, flags) {
    if (flags.transitionClockSoundToggle == true) {
        clock_tick.volume = 0.25; //lowering volume of soundgetTotalElapsed
        clock_tick.play();
    }
};

function handleEnter(event, start_stop_btn, submit_change_btn, createLabelInput, updateLabelInput, flags) {

    if ((event.key === 'Enter') && (!flags.enterKeyDown)) {
        event.preventDefault();
        flags.enterKeyDown = true;
        
        if (document.activeElement.id === 'target-hours') {
            submit_change_btn.click();
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
        } else {
            flags.autoSwitchedModes = false;
            start_stop_btn.click();
        }
    }
};

function handleKeyUp(event, flags) {
    if ((event.key === 'Enter') && (flags.enterKeyDown)) {
        flags.enterKeyDown = false;
    }
}

function totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount) {
    let timeDiff = getTotalElapsed(flags, elapsedTime.hyperFocus, startTimes);
    
    let hours = Math.floor(timeDiff / timeConvert.msPerHour);
    let minutes = Math.floor((timeDiff - hours * timeConvert.msPerHour) / timeConvert.msPerMin);
    let seconds = Math.floor((timeDiff - hours * timeConvert.msPerHour - minutes * timeConvert.msPerMin) / timeConvert.msPerSec);

    // Format the time values
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    if (flags.submittedTarget) {
        let percentage = timeDiff / timeAmount.targetTime;
        
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

// ---------------------
// EXPORTED FUNCTIONS
// ---------------------

export function setInitialBackgroundCellSelection() {
    document.getElementById(selectedBackgroundId.flowtime).classList.add('selected-background');
    document.getElementById(selectedBackgroundId.chilltime).classList.add('selected-background');
}

export function setBackground(background_color) {
    document.body.style.backgroundImage = background_color;  // Set the background color back to red when started
    document.documentElement.style.backgroundImage = background_color;
};

export function deactivateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer) {
    let componentArr1 = [interruptionsContainer, targetHoursContainer, timekeepingContainer, notesContainer, aboutContainer, blogContainer, popupMenu];

    let darkBackgroundTranslucent = "rgba(0, 0, 0, 0.8)"; // changed from 0.35 alpha value
    let darkBackground = "rgb(0, 0, 0)";
    let progressBarBackground = "rgba(255, 255, 255, 0.25)";
    let progressBarBorder = "1px rgba(0, 0, 0, 0.25)";
    let emojiContainerBlackBackground = "#000000";

    componentArr1.forEach(function(component) {
        component.style.backgroundColor = darkBackgroundTranslucent;
        component.style.border = null;
    })

    progressBarContainer.style.backgroundColor = progressBarBackground;
    progressBarContainer.style.border = progressBarBorder;

    settingsContainer.style.backgroundColor = darkBackground;

    emojiContainer.style.backgroundColor = emojiContainerBlackBackground;
    emojiContainer.style.border = "5px solid #FFFFFF";

    if ((selectedBackgroundId.flowtime === "black-flowtime") && (selectedBackgroundId.chilltime === "black-chilltime")) {
        document.getElementById(selectedBackgroundIdTemp.flowtime).click();
        document.getElementById(selectedBackgroundIdTemp.chilltime).click();
    }
};