import { pomodoroNotificationToggle, pomodoroInputs, autoStartPomodoroIntervalToggle, autoStartBreakIntervalToggle, pomodoroVolumeThumb, pomodoroVolumeThumb2, pomodoroRadios, flowmodoroNotificationToggle, flowmodoroInputs, flowmodoroVolumeThumb, flowmodoroVolumeThumb2, flowmodoroRadios, breakSuggestionToggle, suggestionMinutesInput, generalRadios, targetTimeReachedToggle, darkGrayTheme, defaultTheme, interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, emojiContainer, flowTimeAnimationToggle, chillTimeAnimationToggle, transitionClockSoundToggle, labelSelectionRow, emojiImg, emojiImg2, dynamicList, propagateUnfinishedTasksToggle as propagateUnfinishedTasksToggleElement, blackFlowtimeBackground, blackChilltimeBackground, total_time_display, streaksContainer, labelInputContainer, tagIcon, promptContainer, clearIcon, addDoneContainer, tagSelectionDivider, taskPrompt, intervalTimeToggle, totalTimeToggle, muffinToggle as muffToggle, lightContainer, darkContainer } from '../modules/dom-elements.js';
import { sessionState } from '../modules/state-objects.js';
import { flags, timeAmount, alertVolumes, alertSounds, selectedBackgroundId, selectedBackground, flowtimeBackgrounds, chilltimeBackgrounds, selectedBackgroundIdTemp, startTimes, elapsedTime, timeConvert, progressTextMod, darkHtmlBackground, lightHtmlBackground } from '../modules/index-objects.js';
import { flags as notesflags, counters as notesCounters, state as notesState, labelDict, notesArr, selectedLabelDict, notesFlags, fontSizeArr, fontNumArr, labelFlags, labelArrs } from '../modules/notes-objects.js';

import { updateStreak } from '../utility/update-streaks.js';
import { setInitialBackgroundCellSelection, deactivateDarkTheme, activateDarkTheme, replaceTargetHours, totalTimeDisplay, intervalTimeToggleGUIUpdate, totalTimeToggleGUIUpdate } from '../main/index.js';
import { appendEditRemoveContainer, createCheckElements, getLastNumberFromId, addLabelInputContainerTagDivider, addLabelInitialActions, removeTagSelectionDivider, adjustLabelFontSize } from '../main/notes.js';
import { populateDashboard } from '../dashboard/populate-dashboard.js';

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const myFontBlog = {
    path: 'url(../fonts/CPMono_v07_Plain.woff)',
    name: "myFontBlog"
}

const myFont2 = {
    path: 'url(../fonts/CPMono_v07_Bold.woff)',
    name: "myFont2"
}

const myFont3 = {
    path: 'url(../fonts/CPMono_v07_Light.woff)',
    name: "myFont3"
}

const settingsHeaderFont = {
    path: 'url(../fonts/TTNormsProRegular.otf)',
    name: "settingsHeaderFont"
}

document.addEventListener('DOMContentLoaded', () => {
    checkUserSession()
        .catch(error => {
            // Handle the error here if needed
            console.error('Error in checkUserSession:', error);
        })
        .finally(() => {
            document.dispatchEvent(new Event('stateUpdated'));
        });
});

