import { dayViewContainer, dayViewSessionsContainer, percentTimeInDeepWorkStat, pomodoroCountStat, sessionDurationStat, sessionTitle, sessionViewBackBtn, sessionViewCommentsTextArea, sessionViewContainer, sessionViewHeaderContainer, sessionViewLabelsContainer, sessionViewNoLabelsContainer, sessionViewSessionContainer, sessionViewSubjectiveFeedbackDropdown } from "../modules/dashboard-elements.js";
import { dashboardData, flags } from "../modules/dashboard-objects.js";
import { getDeepWork } from "./session-summary-chart.js";

document.addEventListener("stateUpdated", async function() {
    
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

        // UI UPDATES
        event.stopPropagation(); // stops propagation in bubbling phase after target phase
        sessionViewContainer.style.display = 'none';
        sessionViewContainer.style.opacity = '0';
        dayViewContainer.style.display = 'flex';
        setTimeout(() => {
            dayViewContainer.style.opacity = '1';
        }, 0)

    })
    
    // Add event listener for input events
    sessionViewCommentsTextArea.addEventListener('input', autoResize);
    
    // Function to auto-resize the textarea
    function autoResize() {
        this.style.height = 'auto'; // Reset height to auto to recalculate
        this.style.height = this.scrollHeight + 'px'; // Set height based on scrollHeight
    }
    
})

export async function initializeSessionView(session, dayViewSessionContainerCopy, sessionNumber) {
    await resetData();
    displaySessionView(session, dayViewSessionContainerCopy, sessionNumber);
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
    
    // Initialize the subjective feedback
    let subjectiveFeedback = session.sessionSummary.subjectiveFeedback;
    sessionViewSubjectiveFeedbackDropdown.value = subjectiveFeedback; // resets value on initialization
    
    console.log(session)
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
    let totalDurationStr = calculateTotalDuration(startTime, endTime).totalDurationStr;
    sessionDurationStat.innerText = totalDurationStr;

    let deepWorkDuration = session.totalDeepWork;
    let percentTimeInDeepWork = calculatePercentTimeInDeepWork(totalDuration, deepWorkDuration);
    percentTimeInDeepWorkStat.innerText = `${percentTimeInDeepWork}%`;

    let pomodorosCompleted = session.pomodorosCompleted;
    pomodoroCountStat.innerText = pomodorosCompleted;
}

function calculatePercentTimeInDeepWork(totalDuration, deepWorkDuration) {
    let percentInDeepWork = Math.round((deepWorkDuration / totalDuration) * 100);

    if (percentInDeepWork > 100) {
        percentInDeepWork = 100;
    }
    
    return percentInDeepWork;
}

function calculateTotalDuration(startTime, endTime) {
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
                if (document.getElementById(sessionViewLabel.id).offsetWidth > 200) {
                    let innerText = document.getElementById(sessionViewLabel.id).innerText;
                    innerText = innerText.slice(0, 10) + '...';
                    document.getElementById(sessionViewLabel.id).innerText = innerText;
                }
            }, 0);
        }
    }
}

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
}