import { totalDeepWorkSummaryStat, avgDeepWorkSummaryStat, avgFocusQualitySummaryStat, avgIntervalLengthSummaryStat, mostFocusedHourSummaryStat } from '../modules/dashboard-elements.js';
import { timeConvert } from '../modules/index-objects.js';

import { focusQualityCalculation } from './populate-dashboard.js';

// Global Vars
const FOCUS_QUALITY_CONSTANT = 0.5;

export function populateDashboardSummaryStats(timeConvert, dailySummarizedData, dashboardData) {
    let totalDeepWork = 0;
    let totalDistractions = 0;
    let totalDeepWorkIntervals = [];

    if (dailySummarizedData.length > 0) {
        for (let i = 0; i < dailySummarizedData.length; i++) {
            totalDeepWork += dailySummarizedData[i].deepWorkTime;

            totalDistractions += dailySummarizedData[i].distractions;

            dailySummarizedData[i].deepWorkIntervals.forEach(interval => {
                totalDeepWorkIntervals.push(interval);
            })
        }
    
        // total deep work 
        let totalDeepWorkHrs = populateTotalDeepWorkSummaryStat(timeConvert, totalDeepWork);
    
        // avg. deep work per day
        populateAvgDeepWorkSummaryStat(totalDeepWorkHrs, dailySummarizedData);
    
        // avg. focus quality per day
        populateFocusQualitySummaryStat(totalDeepWork, totalDistractions);

        // avg. interval length
        populateAvgIntervalLengthSummaryStat(timeConvert, totalDeepWorkIntervals);
        
        // most focused hour
        populateMostFocusedHourSummaryStat(dashboardData);

    } else {
        setDefaultAllSummaryStats();
    }
}

function populateMostFocusedHourSummaryStat(dashboardData) {
    // most focused hour - the hour which has the highest focus quality
    let highestAvgFocusQuality = 0;
    let highestAvgFocusQualityIndex;
    for (let i = 0; i < 24; i++) { // for each hour of the day
        let currentHour = dashboardData.hourlyArr[i];
        let currentAvgFocusQuality = currentHour.focusQualities.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / currentHour.focusQualities.length;
        if (currentAvgFocusQuality > highestAvgFocusQuality) {
            highestAvgFocusQuality = currentAvgFocusQuality;
            highestAvgFocusQualityIndex = i;
        } else if (currentAvgFocusQuality == highestAvgFocusQuality) {
            let initialHour = dashboardData.hourlyArr[highestAvgFocusQualityIndex];
            // if the current hour has a higher average deep work time, then it becomes the highest quality
            let highestAvgFocusQuality_AvgDeepWork = initialHour.deepWorkTimes.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / initialHour.deepWorkTimes.length;
            let currentAvgFocusQuality_AvgDeepWork = currentHour.deepWorkTimes.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / currentHour.deepWorkTimes.length;

            if (currentAvgFocusQuality_AvgDeepWork > highestAvgFocusQuality_AvgDeepWork) {
                highestAvgFocusQuality = currentAvgFocusQuality;
                highestAvgFocusQualityIndex = i;
            }
        }
    }

    let hourStrArr = [
        '12am-1am', '1am-2am', '2am-3am', '3am-4am',
        '4am-5am', '5am-6am', '6am-7am', '7am-8am',
        '8am-9am', '9am-10am', '10am-11am', '11am-12pm',
        '12pm-1pm', '1pm-2pm', '2pm-3pm', '3pm-4pm',
        '4pm-5pm', '5pm-6pm', '6pm-7pm', '7pm-8pm',
        '8pm-9pm', '9pm-10pm', '10pm-11pm', '11pm-12am'
    ]

    let highestAvgFocusQualityStr = hourStrArr[highestAvgFocusQualityIndex];
    mostFocusedHourSummaryStat.innerText = highestAvgFocusQualityStr;
}

function populateAvgIntervalLengthSummaryStat(timeConvert, totalDeepWorkIntervals) {
    let avgDeepWorkIntervalMs = totalDeepWorkIntervals.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / totalDeepWorkIntervals.length;
    let avgDeepWorkInterval = avgDeepWorkIntervalMs / timeConvert.msPerHour;
    let avgDeepWorkIntervalHour = Math.floor(avgDeepWorkInterval);
    let avgDeepWorkIntervalMinutes = Math.round((avgDeepWorkInterval - avgDeepWorkIntervalHour) * 60);
    let avgDeepWorkIntervalStr = avgDeepWorkIntervalHour + 'h ' + avgDeepWorkIntervalMinutes + 'm';
    avgIntervalLengthSummaryStat.innerText = avgDeepWorkIntervalStr;
}

function setDefaultAllSummaryStats() {
    totalDeepWorkSummaryStat.innerText = "0h 0m";
    avgDeepWorkSummaryStat.innerText = "N/A";
    avgFocusQualitySummaryStat.innerText = "N/A";
    avgIntervalLengthSummaryStat.innerText = "N/A";
    mostFocusedHourSummaryStat.innerText = "N/A";
}

function populateFocusQualitySummaryStat(totalDeepWork, totalDistractions) {

    let deepWorkHours = totalDeepWork / timeConvert.msPerHour; // total hour float
    let deepWorkMinutes = deepWorkHours * 60; // total minutes float

    // focus quality calculation
    let focusQuality = 1 - ((totalDistractions / deepWorkMinutes) / FOCUS_QUALITY_CONSTANT);
    if (focusQuality < 0) {
        focusQuality = 0;
    } else if (isNaN(focusQuality)) {
        focusQuality = 1;
    }

    let avgFocusQualityPercent = Math.floor(focusQuality * 100);
    let avgFocusQualityStr = avgFocusQualityPercent + '%';
    avgFocusQualitySummaryStat.innerText = avgFocusQualityStr;
}

function populateAvgDeepWorkSummaryStat(totalDeepWork, dailySummarizedData) {
    let avgDeepWork = totalDeepWork / dailySummarizedData.length;
    let avgDeepWorkHours = Math.floor(avgDeepWork);
    let avgDeepWorkMinutes = Math.floor((avgDeepWork - avgDeepWorkHours) * 60);
    let avgDeepWorkStr = avgDeepWorkHours + 'h ' + avgDeepWorkMinutes + 'm';
    avgDeepWorkSummaryStat.innerText = avgDeepWorkStr;
}

function populateTotalDeepWorkSummaryStat(timeConvert, totalDeepWork) {

    totalDeepWork = totalDeepWork / timeConvert.msPerHour;
    let totalDeepWorkHours = Math.floor(totalDeepWork);
    let totalDeepWorkMinutes = Math.round((totalDeepWork - totalDeepWorkHours) * 60);
    let totalDeepWorkStr = totalDeepWorkHours + 'h ' + totalDeepWorkMinutes + 'm';
    totalDeepWorkSummaryStat.innerText = totalDeepWorkStr;

    return totalDeepWork;
}