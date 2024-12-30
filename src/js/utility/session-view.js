import { confirmSessionDeletionNoBtn, confirmSessionDeletionPopup, confirmSessionDeletionYesBtn, cutoffBackground, dayViewContainer, dayViewSessionsContainer, deleteSessionContainer, editLabelTimeColumns, editSessionCancelBtn, editSessionContainer, editSessionLabels, editSessionNoLabels, editSessionPopup, editSessionSaveBtn, labelHourColumn, labelMinColumn, labelNameColumn, labelSecColumn, percentTimeInDeepWorkStat, pomodoroCountStat, sessionDurationStat, sessionTitle, sessionToDeleteContainer, sessionToEditContainer, sessionViewBackBtn, sessionViewCommentsTextArea, sessionViewContainer, sessionViewHeaderContainer, sessionViewLabelsContainer, sessionViewMoreOptionsDropdown, sessionViewMoreOptionsIcon, sessionViewNoLabelsContainer, sessionViewSessionContainer, sessionViewSubjectiveFeedbackDropdown, sessionViewTrashIcon, trim_marker } from "../modules/dashboard-elements.js";
import { dashboardData, flags } from "../modules/dashboard-objects.js";
import { body, confirmLabelDeletionYesBtn, overlayExit, popupOverlay, subjectiveFeedbackDropdown } from "../modules/dom-elements.js";

import { updateSessionSummaryData } from '../state/update-session-summary-data.js'; // minified
import { deleteSession } from '../state/delete-session.js'; // minified
import { getDeepWork } from './session-summary-chart.js'; // minified

// GLOBAL VARS
let userSession;
let sessionViewSessionContainerCopy;
let isDragging = false;
let containerRect;
let sessionDuration; // in ms
let newSession = true;
let newSessionCutoff;

let sessionEdits = {
    endTime: null,
    totalDeepWork: null,
    deepWorkIntervals: null,
    breakIntervals: null,
    avgDeepWorkInterval: null,
    avgBreakInterval: null,
    deepWorkIntervalCount: null,
    breakIntervalCount: null,
    hitTarget: null,
    perHourData: {},
    labelTimes: {}
}

export function checkViewportWidth() {
    if (flags.editSessionPopupShowing) {
        trim_marker.style.right = '0px';
        cutoffBackground.style.left = '';
        // set cutoff time back to end time
        let endTimeStr = getEndTimeStr();
        editSessionCutoffTime.innerText = `Cutoff Time: ${endTimeStr}`;
    }
}