async function checkUserSession() {
    try {
        const response = await fetch('/api/state/sessionValidation', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        loadFonts([myFontBlog, myFont2, myFont3, settingsHeaderFont]);
        updateUserSession(data);
        return data;

    } catch (error) {
        console.error('Error validating user session:', error);
        throw error;
    }
}

async function updateUserSession(data) {
    if (data.isLoggedIn) {
        sessionState.loggedIn = true;
        sessionState.updatingState = true;
        await updateGUIForLoggedInUser(data.user, data.note, data.sessions);
        sessionState.updatingState = false;
    }
}

async function updateGUIForLoggedInUser(userData, noteData, sessionData) {

    // menu container (--> logged in version)
    updateMenuContainer();

    // menu question container (--> logged in version)
    updateQuestionMenuContainer(userData);

    // account settings page (--> logged in version)
    updateAccountSettingsTab(userData);

    // settings (--> logged in version)
    updateSettings(userData);

    // streak (--> logged in version)
    updateStreak(sessionData);

    // showing time left (--> logged in version)
    updateShowingTimeLeft(userData);
    
    // target hours (--> logged in version)
    updateTargetHours(userData);

    // labels (--> logged in version)
    updateUserLabels(noteData);
    
    // notes (--> logged in version)
    updateUserNotes(noteData);

    // dashboard (--> logged in version)
    populateDashboard(sessionData, noteData);
}

function updateShowingTimeLeft(userData) {
    const showingTimeLeft = userData.showingTimeLeft;
    progressTextMod.showingTimeLeft = showingTimeLeft;
}

function updateTargetHours(userData) {
    const targetHours = userData.targetHours;
    // console.log(targetHours); // Int or undefined

    if (targetHours !== undefined) {
        timeAmount.targetTime = targetHours * 60 * 60 * 1000;

        // update UI
        replaceTargetHours(targetHours, timeAmount, flags);
        totalTimeDisplay(startTimes, elapsedTime, total_time_display, timeConvert, flags, timeAmount, progressTextMod);

        progressBarContainer.classList.toggle("small");
        flags.progressBarContainerIsSmall = false;
    }
}

function updateMenuContainer() {
    document.getElementById('loginIcon').style.display = "none";
    document.getElementById('logoutIcon').style.display = "flex";
    document.getElementById('logInOutBtn').innerText = "Log Out";
}

function updateQuestionMenuContainer(userData) {
    document.getElementById('loginIcon2').style.display = "none";
    document.getElementById('accountIconFinal').style.display = "flex";
    document.getElementById('logInOutBtn2').innerText = userData.email;

    // account popup UI
    document.getElementById('questionPopupUserEmail').innerText = userData.email;

    if (userData.logins <= 1) {
        document.getElementById('welcomeText').innerText = "Welcome";
    } else {
        document.getElementById('welcomeText').innerText = "Welcome Back";
    }
}

function updateAccountSettingsTab(userData) {
    const hideElements = ['noAccountText', 'accountOr1', 'settingsGoogleLogin', 'accountOr2', 'emailPasswordLoginMainContainer', 'loginBtnContainer'];
    const showElements = ['userEmailContainer', 'logoutBtnContainer', 'accountHr', 'deleteAccountBtnContainer'];

    hideElements.forEach(id => document.getElementById(id).style.display = "none");
    showElements.forEach(id => document.getElementById(id).style.display = "flex");

    document.getElementById('userEmail').innerText = userData.email;
}

function updateSettings(userData) {
    updatePomodoro(userData);
    updateChillTime(userData);
    updateFlowTime(userData);

    updateBackgroundsThemes(userData);
    updateDisplay(userData);
    updateNotes(userData);
    updateSounds(userData);
}

// POMODORO
function updatePomodoro(userData) {
    updatePomodoroNotificationToggle(userData);
    updatePomodoroIntervalArr(userData);
    updateAutoStartIntervals(userData);
    updatePomodoroAlertVolume(userData);
    updatePomodoroAlertSound(userData);
}

function updatePomodoroNotificationToggle(userData) {
    const { notificationToggle } = userData.settings.pomodoro;

    // programmatic update
    flags.pomodoroNotificationToggle = notificationToggle;

    // GUI update
    pomodoroNotificationToggle.checked = notificationToggle;
}

function updatePomodoroIntervalArr(userData) {
    const { intervalArr } = userData.settings.pomodoro;

    // programmatic update
    timeAmount.pomodoroIntervalArr = intervalArr;

    // GUI update
    pomodoroInputs.forEach((input, index) => {
        input.value = intervalArr[index];
    });
}

function updateAutoStartIntervals(userData) {
    const { autoStartPomToggle, autoStartBreakToggle } = userData.settings.pomodoro;

    // auto start pom interval programmatic & GUI update
    flags.autoStartPomodoroInterval = autoStartPomToggle;
    autoStartPomodoroIntervalToggle.checked = autoStartPomToggle;
    
    // auto start break interval programmatic & GUI update
    flags.autoStartBreakInterval = autoStartBreakToggle;
    autoStartBreakIntervalToggle.checked = autoStartBreakToggle;
}

function updatePomodoroAlertVolume(userData) {
    const { alertVolume } = userData.settings.pomodoro;

    // programmatic update
    alertVolumes.pomodoro = alertVolume;

    // GUI update
    pomodoroVolumeThumb.style.left = (alertVolume * 100) + "%";
    pomodoroVolumeThumb2.style.left = (alertVolume * 100) + "%";
}

function updatePomodoroAlertSound(userData) {
    const { alertSound } = userData.settings.pomodoro;

    // programmatic update
    alertSounds.pomodoro = alertSound;

    // GUI update
    if (alertSound === "none") {
        pomodoroRadios[0].checked = true;
        pomodoroRadios[3].checked = true;
    } else if (alertSound === "chime") {
        pomodoroRadios[1].checked = true;
        pomodoroRadios[4].checked = true;
    } else if (alertSound === "bell") {
        pomodoroRadios[2].checked = true;
        pomodoroRadios[5].checked = true;
    }
}

// CHILL TIME
function updateChillTime(userData) {
    updateChillTimeNotificationToggle(userData);
    updateChillTimeIntervalArr(userData);
    updateChillTimeAlertVolume(userData);
    updateChillTimeAlertSound(userData);
}

function updateChillTimeNotificationToggle(userData) {
    const { notificationToggle } = userData.settings.chillTime;

    // programmatic update
    flags.flowmodoroNotificationToggle = notificationToggle;

    // GUI update
    flowmodoroNotificationToggle.checked = notificationToggle;
}

function updateChillTimeIntervalArr(userData) {
    const { intervalArr } = userData.settings.chillTime;

    // programmatic update
    timeAmount.breakTimeSuggestionsArr = intervalArr;

    // GUI update
    flowmodoroInputs.forEach((input, index) => {
        input.value = intervalArr[index];
    });
}

function updateChillTimeAlertVolume(userData) {
    const { alertVolume } = userData.settings.chillTime;

    // programmatic update
    alertVolumes.flowmodoro = alertVolume;

    // GUI update
    flowmodoroVolumeThumb.style.left = (alertVolume * 100) + "%";
    flowmodoroVolumeThumb2.style.left = (alertVolume * 100) + "%";
}

function updateChillTimeAlertSound(userData) {
    const { alertSound } = userData.settings.chillTime;

    // programmatic update
    alertSounds.flowmodoro = alertSound;

    // GUI update
    if (alertSound === "none") {
        flowmodoroRadios[0].checked = true;
        flowmodoroRadios[3].checked = true;
    } else if (alertSound === "chime") {
        flowmodoroRadios[1].checked = true;
        flowmodoroRadios[4].checked = true;
    } else if (alertSound === "bell") {
        flowmodoroRadios[2].checked = true;
        flowmodoroRadios[5].checked = true;
    }
}

// FLOW TIME
function updateFlowTime(userData) {
    updateFlowTimeNotificationToggle(userData);
    updateSuggestionMinutes(userData);
    updateFlowTimeAlertVolume(userData);
    updateFlowTimeAlertSound(userData);
    updateTargetTimeReachedToggle(userData, targetTimeReachedToggle);
}

function updateFlowTimeNotificationToggle(userData) {
    const { notificationToggle } = userData.settings.flowTime;

    // programmatic update
    flags.breakSuggestionToggle = notificationToggle;

    // GUI update
    breakSuggestionToggle.checked = notificationToggle;
}

function updateSuggestionMinutes(userData) {
    const { suggestionMinutes } = userData.settings.flowTime;

    // programmatic update
    timeAmount.suggestionMinutes = suggestionMinutes;

    // GUI update
    suggestionMinutesInput.value = suggestionMinutes;
}

function updateFlowTimeAlertVolume(userData) {
    const { alertVolume } = userData.settings.flowTime;

    // programmatic update
    alertVolumes.general = alertVolume;

    // GUI update
    generalVolumeThumb.style.left = (alertVolume * 100) + "%";
    generalVolumeThumb2.style.left = (alertVolume * 100) + "%";
}

function updateFlowTimeAlertSound(userData) {
    const { alertSound } = userData.settings.flowTime;

    // programmatic update
    alertSounds.general = alertSound;

    // GUI update
    if (alertSound === "none") {
        generalRadios[0].checked = true;
        generalRadios[3].checked = true;
    } else if (alertSound === "chime") {
        generalRadios[1].checked = true;
        generalRadios[4].checked = true;
    } else if (alertSound === "bell") {
        generalRadios[2].checked = true;
        generalRadios[5].checked = true;
    }
}

function updateTargetTimeReachedToggle(userData, targetReachedToggle) {
    const { targetTimeReachedToggle } = userData.settings.flowTime;

    // programmatic update
    flags.targetReachedToggle = targetTimeReachedToggle;

    // GUI update
    targetReachedToggle.checked = targetTimeReachedToggle;
}

// BACKGROUNDS & THEMES
function updateBackgroundsThemes(userData) {
    updateThemes(userData);
    updateBackgrounds(userData);
    updateAnimations(userData);
}

function updateThemes(userData) {
    const { darkThemeActivated } = userData.settings.backgroundsThemes;

    // programmatic updates
    flags.darkThemeActivated = darkThemeActivated;

    // GUI updates (removing hardcoded class)
    if (!flags.darkThemeActivated) {
        darkGrayTheme.classList.remove('selected-background');
        defaultTheme.classList.add('selected-background');
        // darkContainer should already be showing by default
        deactivateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer, isMobile, streaksContainer, lightHtmlBackground);
    } else {
        darkGrayTheme.classList.add('selected-background');
        defaultTheme.classList.remove('selected-background');
        lightContainer.style.display = "flex";
        darkContainer.style.display = "none";
        activateDarkTheme(interruptionsContainer, targetHoursContainer, timekeepingContainer, progressBarContainer, popupMenu, settingsContainer, notesContainer, aboutContainer, blogContainer, blackFlowtimeBackground, blackChilltimeBackground, selectedBackgroundIdTemp, selectedBackgroundId, emojiContainer, streaksContainer, darkHtmlBackground);
    }
}

