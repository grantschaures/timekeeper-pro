import { dashboardData, constants, general, flags} from '../modules/dashboard-objects.js';
import { timeConvert } from '../modules/index-objects.js';

import { populateDashboardSummaryStats } from './summary-stats.js'; // minified
import { populateLabelDistContainer } from './label-distribution.js'; // minified
import { setMetricCharts } from './metric-charts.js'; // minified

import { userTimeZone } from '../utility/identification.js'; // minified
import { setInitialDate } from './daily-sessions.js'; // minified
import { calculateTotalDuration } from '../utility/session-view.js'; // minified

// GLOBAL VARIABLES
const FOCUS_QUALITY_CONSTANT = constants.FOCUS_QUALITY_CONSTANT;

export async function populateDashboard(sessionData, noteData, notesEntries) { // called from state.js & end-session.js (only for logged-in user)

    // create sorted array of data for each day
    await initializeDailyData(sessionData);

    // setDashboardData
    await setDashboardData(sessionData, noteData, notesEntries); // ensure this has executed before constructing chart.js charts

    // update summary stats
    populateDashboardSummaryStats(timeConvert, dashboardData.dailyArr, dashboardData);

    // update label distribution container
    populateLabelDistContainer();

    // setup metric charts
    setMetricCharts();

    // update daily container (for now, updating daily container will pullup current day)
    if (flags.dashboardPopulated) { // if dashboard has been opened before
        setInitialDate();
    }

    flags.dashboardPopulated = true;
}

function createWeeklyArr(notesEntries) {

    // console.log(notesEntries)
    let dailyArr = dashboardData.dailyArr;
    
    let weeklyArr = [];
    let dayObj = {};
    let weekObj = {};

    // FINDING THE EARLIEST DATE BETWEEN NOTES ENTRIES AND SESSIONS FOR
    // INITIAL WEEK START DATE
    let validNotesEntryExists = checkIfNoteOrCompletedTaskExists(notesEntries);
    let initialWeekDate = getInitialWeekDate(general.currentDay);

    let earliestNoteEntryDateObj = getEarliestNoteEntryDate(notesEntries);
    let earliestNoteEntryDate = earliestNoteEntryDateObj.date;
    var earliestNoteEntryDateStr = earliestNoteEntryDateObj.string;

    if ((dailyArr[0]) && (validNotesEntryExists)) {
        // find the earliest date between the two
        let earliestDailyArrDate = moment(dailyArr[0].date, 'YYYY-MM-DD');

        if (earliestNoteEntryDate.isBefore(earliestDailyArrDate)) {
            initialWeekDate = getInitialWeekDate(earliestNoteEntryDateStr);
        } else {
            initialWeekDate = getInitialWeekDate(dailyArr[0].date);
        }

    } else if (dailyArr[0]) {
        // set initialWeekDate to dailyArr[0].date
        initialWeekDate = getInitialWeekDate(dailyArr[0].date);
        
    } else if (validNotesEntryExists) {
        // set initialWeekDate to the earliest notesEntry date
        initialWeekDate = getInitialWeekDate(earliestNoteEntryDateStr);
    }

    // console.log(initialWeekDate);

    let latestFinalWeekDate = getFinalWeekDate(general.currentDay);
    
    let currentDate = initialWeekDate;
    let currentDateObj = moment(currentDate, 'YYYY-MM-DD');
    let latestFinalWeekDateObj = moment(latestFinalWeekDate, 'YYYY-MM-DD');
    
    let tempArr = [];
    while (currentDateObj.isSameOrBefore(latestFinalWeekDateObj)) {
        weekObj = {};
        weekObj[initialWeekDate] = [];
        // console.log(initialWeekDate);

        for (let i = 0; i < 7; i++) {
            dayObj = {
                dailyData: null,
                noteEntryData: null
            };

            let dailyObj = findObjectByDate(dailyArr, currentDate);
            if (dailyObj) {
                dayObj.dailyData = dailyObj;
            }

            let noteEntryObj = getNoteEntriesObj(notesEntries, currentDate);
            if ((noteEntryObj.notes.length > 0) || (noteEntryObj.completedTasks.length > 0)) {
                dayObj.noteEntryData = noteEntryObj;
            }

            weekObj[initialWeekDate].push(dayObj);
            currentDate = incrementDate(currentDate);
        }

        weeklyArr.push(weekObj);
        initialWeekDate = incrementByWeek(initialWeekDate);
        currentDateObj = moment(currentDate, 'YYYY-MM-DD');
    }
    
    // console.log(weeklyArr)

    return weeklyArr;
}