document.addEventListener("stateUpdated", async function() {

    window.addEventListener('resize', checkViewportWidth);
    checkViewportWidth();
    
    sessionViewBackBtn.addEventListener('mouseover', function() {
        sessionViewBackBtn.classList.remove('resetBounce');
        sessionViewBackBtn.classList.add('triggerBounceLeft');
    })
    sessionViewBackBtn.addEventListener('mouseout', function() {
        sessionViewBackBtn.classList.remove('triggerBounceLeft');
        sessionViewBackBtn.classList.add('resetBounce');
    })
    sessionViewBackBtn.addEventListener("click", function(event) {
        // PROGRAMMATIC UPDATES
        flags.sessionViewContainerShowing = false;
        newSession = true;

        // UI UPDATES
        event.stopPropagation(); // stops propagation in bubbling phase after target phase
        sessionViewContainer.style.display = 'none';
        sessionViewContainer.style.opacity = '0';
        dayViewContainer.style.display = 'flex';
        setTimeout(() => {
            dayViewContainer.style.opacity = '1';
        }, 0)

        if (flags.sessionViewMoreOptionsDropdownShowing) {
            sessionViewMoreOptionsDropdown.style.display = "none";
            flags.sessionViewMoreOptionsDropdownShowing = false;
        }

        // reset edit session popup
        trim_marker.style.right = '0px';
        cutoffBackground.style.left = '';
        let endTimeStr = getEndTimeStr();
        editSessionCutoffTime.innerText = `Cutoff Time: ${endTimeStr}`;
    })
    
    // Add event listener for input events
    sessionViewCommentsTextArea.addEventListener('input', autoResize);
    
    // Function to auto-resize the textarea
    function autoResize() {
        this.style.height = 'auto'; // Reset height to auto to recalculate
        this.style.height = this.scrollHeight + 'px'; // Set height based on scrollHeight
    }

    editSessionContainer.addEventListener('click', function() {
        // console.log("you're now editing session: " + userSession._id);

        showEditSessionPopup();
    })

    deleteSessionContainer.addEventListener('click', function() {
        console.log('deleting session: ' + userSession._id);
        // create a new popup for the session deletion
        // hardcode most of popup in HTML, but dynamically load in the session representation
        showConfirmSessionDeletionPopup();
    })

    confirmSessionDeletionNoBtn.addEventListener('click', function() {
        hideConfirmSessionDeletionPopup();
    })

    confirmSessionDeletionYesBtn.addEventListener('click', async function() {
        hideConfirmSessionDeletionPopup();
        await deleteSession(userSession._id);
        sessionViewBackBtn.click();
    })

    editSessionCancelBtn.addEventListener('click', function() {
        // hide sessionToEditContainer
        hideEditSessionPopup();
    })
    
    editSessionSaveBtn.addEventListener('click', function() {
        // hide sessionToEditContainer
        hideEditSessionPopup();

        // also make necessary update changes to the database
        updateSessionWithEdits();
    })

    sessionViewCommentsTextArea.addEventListener('blur', function() {
        // Once focus has been removed, update appropriate session w/ new session summary comments
        let commentsText = sessionViewCommentsTextArea.value;

        if (commentsText.length > 10000) {
            commentsText = commentsText.slice(0, 10000); // Cut off at the 10,000th character
            sessionViewCommentsTextArea.value = commentsText;
            sessionViewCommentsTextArea.style.height = 'auto'; // Reset height to auto to recalculate
            sessionViewCommentsTextArea.style.height = sessionViewCommentsTextArea.scrollHeight + 'px'; // Set height based on scrollHeight
        }

        let summaryData = {
            type: 'comments',
            value: commentsText
        }

        updateSessionSummaryData(userSession._id, summaryData);
    })

    sessionViewSubjectiveFeedbackDropdown.addEventListener('change', function(event) {
        let subjectiveFeedback = sessionViewSubjectiveFeedbackDropdown.value;
        let summaryData = {
            type: 'subjectiveFeedback',
            value: subjectiveFeedback
        }

        updateSessionSummaryData(userSession._id, summaryData);
    })

    sessionViewMoreOptionsIcon.addEventListener('click', function() {
        if (flags.sessionViewMoreOptionsDropdownShowing) {
            sessionViewMoreOptionsDropdown.style.display = 'none';
            flags.sessionViewMoreOptionsDropdownShowing = false;
        } else {
            sessionViewMoreOptionsDropdown.style.display = 'flex';
            flags.sessionViewMoreOptionsDropdownShowing = true;
        }
    })

    trim_marker.addEventListener('mousedown', (event) => {
        isDragging = true;
        containerRect = sessionToEditContainer.getBoundingClientRect();
        trim_marker.style.cursor = 'grabbing';
        event.preventDefault(); // Prevent text selection
    });
})

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        trim_marker.style.cursor = 'grab';
    }
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        let newRight = containerRect.right - event.clientX;

        // Constrain movement within the container bounds
        if (newRight < 0) {
            newRight = 0;
        }

        if (newRight > containerRect.width - 25) {
            newRight = containerRect.width - 25;
        }

        let sessionPercentage = 1 - (newRight / ((containerRect.right - containerRect.left) - 25));

        let cuttoffBackgroundOpacity = (1 - sessionPercentage) * 10;
        cutoffBackground.style.opacity = cuttoffBackgroundOpacity;

        cutoffBackground.style.left = (sessionPercentage * ((containerRect.right - containerRect.left) - 25)) + 10 + 'px';

        // Update the position of the trim marker
        trim_marker.style.right = `${newRight}px`;

        // Calculate the updated time based on the sessionPercentage * sessionDuration added to the session startTime
        // (1) Calculate the sessionDuration
        let sessionTimeCutoffStr = getSessionTimeCutoffStr(sessionPercentage);
        editSessionCutoffTime.innerText = `Cutoff Time: ${sessionTimeCutoffStr}`;
    }
})