function updateBackgrounds(userData) {
    const { flowTimeBackground, chillTimeBackground, flowTimeBackgroundTemp, chillTimeBackgroundTemp } = userData.settings.backgroundsThemes;

    // programmatic updates
    selectedBackgroundId.flowtime = flowTimeBackground;
    selectedBackground.flowtime = flowtimeBackgrounds[flowTimeBackground];

    selectedBackgroundId.chilltime = chillTimeBackground;
    selectedBackground.chilltime = chilltimeBackgrounds[chillTimeBackground];

    selectedBackgroundIdTemp.flowtime = flowTimeBackgroundTemp;
    selectedBackgroundIdTemp.chilltime = chillTimeBackgroundTemp;

    // GUI updates

    document.getElementById("green-default").classList.remove('selected-background');
    document.getElementById("blue-default").classList.remove('selected-background');
    setInitialBackgroundCellSelection();
}

function updateAnimations(userData) {
    const { flowTimeAnimation, chillTimeAnimation } = userData.settings.backgroundsThemes;

    // programmatic updates
    flags.flowTimeAnimationToggle = flowTimeAnimation;
    flowTimeAnimationToggle.checked = flowTimeAnimation;

    flags.chillTimeAnimationToggle = chillTimeAnimation;
    chillTimeAnimationToggle.checked = chillTimeAnimation;
}

