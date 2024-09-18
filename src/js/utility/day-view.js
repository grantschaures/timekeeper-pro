import { dayViewCompletedTasks, dayViewCompletedTasksHeader, dayViewDeepWorkSummaryStat, dayViewFocusQualitySummaryStat, dayViewNoEntriesContainer, dayViewNotes, dayViewNotesEntriesContainer, dayViewNotesHeader, dayViewSessionsContainer, dayViewSummaryChart, sessionToDeleteContainer } from "../modules/dashboard-elements.js";
import { charts, constants, dailyContainer, dashboardData } from "../modules/dashboard-objects.js";

import { getDeepWork, getFocusQuality, getTargetHours } from './session-summary-chart.js'; // minified
import { userTimeZone } from './identification.js'; // minified
import { initializeSessionView } from './session-view.js'; // minified

let currentWeekData;
let dayViewSummaryStats = {
    focusQuality: null,
    hours: null,
    minutes: null,
    seconds: null
}

let sessionDataArr = [];
let dayViewSessionIds = [];

document.addEventListener("stateUpdated", async function() {

    dayViewSessionsContainer.addEventListener('click', function(event) {
        let target = event.target;

        for (let i = 0; i < dayViewSessionIds.length; i++) {
            let selector = '#' + dayViewSessionIds[i];
            if (target.closest(selector)) {
                let dayViewSessionContainer = document.getElementById(`${dayViewSessionIds[i]}`);
                console.log(dayViewSessionContainer)
                let dayViewSessionContainerCopy = dayViewSessionContainer.cloneNode(true);
                let sessionNumber = i + 1;
                initializeSessionView(sessionDataArr[i], dayViewSessionContainerCopy, sessionNumber);
            }
        }

    })

})

document.addEventListener("displayDayView", async function() {
    await resetData();
    await initializeData();
    displayDayView();
})

async function initializeData() {
    currentWeekData = dashboardData.currentWeekArr[dailyContainer.weekIndex];
    // console.log(dashboardData.currentWeekArr);
}

async function resetData() {
    currentWeekData = {};

    Object.keys(dayViewSummaryStats).forEach(function(key) {
        dayViewSummaryStats[key] = null;
    });

    // reset the dayViewSessionsContainer UI
    dayViewSessionsContainer.innerHTML = "";

    // we'll also need to clear the innerHTML of:
    // (1) #dayViewCompletedTasks
    // (2) #dayViewNotes
    dayViewNotes.innerHTML = "";
    dayViewCompletedTasks.innerHTML = "";

    // hide the 'No notes or completed tasks' message (if it was showing)
    dayViewNoEntriesContainer.style.display = 'none';

    // hide #dayViewNotesHeader AND #dayViewCompletedTasksHeader
    dayViewNotesHeader.innerText = "";
    dayViewCompletedTasksHeader.innerText = "";

    // reset dayViewSessionId array
    dayViewSessionIds = [];

    sessionDataArr = [];
}

function displayDayView() {
    // console.log(currentWeekData);

    // (1) Show the Chart.js doughnut charts
    let animationLength = 0;
    if (dailyContainer.dayViewSummaryChartSeen) {
        animationLength = 1000;
    }
    displayDayViewSummaryChart(animationLength);
    dailyContainer.dayViewSummaryChartSeen = true;

    // (2) Initialize Deep Work and Focus Quality summary stat values
    setDeepWorkAndFocusQuality();

    // (3) Initialize session selections
    initializeDayViewSessions();

    // (4) Initialize the completed tasks and notes entries
    initializeNotesEntries();
}

// includes completed tasks and notes
function initializeNotesEntries() {
    // in populate-dashboard, we'll probably have to read in user data from the Notes-Entries collection
    // I will end up probably adding a notesEntries field to the dailyData
    // ^^ I did not do that
    // Instead, I simply made each element in the weeklyArr contains a dailyData and noteEntryData object

    if (currentWeekData.noteEntryData) {
        let noteEntryData = currentWeekData.noteEntryData;
        let notesArr = noteEntryData.notes;
        let completedTasksArr = noteEntryData.completedTasks;
    
        let noteCount = notesArr.length;
        let completedTaskCount = completedTasksArr.length;

        // Set notes and completed tasks headers
        dayViewNotesHeader.innerText = `Notes (${noteCount})`;
        dayViewCompletedTasksHeader.innerText = `Completed Tasks (${completedTaskCount})`;

        // add li dom elements under #dayViewNotes and #dayViewCompletedTasks
        addNotesEntriesToList(noteCount, 'dayViewNote', notesArr, dayViewNotes);
        addNotesEntriesToList(completedTaskCount, 'dayViewCompletedTask', completedTasksArr, dayViewCompletedTasks);
        
    } else {
        dayViewNoEntriesContainer.style.display = 'flex';
    }
}