function updateSessionWithEdits() {
    // console.log(userSession);
    // (1) derive the new session duration based on the new endTime
    let startTime = new Date(userSession.startTime);
    let newEndTime = new Date(newSessionCutoff.toISOString());
    let newDuration = Math.abs(newEndTime - startTime); // in ms
    sessionEdits.endTime = newEndTime; // ensure this is the right format for the date in MongoDB

    // (2) create combined deepwork/ break interval array
    let deepWorkIntervals = [...userSession.deepWorkIntervals];
    let breakIntervals = [...userSession.breakIntervals];
    let totalIntervalCount = deepWorkIntervals.length + breakIntervals.length;
    let combinedIntervalArr = [];

    for (let i = 0; i < totalIntervalCount; i++) {
        if (i % 2 == 0) {
            combinedIntervalArr.push(deepWorkIntervals.shift())
        } else {
            combinedIntervalArr.push(breakIntervals.shift())
        }
    }

    // (3) create new deep work and break intervals
    let newDeepWorkIntervals = [];
    let newBreakIntervals = [];

    let i = 0;
    while (newDuration > 0) {
        let prevNewDuration = newDuration;
        newDuration = newDuration - combinedIntervalArr[i];

        if (newDuration > 0) {
            if (i % 2 == 0) {
                newDeepWorkIntervals.push(combinedIntervalArr[i]);
            } else {
                newBreakIntervals.push(combinedIntervalArr[i]);
            }
        } else {
            if (i % 2 == 0) {
                newDeepWorkIntervals.push(prevNewDuration);
            } else {
                newBreakIntervals.push(prevNewDuration);
            }
        }
        i++;
    }

    // set deep work and break intervals
    sessionEdits.deepWorkIntervals = newDeepWorkIntervals;
    sessionEdits.breakIntervals = newBreakIntervals;

    // set deep work and break interval count
    sessionEdits.deepWorkIntervalCount = newDeepWorkIntervals.length;
    sessionEdits.breakIntervalCount = newBreakIntervals.length;

    // calculate and set totalDeepWork, avg intervals, hit target
    let newTotalDeepWork = newDeepWorkIntervals.reduce((accumulator, currentVal) => accumulator + currentVal, 0);
    sessionEdits.totalDeepWork = newTotalDeepWork;

    let newAvgDeepWorkInterval = newTotalDeepWork / newDeepWorkIntervals.length;
    sessionEdits.avgDeepWorkInterval = newAvgDeepWorkInterval;

    let newTotalBreak = newBreakIntervals.reduce((accumulator, currentVal) => accumulator + currentVal, 0);
    let newAvgBreakInterval = newTotalBreak / newBreakIntervals.length;
    sessionEdits.avgBreakInterval = newAvgBreakInterval;

    let targetTimeMs = userSession.targetHours;
    if (newTotalDeepWork >= targetTimeMs) {
        sessionEdits.hitTarget = true;
    } else {
        sessionEdits.hitTarget = false;
    }

    // (4) editing distractions
    // first step here is to check if the new cutoff is before each distraction in the distraction times array
    let distractionTimesArr = userSession.distractionTimesArr;
    let newDistractionTimesArr = [];
    
    let d = 0;
    while (new Date(distractionTimesArr[d]) < new Date(newEndTime)) {
        newDistractionTimesArr.push(distractionTimesArr[d]);
        d++;
    }

    // set value of distractionTimesArr and totalDistractions
    sessionEdits.distractionTimesArr = newDistractionTimesArr;
    sessionEdits.totalDistractions = newDistractionTimesArr.length;

    // for use when iterating through perHourdata
    let removedDistractionCount = distractionTimesArr.length - newDistractionTimesArr.length;
    let cutoffDeepWorkTime = userSession.totalDeepWork - newTotalDeepWork;

    // (5) editing perHourData
    const newPerHourData = JSON.parse(JSON.stringify(userSession.perHourData)); // deep copy (nested objects are duplicates)

    let sortedNewPerHourDataArr = Object.entries(newPerHourData)
    .sort(([keyA], [keyB]) => {
        return new Date(keyA) - new Date(keyB);
    })

    // note: sortedNewPerHourDataArr[j][1] is a reference to the same object in newPerHourData
    let j = sortedNewPerHourDataArr.length - 1;
    while ((cutoffDeepWorkTime > 0) && (j >= 0)) { // last condition shouldn't be necessary but just for insurance
        console.log(removedDistractionCount);

        if (sortedNewPerHourDataArr[j][1].deepWorkTime <= cutoffDeepWorkTime) {
            cutoffDeepWorkTime = cutoffDeepWorkTime - sortedNewPerHourDataArr[j][1].deepWorkTime;
            sortedNewPerHourDataArr[j][1].deepWorkTime = 0;
            sortedNewPerHourDataArr[j][1].inDeepWork = false;
            
        } else {
            sortedNewPerHourDataArr[j][1].deepWorkTime = sortedNewPerHourDataArr[j][1].deepWorkTime - cutoffDeepWorkTime;
            // inDeepWork would remain true (nothing to do here)
            cutoffDeepWorkTime = 0;
        }
        
        if (removedDistractionCount >= sortedNewPerHourDataArr[j][1].distractions) {
            removedDistractionCount = removedDistractionCount - sortedNewPerHourDataArr[j][1].distractions;
            sortedNewPerHourDataArr[j][1].distractions = 0;
        } else {
            sortedNewPerHourDataArr[j][1].distractions = sortedNewPerHourDataArr[j][1].distractions - removedDistractionCount;
        }
        
        j--;
    }

    sessionEdits.perHourData = newPerHourData;

    // (5) Label Time Edits
    // I am having issues with getting the dynamically added input elements for each label
    // What I'll need to do add id's to each input element (based on labelId),
    // and store those id's somewhere to access here


}