// DISPLAY
function updateDisplay(userData) {
    updateIntervalTimeToggle(userData);
    updateTotalTimeToggle(userData);
    updateMuffinToggle(userData);
}

function updateIntervalTimeToggle(userData) {
    const { intervalTime } = userData.settings.display;
    intervalTimeToggle.checked = intervalTime;

    intervalTimeToggleGUIUpdate();
}

function updateTotalTimeToggle(userData) {
    const { totalTime } = userData.settings.display;
    totalTimeToggle.checked = totalTime;

    totalTimeToggleGUIUpdate();
}

function updateMuffinToggle(userData) {
    const { muffinToggle } = userData.settings.display;
    muffToggle.checked = muffinToggle;

    if (muffToggle.checked) {
        flags.muffinToggle = true;
        
    } else {
        flags.muffinToggle = false;
        
    }
}

// NOTES
function updateNotes(userData) {
    updateAutoSwitchToggle(userData);
    updatePropagateTasksToggle(userData);
}

function updateAutoSwitchToggle(userData) {
    const { autoSwitchToggle } = userData.settings.notes;

    notesflags.transitionNotesAutoSwitchToggle = autoSwitchToggle;

    transitionNotesAutoSwitchToggle.checked = autoSwitchToggle;
}

function updatePropagateTasksToggle(userData) {
    const { propagateUnfinishedTasksToggle } = userData.settings.notes;

    notesflags.propagateUnfinishedTasksToggle = propagateUnfinishedTasksToggle;

    propagateUnfinishedTasksToggleElement.checked = propagateUnfinishedTasksToggle;
}

