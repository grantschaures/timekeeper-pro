import { dailyDay, dailyDate, totalDeepWorkSummaryStat, avgDeepWorkSummaryStat, avgFocusQualitySummaryStat, avgIntervalLengthSummaryStat, mostFocusedHourSummaryStat } from '../modules/dashboard-elements.js';
import { dashboardData } from '../modules/dashboard-objects.js';
import { timeConvert } from '../modules/index-objects.js';

export async function populateDashboard(sessionData, noteData) {
    console.log("Sessions")
    console.log(sessionData);
    console.log("")

    // create sorted array of data for each day
    const dailySummarizedData = await initializeDailyData(sessionData);

    // setDashboardData
    setDashboardData(sessionData, dailySummarizedData); // ensure this has executed before constructing chart.js charts

    // set initial date of dailyDateContainer
    setInitialDate();
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
    console.log(adjustedDataArray)

    const dailySummarizedData = summarizeDailyData(adjustedDataArray, sessionData);
    console.log(dailySummarizedData)

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

            let hourlyArrIndex = getHourlyArrIndex(adjustedDateKey);
            if (dataValue.inDeepWork) {
                dashboardData.hourlyArr[hourlyArrIndex].focusQualities.push(focusQualityCalculation(timeConvert, dataValue.deepWorkTime, dataValue.distractions, 0.5));
                dashboardData.hourlyArr[hourlyArrIndex].distractionsPerHour.push(calculateDistractionsPerHour(timeConvert, dataValue.deepWorkTime, dataValue.distractions));
                dashboardData.hourlyArr[hourlyArrIndex].deepWorkTimes.push(dataValue.deepWorkTime);
            }
        });
    });

    console.log(dashboardData);

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

function focusQualityCalculation(timeConvert, totalTime, totalDistractions, constant) {
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

        // avg. interval length
        populateAvgIntervalLengthSummaryStat();
        

        // most focused hour

    } else {
        setDefaultAllSummaryStats();
    }
}

function setDefaultAllSummaryStats() {
    totalDeepWorkSummaryStat.innerText = "0h 0m";
    avgDeepWorkSummaryStat.innerText = "N/A";
    avgFocusQualitySummaryStat.innerText = "N/A";
    avgIntervalLengthSummaryStat.innerText = "N/A";
    mostFocusedHourSummaryStat.innerText = "N/A";
}

function populateFocusQualitySummaryStat(dailyFocusQualityArr, dailySummarizedData) {
    let avgFocusQuality = dailyFocusQualityArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / dailySummarizedData.length;
    let avgFocusQualityPercent = Math.floor(avgFocusQuality * 100);
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