function updateLabelTimes() {
    // (1) iterate through userSession.labelTimes and create new object of labels with time {labelId: time (in ms)} if time > 0
    const labelTimes = userSession.labelTimes;
    const filteredTimes = {};

    for (const [key, value] of Object.entries(labelTimes)) {
        if (value > 0) {
            filteredTimes[key] = value;
        }
    }

    if (Object.keys(filteredTimes).length === 0) {
        displayEditSessionNoLabels()
    } else {
        displayEditSessionLabels(filteredTimes);
    }
}

function displayEditSessionLabels(filteredTimes) {

    // (2) replace labelId in dictionary with label name based on users notes data --> {labelName: labelTime (in ms)}
    let userNoteData = dashboardData.noteData;
    let labels = userNoteData.labels;
    let deletedLabels = userNoteData.deletedLabels;
    const combinedLabels = { ...labels, ...deletedLabels };

    const replacedKeys = Object.entries(filteredTimes).reduce((result, [key, value]) => {
        if (combinedLabels[key]) {
            result[key] = [combinedLabels[key], value]; // Replace key with corresponding label
        }
        return result;
    }, {});

    // (3) for each key-value pair, create container with labelName and two inputs for the hour, minute, second amount
    for (const key in replacedKeys) {

        // (3.0) calculate times for hour, min and sec
        let labelTimeMs = replacedKeys[key][1];
        const hourMinSec = getHourMinSec(labelTimeMs);
        const hours = hourMinSec[0];
        const min = hourMinSec[1];
        const sec = hourMinSec[2];

        // (3.1) create label name element
        let labelNameDiv = document.createElement('div');
        labelNameDiv.classList.add('editSessionLabelName');
        labelNameDiv.textContent = replacedKeys[key][0];
        labelNameDiv.id = "labelNameDiv-" + String(key);
        labelNameColumn.appendChild(labelNameDiv);

        // (3.2) create label hour input element
        let labelHourInput = document.createElement('input');
        labelHourInput.type = 'number';
        labelHourInput.value = hours; // actual value TBD
        labelHourInput.classList.add('sessionEditLabelTimeInput');
        labelHourInput.classList.add(key);
        labelHourInput.name = 'hour';
        labelHourInput.min = '0';
        labelHourInput.max = '23';
        labelHourInput.step = '1';
        labelHourColumn.appendChild(labelHourInput);

        // (3.3) create label min input element
        let labelMinInput = document.createElement('input');
        labelMinInput.type = 'number';
        labelMinInput.value = min; // actual value TBD
        labelMinInput.classList.add('sessionEditLabelTimeInput');
        labelMinInput.classList.add(key);
        labelMinInput.name = 'min';
        labelMinInput.min = '0';
        labelMinInput.max = '59';
        labelMinInput.step = '1';
        labelMinColumn.appendChild(labelMinInput);

        // (3.4) create label sec input element
        let labelSecInput = document.createElement('input');
        labelSecInput.type = 'number';
        labelSecInput.value = sec; // actual value TBD
        labelSecInput.classList.add('sessionEditLabelTimeInput');
        labelSecInput.classList.add(key);
        labelSecInput.name = 'sec';
        labelSecInput.min = '0';
        labelSecInput.max = '59';
        labelSecInput.step = '1';
        labelSecColumn.appendChild(labelSecInput);

        // edit length of label name (still buggy)
        setTimeout(() => {
            if (document.getElementById(labelNameDiv.id).offsetWidth > 200) {
                let innerText = document.getElementById(labelNameDiv.id).innerText;
                innerText = innerText.slice(0, 10) + '...';
                document.getElementById(labelNameDiv.id).innerText = innerText;
            }
        }, 0);
    }
}