function getEarliestNoteEntryDate(notesEntries) {
    let earliestDate = moment(general.currentDay, 'YYYY-MM-DD');
    let earliestDateStr = earliestDate.format('YYYY-MM-DD');

    for (let i = 0; i < notesEntries.length; i++) {

        // if notesEntries[i] doesn't contain a timeZone, set timeZone to userTimeZone
        let timeZone;
        if (notesEntries[i].entry.timeZone) {
            timeZone = notesEntries[i].entry.timeZone;
        } else {
            timeZone = userTimeZone;
        }

        let notesEntryDateStr;
        if (notesEntries[i].entry.classList.includes('note')) {
            notesEntryDateStr = notesEntries[i].entry.date;
        } else if (notesEntries[i].entry.classList.includes('completed-task')) {
            notesEntryDateStr = notesEntries[i].entry.completionDate;
        }
        
        let notesEntryDate = moment.tz(notesEntryDateStr, timeZone);
        notesEntryDateStr = notesEntryDate.format('YYYY-MM-DD');
        notesEntryDate = moment(notesEntryDateStr, 'YYYY-MM-DD');

        if (notesEntryDate.isBefore(earliestDate)) {
            earliestDate = notesEntryDate;
            earliestDateStr = notesEntryDateStr;
        }
    }
    
    let earliestDateObj = {
        date: earliestDate,
        string: earliestDateStr
    }

    return earliestDateObj;
}

function checkIfNoteOrCompletedTaskExists(notesEntries) {
    // console.log(notesEntries)

    for (let i = 0; i < notesEntries.length; i++) {
        if ((notesEntries[i].entry.classList.includes('note')) || (notesEntries[i].entry.classList.includes('completed-task'))) {
            return true;
        }
    }

    return false;
}

function findObjectByDate(array, targetDate) {
    return array.find(obj => obj.date === targetDate);
}

function getNoteEntriesObj(notesEntries, targetDate) {

    let noteEntriesObj = {
        notes: [],
        completedTasks: []
    };

    for (let i = 0; i < notesEntries.length; i++) {

        let timeZone;
        if (notesEntries[i].entry.timeZone) {
            timeZone = notesEntries[i].entry.timeZone;
        } else {
            timeZone = userTimeZone;
        }

        let noteEntryDateStr;
        if (notesEntries[i].entry.classList.includes('note')) {
            noteEntryDateStr = notesEntries[i].entry.date;
            let noteEntryDate = moment.tz(noteEntryDateStr, timeZone);
            noteEntryDateStr = noteEntryDate.format('YYYY-MM-DD');

            if (noteEntryDateStr === targetDate) {
                noteEntriesObj.notes.push(notesEntries[i].entry);
            }

        } else if (notesEntries[i].entry.classList.includes('completed-task')) {
            noteEntryDateStr = notesEntries[i].entry.completionDate;
            let taskEntryDate = moment.tz(noteEntryDateStr, timeZone);
            noteEntryDateStr = taskEntryDate.format('YYYY-MM-DD');

            if (noteEntryDateStr === targetDate) {
                noteEntriesObj.completedTasks.push(notesEntries[i].entry);
            }
        }
    }

    return noteEntriesObj;
}

