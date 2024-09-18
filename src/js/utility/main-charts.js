import { directionIndicators, summaryAvgAdjustedDeepWorkDown, summaryAvgAdjustedDeepWorkTime, summaryAvgAdjustedDeepWorkUp, summaryAvgBreakInterval, summaryAvgBreakIntervalDown, summaryAvgBreakIntervalUp, summaryAvgDeepWorkDown, summaryAvgDeepWorkInterval, summaryAvgDeepWorkIntervalDown, summaryAvgDeepWorkIntervalUp, summaryAvgDeepWorkTime, summaryAvgDeepWorkUp, summaryDeepWorkTime, summaryDeepWorkTimeUp, summaryFocusQuality, summaryFocusQualityDown, summaryFocusQualityUp } from "../modules/dashboard-elements.js";
import { charts, mainChartContainer, dashboardData, flags, constants, general } from "../modules/dashboard-objects.js";
import { timeConvert } from "../modules/index-objects.js";

import { updateDailyContainer } from '../dashboard/daily-sessions.js'; // minified

// Global Variables
let deepWorkArr = []; // holds normal or quality adjusted deep work time

let deepWork365Arr = []; // holds data for each day in year
let distractions365Arr = []; // holds distractions for each day, going up to a year (365 days)
let deepWorkInterval365Arr = [];
let breakInterval365Arr = [];

let focusQualityArr = [];
let avgIntervalArr = [];
let sundayIndices = [];

let percentInDeepWorkArr = [];

let deepWorkIntervalDataArr = [];
let breakIntervalDataArr = [];

const FOCUS_QUALITY_CONSTANT = constants.FOCUS_QUALITY_CONSTANT;

let currStats = {
    deepWorkTime: null, // hrs
    avgDeepWorkTime: null, // hrs
    focusQuality: null, // float
    adjustedDeepWorkTime: null, // hrs
    deepWorkInterval: null, // min
    breakInterval: null // min
}

let prevStats = {
    deepWorkTime: null, // hrs
    avgDeepWorkTime: null, // hrs
    focusQuality: null, // float
    adjustedDeepWorkTime: null, // hrs
    deepWorkInterval: null, // min
    breakInterval: null // min
}

// holds yMax value for non-adjusted value (for deep work)
let yMax = {
    deepWork: 0,
    avgInterval: 0
}
// y-max for focus quality will always be 100

let dateStrArr = [];

const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const monthsOfTheYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let xAxisTickLabels = {
    week: daysOfTheWeek,
    month: [], // dynamically loaded
    year: monthsOfTheYear
}

document.addEventListener("displayMainCharts", async function() {

    // reset everything
    resetStats(currStats);
    resetStats(prevStats);
    await resetData();

    await initializeData(dashboardData, mainChartContainer, deepWorkArr, focusQualityArr, avgIntervalArr, yMax);
    let chartTransition = general.chartTransition;

    if (chartTransition === 'summary') {
        displayMainChartsSummaryStats();
    }

    if ((chartTransition === 'all') || (chartTransition === 'main-adjusted')) {
        displayDeepWorkChart();
    }

    if (chartTransition === 'all') {
        displayFocusQualityChart();
        displayPercentDeepWorkChart();
    }

    if ((chartTransition === 'all') || (chartTransition === 'main-break')) {
        displayAvgIntervalChart();
    }

    flags.quickerChartAnimations = true;

    await initializeSessionData();

    if (chartTransition === 'all') {
        displaySessionIntervalsChart();
    }
}) 

// // // // // // //
// HELPER FUNCTIONS
// // // // // // //

function resetStats(stats) {
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            stats[key] = null;
        }
    }
}

async function displayMainChartsSummaryStats() {

    // display deep work time
    let deepWorkTime = calculateSummaryDeepWorkTime();

    // display avg deep work (per day)
    let avgDeepWorkTime = calculateAvgDeepWork();

    // display avg quality adjusted deep work (per day)
    let combinedArr1 = calculateFocusQualityAndAdjustedAvgDeepWork();

    // display intervals
    let combinedArr2 = calculateAvgIntervals();

    await setStatsObj(currStats, deepWorkTime, avgDeepWorkTime, combinedArr1[0], combinedArr1[1], combinedArr2[0], combinedArr2[1]);

    displayCurrStats();

    setDirectionIndicators();
}

async function setDirectionIndicators() {
    // temporarily set lower and upper bounds back by one timeFrame length
    tempBoundShift('shiftdown');

    // reset main arrays
    await resetData();

    //re-initialize data
    await initializeData(dashboardData, mainChartContainer, deepWorkArr, focusQualityArr, avgIntervalArr, yMax);

    // calculate same summary stats as above and store result in object called prevStats
    // display deep work time
    let deepWorkTime = calculateSummaryDeepWorkTime();

    // display avg deep work (per day)
    let avgDeepWorkTime = calculateAvgDeepWork();

    // display avg quality adjusted deep work (per day)
    let combinedArr1 = calculateFocusQualityAndAdjustedAvgDeepWork();

    // display intervals
    let combinedArr2 = calculateAvgIntervals();

    await setStatsObj(prevStats, deepWorkTime, avgDeepWorkTime, combinedArr1[0], combinedArr1[1], combinedArr2[0], combinedArr2[1]);

    // compare to current stats and make corresponding changes to direction indicators
    displayDirectionIndicators();

    // reset lower and upper bounds to what they were previously
    tempBoundShift('shiftup');
}

function displayDirectionIndicators() {
    compareAndSetDeepWorkIndicatorDirection('deepWorkTime');
    compareAndSetIndicatorDirection('avgDeepWorkTime', summaryAvgDeepWorkUp, summaryAvgDeepWorkDown);
    compareAndSetIndicatorDirection('adjustedDeepWorkTime', summaryAvgAdjustedDeepWorkUp, summaryAvgAdjustedDeepWorkDown);
    compareAndSetIndicatorDirection('focusQuality', summaryFocusQualityUp, summaryFocusQualityDown);
    compareAndSetIndicatorDirection('deepWorkInterval', summaryAvgDeepWorkIntervalUp, summaryAvgDeepWorkIntervalDown);
    compareAndSetIndicatorDirection('breakInterval', summaryAvgBreakIntervalUp, summaryAvgBreakIntervalDown);

    // console.log(currStats)
    // console.log(prevStats)
}

function compareAndSetDeepWorkIndicatorDirection(statType) {
    if (currStats[statType] > prevStats[statType]) {
        summaryDeepWorkTimeUp.style.display = 'flex';
        setTimeout(() => {
            summaryDeepWorkTimeUp.style.opacity = '1';
        }, 0)
    }
}

function compareAndSetIndicatorDirection(statType, upIndicator, downIndicator) {

    if ((prevStats[statType] !== null) && (currStats[statType] !== null)) {
        if (currStats[statType] > prevStats[statType]) {
            upIndicator.style.display = 'flex';
            setTimeout(() => {
                upIndicator.style.opacity = '1';
            }, 0)
        } else if (currStats[statType] < prevStats[statType]) {
            downIndicator.style.display = 'flex';
            setTimeout(() => {
                downIndicator.style.opacity = '1';
            }, 0)
        }
    } else {
        upIndicator.style.display = 'none';
        downIndicator.style.display = 'none';
        setTimeout(() => {
            upIndicator.style.opacity = '0';
            downIndicator.style.opacity = '0';
        }, 0)
    }
}

function displayCurrStats() {
    displayDeepWorkTime(currStats.deepWorkTime);
    displayAvgDeepWorkTime(currStats.avgDeepWorkTime);
    displayFocusQuality(currStats.focusQuality);
    displayAdjustedAvgDeepWorkTime(currStats.focusQuality, currStats.adjustedDeepWorkTime);
    displayAvgIntervals(currStats.deepWorkInterval, currStats.breakInterval);
}