// Sounds
function updateSounds(userData) {
    updateTransitionClockSound(userData);
}

function updateTransitionClockSound(userData) {
    const { transitionClockSound } = userData.settings.sounds;

    flags.transitionClockSoundToggle = transitionClockSound;

    transitionClockSoundToggle.checked = transitionClockSound;
}

function updateUserLabels(noteData) {

    // remove ALL default labels
    const tags = labelSelectionRow.getElementsByClassName('selection-tag');
    Array.from(tags).forEach(tag => {
        tag.remove();
        delete labelDict[tag.id]; // delete default tags from labelDict
    });

    // console.log(noteData.selectedLabels);

    // populate w/ noteData labels
    for (const [key, value] of Object.entries(noteData.labels).reverse()) {

        const newLabelElement = document.createElement('div');
        newLabelElement.id = key;
        
        const labelText = document.createElement('h4');
        labelText.className = 'tag-text';
        labelText.textContent = value; // Assuming value is the label text
        
        //make labelText a child of  newLabelElement
        newLabelElement.appendChild(labelText);
        
        if (!noteData.selectedLabels.hasOwnProperty(key)) {
            newLabelElement.className = 'tag unselectable selection-tag';
            labelSelectionRow.insertBefore(newLabelElement, labelSelectionRow.firstChild);
        }
        
        // update labels dictionary (client-side) - contains every label (regardless of location)
        labelDict[key] = value;

        // update labelFlags (initially initialize all to false)
        labelFlags[value] = false;

        //update labelArrs (initialize all to empty array)
        labelArrs[value] = [];
    }

    for (const [key, value] of Object.entries(noteData.selectedLabels)) {

        const newLabelElement = document.createElement('div');
        newLabelElement.id = key;
        
        const labelText = document.createElement('h4');
        labelText.className = 'tag-text';
        labelText.textContent = value; // Assuming value is the label text
        
        //make labelText a child of  newLabelElement
        newLabelElement.appendChild(labelText);

        newLabelElement.className = 'tag unselectable selected-tag';
        
        // modified addLabel() function, but for state.js
        newLabelElement.firstElementChild.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        
        notesCounters.tagsSelected++;
        addLabelInputContainerTagDivider(notesCounters, labelInputContainer);
        labelInputContainer.appendChild(newLabelElement);
        
        if ((labelInputContainer.scrollWidth > labelInputContainer.clientWidth) || (notesState.currentLabelInputTagSize < 20)) {
            adjustLabelFontSize(notesState, fontSizeArr, fontNumArr, labelInputContainer);
            
            if (labelInputContainer.scrollWidth > labelInputContainer.clientWidth) {
                labelInputContainer.style.justifyContent = 'left';
            }
        }
        
        selectedLabelDict[key] = value;

        // update labels in labelFlags w/ true if selected
        labelFlags[value] = true;
    }

    let labelDictReversed = reverseDict(labelDict);
    Object.keys(labelDict).forEach(key => delete labelDict[key]);
    Object.keys(labelDictReversed).forEach(key => labelDict[key] = labelDictReversed[key])
    
    if (notesCounters.tagsSelected > 0) {
        addLabelInitialActions(notesflags, tagIcon, promptContainer, clearIcon);
        taskPrompt.style.display = "none";
        promptContainer.style.zIndex = 3;
    }

    removeTagSelectionDivider(addDoneContainer, tagSelectionDivider, notesflags);

    // update lastLabelIdNum
    notesCounters.lastLabelIdNum = noteData.lastLabelIdNum;

    // update lastSelectedEmojiId
    notesState.lastSelectedEmojiId = noteData.lastSelectedEmojiId;

    // replace emoji w/ last selected one (overrides hardcoded html emoji) -- repeated code (from replaceEmoji() in notes.js), can refactor later :P
    let emojiImgPath = document.getElementById(notesState.lastSelectedEmojiId).src;
    emojiImg.src = emojiImgPath; // for add label container
    emojiImg2.src = emojiImgPath; // for update label container
}