function addNotesEntriesToList(noteEntryCount, listClass, noteEntryArr, unorderedList) {

    for (let i = 0; i < noteEntryCount; i++) {
        let li = document.createElement('li');
        li.classList.add(listClass);
        li.innerText = noteEntryArr[i].content;

        let dayViewNoteEntryTimestamp = document.createElement('span');
        dayViewNoteEntryTimestamp.classList.add('dayViewNoteEntryTimestamp');

        dayViewNoteEntryTimestamp.innerText = getDayViewNoteEntryTimestamp(noteEntryArr[i], listClass, dayViewNoteEntryTimestamp);

        li.appendChild(dayViewNoteEntryTimestamp);

        unorderedList.appendChild(li);
    }
}

function getDayViewNoteEntryTimestamp(arrElement, listClass, timestampElement) {
    // based on the list element class
    // either adjust the date or completionDate to the timeZone (if it exists, if not use userTimeZone from identification.js)

    let dateStr;
    if (listClass === "dayViewNote") {
        dateStr = arrElement.date;
    } else { // listClass === "dayViewCompletedTask"
        timestampElement.classList.add('dayViewCompletedTaskTimestamp');
        dateStr = arrElement.completionDate;
    }

    // convert the UTC date to the adjusted date based on either the timeZone associated with the arrElement if it exists or userTimeZone otherwise
    let timeZone;
    if (arrElement.timeZone) {
        timeZone = arrElement.timeZone;
    } else {
        timeZone = userTimeZone;
    }

    dateStr = moment.tz(dateStr, timeZone).format('h:mm a');

    return dateStr;
}

function initializeDayViewSessions() {
    // Figure out if there are any sessions
    // if so, loop through all the sessions and call function to append a new sessionContainer to the dayViewSessionsContainer
    // if not, output a similar looking container with a white border, but with inner text reading "No Sessions"
    
    if (currentWeekData.dailyData) {
        sessionDataArr = currentWeekData.dailyData.sessions;

        // call function to append new sessionContainer to the DOM for each session
        for (let i = 0; i < sessionDataArr.length; i++) {
            createAndAppendSessionContainer(sessionDataArr[i], i);

        }

    } else {
        createAndAppendNoSessionsContainer();

    }
}