function incrementByWeek(firstInitialWeekDate) {
    let date = new Date(firstInitialWeekDate + 'T00:00:00'); // Adding 'T00:00:00' ensures it's treated as a valid date
    date.setDate(date.getDate() + 7);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    let day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function incrementDate(currentDate) {
    let date = new Date(currentDate + 'T00:00:00'); // Adding 'T00:00:00' ensures it's treated as a valid date
    date.setDate(date.getDate() + 1);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    let day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function getInitialWeekDate(dateString) {
    // Manually parse the date string
    let [year, month, day] = dateString.split('-').map(Number);
    
    // Create a new date without time zone adjustments
    let date = new Date(year, month - 1, day);  // Month is 0-indexed

    let dayOfWeek = date.getDay();
    let diffToSunday = dayOfWeek;
    date.setDate(date.getDate() - diffToSunday);
    let finalYear = date.getFullYear();
    let finalMonth = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    let finalDay = String(date.getDate()).padStart(2, '0');

    return `${finalYear}-${finalMonth}-${finalDay}`;
}

function getFinalWeekDate(dateString) {
    // Manually parse the date string
    let [year, month, day] = dateString.split('-').map(Number);
    
    // Create a new date without time zone adjustments
    let date = new Date(year, month - 1, day);  // Month is 0-indexed

    let dayOfWeek = date.getDay();
    let diffToSaturday = 6 - dayOfWeek;
    date.setDate(date.getDate() + diffToSaturday);

    // Format the final week date in 'YYYY-MM-DD'
    let finalYear = date.getFullYear();
    let finalMonth = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because JS months are 0-indexed
    let finalDay = String(date.getDate()).padStart(2, '0');
    
    return `${finalYear}-${finalMonth}-${finalDay}`;
}

async function setDashboardData(sessionData, noteData, notesEntries) {
    dashboardData.sessionArr = sessionData;
    dashboardData.noteData = noteData;
    dashboardData.weeklyArr = createWeeklyArr(notesEntries);
}

async function initializeDailyData(sessions) {

    sessions.forEach(session => {
        const { timeZone, startTime, endTime, totalDeepWork, totalDistractions, perHourData, targetHours, deepWorkIntervals, breakIntervals, labelTimes} = session;

        // check if session startTime date is same as previous one, and if so, add it to the previous target hours
        const adjustedStartTime = moment.tz(startTime, timeZone).format();
        const startDate = moment(adjustedStartTime).format('YYYY-MM-DD');

        // NEW ADDITION
        if (!dashboardData.dailySummary[startDate]) {
            dashboardData.dailySummary[startDate] = {
                date: startDate,
                sessionTimeSum: 0,
                deepWorkTime: 0,
                distractions: 0,
                inDeepWork: false,
                deepWorkIntervals: [],
                breakIntervals: [],
                labelTimes: {},
                targetHourSum: 0,
                moodSum: null,
                sessions: []
            };
        }

        // mood sum
        let mood = session.sessionSummary.subjectiveFeedback;
        if (mood === "good") {
            mood = 1;
        } else if (mood === "ok") {
            mood = 0;
        } else if (mood === "bad") {
            mood = -1;
        } else if (mood === "unsure") {
            mood = "";
        }
        
        if (Number(mood) > 2) {
            mood = "2";
        } else if (Number(mood) < -2) {
            mood = "-2";
        }

        if (mood !== "") {
            if (dashboardData.dailySummary[startDate].moodSum === null) {
                dashboardData.dailySummary[startDate].moodSum = Number(mood);

            } else {
                dashboardData.dailySummary[startDate].moodSum += Number(mood);
            }
        }

        // Session time sum
        let sessionTime = calculateTotalDuration(startTime, endTime).totalDurationMs;
        dashboardData.dailySummary[startDate].sessionTimeSum += sessionTime;

        // Total deep work and distractions
        dashboardData.dailySummary[startDate].deepWorkTime += totalDeepWork;
        dashboardData.dailySummary[startDate].distractions += totalDistractions;
        
        if (totalDeepWork > 0) {
            dashboardData.dailySummary[startDate].inDeepWork = true;
        }

        // add deep work intervals
        for (let interval of deepWorkIntervals) {
            dashboardData.dailySummary[startDate].deepWorkIntervals.push(interval);
        }

        // add break intervals
        for (let interval of breakIntervals) {
            dashboardData.dailySummary[startDate].breakIntervals.push(interval);
        }
        
        // add label times
        if (Object.keys(dashboardData.dailySummary[startDate].labelTimes).length === 0) {
            dashboardData.dailySummary[startDate].labelTimes = { ...labelTimes };
        } else {
            for (let key in labelTimes) {
                if (dashboardData.dailySummary[startDate].labelTimes.hasOwnProperty(key)) {
                    dashboardData.dailySummary[startDate].labelTimes[key] += labelTimes[key];
                } else {
                    dashboardData.dailySummary[startDate].labelTimes[key] = labelTimes[key];
                }
            }
        }

        if (targetHours) {
            dashboardData.dailySummary[startDate].targetHourSum += targetHours;
        }

        dashboardData.dailySummary[startDate].sessions.push(session);
        // NEW ADDITION

        // Iterate through each perHourData key-value pair
        Object.entries(perHourData).forEach(([dateKey, dataValue]) => {
            // Convert the dateKey to the session's time zone
            const adjustedDateKey = moment.tz(dateKey, timeZone).format(); // adjusting for timeZone

            // populating dashboardData.hourlyArr
            let hourlyArrIndex = getHourlyArrIndex(adjustedDateKey);
            if (dataValue.inDeepWork) {
                dashboardData.hourlyArr[hourlyArrIndex].focusQualities.push(focusQualityCalculation(timeConvert, dataValue.deepWorkTime, dataValue.distractions, FOCUS_QUALITY_CONSTANT));
                dashboardData.hourlyArr[hourlyArrIndex].distractionsPerHour.push(calculateDistractionsPerHour(timeConvert, dataValue.deepWorkTime, dataValue.distractions));
                dashboardData.hourlyArr[hourlyArrIndex].deepWorkTimes.push(dataValue.deepWorkTime);
                dashboardData.hourlyArr[hourlyArrIndex].deepWork += dataValue.deepWorkTime;
                dashboardData.hourlyArr[hourlyArrIndex].distractions += dataValue.distractions;
            }
        });
    });

    let summaryArr = Object.values(dashboardData.dailySummary);
    let sortedSummaryArr = sortByDateAscending(summaryArr);
    dashboardData.dailyArr = sortedSummaryArr;
    
    // Reset dailySummary
    dashboardData.dailySummary = {};
}

function sortByDateAscending(arr) {
    return arr.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; // Sort in Ascending order
    });
}

