import { charts, dashboardData, flags } from "../modules/dashboard-objects.js";
import { timeConvert } from "../modules/index-objects.js";

import { calculateDistractionsPerHour, focusQualityCalculation } from '../dashboard/populate-dashboard.js';

// Global Variables
let hourlyFocusQualityArr = [];
let hourlyDistractionsArr = []; // avg per hour
let hourlyDeepWorkArr = []; // avg per hour

const finalHourArr = ['1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12am'];

const FOCUS_QUALITY_CONSTANT = 0.5;

document.addEventListener("displayAdvCharts", async function() {
    // await resetHourlyData();

    await initializeHourlyData(dashboardData, hourlyFocusQualityArr, hourlyDistractionsArr, hourlyDeepWorkArr);

    displayHourlyFocusChart();
})

// // // // // // //
// HELPER FUNCTIONS
// // // // // // //

function displayHourlyFocusChart() {

    let barColor;
    let dataArr;
    let yScale;

    if (flags.distractionsToggle) {
        barColor = 'rgb(255, 69, 0)';
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
        barColor = 'rgb(162, 0, 212)';
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
                backgroundColor: barColor,
                borderColor: 'rgb(255, 255, 255)',
                borderWidth: 2,
                borderRadius: 5,
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
            noDataPlugin,    // Register the noDataPlugin
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

async function initializeHourlyData(dashboardData, hourlyFocusQualityArr, hourlyDistractionsArr, hourlyDeepWorkArr) {
    let hourlyData = dashboardData.hourlyArr;
    for (let i = 0; i < hourlyData.length; i++) {
        let focusQuality = focusQualityCalculation(timeConvert, hourlyData[i].deepWork, hourlyData[i].distractions, FOCUS_QUALITY_CONSTANT);
        hourlyFocusQualityArr.push(Math.round(focusQuality * 100));

        let distractionsPerHour = calculateDistractionsPerHour(timeConvert, hourlyData[i].deepWork, hourlyData[i].distractions);
        hourlyDistractionsArr.push(distractionsPerHour);

        let avgDeepWorkPerHour = calculateAvgDeepWorkPerHour(hourlyData[i].deepWorkTimes);
        hourlyDeepWorkArr.push(avgDeepWorkPerHour);
    }

    // console.log(hourlyFocusQualityArr)
}


function calculateAvgDeepWorkPerHour(deepWorkTimesArr) {
    let arrSum = deepWorkTimesArr.reduce((acc, curr) => acc + curr, 0);
    let deepWorkAvgMs = arrSum / deepWorkTimesArr.length;
    let deepWorkAvgMin = Math.round(deepWorkAvgMs / 60000);

    return deepWorkAvgMin;
}