function displayAvgIntervals(deepWorkInterval, breakInterval) {

    let deepWorkIntervalAvgStr;
    if (deepWorkInterval !== null) {
        deepWorkIntervalAvgStr = Math.round(deepWorkInterval) + 'm';
    } else {
        deepWorkIntervalAvgStr = 'N/A';
    }

    let breakIntervalAvgStr;
    if (breakInterval !== null) {
        breakIntervalAvgStr = Math.round(breakInterval) + 'm';
    } else {
        breakIntervalAvgStr = 'N/A';
    }

    summaryAvgDeepWorkInterval.innerHTML = `<b>${deepWorkIntervalAvgStr}</b>`;
    summaryAvgBreakInterval.innerHTML = `<b>${breakIntervalAvgStr}</b>`;
}

function displayAdjustedAvgDeepWorkTime(focusQuality, adjustedDeepWorkTime) {

    let adjustedAvgDeepWorkStr;
    if ((focusQuality !== null) && (adjustedDeepWorkTime !== null)) {
        let hours = Math.floor(adjustedDeepWorkTime);
        let mins = Math.round((adjustedDeepWorkTime - hours) * 60);
        adjustedAvgDeepWorkStr = `${hours}h ${mins}m`;
    } else {
        adjustedAvgDeepWorkStr = 'N/A';
    }

    summaryAvgAdjustedDeepWorkTime.innerHTML = `<b>${adjustedAvgDeepWorkStr}</b>`;
}

function displayFocusQuality(focusQuality) {
    let focusQualityStr;
    if (focusQuality !== null) {
        focusQualityStr = Math.floor(focusQuality * 100) + '%';
    } else {
        focusQualityStr = 'N/A';
    }

    summaryFocusQuality.innerHTML = `<b>${focusQualityStr}</b>`;
}

function displayAvgDeepWorkTime(avgDeepWorkTime) {
    
    let avgDeepWorkTimeStr;
    if (avgDeepWorkTime !== null) {
        let hours = Math.floor(avgDeepWorkTime);
        let mins = Math.round((avgDeepWorkTime - hours) * 60);
        avgDeepWorkTimeStr = `${hours}h ${mins}m`;
    } else {
        avgDeepWorkTimeStr = 'N/A';
    }

    summaryAvgDeepWorkTime.innerHTML = `<b>${avgDeepWorkTimeStr}</b>`;
}

function displayDeepWorkTime(deepWorkTime) {
    let hours = Math.floor(deepWorkTime);
    let mins = Math.round((deepWorkTime - hours) * 60);
    let deepWorkTimeStr = ` ${hours}h ${mins}m`;
    
    summaryDeepWorkTime.innerHTML = `<b>${deepWorkTimeStr}</b>`;
}

