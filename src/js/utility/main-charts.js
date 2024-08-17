import { charts, mainChartContainer, dashboardData, flags } from "../modules/dashboard-objects.js";
import { timeConvert } from "../modules/index-objects.js";

// Global Variables
let deepWorkArr = []; // holds normal or quality adjusted deep work time
let focusQualityArr = [];
let avgIntervalArr = [];
let sundayIndices = [];
let FOCUS_QUALITY_CONSTANT = 0.5;

// holds yMax value for non-adjusted value (for deep work)
let yMax = {
    deepWork: 0,
    avgInterval: 0
}
// y-max for focus quality will always be 100

let dateStrArr = [];
let monthStrArr = [];

let xAxisTickLabels = {
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    month: [], // dynamically loaded
    year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}

document.addEventListener("displayMainCharts", async function() {
    await resetData();

    await initializeData(dashboardData, mainChartContainer, deepWorkArr, focusQualityArr, avgIntervalArr, yMax);
    
    displayDeepWorkChart();
    displayFocusQualityChart();
    displayAvgIntervalChart();

})

// // // // // // //
// HELPER FUNCTIONS
// // // // // // //

async function resetData() {
    deepWorkArr = []; // holds normal or quality adjusted deep work time
    focusQualityArr = [];
    avgIntervalArr = [];
    sundayIndices = [];

    Object.keys(yMax).forEach(key => {
        yMax[key] = 0;
    });

    dateStrArr = [];
    monthStrArr = [];

    xAxisTickLabels.month = [];
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
    let intervalsPerMonthArr = [[], [], [], [], [], [], [], [], [], [], [], []];

    let dashboardDataDailyArr = dashboardData.dailyArr;
    for (let i = 0; i < dashboardDataDailyArr.length; i++) {
        let date = dashboardDataDailyArr[i].date;
        if((moment(date, 'YYYY-MM-DD').isSameOrAfter(moment(mainChartContainer.lowerBound, 'YYYY-MM-DD'))) && (moment(date, 'YYYY-MM-DD').isSameOrBefore(moment(mainChartContainer.upperBound, 'YYYY-MM-DD')))) {
            let deepWorkHours = getDeepWorkHoursAndFocusQuality(dashboardDataDailyArr[i])[0];
            let focusQuality = getDeepWorkHoursAndFocusQuality(dashboardDataDailyArr[i])[1];
            let avgInterval = getInterval(dashboardDataDailyArr[i]);
            let dateStr = formatDateString(date);
            
            if (mainChartContainer.timeFrame === 'week') {
                let dayOfWeekIndex = getDayOfWeekIndex(date); // 0-6
                while (deepWorkArr.length < dayOfWeekIndex) {
                    deepWorkArr.push(0);
                    focusQualityArr.push(0);
                    avgIntervalArr.push(0);
                }
                updateDateStr(dateStr, dayOfWeekIndex);
                
            } else if (mainChartContainer.timeFrame === 'month') {
                let dayOfMonthIndex = getDayOfMonthIndex(date);
                while (deepWorkArr.length < dayOfMonthIndex) {
                    deepWorkArr.push(0);
                    focusQualityArr.push(0);
                    avgIntervalArr.push(0);
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
            }

            // console.log(dashboardDataDailyArr[i]);
        }
    }

    if (mainChartContainer.timeFrame === 'month') {
        // fill month tick mark labels arr
        let daysInMonth = getDaysInMonth(mainChartContainer.lowerBound);
        xAxisTickLabels.month = setMonthTickLabels(daysInMonth);
        sundayIndices = getSundayIndices(mainChartContainer.lowerBound, xAxisTickLabels.month);
    }

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
            }
            // console.log(monthlyData)

            if (deepWorkMsPerMonthArr[i] !== 0) {
                let deepWorkHours = getDeepWorkHoursAndFocusQuality(monthlyData)[0];
                let focusQuality = getDeepWorkHoursAndFocusQuality(monthlyData)[1];
                let avgInterval = getInterval(monthlyData);

                deepWorkArr.push(deepWorkHours);
                focusQualityArr.push(Math.floor(focusQuality * 100));
                avgIntervalArr.push(avgInterval);

                dataPresent = true;
            } else {
                deepWorkArr.push(0);
                focusQualityArr.push(0);
                avgIntervalArr.push(0);
            }

            // update dateStrArr
            let monthStr = formatMonthYear(mainChartContainer.lowerBound, i);
            dateStrArr.push(monthStr);
        }

        if (!dataPresent) { // allows for "no data" message
            deepWorkArr.length = 0;
            focusQualityArr.length = 0;
            avgIntervalArr.length = 0;
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
    return Math.ceil(avgIntervalYMax / 5) * 5;
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

async function displayDeepWorkChart() {
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
        barColor = 'rgba(13, 160, 18, 1)';
    } else {
        barColor = 'rgba(63, 210, 68, 1)';
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
                        color: 'white'
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
                    duration: 1000,
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

async function displayFocusQualityChart() {
    let xAxisTickLabelArr;
    if (mainChartContainer.timeFrame === 'week') {
        xAxisTickLabelArr = xAxisTickLabels.week;
    } else if (mainChartContainer.timeFrame === 'month') {
        xAxisTickLabelArr = xAxisTickLabels.month;
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
                pointHoverRadius: 8 // Size of the points when hovered
            }]
        },
        options: {
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
                    duration: 1000,
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

async function displayAvgIntervalChart() {
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
            scales: {
                y: {
                    beginAtZero: true,
                    max: yMax.avgInterval, // this'll be whatever 
                    title: {
                        display: true,
                        text: 'Interval Length (Min)',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
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
                    duration: 1000,
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