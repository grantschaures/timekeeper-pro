import { charts, dashboardData, flags, constants, general, settings } from "../modules/dashboard-objects.js";
import { timeConvert } from "../modules/index-objects.js";

import { calculateDistractionsPerHour, focusQualityCalculation } from '../dashboard/populate-dashboard.js';

// Global Variables
let hourlyFocusQualityArr = [];
let hourlyDistractionsArr = []; // avg per hour
let hourlyDeepWorkArr = []; // avg per hour
let hourlyAdjustedDeepWorkArr = [];

let opacityArr = [];
let maxSampleSize = 0;

const finalHourArr = ['1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12am'];

const FOCUS_QUALITY_CONSTANT = constants.FOCUS_QUALITY_CONSTANT;

document.addEventListener("displayAdvCharts", async function() {
    await resetHourlyData();

    await initializeHourlyData(dashboardData, hourlyFocusQualityArr, hourlyDistractionsArr, hourlyDeepWorkArr);
    let chartTransition = general.chartTransition;

    if ((chartTransition === 'all') || (chartTransition === 'adv-adjusted')) {
        displayHourlyAvgDeepWorkChart();
    }

    if ((chartTransition === 'all') || (chartTransition === 'adv-distractions')) {
        displayHourlyFocusChart();
    }
})

// // // // // // //
// HELPER FUNCTIONS
// // // // // // //

async function resetHourlyData() {
    hourlyFocusQualityArr = [];
    hourlyDistractionsArr = []; // avg per hour
    hourlyDeepWorkArr = []; // avg per hour
    opacityArr = [];
    maxSampleSize = 0;
}

