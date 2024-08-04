import { dailyDay, dailyDate, totalDeepWorkSummaryStat, avgDeepWorkSummaryStat, avgFocusQualitySummaryStat, avgDistractionsSummaryStat, mostFocusedHourSummaryStat } from '../modules/dashboard-elements.js';
import { dashboardData } from '../modules/dashboard-objects.js';
import { focusQualityCalculation } from '../main/end-session.js';
import { timeConvert } from '../modules/index-objects.js';
import { getFocusQuality } from '../utility/session-summary-chart.js';

export async function populateDashboard(sessionData, noteData) {
    // create sorted array of data for each day
    const dailySummarizedData = await initializeDailyData(sessionData);

    // setDashboardData
    setDashboardData(sessionData, dailySummarizedData); // ensure this has executed before constructing chart.js charts

    // populate dashboardSummaryStats
    populateDashboardSummaryStats(sessionData, dailySummarizedData);

    // set initial date of dailyDateContainer
    setInitialDate();
}

function populateDashboardSummaryStats(sessionData, dailySummarizedData) {
    let totalDeepWork = 0;
    let dailyFocusQualityArr = [];

    if (dailySummarizedData.length > 0) {
        for (let i = 0; i < dailySummarizedData.length; i++) {
            totalDeepWork += dailySummarizedData[i].deepWorkTime;
            dailyFocusQualityArr.push(focusQualityCalculation(timeConvert, dailySummarizedData[i].deepWorkTime, dailySummarizedData[i].distractions, 0.5));
        }
    
        // total deep work 
        totalDeepWork = populateTotalDeepWorkSummaryStat(totalDeepWork);
    
        // avg. deep work per day
        populateAvgDeepWorkSummaryStat(totalDeepWork, dailySummarizedData);
    
        // avg. focus quality per day
        populateFocusQualitySummaryStat(dailyFocusQualityArr, dailySummarizedData);

        // avg. distractions per hour
        

        // most focused hour

    } else {
        setDefaultAllSummaryStats();
    }
}

function setDefaultAllSummaryStats() {
    totalDeepWorkSummaryStat.innerText = "0h 0m";
    avgDeepWorkSummaryStat.innerText = "N/A";
    avgFocusQualitySummaryStat.innerText = "N/A";
    avgDistractionsSummaryStat.innerText = "N/A";
    mostFocusedHourSummaryStat.innerText = "N/A";
}

function populateFocusQualitySummaryStat(dailyFocusQualityArr, dailySummarizedData) {
    let avgFocusQuality = dailyFocusQualityArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / dailySummarizedData.length;
    let avgFocusQualityPercent = getFocusQuality(avgFocusQuality);
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

function populateTotalDeepWorkSummaryStat(totalDeepWork) {
    totalDeepWork = totalDeepWork / 3600000;
    let totalDeepWorkHours = Math.floor(totalDeepWork);
    let totalDeepWorkMinutes = Math.floor((totalDeepWork - totalDeepWorkHours) * 60);
    let totalDeepWorkStr = totalDeepWorkHours + 'h ' + totalDeepWorkMinutes + 'm';
    totalDeepWorkSummaryStat.innerText = totalDeepWorkStr;

    return totalDeepWork;
}

function setDashboardData(sessionData, dailySummarizedData) {
    dashboardData.sessionArr = sessionData;
    dashboardData.dailyArr = dailySummarizedData;
}

function setInitialDate() {
    const now = new Date();
    
    // Array of weekdays
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Array of month names
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    // Get the day of the week and the date
    const dayOfWeek = weekdays[now.getDay()]; // Get the day of the week
    const month = months[now.getMonth()]; // Get the month name
    const day = now.getDate(); // Get the day of the month
    const year = now.getFullYear(); // Get the year
    
    // Format the date as "Month Day, Year"
    const formattedDate = `${month} ${day}, ${year}`;

    dailyDay.innerText = dayOfWeek;
    dailyDate.innerText = formattedDate;
}

async function initializeDailyData(sessionData) {
    const adjustedDataArray = adjustPerHourDataKeys(sessionData);
    console.log(adjustedDataArray);

    const dailySummarizedData = summarizeDailyData(adjustedDataArray);
    console.log(dailySummarizedData);

    return dailySummarizedData;
}

function summarizeDailyData(dataArray) {
    const dailySummary = {};

    dataArray.forEach(entry => {
        const day = moment(entry.date).format('YYYY-MM-DD'); // Extract the day part of the date
        const { deepWorkTime, distractions, inDeepWork } = entry.data;

        if (!dailySummary[day]) {
            dailySummary[day] = {
                date: day,
                deepWorkTime: 0,
                distractions: 0,
                inDeepWork: false
            };
        }

        dailySummary[day].deepWorkTime += deepWorkTime;
        dailySummary[day].distractions += distractions;

        if (inDeepWork) {
            dailySummary[day].inDeepWork = true;
        }
    });

    // Convert the summary object back to an array
    return Object.values(dailySummary);
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
        });
    });

    return adjustedPerHourDataArray;
}