function displayEditSessionNoLabels() {
    editSessionLabels.style.display = 'none';
    editSessionNoLabels.style.display = 'flex';
}

// Input: ms duration of label time
// Output: array of hour, min, and sec
function getHourMinSec(labelTimeMs) {
    const seconds = Math.floor(labelTimeMs / 1000); // Convert ms to seconds
    const hours = Math.floor(seconds / 3600); // Extract hours
    const minutes = Math.floor((seconds % 3600) / 60); // Extract minutes
    const remainingSeconds = seconds % 60; // Remaining seconds

    return [hours, minutes, remainingSeconds];
}

function getEndTimeStr() {
    let sessionEndTime = userSession.endTime;
    const date = new Date(sessionEndTime);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getSessionTimeCutoffStr(sessionPercentage) {
    let sessionStartDate = userSession.startTime;
    const date = new Date(sessionStartDate);

    // Add the milliseconds to the date
    const newDate = new Date(date.getTime() + (sessionDuration * sessionPercentage));

    // Set global newDate variable to this altered date
    newSessionCutoff = newDate;

    return newDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function showEditSessionPopup() {
    flags.sessionViewMoreOptionsDropdownShowing = false;
    sessionViewMoreOptionsDropdown.style.display = "none";

    flags.editSessionPopupShowing = true;
    popupOverlay.style.display = "flex"; 
    overlayExit.style.display = 'none';

    editSessionPopup.style.display = "block";
    body.style.overflowY = 'hidden';

    let endTimeStr = getEndTimeStr();
    if (newSession) {
        editSessionCutoffTime.innerText = `Cutoff Time: ${endTimeStr}`;
        newSession = false;
    }

    insertSessionContainerIntoPopup(sessionToEditContainer); // add label to popup
    getSessionTimeCutoffStr(1.0); // initialize newSessionCutoff immediately
    console.log(newSessionCutoff);

    // Next insert labels --> call function that iterates through labelTimes and if time > 0
    // find corresponding label name, add time in h and m to inputs that user can change (update)

    updateLabelTimes();
}

export function hideEditSessionPopup() {
    flags.editSessionPopupShowing = false;
    popupOverlay.style.display = "none";
    editSessionPopup.style.display = "none";

    overlayExit.style.display = 'flex';
    
    body.style.overflowY = 'scroll';

    // resetting the session visualization
    sessionToEditContainer.removeChild(sessionToEditContainer.lastChild);

    // resetting the label columns
    labelNameColumn.innerHTML = '';
    editLabelTimeColumns.forEach(column => {
        column.innerHTML = '';
    })

    // resetting containers
    editSessionLabels.style.display = 'flex';
    editSessionNoLabels.style.display = 'none';
}

export function hideConfirmSessionDeletionPopup() {
    flags.confirmSessionDeletionPopupShowing = false;
    popupOverlay.style.display = "none";
    confirmSessionDeletionPopup.style.display = "none";

    menuBtn.style.display = 'flex';
    setTimeout(() => {
        menuBtn.style.opacity = '1';
    }, 0)
    
    body.style.overflowY = 'scroll';

    sessionToDeleteContainer.removeChild(sessionToDeleteContainer.firstChild);
}

function showConfirmSessionDeletionPopup() {
    flags.sessionViewMoreOptionsDropdownShowing = false;
    sessionViewMoreOptionsDropdown.style.display = "none";

    flags.confirmSessionDeletionPopupShowing = true;
    popupOverlay.style.display = "flex"; 

    menuBtn.style.display = 'none';
    menuBtn.style.opacity = '0';

    confirmSessionDeletionPopup.style.display = "block";
    body.style.overflowY = 'hidden';

    insertSessionContainerIntoPopup(sessionToDeleteContainer); // add label to popup

    // create event listener callback fns() for yes and no btns
}

function insertSessionContainerIntoPopup(container) {
    // Visual modifications to sessionViewSessionContainerCopy
    sessionViewSessionContainerCopy.style.backgroundColor = 'black';
    sessionViewSessionContainerCopy.style.color = 'white';
    sessionViewSessionContainerCopy.style.fontFamily = 'settingsHeaderFont';
    sessionViewSessionContainerCopy.style.marginBottom = '15px';
    container.appendChild(sessionViewSessionContainerCopy);
}

export async function initializeSessionView(session, dayViewSessionContainerCopy, sessionNumber) {
    await resetData();
    await initializeData(session, dayViewSessionContainerCopy);
    displaySessionView(session, dayViewSessionContainerCopy, sessionNumber);
}

async function initializeData(session, dayViewSessionContainerCopy) {
    userSession = session;
    sessionViewSessionContainerCopy = dayViewSessionContainerCopy.cloneNode(true);
}

function displaySessionView(session, dayViewSessionContainerCopy, sessionNumber) {

    // PROGRAMMATIC UPDATES
    flags.sessionViewContainerShowing = true;

    // UI UPDATES

    // scroll to the top every time
    dailyBodyContainer.scrollTo(0, 0);

    // showing dayViewContainer
    dayViewContainer.style.display = 'none';
    dayViewContainer.style.opacity = '0';

    sessionViewContainer.style.display = 'flex';
    setTimeout(() => {
        sessionViewContainer.style.opacity = '1';
    }, 0)

    // set sessionTitle (based on session index)
    sessionTitle.innerText = `Session #${sessionNumber}`;

    // append dayViewSessionContainerCopy as a child of sessionViewSessionContainer
    dayViewSessionContainerCopy.classList.add('no-select');
    sessionViewSessionContainer.appendChild(dayViewSessionContainerCopy);

    // Initialize the comments container w/ user's comments if they were added in session summary
    let sessionComments = session.sessionSummary.comments;
    sessionViewCommentsTextArea.value = sessionComments; // resets value on initialization
    sessionViewCommentsTextArea.style.height = 'auto';
    sessionViewCommentsTextArea.style.height = sessionViewCommentsTextArea.scrollHeight + 'px';
    
    // Initialize the subjective feedback
    let subjectiveFeedback = session.sessionSummary.subjectiveFeedback;

    sessionViewSubjectiveFeedbackDropdown.value = subjectiveFeedback; // resets value on initialization
    
    // Initialize the label times
    // now, we'll need to do just a bit of calculations before proceeding the label and adv stats sections
    // iterate through all of the labels
    // conditional check for ANY time at all, if present then create time string (xh ym)
    // ..along with a percentage of the total time

    let labelObjsArr = [];
    let labelTimes = session.labelTimes;

    // creates an array of all label time objects with some amount of time
    for (let key in labelTimes) {
        if (labelTimes.hasOwnProperty(key)) {
            if (labelTimes[key] > 0) {
                labelObjsArr.push({ id: key, time: labelTimes[key] });
            }
        }
    }
    displaySessionViewLabels(labelObjsArr);

    // Adv Stats section
    // calculate total duration of the session
    // calculate % time in deep work
    // initialize number of pomodoros completed
    // and then we're good!
    let startTime = session.startTime;
    let endTime = session.endTime;

    let totalDuration = calculateTotalDuration(startTime, endTime).totalDurationMs;
    sessionDuration = totalDuration;
    let totalDurationStr = calculateTotalDuration(startTime, endTime).totalDurationStr;
    sessionDurationStat.innerText = totalDurationStr;

    let deepWorkDuration = session.totalDeepWork;
    let percentTimeInDeepWork = calculatePercentTimeInDeepWork(totalDuration, deepWorkDuration);
    percentTimeInDeepWorkStat.innerText = `${percentTimeInDeepWork}%`;

    let pomodorosCompleted = session.pomodorosCompleted;
    pomodoroCountStat.innerText = pomodorosCompleted;
}

function calculatePercentTimeInDeepWork(totalDuration, deepWorkDuration) {
    let percentInDeepWork = Math.floor((deepWorkDuration / totalDuration) * 100);

    if (percentInDeepWork > 100) {
        percentInDeepWork = 100;
    }
    
    return percentInDeepWork;
}

export function calculateTotalDuration(startTime, endTime) {
    // Convert the date strings into Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    // Calculate the total duration in milliseconds
    const totalDuration = endDate - startDate;

    let totalDurationStr = getTimeString(totalDuration);

    let durationObj = {
        totalDurationMs: totalDuration,
        totalDurationStr: totalDurationStr
    }

    return durationObj;
}

function displaySessionViewLabels(labelObjsArr) {
    // create an array of ALL labels (deleted or not)

    let labels = dashboardData.noteData.labels;
    let deletedLabels = dashboardData.noteData.deletedLabels;
    let combinedLabels = { ...labels, ...deletedLabels}

    if (labelObjsArr.length === 0) {
        // create and show sessionViewNoLabelsContainer
        let sessionViewNoLabelsContainer = document.createElement('div');
        sessionViewNoLabelsContainer.classList.add('sessionViewNoLabelsContainer');
        sessionViewNoLabelsContainer.innerText = "No Labels";
        sessionViewLabelsContainer.appendChild(sessionViewNoLabelsContainer);
        console.log(sessionViewLabelsContainer);

    } else {
        for (let i = 0; i < labelObjsArr.length; i++) {
            let labelName = combinedLabels[labelObjsArr[i].id];
            let labelTime = labelObjsArr[i].time; // in ms
    
            // convert the labelTime (ms) to a time string of minutes and hours
            let labelTimeStr = getTimeString(labelTime);
            labelTimeStr = "| " + labelTimeStr;
    
            // create DOM elements and append as children to sessionViewLabelsContainer
            let sessionViewLabelContainer = document.createElement('div');
            sessionViewLabelContainer.classList.add('sessionViewLabelContainer');
    
            let sessionViewLabel = document.createElement('div');
            sessionViewLabel.classList.add('sessionViewLabel');
            sessionViewLabel.innerText = labelName;
            sessionViewLabel.id = 'sessionViewLabel' + i;
    
            let sessionViewLabelTime = document.createElement('div');
            sessionViewLabelTime.classList.add('sessionViewLabelTime');
            sessionViewLabelTime.innerText = labelTimeStr;
    
            sessionViewLabelContainer.appendChild(sessionViewLabel);
            sessionViewLabelContainer.appendChild(sessionViewLabelTime);
    
            sessionViewLabelsContainer.appendChild(sessionViewLabelContainer);

            setTimeout(() => {
                if (document.getElementById(sessionViewLabel.id).offsetWidth > 150) {
                    let innerText = document.getElementById(sessionViewLabel.id).innerText;
                    innerText = innerText.slice(0, 10) + '...';
                    document.getElementById(sessionViewLabel.id).innerText = innerText;
                }
            }, 0);
        }
    }
}

// repeated
function getTimeString(labelTime) {
    let deepWork = getDeepWork(labelTime); // retrieves DW hours
    let deepWorkHours = Math.floor(deepWork);
    let deepWorkMinutes = Math.round((deepWork - deepWorkHours) * 60);
    let deepWorkSeconds;

    if (labelTime < 60000) {
        deepWorkSeconds = Math.floor(labelTime / 1000);
    }

    let deepWorkStr;
    if (deepWorkSeconds) {
        deepWorkStr = `${deepWorkSeconds}s`;
    } else {
        deepWorkStr = `${deepWorkHours}h ${deepWorkMinutes}m`;
    }

    return deepWorkStr;
}

async function resetData() {
    sessionViewSessionContainer.innerHTML = "";
    sessionViewLabelsContainer.innerHTML = "";
    sessionDurationStat.innerText = "";
    percentTimeInDeepWorkStat.innerText = "";
    pomodoroCountStat.innerText = "";
    sessionToDeleteContainer.innerHTML = "";
}