function createAndAppendSessionContainer(session, i) {
    // console.log(session);

    // INITIALIZE VARS

    // DEEP WORK TIME
    let deepWork = getDeepWork(session.totalDeepWork); // retrieves DW hours
    let deepWorkHours = Math.floor(deepWork);
    let deepWorkMinutes = Math.round((deepWork - deepWorkHours) * 60);
    let lessThanOneMin = false;
    let deepWorkSeconds;
    if (session.totalDeepWork < 60000) {
        lessThanOneMin = true;
        deepWorkSeconds = Math.floor(session.totalDeepWork / 1000);
    }
    let deepWorkStr;
    if (deepWorkSeconds) {
        deepWorkStr = `${deepWorkSeconds}s`;
    } else {
        deepWorkStr = `${deepWorkHours}h ${deepWorkMinutes}m`;
    }

    // FOCUS QUALITY
    let focusQualityFraction = 1 - ((session.totalDistractions / (session.totalDeepWork / 60000)) / constants.FOCUS_QUALITY_CONSTANT);
    if (focusQualityFraction < 0) {
        focusQualityFraction = 0;
    }
    let focusQuality = Math.floor(focusQualityFraction * 100);
    let focusQualityStr = `${focusQuality}%`;

    // START TIME
    let startTime = getAdjustedTime(session.startTime, session.timeZone);
    
    // END TIME
    let endTime = getAdjustedTime(session.endTime, session.timeZone);
    
    // create dayViewSessionContainer
    let dayViewSessionContainer = document.createElement('div');
    dayViewSessionContainer.classList.add('dayViewSessionContainer');
    
    let dayViewSessionId = 'dayViewSession' + i;
    dayViewSessionContainer.id = dayViewSessionId;
    dayViewSessionIds.push(dayViewSessionId);

    // (1) dayViewSessionStatOverview
    let dayViewSessionStatOverviewContainer = document.createElement('div');
    dayViewSessionStatOverviewContainer.classList.add('dayViewSessionStatOverviewContainer');

    let dayViewSessionDeepWork = document.createElement('div');
    dayViewSessionDeepWork.classList.add('dayViewSessionDeepWork');
    dayViewSessionDeepWork.innerText = deepWorkStr;

    let dayViewSessionFocusQuality = document.createElement('div');
    dayViewSessionFocusQuality.classList.add('dayViewSessionFocusQuality');
    dayViewSessionFocusQuality.innerText = focusQualityStr;

    dayViewSessionStatOverviewContainer.appendChild(dayViewSessionDeepWork);
    dayViewSessionStatOverviewContainer.appendChild(dayViewSessionFocusQuality);

    dayViewSessionContainer.appendChild(dayViewSessionStatOverviewContainer);

    // (2) dayViewSessionStartEndTimeContainer

    // Create the outer container
    const dayViewSessionStartEndTimeContainer = document.createElement('div');
    dayViewSessionStartEndTimeContainer.classList.add('dayViewSessionStartEndTimeContainer');

    // Create the first inner container (start time)
    const startTimeContainer = document.createElement('div');
    startTimeContainer.classList.add('dayViewSessionStartEndTime');

    // Create start time arrow container
    const startTimeArrowContainer = document.createElement('div');
    startTimeArrowContainer.classList.add('startTimeArrowContainer');

    // Create start time arrow image
    const startTimeArrow = document.createElement('img');
    startTimeArrow.src = 'images/icons/startTimeArrow.png';
    startTimeArrow.classList.add('startTimeArrow');

    // Append start time arrow image to the arrow container
    startTimeArrowContainer.appendChild(startTimeArrow);

    // Create start time text container
    const dayViewSessionStartTime = document.createElement('div');
    dayViewSessionStartTime.classList.add('dayViewSessionStartTime');
    dayViewSessionStartTime.textContent = startTime;

    // Append start time arrow container and start time text to start time container
    startTimeContainer.appendChild(startTimeArrowContainer);
    startTimeContainer.appendChild(dayViewSessionStartTime);

    // Create the second inner container (end time)
    const endTimeContainer = document.createElement('div');
    endTimeContainer.classList.add('dayViewSessionStartEndTime');

    // Create end time arrow container
    const endTimeArrowContainer = document.createElement('div');
    endTimeArrowContainer.classList.add('endTimeArrowContainer');

    // Create end time arrow image
    const endTimeArrow = document.createElement('img');
    endTimeArrow.src = 'images/icons/endTimeArrow.png';
    endTimeArrow.classList.add('endTimeArrow');

    // Append end time arrow image to the arrow container
    endTimeArrowContainer.appendChild(endTimeArrow);

    // Create end time text container
    const dayViewSessionEndTime = document.createElement('div');
    dayViewSessionEndTime.classList.add('dayViewSessionEndTime');
    dayViewSessionEndTime.textContent = endTime;

    // Append end time arrow container and end time text to end time container
    endTimeContainer.appendChild(endTimeArrowContainer);
    endTimeContainer.appendChild(dayViewSessionEndTime);

    // Append the start time and end time containers to the outer container
    dayViewSessionStartEndTimeContainer.appendChild(startTimeContainer);
    dayViewSessionStartEndTimeContainer.appendChild(endTimeContainer);

    // Append the entire structure to the body or another container in the DOM
    dayViewSessionContainer.appendChild(dayViewSessionStartEndTimeContainer);

    // (3) dayViewSessionIntervalsContainer

    let deepWorkIntervalsArr = session.deepWorkIntervals;
    let deepWorkIntervalSum = sumArray(deepWorkIntervalsArr);

    let breakIntervalsArr = session.breakIntervals;
    let breakIntervalSum = sumArray(breakIntervalsArr);

    let totalIntervalSum = deepWorkIntervalSum + breakIntervalSum;
    let intervalWidthPercentArr = [];

    for (let i = 0; i < deepWorkIntervalsArr.length; i++) {
        let relativeWidthPercent;
        relativeWidthPercent = ((deepWorkIntervalsArr[i] / totalIntervalSum) * 100);
        intervalWidthPercentArr.push(relativeWidthPercent);

        if (breakIntervalsArr[i]) {
            relativeWidthPercent = ((breakIntervalsArr[i] / totalIntervalSum) * 100);
            intervalWidthPercentArr.push(relativeWidthPercent);
        }
    }

    let dayViewSessionIntervalsContainer = document.createElement('div');
    dayViewSessionIntervalsContainer.classList.add('dayViewSessionIntervalsContainer');

    for (let i = 0; i < intervalWidthPercentArr.length; i++) {
        let dayViewSessionInterval = document.createElement('div');
        dayViewSessionInterval.classList.add('dayViewSessionInterval');
        dayViewSessionInterval.id = "dayViewSessionInterval" + i;
        dayViewSessionInterval.style.width = `${intervalWidthPercentArr[i]}%`;

        // children added to dayViewSessionInterval depends on the order of the array
        let dayViewSessionBlankInterval = document.createElement('div');
        dayViewSessionBlankInterval.classList.add('dayViewSessionBlankInterval');
        if (i % 2 === 0) { // if even, creating a deep work interval
            let dayViewSessionDeepWorkInterval = document.createElement('div');
            dayViewSessionDeepWorkInterval.classList.add('dayViewSessionDeepWorkInterval');

            dayViewSessionInterval.appendChild(dayViewSessionDeepWorkInterval);
            dayViewSessionInterval.appendChild(dayViewSessionBlankInterval);
        } else { // if odd, create a break interval
            let dayViewSessionBreakInterval = document.createElement('div');
            dayViewSessionBreakInterval.classList.add('dayViewSessionBreakInterval');

            dayViewSessionInterval.appendChild(dayViewSessionBlankInterval);
            dayViewSessionInterval.appendChild(dayViewSessionBreakInterval);
        }

        dayViewSessionIntervalsContainer.appendChild(dayViewSessionInterval);
    }
    dayViewSessionContainer.appendChild(dayViewSessionIntervalsContainer);


    // append dayViewSessionContainer to dayViewSessionsContainer
    dayViewSessionsContainer.appendChild(dayViewSessionContainer);
}