function updateUserNotes(noteData) {
    let noteTaskArr = noteData.noteTasks;
    // console.log(noteTaskArr);

    // remove ALL default labels
    for (let i = 0; i < noteTaskArr.length; i++) {
        // create new taskDiv
        let noteTaskDiv = document.createElement('div');

        // add id
        let noteTaskDivIdStr = noteTaskArr[i].id;
        noteTaskDiv.id = noteTaskDivIdStr;
        noteTaskDiv.setAttribute('data-testid', noteTaskDivIdStr);
        let idNum = getLastNumberFromId(noteTaskDiv.id);

        // add classes
        let noteTaskClasslist = noteTaskArr[i].classList;
        for (let j = 0; j < noteTaskClasslist.length; j++) {
            noteTaskDiv.classList.add(noteTaskClasslist[j]);
        }

        // add circular check if note (check if checked)
        if (noteTaskClasslist.includes("task")) {
            let dummyCounters = {
                lastTaskInputIdNum: idNum
            }
            let taskCircularCheckDiv = createCheckElements(dummyCounters);
            noteTaskDiv.appendChild(taskCircularCheckDiv);

            // check circular check
            let checkId = "check" + idNum;
            let check = noteTaskDiv.querySelector('#' + checkId);
            let taskCircularCheckElement = noteTaskDiv.firstElementChild;

            if (noteTaskArr[i].classList.includes("completed-task")) {
                taskCircularCheckElement.style.backgroundColor = "#3ba43e";
                check.setAttribute('stroke-width', '3');
                check.parentElement.parentElement.style.opacity = '1';
                noteTaskDiv.classList.add('completed-task');
            }
        }

        // add content
        let taskText = document.createElement('span');
        taskText.textContent = noteTaskArr[i].content;

        let taskTextId = "spanText" + idNum;
        taskText.setAttribute('data-testid', taskTextId);
        noteTaskDiv.appendChild(taskText);

        let container = appendEditRemoveContainer("Task", idNum);
        noteTaskDiv.appendChild(container);
        dynamicList.appendChild(noteTaskDiv);

        // update notesArr
        const notesArrObj = {
            id: noteTaskDiv.id,
            classList: [...noteTaskDiv.classList], // convert to string arr
            content: taskText.textContent,
            date: noteTaskArr[i].date
        }
        notesArr.push(notesArrObj);
    }

    // console.log(notesArr)

    // update lastTaskInputIdNum
    notesCounters.lastTaskInputIdNum = noteData.lastTaskInputIdNum;
}

function reverseDict(tagDict) {

    // Step 1: Convert the object to an array of key-value pairs
    let entries = Object.entries(tagDict);
    // console.table(entries);
    
    // Step 2: Reverse the array
    let reversedEntries = entries.reverse();
    // console.table(reversedEntries); 

    // Step 3: Convert the reversed array back to an object
    let reversedSelectedLabelDict = Object.fromEntries(reversedEntries);
    // console.log(reversedSelectedLabelDict);

    return reversedSelectedLabelDict;
}

function loadFonts(fontArr) {
    for (let i = 0; i < fontArr.length; i++) {
        const font = new FontFace(fontArr[i].name, fontArr[i].path);
        // console.log(fontArr[i].path);
        // console.log(fontArr[i].name);
    
        font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
        }).catch(function(error) {
            console.error("Font loading failed:", error);
        });
    }
}