function tempBoundShift(type) { // type can be 'shiftup' or 'shiftdown'
    if ((type === 'shiftup')) {
        mainChartContainer.lowerBound = moment(mainChartContainer.lowerBound, 'YYYY-MM-DD').add(1, mainChartContainer.timeFrame).format('YYYY-MM-DD');

        // Adjust upperBound if the timeFrame is month
        if (mainChartContainer.timeFrame === 'month') {
            mainChartContainer.upperBound = moment(mainChartContainer.lowerBound, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');
        } else {
            mainChartContainer.upperBound = moment(mainChartContainer.upperBound, 'YYYY-MM-DD').add(1, mainChartContainer.timeFrame).format('YYYY-MM-DD');
        }

    } else if (type === 'shiftdown') {
        mainChartContainer.lowerBound = moment(mainChartContainer.lowerBound, 'YYYY-MM-DD').subtract(1, mainChartContainer.timeFrame).format('YYYY-MM-DD');

        // Adjust upperBound if the timeFrame is month
        if (mainChartContainer.timeFrame === 'month') {
            mainChartContainer.upperBound = moment(mainChartContainer.lowerBound, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');
        } else {
            mainChartContainer.upperBound = moment(mainChartContainer.upperBound, 'YYYY-MM-DD').subtract(1, mainChartContainer.timeFrame).format('YYYY-MM-DD');
        }
    }
}

async function setStatsObj(statsObj, deepWorkTime, avgDeepWorkTime, focusQuality, adjustedAvgDeepWork, deepWorkIntervalLength, breakIntervalLength) {
    statsObj.deepWorkTime = deepWorkTime;
    statsObj.avgDeepWorkTime = avgDeepWorkTime;
    statsObj.focusQuality = focusQuality;
    statsObj.adjustedDeepWorkTime = adjustedAvgDeepWork;
    statsObj.deepWorkInterval = deepWorkIntervalLength;
    statsObj.breakInterval = breakIntervalLength;
}

function calculateAvgIntervals() {
    
    let deepWorkIntervalAvgMin = null;
    if (deepWorkInterval365Arr.length > 0) {
        let deepWorkIntervalAvgMs = deepWorkInterval365Arr.reduce((total, num) => total + num, 0) / deepWorkInterval365Arr.length;
        deepWorkIntervalAvgMin = deepWorkIntervalAvgMs / timeConvert.msPerMin;
        
    }
    
    let breakIntervalAvgMin = null;
    if (breakInterval365Arr.length > 0) {
        let breakIntervalAvgMs = breakInterval365Arr.reduce((total, num) => total + num, 0) / breakInterval365Arr.length;
        breakIntervalAvgMin = breakIntervalAvgMs / timeConvert.msPerMin;
    }

    return [deepWorkIntervalAvgMin, breakIntervalAvgMin]
}

function calculateFocusQualityAndAdjustedAvgDeepWork() {
    // sun up 360 arrs and divide by length
    // derive focus quality

    let adjustedAvgDeepWorkHrs = null;
    let focusQuality = null;

    if (deepWork365Arr.length > 0) {
        let deepWork365Sum = deepWork365Arr.reduce((total, num) => total + num, 0) / deepWork365Arr.length;
        let distractions365Sum = distractions365Arr.reduce((total, num) => total + num, 0) / distractions365Arr.length;

        let deepWorkMinutes = deepWork365Sum * 60;

        // focus quality calculation
        focusQuality = 1 - ((distractions365Sum / deepWorkMinutes) / FOCUS_QUALITY_CONSTANT);
        if (focusQuality < 0) {
            focusQuality = 0;
        } else if (isNaN(focusQuality)) {
            focusQuality = 1;
        }

        adjustedAvgDeepWorkHrs = deepWork365Sum * focusQuality;
    }

    return [focusQuality, adjustedAvgDeepWorkHrs];
}

function calculateAvgDeepWork() {
    let avgDeepWorkTime = null;
    if (deepWork365Arr.length > 0) {
        avgDeepWorkTime = deepWork365Arr.reduce((total, num) => total + num, 0) / deepWork365Arr.length; // in hours
    }
    return avgDeepWorkTime;
}

function calculateSummaryDeepWorkTime() {
    let deepWorkTime = deepWork365Arr.reduce((total, num) => total + num, 0); // in hours
    return deepWorkTime;
}

function convertHourFloatToStr(hour) {
    // Get the integer part for the hour
    const hours = Math.floor(hour);

    // Get the fractional part and convert it to minutes
    const minutes = Math.floor((hour - hours) * 60);

    // Determine whether it is AM or PM
    const period = hours < 12 || hours === 24 ? 'am' : 'pm';

    // Convert hours to 12-hour format
    const adjustedHours = hours % 12 === 0 ? 12 : hours % 12;

    // Ensure minutes are always two digits
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    // Return the formatted time string
    return `${adjustedHours}:${minutesStr} ${period}`;
}

async function initializeSessionData() {
    let dashboardDataSessionArr = dashboardData.sessionArr;
    for (let i = 0; i < dashboardDataSessionArr.length; i++) {

        let startTime = moment.tz(dashboardDataSessionArr[i].startTime, dashboardDataSessionArr[i].timeZone).format();
        let endTime = moment.tz(dashboardDataSessionArr[i].endTime, dashboardDataSessionArr[i].timeZone).format();

        // includes sessions that overlap at all with the lower or upper bound dates
        if((moment(endTime, 'YYYY-MM-DD').isSameOrAfter(moment(mainChartContainer.lowerBound, 'YYYY-MM-DD'))) && (moment(startTime, 'YYYY-MM-DD').isSameOrBefore(moment(mainChartContainer.upperBound, 'YYYY-MM-DD')))) {
           
            let hourlyTransitionArr = createHourlyTransitionArr(startTime, dashboardDataSessionArr[i].deepWorkIntervals, dashboardDataSessionArr[i].breakIntervals);
            
            populateIntervalDataArrs(startTime, endTime, hourlyTransitionArr);
        }
    }
}

function populateIntervalDataArrs(startTime, endTime, hourlyTransitionArr) {
    for (let i = 0; i < hourlyTransitionArr.length - 1; i++) {

        let startTimeDay = extractDateInfo(startTime, mainChartContainer.timeFrame);
        let endTimeDay = extractDateInfo(endTime, mainChartContainer.timeFrame);

        const isEven = i % 2 === 0;
        const dataArr = isEven ? deepWorkIntervalDataArr : breakIntervalDataArr;

        const startTimeBeforeLowerBound = moment(startTime, 'YYYY-MM-DD').isBefore(moment(mainChartContainer.lowerBound, 'YYYY-MM-DD'));
        const endTimeAfterUpperBound = moment(endTime, 'YYYY-MM-DD').isAfter(moment(mainChartContainer.upperBound, 'YYYY-MM-DD'));

        const initialTime = hourlyTransitionArr[i];
        const finalTime = hourlyTransitionArr[i + 1];

        if (startTimeBeforeLowerBound) {
            if (finalTime > 24) {
                if (initialTime < 24) {
                    // push { x: endTimeDay, y: [0, (finalTime - 24)]} to dataArr
                    dataArr.push({ x: endTimeDay, y: [0, (finalTime - 24)]}); // from previous week

                } else {
                    // push { x: endTimeDay, y: [(initialTime - 24), (finalTime - 24)]} to dataArr
                    dataArr.push({ x: endTimeDay, y: [(initialTime - 24), (finalTime - 24)]}); // from previous week
                }
            }
        } else if (endTimeAfterUpperBound) {
            if (initialTime < 24) {
                if (finalTime > 24) {
                    // push { x: startTimeDay, y: [initialTime, 24]} to dataArr
                    dataArr.push({ x: startTimeDay, y: [initialTime, 24]});
                } else {
                    // push { x: startTimeDay, y: [initialTime, finalTime]} to dataArr
                    dataArr.push({ x: startTimeDay, y: [initialTime, finalTime]});
                }
            }
        } else {
            if (initialTime > 24 && finalTime > 24) {
                // push { x: endTimeDay, y: [(initialTime - 24), (finalTime - 24)]} to dataArr
                dataArr.push({ x: endTimeDay, y: [(initialTime - 24), (finalTime - 24)]}); // from previous day

            } else if (finalTime > 24) {
                // push { x: startTimeDay, y: [initialTime, 24]} to dataArr
                dataArr.push({ x: startTimeDay, y: [initialTime, 24]});
                
                // push { x: endTimeDay, y: [0, (finalTime - 24)]} to dataArr
                dataArr.push({ x: endTimeDay, y: [0, (finalTime - 24)]}); // from previous day

            } else {
                // push { x: startTimeDay, y: [initialTime, finalTime]} to dataArr
                dataArr.push({ x: startTimeDay, y: [initialTime, finalTime]});

            }
        }
    }
}

function extractDateInfo(dateString, timeFrame) {
    // Parse the date string into a Date object
    dateString = dateString.split('T')[0];
    const parts = dateString.split("-");
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    // Arrays to help with returning day and month names
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Determine what to return based on the timeFrame
    if (timeFrame === 'week') {
        const dayOfWeek = date.getDay();
        return daysOfWeek[dayOfWeek];

    } else if (timeFrame === 'month') {
        const dayOfMonth = date.getDate();
        return dayOfMonth.toString();

    } else if (timeFrame === 'year') {
        const month = date.getMonth();
        return monthsOfYear[month];

    } else {
        return null;
    }
}

function createHourlyTransitionArr(startTime, deepWorkIntervalArr, breakIntervalArr) {
    let combinedArr = combineDeepWorkBreakArrs(deepWorkIntervalArr, breakIntervalArr);
    // now, we need to convert the start time to a value 0-24, representing the time since beginning of day
    let startTimeHour = getStartTimeHour(startTime);
    let hourlyTransitionArr = [];

    let hourSum = startTimeHour;
    hourlyTransitionArr.push(hourSum);

    for (let i = 0; i < combinedArr.length; i++) {
        hourSum = hourSum + (combinedArr[i] / timeConvert.msPerHour);
        hourlyTransitionArr.push(hourSum);
    }

    return hourlyTransitionArr;
}

function getStartTimeHour(startTime) {
    // Parse the ISO 8601 date-time string with moment
    const momentTime = moment.parseZone(startTime);

    // Get the hour, minute, and second parts
    const hours = momentTime.hours();
    const minutes = momentTime.minutes();
    const seconds = momentTime.seconds();

    // Calculate the fractional hour value
    const hourValue = hours + (minutes / 60) + (seconds / 3600);

    return hourValue;
}

function combineDeepWorkBreakArrs(deepWorkIntervalArr, breakIntervalArr) {

    let combinedArr = [];
    for (let i = 0; i < deepWorkIntervalArr.length; i++) {
        combinedArr.push(deepWorkIntervalArr[i]);

        // if current index exists as valid location in breakIntervalArr, push to combinedArr
        if (breakIntervalArr[i]) {
            combinedArr.push(breakIntervalArr[i]);
        }
    }

    return combinedArr;
}

async function resetData() {
    deepWorkArr = []; // holds normal or quality adjusted deep work time
    focusQualityArr = [];
    avgIntervalArr = [];
    percentInDeepWorkArr = [];
    sundayIndices = [];

    deepWorkIntervalDataArr = [];
    breakIntervalDataArr = [];  

    Object.keys(yMax).forEach(key => {
        yMax[key] = 0;
    });

    dateStrArr = [];
    xAxisTickLabels.month = [];

    deepWork365Arr = [];
    distractions365Arr = [];
    deepWorkInterval365Arr = [];
    breakInterval365Arr = [];

    directionIndicators.forEach(indicator => {
        indicator.style.display = 'none';
        indicator.style.opacity = '0';
    })

    flags.populated365Arrs = false;
}

async function initializeData(dashboardData, mainChartContainer, deepWorkArr, focusQualityArr, avgIntervalArr, yMax) {
    // bounds can be week, month, or year in length
    // basically, for week and month, we'll display individual days
    // week = 7 days
    // month = variable number of days (28 - 31), essentially just more days
    // for the year, we'll be displaying the total deep work hours for each month (12 months)
    
    // regarding the chart parameters, what will change?
    // the number and type of x-axis tic labels
    // week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'], n=7
    // month: ['1', '8', '15', '22', '29'], n=~5 (possibly every number in the month)
    // year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], n=12
    
    // the data
    // week: 7 numbers
    // month: 28-31 numbers
    // year: 12 numbers
    
    // if quality adjusted toggle is on, then make appropriate changes to data (labeling will not change)
    let deepWorkMsPerMonthArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let distractionsPerMonthArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let sessionTimeSumPerMonthArr =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let intervalsPerMonthArr = [[], [], [], [], [], [], [], [], [], [], [], []];

    let dashboardDataDailyArr = dashboardData.dailyArr;
    for (let i = 0; i < dashboardDataDailyArr.length; i++) {
        let date = dashboardDataDailyArr[i].date;
        if((moment(date, 'YYYY-MM-DD').isSameOrAfter(moment(mainChartContainer.lowerBound, 'YYYY-MM-DD'))) && (moment(date, 'YYYY-MM-DD').isSameOrBefore(moment(mainChartContainer.upperBound, 'YYYY-MM-DD')))) {
            let deepWorkHours = getDeepWorkHoursAndFocusQuality(dashboardDataDailyArr[i])[0];
            let focusQuality = getDeepWorkHoursAndFocusQuality(dashboardDataDailyArr[i])[1];
            let avgInterval = getInterval(dashboardDataDailyArr[i]);
            let dateStr = formatDateString(date);
            let percentInDeepWork = getPercentInDeepWork(dashboardDataDailyArr[i]);

            deepWork365Arr.push(deepWorkHours);
            distractions365Arr.push(dashboardDataDailyArr[i].distractions);
            
            if (mainChartContainer.timeFrame === 'week') {
                let dayOfWeekIndex = getDayOfWeekIndex(date); // 0-6
                while (deepWorkArr.length < dayOfWeekIndex) {
                    deepWorkArr.push(0);
                    focusQualityArr.push(0);
                    avgIntervalArr.push(0);
                    percentInDeepWorkArr.push(0);
                }
                updateDateStr(dateStr, dayOfWeekIndex);
                
            } else if (mainChartContainer.timeFrame === 'month') {
                let dayOfMonthIndex = getDayOfMonthIndex(date);
                while (deepWorkArr.length < dayOfMonthIndex) {
                    deepWorkArr.push(0);
                    focusQualityArr.push(0);
                    avgIntervalArr.push(0);
                    percentInDeepWorkArr.push(0);
                }
                updateDateStr(dateStr, dayOfMonthIndex);

            } else { // year
                // (1) find the index (0 - 11) based on the date
                let monthIndex = getMonthOfYear(date);

                // (2a) += the deep work value at that index location on deepWorkPerMonthArr
                // (2b) += distractions at that index location on distractionsPerMonth
                // (2c) pushing all of the intervals at that index location fort intervalsPerMonthArr

                deepWorkMsPerMonthArr[monthIndex] += dashboardDataDailyArr[i].deepWorkTime;
                distractionsPerMonthArr[monthIndex] += dashboardDataDailyArr[i].distractions;
                sessionTimeSumPerMonthArr[monthIndex] += dashboardDataDailyArr[i].sessionTimeSum;

                if (flags.avgBreakIntervalToggle) {
                    intervalsPerMonthArr[monthIndex].push(...dashboardDataDailyArr[i].breakIntervals);
                } else {
                    intervalsPerMonthArr[monthIndex].push(...dashboardDataDailyArr[i].deepWorkIntervals);
                }
            }

            if (mainChartContainer.timeFrame !== 'year') {
                deepWorkArr.push(deepWorkHours);
                focusQualityArr.push(Math.floor(focusQuality * 100));
                avgIntervalArr.push(avgInterval);
                percentInDeepWorkArr.push(Math.floor(percentInDeepWork * 100));
            }
        }
    }

    if (mainChartContainer.timeFrame === 'month') {
        // fill month tick mark labels arr
        let daysInMonth = getDaysInMonth(mainChartContainer.lowerBound);
        xAxisTickLabels.month = setMonthTickLabels(daysInMonth);
        sundayIndices = getSundayIndices(mainChartContainer.lowerBound, xAxisTickLabels.month);
    }

    flags.populated365Arrs = true;

    if (mainChartContainer.timeFrame === 'year') {
        
        // iterate through deepWorkMsPerMonthArr
        // if time exists for a particular month
        // (1)... convert ms to hours
        // (2)... calculate average focus quality
        // (3)... calculate average interval length
        // add either 0 or converted time to deepWorkArr, avg focus quality to focusQualityArr, avg interval length to avgIntervalArr

        yMax.avgInterval = 0; // resetting avgInterval for year only

        let dataPresent = false;
        for (let i = 0; i < 12; i++) {
            let monthlyData = {
                deepWorkTime: deepWorkMsPerMonthArr[i],
                distractions: distractionsPerMonthArr[i],
                deepWorkIntervals: intervalsPerMonthArr[i],
                breakIntervals: intervalsPerMonthArr[i],
                sessionTimeSum: sessionTimeSumPerMonthArr[i]
            }

            if (deepWorkMsPerMonthArr[i] !== 0) {
                let deepWorkHours = getDeepWorkHoursAndFocusQuality(monthlyData)[0];
                let focusQuality = getDeepWorkHoursAndFocusQuality(monthlyData)[1];
                let avgInterval = getInterval(monthlyData);
                let percentInDeepWork = getPercentInDeepWork(monthlyData);

                deepWorkArr.push(deepWorkHours);
                focusQualityArr.push(Math.floor(focusQuality * 100));
                avgIntervalArr.push(avgInterval);
                percentInDeepWorkArr.push(Math.floor(percentInDeepWork * 100));

                dataPresent = true;
            } else {
                deepWorkArr.push(0);
                focusQualityArr.push(0);
                avgIntervalArr.push(0);
                percentInDeepWorkArr.push(0);
            }

            // update dateStrArr
            let monthStr = formatMonthYear(mainChartContainer.lowerBound, i);
            dateStrArr.push(monthStr);
        }

        if (!dataPresent) { // allows for "no data" message
            deepWorkArr.length = 0;
            focusQualityArr.length = 0;
            avgIntervalArr.length = 0;
            percentInDeepWorkArr.length = 0;
        }
    }

    yMax.deepWork = ceilDeepWorkYMax(yMax.deepWork);
    yMax.avgInterval = ceilAvgIntervalYMax(yMax.avgInterval);
}

function getSundayIndices(dateString, daysArray) {
    // Step 1: Extract the year and month from the dateString
    const [year, month] = dateString.split('-').map(Number);

    // Step 2: Initialize an array to hold the indices of Sundays
    let sundayIndices = [];

    // Step 3: Iterate over the days in the month
    daysArray.forEach((day, index) => {
        // Create a new Date object for each day
        let date = new Date(year, month - 1, Number(day));

        // Check if the day is a Sunday (0 represents Sunday in JavaScript's Date object)
        if (date.getDay() === 0) {
            sundayIndices.push(index);
        }
    });

    return sundayIndices;
}

function formatMonthYear(dateStr, monthIndex) {
    // Array of month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Extract the year from the date string
    const year = dateStr.split('-')[0];

    // Get the corresponding month name from the monthIndex
    const monthName = months[monthIndex];

    // Return the formatted string
    return `${monthName}, ${year}`;
}

function getMonthOfYear(date) {
    // Extract the month ('MM') from the date string
    const month = date.split('-')[1];

    // Convert the month to a zero-indexed month number
    const monthIndex = parseInt(month, 10) - 1;

    return monthIndex;
}

function updateDateStr(dateStr, dayOfIndex) {

    if (dateStrArr.length === dayOfIndex) { // base case
        dateStrArr.push(dateStr);
        return;
    }

    while (dateStrArr.length < dayOfIndex) {
        dateStrArr.push("no data");
    }
    dateStrArr.push(dateStr);
}

function getDayOfMonthIndex(dateString) {
    // Split the dateString into its components
    const [year, month, day] = dateString.split('-').map(Number);

    // Create a new Date object using the year, month, and day
    // Note: Month is 0-indexed (0 = January, 11 = December)
    const date = new Date(year, month - 1, day);

    // Use getDate() to get the day of the month
    const dayOfMonth = date.getDate();

    // Subtract 1 to make it zero-indexed
    const dayOfMonthIndex = dayOfMonth - 1;

    return dayOfMonthIndex;
}

function getDayOfWeekIndex(dateString) {
    // Split the dateString into its components
    const [year, month, day] = dateString.split('-').map(Number);

    // Create a new Date object using the year, month, and day
    // Note: Month is 0-indexed (0 = January, 11 = December)
    const date = new Date(year, month - 1, day);

    // Use getDay() to get the day of the week
    const dayOfWeekIndex = date.getDay();

    return dayOfWeekIndex;
}

function setMonthTickLabels(days) {
    let monthLabels = [];
    for (let i = 1; i <= days; i++) {
        monthLabels.push(String(i));
    }
    return monthLabels;
}

function getDaysInMonth(dateString) {
    // Step 1: Extract the year and month from the dateString
    const [year, month] = dateString.split('-').map(Number);

    // Step 2: Create a new Date object for the first day of the next month
    // We use 0 as the day in the new Date(year, month, 0) to get the last day of the previous month
    // So for example, if month is 2 (February), new Date(year, 2, 0) will give you the last day of February.
    const daysInMonth = new Date(year, month, 0).getDate();

    return daysInMonth;
}

function formatDateString(dateString) {
    // Step 1: Extract the month and day parts from the string
    let [year, month, day] = dateString.split('-');

    // Convert the month from numeric to string format
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthStr = months[parseInt(month) - 1]; // Convert month number to month name

    // Step 2: Convert the day to the ordinal format (e.g., 11 -> 11th)
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th'; // Covers 11th, 12th, 13th, etc.
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    let dayWithSuffix = parseInt(day) + getOrdinalSuffix(parseInt(day));

    let dayOfWeekIndex = getDayOfWeekIndex(dateString);
    let dayOfWeekStr = xAxisTickLabels.week[dayOfWeekIndex];

    // Construct the final date string
    return `${dayOfWeekStr}, ${monthStr} ${dayWithSuffix}`;
}

function ceilDeepWorkYMax(deepWorkYMax) {
    let ceilResult = Math.ceil(deepWorkYMax);

    if (isPrime(ceilResult) && (ceilResult > 2)) {
        ceilResult++;
    }

    return ceilResult;
}

function ceilAvgIntervalYMax(avgIntervalYMax) {
    return Math.ceil(avgIntervalYMax / 2) * 2;
}

function isPrime(num) {
    if (num <= 1) return false; // Numbers less than or equal to 1 are not prime
    if (num <= 3) return true; // 2 and 3 are prime numbers

    // Eliminate multiples of 2 and 3
    if (num % 2 === 0 || num % 3 === 0) return false;

    // Check for factors from 5 to the square root of num
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }

    return true;
}

function getInterval(dailyData) { // either deep work or break, depending on toggle

    if (!flags.populated365Arrs)  {
        // pushing all intervals individually onto the arrays
        deepWorkInterval365Arr.push(...dailyData.deepWorkIntervals);
        breakInterval365Arr.push(...dailyData.breakIntervals);
    }

    // calculation of average interval per day
    let avgIntervalMs;
    if (flags.avgBreakIntervalToggle) {
        avgIntervalMs = dailyData.breakIntervals.reduce((accumulator, currentVal) => accumulator + currentVal, 0) / dailyData.breakIntervals.length;
    } else {
        avgIntervalMs = dailyData.deepWorkIntervals.reduce((accumulator, currentVal) => accumulator + currentVal, 0) / dailyData.deepWorkIntervals.length;
    }

    let avgIntervalMin = Math.round(avgIntervalMs / timeConvert.msPerMin);

    // assign yMax value for average interval (either break or deep work)
    if (avgIntervalMin > yMax.avgInterval) {
        yMax.avgInterval = avgIntervalMin;
    }

    return avgIntervalMin;
}

function getPercentInDeepWork(dailyData) {
    let totalSessionTime = dailyData.sessionTimeSum;
    let deepWorkTime = dailyData.deepWorkTime;
    let percentInDeepWork = deepWorkTime / totalSessionTime;
    if (percentInDeepWork > 1) {
        percentInDeepWork = 1;
    }

    return percentInDeepWork;
}

function getDeepWorkHoursAndFocusQuality(dailyData) {
    let deepWorkHours = dailyData.deepWorkTime / timeConvert.msPerHour; // total hour float
    let deepWorkMinutes = deepWorkHours * 60; // total minutes float

    // assign yMax value for deepWork (always max non-adjusted value)
    if (deepWorkHours > yMax.deepWork) {
        yMax.deepWork = deepWorkHours;
    }

    // focus quality calculation
    let focusQuality = 1 - ((dailyData.distractions / deepWorkMinutes) / FOCUS_QUALITY_CONSTANT);
    if (focusQuality < 0) {
        focusQuality = 0;
    } else if (isNaN(focusQuality)) {
        focusQuality = 1;
    }

    // optionally adjust deep work
    if (flags.adjustedDeepWorkToggle) {
        deepWorkHours = deepWorkHours * focusQuality;
    }

    return [deepWorkHours, focusQuality];
}

function handleBarClick(elementIndex) {
    // console.log(`Bar clicked! Element Index: ${elementIndex}`);

    let lowerBound = mainChartContainer.lowerBound;
    let upperBound = mainChartContainer.upperBound;
    let boundArr = constructDateArray(lowerBound, upperBound);
    let selectedDate = boundArr[elementIndex];

    updateDailyContainer(selectedDate);
}

function constructDateArray(lowerBound, upperBound) {
    // Create a Date object for lowerBound and upperBound
    let startDate = new Date(lowerBound);
    let endDate = new Date(upperBound);

    // Initialize an array to hold the dates
    let dateArray = [];

    // Loop through the dates, incrementing by one day each time
    while (startDate <= endDate) {
        // Push the current date to the array, formatted as 'YYYY-MM-DD'
        dateArray.push(startDate.toISOString().split('T')[0]);

        // Move to the next day
        startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
}

function displayDeepWorkChart() {

    let xAxisTickLabelArr;
    if (mainChartContainer.timeFrame === 'week') {
        xAxisTickLabelArr = xAxisTickLabels.week;
    } else if (mainChartContainer.timeFrame === 'month') {
        xAxisTickLabelArr = xAxisTickLabels.month;
    } else { // year
        xAxisTickLabelArr = xAxisTickLabels.year;
    }

    let barColor;
    if (flags.adjustedDeepWorkToggle) {
        barColor = '#0cce63';
    } else {
        barColor = 'rgba(63, 210, 68, 1)';
    }

    if (yMax.deepWork < 6) {
        yMax.deepWork = 6;
    }

    if (deepWorkArr.length === 0) {
        yMax.deepWork = 0;
    }

    const ctx = document.getElementById('deepWorkChart').getContext('2d');
    const config = {
        type: 'bar',
        data: {
            labels: xAxisTickLabelArr,
            datasets: [{
                label: 'Deep Work Hours',
                data: deepWorkArr,
                backgroundColor: barColor,
                borderColor: 'rgb(255, 255, 255)',
                // borderWidth: 3,
                borderRadius: 25,
                borderSkipped: false,
                barPercentage: 1,
                categoryPercentage: 0.5
            }]
        },
        options: {
            onClick: function(event, elements) {
                if (mainChartContainer.timeFrame !== 'year') {
                    // Check if a bar (or element) was clicked
                    if (elements.length > 0) {
                        // Get the clicked element's data index and dataset index
                        const elementIndex = elements[0].index; // Index of the clicked bar
                        const datasetIndex = elements[0].datasetIndex;
        
                        // Trigger your custom callback function
                        handleBarClick(elementIndex);
                    }
                }
            },
            onHover: function(event, elements) {
                const chart = this;
                const canvas = chart.canvas;
    
                // Check if we're hovering over a bar (elements array is not empty)
                if ((elements.length) && (mainChartContainer.timeFrame !== 'year')) {
                    canvas.style.cursor = 'pointer'; // Change cursor to pointer
                } else {
                    canvas.style.cursor = 'default'; // Reset cursor to default when not hovering
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: yMax.deepWork, // this'll be whatever 
                    title: {
                        display: true,
                        text: 'Deep Work Hours',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white',
                        stepSize: 1
                    },
                    grid: {
                        display: true, 
                        color: 'rgba(255, 255, 255, 0.15)',
                        lineWidth: 1,
                        drawBorder: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                    }
                },
                x: {
                    title: {
                        display: false
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgb(0, 0, 0)', // Sets the tooltip background color
                    titleColor: 'white', // Sets the color of the title in the tooltip
                    bodyColor: 'white', // Sets the color of the text in the tooltip body
                    borderColor: 'white', // Sets the color of the tooltip border
                    borderWidth: 2, // Sets the width of the tooltip border
                    callbacks: {
                        title: function(tooltipItems) {
                            // Custom title logic
                            // tooltipItems is an array; we'll use the first item for the title
                            let item = tooltipItems[0];
                            let index = item.dataIndex;
                            let date = dateStrArr[index];
                            return `${date}`;
                        },
                        label: function(tooltipItem) {
                            let hours = Math.floor(tooltipItem.raw);
                            let mins = Math.round((tooltipItem.raw - hours) * 60);
                            return ` ${hours}h ${mins}m`; // Customize tooltip text
                        }
                    }
                }
            },
            animations: {
                x: {
                    duration: 0 
                },
                y: {
                    duration: flags.quickerChartAnimations ? 500 : 1000,
                    easing: 'easeOutQuint'
                }
            }
        },
        plugins: [
            noDataPlugin,    // Register the noDataPlugin
            dottedLinePlugin // Register the dottedLinePlugin
        ]
    };

    // Destroy the existing chart instance if it exists
    if (charts.deepWork) {
        charts.deepWork.destroy();
        charts.deepWork = null;
    }

    // Create a new chart instance
    charts.deepWork = new Chart(ctx, config);
}

function displayFocusQualityChart() {
    let xAxisTickLabelArr;
    if (mainChartContainer.timeFrame === 'week') {
        xAxisTickLabelArr = xAxisTickLabels.week;
    } else if (mainChartContainer.timeFrame === 'month') {
        xAxisTickLabelArr = xAxisTickLabels.month;

        for (let i = 0; i < focusQualityArr.length; i++) {
            if (dateStrArr[i] === 'no data') {
                focusQualityArr[i] = null;
            }
        }

    } else { // year
        xAxisTickLabelArr = xAxisTickLabels.year;
    }

    let chartType = 'bar';
    if (mainChartContainer.timeFrame === 'month') {
        chartType = 'line';
    }

    const yScaleData = {
        beginAtZero: true,
        suggestedMax: 100,
        title: {
            display: true,
            text: 'Focus Quality %',
            color: 'white'
        },
        ticks: {
            color: 'white',
        },
        grid: {
            display: true, 
            color: 'rgba(255, 255, 255, 0.15)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
        }
    }

    const yScaleNoData = {
        beginAtZero: true,
        max: 0,
        title: {
            display: true,
            text: 'Focus Quality %',
            color: 'white'
        },
        ticks: {
            color: 'white',
        },
        grid: {
            display: true, 
            color: 'rgba(255, 255, 255, 0.15)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
        }
    }

    let yScale = yScaleData;
    if (focusQualityArr.length === 0) {
        yScale = yScaleNoData;
    }

    const ctx = document.getElementById('focusQualityChart').getContext('2d');
    const config = {
        type: chartType,
        data: {
            labels: xAxisTickLabelArr,
            datasets: [{
                label: 'Focus Quality %',
                data: focusQualityArr,
                backgroundColor: 'rgb(162, 0, 212)',
                borderColor: 'rgb(255, 255, 255)',
                // borderWidth: 3,
                borderRadius: 25,
                borderSkipped: false,
                barPercentage: 1,
                categoryPercentage: 0.5,
                pointRadius: 5, // Size of the points
                pointHoverRadius: 8, // Size of the points when hovered
                spanGaps: true, // Ensure the line spans across null values
                tension: 0.4 // Set tension to make the line curvy
            }]
        },
        options: {
            onClick: function(event, elements) {
                if (mainChartContainer.timeFrame !== 'year') {
                    // Check if a bar (or element) was clicked
                    if (elements.length > 0) {
                        // Get the clicked element's data index and dataset index
                        const elementIndex = elements[0].index; // Index of the clicked bar
                        const datasetIndex = elements[0].datasetIndex;
        
                        // Trigger your custom callback function
                        handleBarClick(elementIndex);
                    }
                }
            },
            onHover: function(event, elements) {
                const chart = this;
                const canvas = chart.canvas;
    
                // Check if we're hovering over a bar (elements array is not empty)
                if ((elements.length) && (mainChartContainer.timeFrame !== 'year')) {
                    canvas.style.cursor = 'pointer'; // Change cursor to pointer
                } else {
                    canvas.style.cursor = 'default'; // Reset cursor to default when not hovering
                }
            },
            scales: {
                y: yScale,
                x: {
                    title: {
                        display: false
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgb(0, 0, 0)', // Sets the tooltip background color
                    titleColor: 'white', // Sets the color of the title in the tooltip
                    bodyColor: 'white', // Sets the color of the text in the tooltip body
                    borderColor: 'white', // Sets the color of the tooltip border
                    borderWidth: 2, // Sets the width of the tooltip border
                    callbacks: {
                        title: function(tooltipItems) {
                            // Custom title logic
                            // tooltipItems is an array; we'll use the first item for the title
                            let item = tooltipItems[0];
                            let index = item.dataIndex;
                            let date = dateStrArr[index];
                            return `${date}`;
                        },
                        label: function(tooltipItem) {
                            let item = tooltipItem;
                            let index = item.dataIndex;
                            let date = dateStrArr[index];

                            if (date === "no data") {
                                return null;
                            } else {
                                return ` ${tooltipItem.raw}%`; // Customize tooltip text
                            }
                        }
                    }
                }
            },
            animations: {
                x: {
                    duration: 0 
                },
                y: {
                    duration: flags.quickerChartAnimations ? 500 : 1000,
                    easing: 'easeOutQuint' 
                }
            }
        },
        plugins: [
            noDataPlugin,    // Register the noDataPlugin
            dottedLinePlugin // Register the dottedLinePlugin
        ]
    };

    // Destroy the existing chart instance if it exists
    if (charts.focusQuality) {
        charts.focusQuality.destroy();
        charts.focusQuality = null;
    }

    // Create a new chart instance
    charts.focusQuality = new Chart(ctx, config);
}

function displayAvgIntervalChart() {
    let xAxisTickLabelArr;
    if (mainChartContainer.timeFrame === 'week') {
        xAxisTickLabelArr = xAxisTickLabels.week;
    } else if (mainChartContainer.timeFrame === 'month') {
        xAxisTickLabelArr = xAxisTickLabels.month;
    } else { // year
        xAxisTickLabelArr = xAxisTickLabels.year;
    }

    let barColor;
    if (flags.avgBreakIntervalToggle) {
        barColor = 'rgba(59, 143, 227, 1)';
    } else {
        barColor = 'rgba(83, 230, 88, 1)';
    }

    const yScaleUnder60 = {
        beginAtZero: true,
        max: yMax.avgInterval,
        title: {
            display: true,
            text: 'Interval Length (Min)',
            color: 'white'
        },
        ticks: {
            color: 'white',
            stepSize: 10
        },
        grid: {
            display: true, 
            color: 'rgba(255, 255, 255, 0.15)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
        }
    }

    const yScaleOver60 = {
        beginAtZero: true,
        suggestedMax: yMax.avgInterval,
        title: {
            display: true,
            text: 'Interval Length (Min)',
            color: 'white'
        },
        ticks: {
            color: 'white',
            stepSize: 10
        },
        grid: {
            display: true, 
            color: 'rgba(255, 255, 255, 0.15)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
        }
    }

    const yScaleNoData = {
        beginAtZero: true,
        max: 0,
        title: {
            display: true,
            text: 'Interval Length (Min)',
            color: 'white'
        },
        ticks: {
            color: 'white',
            stepSize: 10
        },
        grid: {
            display: true, 
            color: 'rgba(255, 255, 255, 0.15)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
        }
    }

    let yScale = yScaleOver60;
    if (yMax.avgInterval < 60) {
        yMax.avgInterval = 60;

        yScaleUnder60.max = yMax.avgInterval;

        yScale = yScaleUnder60;
    }

    if (avgIntervalArr.length === 0) {
        yScale = yScaleNoData;
    }

    const ctx = document.getElementById('avgIntervalChart').getContext('2d');
    const config = {
        type: 'bar',
        data: {
            labels: xAxisTickLabelArr,
            datasets: [{
                label: 'Interval Length (Min)',
                data: avgIntervalArr,
                backgroundColor: barColor,
                borderColor: 'rgb(255, 255, 255)',
                // borderWidth: 3,
                borderRadius: 25,
                borderSkipped: false,
                barPercentage: 1,
                categoryPercentage: 0.5
            }]
        },
        options: {
            onClick: function(event, elements) {
                if (mainChartContainer.timeFrame !== 'year') {
                    // Check if a bar (or element) was clicked
                    if (elements.length > 0) {
                        // Get the clicked element's data index and dataset index
                        const elementIndex = elements[0].index; // Index of the clicked bar
                        const datasetIndex = elements[0].datasetIndex;
        
                        // Trigger your custom callback function
                        handleBarClick(elementIndex);
                    }
                }
            },
            onHover: function(event, elements) {
                const chart = this;
                const canvas = chart.canvas;
    
                // Check if we're hovering over a bar (elements array is not empty)
                if ((elements.length) && (mainChartContainer.timeFrame !== 'year')) {
                    canvas.style.cursor = 'pointer'; // Change cursor to pointer
                } else {
                    canvas.style.cursor = 'default'; // Reset cursor to default when not hovering
                }
            },
            scales: {
                y: yScale,
                x: {
                    title: {
                        display: false
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgb(0, 0, 0)', // Sets the tooltip background color
                    titleColor: 'white', // Sets the color of the title in the tooltip
                    bodyColor: 'white', // Sets the color of the text in the tooltip body
                    borderColor: 'white', // Sets the color of the tooltip border
                    borderWidth: 2, // Sets the width of the tooltip border
                    callbacks: {
                        title: function(tooltipItems) {
                            // Custom title logic
                            // tooltipItems is an array; we'll use the first item for the title
                            let item = tooltipItems[0];
                            let index = item.dataIndex;
                            let date = dateStrArr[index];
                            return `${date}`;
                        },
                        label: function(tooltipItem) {
                            return ` ${tooltipItem.raw}m`; // Customize tooltip text
                        }
                    }
                }
            },
            animations: {
                x: {
                    duration: 0 
                },
                y: {
                    duration: flags.quickerChartAnimations ? 500 : 1000,
                    easing: 'easeOutQuint' 
                }
            }
        },
        plugins: [
            noDataPlugin,    // Register the noDataPlugin
            dottedLinePlugin // Register the dottedLinePlugin
        ]
    };

    // Destroy the existing chart instance if it exists
    if (charts.avgInterval) {
        charts.avgInterval.destroy();
        charts.avgInterval = null;
    }

    // Create a new chart instance
    charts.avgInterval = new Chart(ctx, config);
}

function displaySessionIntervalsChart() {
    let xAxisTickLabelArr;
    if (mainChartContainer.timeFrame === 'week') {
        xAxisTickLabelArr = xAxisTickLabels.week;
    } else if (mainChartContainer.timeFrame === 'month') {
        xAxisTickLabelArr = xAxisTickLabels.month;
    } else { // year
        xAxisTickLabelArr = xAxisTickLabels.year;
    }

    let data = {
        labels: xAxisTickLabelArr,
        datasets: [
            {
                label: 'Deep Work',
                data: deepWorkIntervalDataArr,
                backgroundColor: 'rgba(63, 210, 68, 1)',
                borderColor: 'rgb(255, 255, 255)',
                borderRadius: 0,
                borderSkipped: false
            },
            {
                label: 'Break',
                data: breakIntervalDataArr,
                backgroundColor: 'rgba(59, 143, 227, 1)',
                borderColor: 'rgb(255, 255, 255)',
                borderRadius: 0,
                borderSkipped: false
            }
        ]
    };

    let xAxisLabelsTempArr = [];
    if (mainChartContainer.timeFrame === 'week') {
        xAxisLabelsTempArr = daysOfTheWeek;
    } else if (mainChartContainer.timeFrame === 'month') {
        xAxisLabelsTempArr = xAxisTickLabels.month;
    } else {
        xAxisLabelsTempArr = monthsOfTheYear;
    }

    let yMax = 24;
    if (deepWorkIntervalDataArr.length === 0) {
        yMax = 0;
    }

    const ctx = document.getElementById('sessionIntervalsChart').getContext('2d');
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: yMax, // Representing 24 hours in a day
                    reverse: true,
                    title: {
                        display: false,
                        text: 'Day',
                        color: 'white'
                    },
                    ticks: {
                        stepSize: 3, // Set step size to 6 hours to match the intervals
                        color: 'white',
                        callback: function(value) {
                            if (value === 0 || value === 24) return '12 AM';
                            if (value === 3) return '3 AM';
                            if (value === 6) return '6 AM';
                            if (value === 9) return '9 AM';
                            if (value === 12) return '12 PM';
                            if (value === 15) return '3 PM';
                            if (value === 18) return '6 PM';
                            if (value === 21) return '9 PM';
                            return ''; // Hide other labels
                        }
                    },
                    grid: {
                        display: true, 
                        color: 'rgba(255, 255, 255, 0.15)',
                        lineWidth: 1,
                        drawBorder: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                    }
                },
                x: {
                    stacked: true,
                    title: {
                        display: false
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true // Show the legend to differentiate between datasets
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgb(0, 0, 0)', // Sets the tooltip background color
                    titleColor: 'white', // Sets the color of the title in the tooltip
                    bodyColor: 'white', // Sets the color of the text in the tooltip body
                    borderColor: 'white', // Sets the color of the tooltip border
                    borderWidth: 2, // Sets the width of the tooltip border
                    callbacks: {
                        title: function(tooltipItems) {
                            // Custom title logic
                            // tooltipItems is an array; we'll use the first item for the title
                            const defaultTitle = tooltipItems.map(item => item.label || item.xLabel).join(', ');
                            let index = xAxisLabelsTempArr.indexOf(defaultTitle);
                            let date = dateStrArr[index];

                            if ((date === "no data") || (!date)) {
                                date = "data from last session of previous day"; // This will be fine for now but could be optimized if time allows
                            }
                            return `${date}`;
                        },
                        label: function(tooltipItem) {
                            let start = tooltipItem.raw.y[0];
                            let initialTime = convertHourFloatToStr(start);

                            let end = tooltipItem.raw.y[1];
                            let finalTime = convertHourFloatToStr(end);

                            return ` ${initialTime} - ${finalTime}`; // Customize tooltip text
                        }
                    }
                }
            },
            animations: false
        },
        plugins: [
            noDataPlugin,    // Register the noDataPlugin
            dottedLinePlugin // Register the dottedLinePlugin
        ]
    };

    // Destroy the existing chart instance if it exists
    if (charts.sessionIntervals) {
        charts.sessionIntervals.destroy();
        charts.sessionIntervals = null;
    }

    // Create a new chart instance
    charts.sessionIntervals = new Chart(ctx, config);
}

function displayPercentDeepWorkChart() {

    let xAxisTickLabelArr;
    if (mainChartContainer.timeFrame === 'week') {
        xAxisTickLabelArr = xAxisTickLabels.week;
    } else if (mainChartContainer.timeFrame === 'month') {
        xAxisTickLabelArr = xAxisTickLabels.month;

        for (let i = 0; i < percentInDeepWorkArr.length; i++) {
            if (dateStrArr[i] === 'no data') {
                percentInDeepWorkArr[i] = null;
            }
        }

    } else { // year
        xAxisTickLabelArr = xAxisTickLabels.year;
    }

    let chartType = 'bar';
    if (mainChartContainer.timeFrame === 'month') {
        chartType = 'line';
    }

    const yScaleData = {
        beginAtZero: true,
        suggestedMax: 100,
        title: {
            display: true,
            text: '% Time in Deep Work',
            color: 'white'
        },
        ticks: {
            color: 'white',
        },
        grid: {
            display: true, 
            color: 'rgba(255, 255, 255, 0.15)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
        }
    }

    const yScaleNoData = {
        beginAtZero: true,
        max: 0,
        title: {
            display: true,
            text: '% Time in Deep Work',
            color: 'white'
        },
        ticks: {
            color: 'white',
        },
        grid: {
            display: true, 
            color: 'rgba(255, 255, 255, 0.15)',
            lineWidth: 1,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: false,
        }
    }

    let yScale = yScaleData;
    if (percentInDeepWorkArr.length === 0) {
        yScale = yScaleNoData;
    }

    const ctx = document.getElementById('percentDeepWorkChart').getContext('2d');
    const config = {
        type: chartType,
        data: {
            labels: xAxisTickLabelArr,
            datasets: [{
                label: '% Time in Deep Work',
                data: percentInDeepWorkArr,
                backgroundColor: 'rgba(63, 210, 68, 1)',
                borderColor: 'rgb(255, 255, 255)',
                // borderWidth: 3,
                borderRadius: 25,
                borderSkipped: false,
                barPercentage: 1,
                categoryPercentage: 0.5,
                pointRadius: 5, // Size of the points
                pointHoverRadius: 8, // Size of the points when hovered
                spanGaps: true, // Ensure the line spans across null values
                tension: 0.4 // Set tension to make the line curvy
            }]
        },
        options: {
            onClick: function(event, elements) {
                if (mainChartContainer.timeFrame !== 'year') {
                    // Check if a bar (or element) was clicked
                    if (elements.length > 0) {
                        // Get the clicked element's data index and dataset index
                        const elementIndex = elements[0].index; // Index of the clicked bar
                        const datasetIndex = elements[0].datasetIndex;
        
                        // Trigger your custom callback function
                        handleBarClick(elementIndex);
                    }
                }
            },
            onHover: function(event, elements) {
                const chart = this;
                const canvas = chart.canvas;
    
                // Check if we're hovering over a bar (elements array is not empty)
                if ((elements.length) && (mainChartContainer.timeFrame !== 'year')) {
                    canvas.style.cursor = 'pointer'; // Change cursor to pointer
                } else {
                    canvas.style.cursor = 'default'; // Reset cursor to default when not hovering
                }
            },
            scales: {
                y: yScale,
                x: {
                    title: {
                        display: false
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgb(0, 0, 0)', // Sets the tooltip background color
                    titleColor: 'white', // Sets the color of the title in the tooltip
                    bodyColor: 'white', // Sets the color of the text in the tooltip body
                    borderColor: 'white', // Sets the color of the tooltip border
                    borderWidth: 2, // Sets the width of the tooltip border
                    callbacks: {
                        title: function(tooltipItems) {
                            // Custom title logic
                            // tooltipItems is an array; we'll use the first item for the title
                            let item = tooltipItems[0];
                            let index = item.dataIndex;
                            let date = dateStrArr[index];
                            return `${date}`;
                        },
                        label: function(tooltipItem) {
                            let item = tooltipItem;
                            let index = item.dataIndex;
                            let date = dateStrArr[index];

                            if (date === "no data") {
                                return null;
                            } else {
                                return ` ${tooltipItem.raw}%`; // Customize tooltip text
                            }
                        }
                    }
                }
            },
            animations: {
                x: {
                    duration: 0 
                },
                y: {
                    duration: flags.quickerChartAnimations ? 500 : 1000,
                    easing: 'easeOutQuint' 
                }
            }
        },
        plugins: [
            noDataPlugin,    // Register the noDataPlugin
            dottedLinePlugin // Register the dottedLinePlugin
        ]
    };

    // Destroy the existing chart instance if it exists
    if (charts.percentDeepWork) {
        charts.percentDeepWork.destroy();
        charts.percentDeepWork = null;
    }

    // Create a new chart instance
    charts.percentDeepWork = new Chart(ctx, config);
}

const dottedLinePlugin = {
    id: 'dottedLinePlugin',
    afterDraw: function(chart) {
        if ((mainChartContainer.timeFrame === 'month') && (deepWorkArr.length > 0)) {
            const ctx = chart.ctx;
            const xScale = chart.scales.x;
            const yScale = chart.scales.y;

            for (let i = 0; i < sundayIndices.length; i++) {
                const currentIndex = sundayIndices[i];
                const prevIndex = currentIndex - 1;

                // Get the pixel positions for the current and previous day
                const xPrev = xScale.getPixelForValue(prevIndex);
                const xCurr = xScale.getPixelForValue(currentIndex);

                // Calculate the midpoint between the two x-axis values
                const xMid = (xPrev + xCurr) / 2;
        
                // Draw the dotted line
                ctx.save();
                ctx.setLineDash([5, 5]); // Set the line to be dotted
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; // Set the line color and transparency
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(xMid, yScale.top); // Start at the top of the chart
                ctx.lineTo(xMid, yScale.bottom); // Draw to the bottom of the chart
                ctx.stroke();
                ctx.restore();
            }
        }
    }
};

const noDataPlugin = {
    id: 'noDataPlugin',
    afterDraw: function(chart) {
        // Check if the data array is empty
        if (chart.data.datasets[0].data.length === 0 || chart.data.datasets[0].data.every(item => item === null)) {
            // Get the chart context
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;

            const paddingBottom = 20;

            // Clear the chart area
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '48px settingsHeaderFont';
            ctx.fillStyle = 'gray';
            ctx.fillText('No Data 😩', width / 2, (height / 2) - paddingBottom);
            ctx.restore();
        }
    }
};