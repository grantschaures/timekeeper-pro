import { dashboardData, constants, general } from '../modules/dashboard-objects.js';
import { timeConvert } from '../modules/index-objects.js';

import { populateDashboardSummaryStats } from './summary-stats.js'; // minified
import { populateLabelDistContainer } from './label-distribution.js'; // minified
import { setMetricCharts } from './metric-charts.js'; // minified

// GLOBAL VARIABLES
const FOCUS_QUALITY_CONSTANT = constants.FOCUS_QUALITY_CONSTANT;

export async function populateDashboard(sessionData, noteData) { // called from state.js

    // create sorted array of data for each day
    await initializeDailyData(sessionData);

    // setDashboardData
    await setDashboardData(sessionData, noteData); // ensure this has executed before constructing chart.js charts

    // update summary stats
    populateDashboardSummaryStats(timeConvert, dashboardData.dailyArr, dashboardData);

    // update label distribution container
    populateLabelDistContainer();

    // setup metric charts
    setMetricCharts();
}

function createWeeklyArr() {
    let dailyArr = dashboardData.dailyArr;
    
    let weeklyArr = [];
    let dayObj = {};
    let weekObj = {};

    let initialWeekDate = getInitialWeekDate(dailyArr[0].date); // key for the weekObjs
    let latestFinalWeekDate = getFinalWeekDate(general.currentDay);
    
    let currentDate = initialWeekDate;
    let currentDateObj = moment(currentDate, 'YYYY-MM-DD');
    let latestFinalWeekDateObj = moment(latestFinalWeekDate, 'YYYY-MM-DD');
    
    while (currentDateObj.isSameOrBefore(latestFinalWeekDateObj)) {
        weekObj = {};
        weekObj[initialWeekDate] = [];
        // console.log(initialWeekDate);

        for (let i = 0; i < 7; i++) {
            dayObj = {};
            dayObj[currentDate] = null;

            let dailyObj = findObjectByDate(dailyArr, currentDate);
            if (dailyObj) {
                dayObj[currentDate] = dailyObj;
            }

            weekObj[initialWeekDate].push(dayObj[currentDate]);
            currentDate = incrementDate(currentDate);
        }

        weeklyArr.push(weekObj);
        initialWeekDate = incrementByWeek(initialWeekDate);
        currentDateObj = moment(currentDate, 'YYYY-MM-DD');
    }

    return weeklyArr;
}

function incrementByWeek(firstInitialWeekDate) {
    let date = new Date(firstInitialWeekDate + 'T00:00:00'); // Adding 'T00:00:00' ensures it's treated as a valid date
    date.setDate(date.getDate() + 7);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    let day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function findObjectByDate(array, targetDate) {
    return array.find(obj => obj.date === targetDate);
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
    let date = new Date(dateString);
    let dayOfWeek = date.getDay();
    let diffToSunday = dayOfWeek;
    date.setDate(date.getDate() - diffToSunday);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    let day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getFinalWeekDate(dateString) {
    let date = new Date(dateString);
    let dayOfWeek = date.getDay();
    let diffToSaturday = 6 - dayOfWeek;
    date.setDate(date.getDate() + diffToSaturday);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    let day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

async function setDashboardData(sessionData, noteData) {
    dashboardData.sessionArr = sessionData;
    dashboardData.noteData = noteData;
    dashboardData.weeklyArr = createWeeklyArr();
}

async function initializeDailyData(sessions) {

    sessions.forEach(session => {
        const { timeZone, totalDeepWork, totalDistractions, perHourData, targetHours, startTime, deepWorkIntervals, breakIntervals, labelTimes} = session;

        // check if session startTime date is same as previous one, and if so, add it to the previous target hours
        const adjustedStartTime = moment.tz(startTime, timeZone).format();
        const startDate = moment(adjustedStartTime).format('YYYY-MM-DD');

        // NEW ADDITION
        if (!dashboardData.dailySummary[startDate]) {
            dashboardData.dailySummary[startDate] = {
                date: startDate,
                deepWorkTime: 0,
                distractions: 0,
                inDeepWork: false,
                deepWorkIntervals: [],
                breakIntervals: [],
                labelTimes: {},
                targetHourSum: null,
                sessions: []
            };
        }

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
}

function summarizeDailyData(dataArray, sessionData) {
    // const dailySummary = {};
    
    dataArray.forEach(entry => {
        const dateStr = entry.date;
        const date = dateStr.split('T')[0];
        const day = moment(date).format('YYYY-MM-DD'); // Extract the day part of the date
        const { deepWorkTime = 0, distractions = 0, inDeepWork = false } = entry.data;
        
        // if (!dailySummary[day]) {
        //     dailySummary[day] = {
        //         date: day,
        //         deepWorkTime: 0,
        //         distractions: 0,
        //         inDeepWork: false,
        //         deepWorkIntervals: [],
        //         breakIntervals: [],
        //         labelTimes: {}
        //     };

        //     // if sessionData contains an arr element (obj) w/ startTime value starting w same YYYY-MM-DD value, add it!
        //     addIntervalsLabelTimes(day, sessionData, dailySummary);
        // }
        
        // dashboardData.dailySummary[day].deepWorkTime += deepWorkTime;
        // dashboardData.dailySummary[day].distractions += distractions;
        
        // if (inDeepWork) {
        //     dashboardData.dailySummary[day].inDeepWork = true;
        // }

    });
    
    let summaryArr = Object.values(dailySummary);
    let sortedSummaryArr = sortByDateAscending(summaryArr);

    // Convert the summary object back to an array
    return sortedSummaryArr;
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

function addIntervalsLabelTimes(day, sessionData, dailySummary) {

    // Iterate through the array of objects
    for (let session of sessionData) {
        // Extract the date part from the startTime field of each object
        const adjustedSessionStartTime = moment.tz(session.startTime, session.timeZone).format();
        const sessionDate = adjustedSessionStartTime.split('T')[0];

        // Compare the date parts
        if (sessionDate == day) {

            // add deep work intervals
            for (let interval of session.deepWorkIntervals) {
                dailySummary[day].deepWorkIntervals.push(interval);
            }

            // add break intervals
            for (let interval of session.breakIntervals) {
                dailySummary[day].breakIntervals.push(interval);
            }
            
            // add label times
            if (Object.keys(dailySummary[day].labelTimes).length === 0) {
                dailySummary[day].labelTimes = { ...session.labelTimes };
            } else {
                for (let key in session.labelTimes) {
                    if (dailySummary[day].labelTimes.hasOwnProperty(key)) {
                        dailySummary[day].labelTimes[key] += session.labelTimes[key];
                    } else {
                        dailySummary[day].labelTimes[key] = session.labelTimes[key];
                    }
                }
            }
        }
    }

    // Return false if no matching date is found
    return false;
}