function getHourlyArrIndex(dateTimeString) {
    const match = dateTimeString.match(/T(\d{2}):/);
    if (match) {
        const hour = match[1];
        return parseInt(hour, 10); // Convert to integer to remove leading zeroes
    }
    return null;
}

export function calculateDistractionsPerHour(timeConvert, deepWorkTime, distractions) {
    let distractionsPerHour = (distractions * timeConvert.msPerHour) / deepWorkTime;

    distractionsPerHour = Math.round(distractionsPerHour * 10) / 10;

    return distractionsPerHour;
}

export function focusQualityCalculation(timeConvert, totalTime, totalDistractions, constant) {
    let totalMin = totalTime / timeConvert.msPerMin;
    
    let focusQualityFraction;
    if (totalMin > 0) {
        focusQualityFraction = 1 - ((totalDistractions / totalMin) / (constant)); 
    } else {
        focusQualityFraction = 0;
    }

    if (focusQualityFraction < 0) {
        focusQualityFraction = 0;
    } else if (isNaN(focusQualityFraction)) { // edge case: if user has 0ms of deep work + no distractions (which shouldn't happen, but just in case)
        focusQualityFraction = 1;
    }

    // Ensure precision to 2 decimal places
    focusQualityFraction = parseFloat(focusQualityFraction.toFixed(2));

    return focusQualityFraction;
}