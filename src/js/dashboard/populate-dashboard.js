import { dashboardSubContainer, dashboardContainerCover } from '../modules/dashboard-elements.js';
import { dashboardData, labelDistContainer, mainChartContainer } from '../modules/dashboard-objects.js';
import { timeConvert } from '../modules/index-objects.js';
import { isMobile } from '../modules/dom-elements.js';

import { populateDashboardSummaryStats } from './summary-stats.js';
import { populateLabelDistContainer } from './label-distribution.js';
import { populateMainChartsContainer } from './metric-charts.js';

export async function populateDashboard(sessionData, noteData) { // called from state.js

    // create sorted array of data for each day
    const dailySummarizedData = await initializeDailyData(sessionData);

    // setDashboardData
    await setDashboardData(sessionData, dailySummarizedData, noteData); // ensure this has executed before constructing chart.js charts

    // update summary stats
    populateDashboardSummaryStats(timeConvert, dailySummarizedData, dashboardData);

    // update label distribution container
    populateLabelDistContainer(dashboardData, labelDistContainer);

    // update charts
    populateMainChartsContainer();
}

async function setDashboardData(sessionData, dailySummarizedData, noteData) {
    dashboardData.sessionArr = sessionData;
    dashboardData.dailyArr = dailySummarizedData;
    dashboardData.noteData = noteData;
}

async function initializeDailyData(sessionData) {
    const adjustedDataArray = adjustPerHourDataKeys(sessionData);

    const dailySummarizedData = summarizeDailyData(adjustedDataArray, sessionData);

    return dailySummarizedData;
}

function summarizeDailyData(dataArray, sessionData) {
    const dailySummary = {};
    
    dataArray.forEach(entry => {
        const day = moment(entry.date).format('YYYY-MM-DD'); // Extract the day part of the date
        const { deepWorkTime, distractions, inDeepWork } = entry.data;
        
        if (!dailySummary[day]) {
            dailySummary[day] = {
                date: day,
                deepWorkTime: 0,
                distractions: 0,
                inDeepWork: false,
                deepWorkIntervals: [],
                breakIntervals: [],
                labelTimes: {}
            };

            // if sessionData contains an arr element (obj) w/ startTime value starting w same YYYY-MM-DD value, add it!
            addIntervalsLabelTimes(day, sessionData, dailySummary);
        }
        
        dailySummary[day].deepWorkTime += deepWorkTime;
        dailySummary[day].distractions += distractions;
        
        if (inDeepWork) {
            dailySummary[day].inDeepWork = true;
        }

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

function adjustPerHourDataKeys(sessions) {
    let adjustedPerHourDataArray = [];
    
    sessions.forEach(session => {
        const { timeZone, perHourData } = session;

        // Iterate through each perHourData key-value pair
        Object.entries(perHourData).forEach(([dateKey, dataValue]) => {
            // Convert the dateKey to the session's time zone
            const adjustedDateKey = moment.tz(dateKey, timeZone).format();

            // Push the adjusted key-value pair to the new array
            adjustedPerHourDataArray.push({
                date: adjustedDateKey,
                data: dataValue
            });

            let hourlyArrIndex = getHourlyArrIndex(adjustedDateKey);
            if (dataValue.inDeepWork) {
                dashboardData.hourlyArr[hourlyArrIndex].focusQualities.push(focusQualityCalculation(timeConvert, dataValue.deepWorkTime, dataValue.distractions, 0.5));
                dashboardData.hourlyArr[hourlyArrIndex].distractionsPerHour.push(calculateDistractionsPerHour(timeConvert, dataValue.deepWorkTime, dataValue.distractions));
                dashboardData.hourlyArr[hourlyArrIndex].deepWorkTimes.push(dataValue.deepWorkTime);
            }
        });
    });

    return adjustedPerHourDataArray;
}

function getHourlyArrIndex(dateTimeString) {
    const match = dateTimeString.match(/T(\d{2}):/);
    if (match) {
        const hour = match[1];
        return parseInt(hour, 10); // Convert to integer to remove leading zeroes
    }
    return null;
}

function calculateDistractionsPerHour(timeConvert, deepWorkTime, distractions) {
    let distractionsPerHour = (distractions * timeConvert.msPerHour) / deepWorkTime;

    distractionsPerHour = Math.round(distractionsPerHour * 10) / 10;

    return distractionsPerHour;
}

export function focusQualityCalculation(timeConvert, totalTime, totalDistractions, constant) {
    let totalMin = totalTime / timeConvert.msPerMin;
    let focusQualityFraction = 1 - ((totalDistractions / totalMin) / (constant));
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