function displayHourlyAvgDeepWorkChart() {

    let backgroundColorStr = 'rgba(63, 210, 68, ';
    let backgroundColorStrFull = 'rgb(63, 210, 68)';

    if (flags.hourlyQualityAdjustedToggle) {
        backgroundColorStr = 'rgba(12, 206, 99, ';
        backgroundColorStrFull = 'rgb(12, 206, 99)';
    }
    
    let dataArr = hourlyDeepWorkArr;
    if (flags.hourlyQualityAdjustedToggle) {
        dataArr = hourlyAdjustedDeepWorkArr;
    }

    let backgrounds = opacityArr.map((value, index) => {
        let finalBackgroundColorStr;
        if (settings.relSampleSizeVis) {
            finalBackgroundColorStr = backgroundColorStr + value;
        } else {
            finalBackgroundColorStr = backgroundColorStrFull;
        }
        return finalBackgroundColorStr;
    })

    const ctx = document.getElementById('avgDeepWorkChart').getContext('2d');
    const config = {
        type: 'bar',
        data: {
            labels: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
            datasets: [{
                label: 'Avg Deep Work (Min)',
                data: dataArr,
                backgroundColor: backgrounds,
                borderWidth: 2,
                borderRadius: 25,
                barPercentage: 1.0, // Full width bar
                categoryPercentage: 1.0, // Full width category
                offset: true // Offset the bars between the ticks
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 60,
                    title: {
                        display: true,
                        text: 'Avg Deep Work (Min)',
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
                    offset: true,
                    ticks: {
                        align: 'end', // Align tick labels to the start (left) of the bar
                        color: 'white'
                    },
                    title: {
                        display: false
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
                    borderWidth: 3, // Sets the width of the tooltip border
                    callbacks: {
                        title: function(tooltipItems) {
                            let item = tooltipItems[0];
                            let index = item.dataIndex;
                            let finalHour = finalHourArr[index];
                            return item.label + " - " + finalHour; // Return the x-axis label directly
                        },
                        label: function(tooltipItem) {
                            let label;
                            if (flags.hourlyQualityAdjustedToggle) {
                                label = ' ' + tooltipItem.raw + ' min adjusted avg deep work'; // Return the raw data value
                            } else {
                                label = ' ' + tooltipItem.raw + ' min avg deep work'; // Return the raw data value
                            }
                            
                            return label;
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
            dottedLinePlugin // Register the dottedLinePlugin
        ]
    };

    // Destroy the existing chart instance if it exists
    if (charts.avgDeepWork) {
        charts.avgDeepWork.destroy();
        charts.avgDeepWork = null;
    }

    // Create a new chart instance
    charts.avgDeepWork = new Chart(ctx, config);
}

function displayHourlyFocusChart() {

    let barColor;
    let dataArr;
    let yScale;

    let backgroundColorStr = 'rgba(162, 0, 212, ';
    let backgroundColorStrFull = 'rgb(162, 0, 212)';
    if (flags.distractionsToggle) {
        backgroundColorStr = 'rgba(255, 69, 0, ';
        backgroundColorStrFull = 'rgb(255, 69, 0)';
    }

    let backgrounds = opacityArr.map((value, index) => {
        let finalBackgroundColorStr;
        if (settings.relSampleSizeVis) {
            finalBackgroundColorStr = backgroundColorStr + value;
        } else {
            finalBackgroundColorStr = backgroundColorStrFull;
        }
        return finalBackgroundColorStr;
    })

    if (flags.distractionsToggle) {
        barColor = backgrounds;
        dataArr = hourlyDistractionsArr;
        yScale = {
            beginAtZero: true,
            suggestedMax: 5,
            title: {
                display: true,
                text: 'Avg Distractions (Per Hour of Deep Work)',
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
        }
    } else {
        barColor = backgrounds;
        dataArr = hourlyFocusQualityArr;
        yScale = {
            beginAtZero: true,
            max: 100,
            title: {
                display: true,
                text: 'Hourly Focus Quality',
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
        };
    }

    const ctx = document.getElementById('hourlyFocusChart').getContext('2d');
    const config = {
        type: 'bar',
        data: {
            labels: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
            datasets: [{
                label: 'Hourly Focus Quality',
                data: dataArr,
                backgroundColor: backgrounds,
                borderWidth: 2,
                borderRadius: 25,
                barPercentage: 1.0, // Full width bar
                categoryPercentage: 1.0, // Full width category
                offset: true // Offset the bars between the ticks
            }]
        },
        options: {
            scales: {
                y: yScale,
                x: {
                    offset: true,
                    ticks: {
                        align: 'end', // Align tick labels to the start (left) of the bar
                        color: 'white'
                    },
                    title: {
                        display: false
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
                    borderWidth: 3, // Sets the width of the tooltip border
                    callbacks: {
                        title: function(tooltipItems) {
                            let item = tooltipItems[0];
                            let index = item.dataIndex;
                            let finalHour = finalHourArr[index];
                            return item.label + " - " + finalHour; // Return the x-axis label directly
                        },
                        label: function(tooltipItem) {

                            let label;
                            if (flags.distractionsToggle) {
                                label = ' ' + tooltipItem.raw + ' avg distractions per hour of deep work'; // Return the raw data value
                            } else {
                                label = ' ' + tooltipItem.raw + '%';
                            }
                            return label;
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
            dottedLinePlugin // Register the dottedLinePlugin
        ]
    };

    // Destroy the existing chart instance if it exists
    if (charts.hourlyFocus) {
        charts.hourlyFocus.destroy();
        charts.hourlyFocus = null;
    }

    // Create a new chart instance
    charts.hourlyFocus = new Chart(ctx, config);
}

const dottedLinePlugin = {
    id: 'dottedLinePlugin',
    afterDraw: function(chart) {
        const ctx = chart.ctx;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;

        // Index for '11am' and '12pm'
        const index11am = 11;
        const index12pm = 12;

        // Get the pixel positions for the '11am' and '12pm'
        const x11am = xScale.getPixelForValue(index11am);
        const x12pm = xScale.getPixelForValue(index12pm);

        // Calculate the midpoint between '11am' and '12pm'
        const xMid = (x11am + x12pm) / 2;
    
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
};

// modified version of this in summary-stats.js for calculating most focused hour
export async function initializeHourlyData(dashboardData) {
    let hourlyData = dashboardData.hourlyArr;
    for (let i = 0; i < hourlyData.length; i++) {
        let focusQuality = focusQualityCalculation(timeConvert, hourlyData[i].deepWork, hourlyData[i].distractions, FOCUS_QUALITY_CONSTANT);
        hourlyFocusQualityArr.push(Math.round(focusQuality * 100));

        let distractionsPerHour = calculateDistractionsPerHour(timeConvert, hourlyData[i].deepWork, hourlyData[i].distractions);
        hourlyDistractionsArr.push(distractionsPerHour);

        let avgDeepWorkPerHour = calculateAvgDeepWorkPerHour(hourlyData[i].deepWorkTimes);
        hourlyDeepWorkArr.push(Math.round(avgDeepWorkPerHour));

        let adjustedAvgDeepWorkPerHour = Math.round(avgDeepWorkPerHour * focusQuality);
        hourlyAdjustedDeepWorkArr.push(adjustedAvgDeepWorkPerHour);

        let hourlyArrLength = hourlyData[i].deepWorkTimes.length;
        if (hourlyArrLength > maxSampleSize) {
            maxSampleSize = hourlyArrLength;
        }
    }

    for (let j = 0; j < hourlyData.length; j++) {
        let currentSampleSize = hourlyData[j].deepWorkTimes.length;
        let opacityValue = currentSampleSize / maxSampleSize;
        opacityArr.push(opacityValue);
    }

    return { hourlyAdjustedDeepWorkArr, opacityArr }; // to populate the Most Productive Hour Summary Stat
}


function calculateAvgDeepWorkPerHour(deepWorkTimesArr) {
    let arrSum = deepWorkTimesArr.reduce((acc, curr) => acc + curr, 0);

    let deepWorkAvgMs = arrSum / deepWorkTimesArr.length;
    let deepWorkAvgMin = deepWorkAvgMs / timeConvert.msPerMin;

    if (isNaN(deepWorkAvgMin)) {
        deepWorkAvgMin = 0;
    }

    return deepWorkAvgMin;
}