function sumArray(arr) {
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function getAdjustedTime(dateString, timeZone) {
    // Parse the input date string and convert it to the specified timezone
    const adjustedTime = moment.tz(dateString, timeZone);
        
    // Return the formatted time, you can customize the format as needed
    return adjustedTime.format('h:mm A');
}

function createAndAppendNoSessionsContainer() {
    let dayViewSessionContainer = document.createElement('div');
    dayViewSessionContainer.classList.add('noSessionsContainer');

    let noSessionsContainer = document.createElement('div');
    noSessionsContainer.classList = 'noSessions no-select';
    noSessionsContainer.innerText = "No Sessions";

    dayViewSessionContainer.appendChild(noSessionsContainer);
    dayViewSessionsContainer.appendChild(dayViewSessionContainer);
}

function setDeepWorkAndFocusQuality() {

    if (dayViewSummaryStats.seconds !== null) {
        dayViewDeepWorkSummaryStat.innerText = `${dayViewSummaryStats.seconds}s`;
    } else {
        dayViewDeepWorkSummaryStat.innerText = `${dayViewSummaryStats.hours}h ${dayViewSummaryStats.minutes}m`;
    }

    dayViewFocusQualitySummaryStat.innerText = `${dayViewSummaryStats.focusQuality}%`;
}

function displayDayViewSummaryChart(animationLength) {

    const ctx = document.getElementById('dayViewSummaryChart').getContext('2d');

    let dayViewFocusQuality = 0;
    let dayViewDeepWorkTime = 0;
    let dayViewTargetHourSum = 0.0000000000000001;

    if (currentWeekData.dailyData) {
        dayViewFocusQuality = 1 - ((currentWeekData.dailyData.distractions / (currentWeekData.dailyData.deepWorkTime / 60000)) / constants.FOCUS_QUALITY_CONSTANT);
        if (dayViewFocusQuality < 0) {
            dayViewFocusQuality = 0;
        }

        dayViewDeepWorkTime = currentWeekData.dailyData.deepWorkTime;
        dayViewTargetHourSum = currentWeekData.dailyData.targetHourSum;
    }

    let focusQuality = getFocusQuality(dayViewFocusQuality);
    dayViewSummaryStats.focusQuality = focusQuality;

    let focusQualityRemainder = 100 - focusQuality;

    let deepWork = getDeepWork(dayViewDeepWorkTime);
    let targetHours = getTargetHours(dayViewTargetHourSum);
    let deepWorkRemainder = targetHours - deepWork;
    if (deepWorkRemainder < 0) {
        deepWorkRemainder = 0;
    }
    let deepWorkHours = Math.floor(deepWork);
    let deepWorkMinutes = Math.round((deepWork - deepWorkHours) * 60);

    dayViewSummaryStats.hours = deepWorkHours;
    dayViewSummaryStats.minutes = deepWorkMinutes;

    let lessThanOneMin = false;
    let deepWorkSeconds;

    // if total deep work is < 1m, calculate number of seconds
    if (dayViewDeepWorkTime < 60000) {
        lessThanOneMin = true;
        deepWorkSeconds = Math.floor(dayViewDeepWorkTime / 1000);
        dayViewSummaryStats.seconds = deepWorkSeconds;
    }

    const data = {
        datasets: [
            {
                label: 'Focus Quality',
                data: [focusQuality, focusQualityRemainder],
                backgroundColor: [
                    'rgba(59, 143, 227, 1)',
                    'rgba(59, 143, 227, 0.15)',
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                ],
                borderWidth: 0,
            },
            {
                label: 'Deep Work',
                data: [deepWork, deepWorkRemainder],
                backgroundColor: [
                    'rgba(83, 230, 88, 1)',
                    'rgba(83, 230, 88, 0.15)',
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                ],
                borderWidth: 0,
            }
        ]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '40%',
            animation: {
                duration: animationLength, // Duration in milliseconds
                animateRotate: true, // Animate rotation
                animateScale: true, // Animate scaling
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'bottom',
                    labels: {
                        boxWidth: 25, // Width of the box
                        padding: 25, // Padding between the legend items
                        usePointStyle: true, // Use point style for the legend
                        textAlign: 'center',
                        generateLabels: function(chart) {
                            // Generate legend items
                            const datasets = chart.data.datasets;
                            return datasets.map((dataset, index) => {
                                return {
                                    text: dataset.label,
                                    fillStyle: dataset.backgroundColor[0],
                                    hidden: !chart.isDatasetVisible(index),
                                    lineCap: dataset.borderCapStyle,
                                    lineDash: dataset.borderDash,
                                    lineDashOffset: dataset.borderDashOffset,
                                    lineJoin: dataset.borderJoinStyle,
                                    strokeStyle: dataset.borderColor[0],
                                    pointStyle: dataset.pointStyle,
                                    datasetIndex: index
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    filter: function(tooltipItem) {
                        // Only show tooltip for the first data point
                        return tooltipItem.dataIndex === 0;
                    },
                    callbacks: {
                        label: function(tooltipItem) {
                            if (tooltipItem.datasetIndex === 0) {
                                return ' Focus Quality: ' + focusQuality + '%';
                            } else if (tooltipItem.datasetIndex === 1) {
                                if (!lessThanOneMin) {
                                    return ' Deep Work: ' + deepWorkHours + 'h ' + deepWorkMinutes + 'm';
                                } else {
                                    return ' Deep Work: ' + deepWorkSeconds + 's';
                                }
                            }
                            return ''; // Default return value
                        }
                    }
                }
            },
            layout: {
                padding: 0
            }
        }
    };

    // Destroy the existing chart instance if it exists
    if (charts.dayViewSummary) {
        charts.dayViewSummary.destroy();
        charts.dayViewSummary = null;
        dayViewSummaryChart.style.display = 'none';
        dayViewSummaryChart.style.opacity = 0;
    }

    // Create a new chart instance
    charts.dayViewSummary = new Chart(ctx, config);

    dayViewSummaryChart.style.display = 'flex';
    setTimeout(() => {
        dayViewSummaryChart.style.opacity = 1;
    }, 0) 
}