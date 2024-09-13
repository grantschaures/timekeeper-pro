import { miniCharts } from "../modules/dashboard-elements.js";
import { dashboardData, dailyContainer, miniChartsArr, constants, flags } from "../modules/dashboard-objects.js";
import { sessionState } from "../modules/state-objects.js";

import { getDeepWork, getFocusQuality, getTargetHours } from './session-summary-chart.js';

let miniChartDataArr = [];

document.addEventListener("displayMiniCharts", async function() {
    await resetData();
    await initializeData();

    displayMiniCharts();
})

function displayMiniCharts() {
    // iterate through miniChartDataArr and at each iteration, initialize a new chart instance w/ the appropriate data
    // Arrays that map on to each other:
    // (1) miniCharts, (2) miniChartDataArr, (3) miniChartsArr

    let animationLength = 0;
    if (dailyContainer.miniChartsSeen) {
        animationLength = 1000;
    }

    for (let i = 0; i < miniCharts.length; i++) {
        displayMiniChart(i, animationLength);
    }

    dailyContainer.miniChartsSeen = true;
}

function displayMiniChart(weekIndex, animationLength) {
    // console.log(miniCharts[weekIndex].id);
    // console.log(miniChartDataArr[weekIndex]);

    let miniChartId = miniCharts[weekIndex].id;
    const ctx = document.getElementById(miniChartId).getContext('2d');

    let miniChartDataObj;
    if (sessionState.loggedIn) {
        miniChartDataObj = miniChartDataArr[weekIndex];
    } else {
        miniChartDataObj = null;
    }

    let miniChartDataFocusQuality = 0;
    let miniChartDataDeepWorkTime = 0;
    let miniChartDataTargetHourSum = 0.0000000000000001;

    if (miniChartDataObj) {
        miniChartDataFocusQuality = 1 - ((miniChartDataObj.distractions / (miniChartDataObj.deepWorkTime / 60000)) / constants.FOCUS_QUALITY_CONSTANT);
        if (miniChartDataFocusQuality < 0) {
            miniChartDataFocusQuality = 0;
        }

        miniChartDataDeepWorkTime = miniChartDataObj.deepWorkTime;
        miniChartDataTargetHourSum = miniChartDataObj.targetHourSum;
    }

    let focusQuality = getFocusQuality(miniChartDataFocusQuality);
    let focusQualityRemainder = 100 - focusQuality;

    let deepWork = getDeepWork(miniChartDataDeepWorkTime);
    let targetHours = getTargetHours(miniChartDataTargetHourSum);
    let deepWorkRemainder = targetHours - deepWork;
    if (deepWorkRemainder < 0) {
        deepWorkRemainder = 0;
    }
    let deepWorkHours = Math.floor(deepWork);
    let deepWorkMinutes = Math.round((deepWork - deepWorkHours) * 60);

    let lessThanOneMin = false;
    let deepWorkSeconds;

    // if total deep work is < 1m, calculate number of seconds
    if (miniChartDataDeepWorkTime < 60000) {
        lessThanOneMin = true;
        deepWorkSeconds = Math.floor(miniChartDataDeepWorkTime / 1000);
    }

    const data = {
        datasets: [
            {
                label: 'Focus Quality',
                data: [focusQuality, focusQualityRemainder],
                backgroundColor: [
                    'rgba(59, 143, 227, 1)',
                    'rgba(59, 143, 227, 0.15)',
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                ],
                borderWidth: 0,
            },
            {
                label: 'Deep Work',
                data: [deepWork, deepWorkRemainder],
                backgroundColor: [
                    'rgba(83, 230, 88, 1)',
                    'rgba(83, 230, 88, 0.15)',
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                ],
                borderWidth: 0,
            }
        ]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '40%',
            animation: {
                duration: animationLength, // Duration in milliseconds
                animateRotate: true, // Animate rotation
                animateScale: false, // Animate scaling
            },
            plugins: {
                legend: false, // Disables the legend
                tooltip: false, // Disables the tooltips
            },
            layout: {
                padding: 0
            }
        }
    };

    // Destroy the existing chart instance if it exists
    if (miniChartsArr[weekIndex]) {
        miniChartsArr[weekIndex].destroy();
        miniChartsArr[weekIndex] = null;
    }

    // Create a new chart instance
    miniChartsArr[weekIndex] = new Chart(ctx, config);
}

async function initializeData() {
    // iterate through dashboardData.weeklyArr
    // create new object consisting of just: (1) deepWorkTime, (2) distractions, and (3) targetHourSum

    let weeklyArr = dashboardData.weeklyArr;
    let currentWeekArrObj = findObjectByDate(weeklyArr, dailyContainer.lowerBound);
    let currentWeekArr;

    if (currentWeekArrObj) {
        currentWeekArr = currentWeekArrObj[dailyContainer.lowerBound];
    } else {
        currentWeekArr = [null, null, null, null, null, null, null];
    }

    dashboardData.currentWeekArr = currentWeekArr; // SETTING dashboardData.currentWeekArr

    if (!flags.dailyArrowClicked) {
        document.dispatchEvent(new Event('displayDayView'));
    } else {
        flags.dailyArrowClicked = false;
    }

    let newCurrentWeekArr = [];
    let newCurrentWeekObj = {};

    for (let i = 0; i < currentWeekArr.length; i++) {
        newCurrentWeekObj = {};

        // create new array where the element either remains null or consists of a pruned down version of the original object
        if (!currentWeekArr[i]) {
            newCurrentWeekArr[i] = currentWeekArr[i]; // value should be null

        } else {
            // push pruned down version of currentWeekArr[i] object to newCurrentWeekArr[i]
            newCurrentWeekObj['deepWorkTime'] = currentWeekArr[i].deepWorkTime;
            newCurrentWeekObj['distractions'] = currentWeekArr[i].distractions;
            newCurrentWeekObj['targetHourSum'] = currentWeekArr[i].targetHourSum;

            newCurrentWeekArr.push(newCurrentWeekObj);
        }
    }

    miniChartDataArr = newCurrentWeekArr;
}

function findObjectByDate(arr, targetDate) {
    return arr.find(obj => Object.keys(obj)[0] === targetDate);
}

async function resetData() {
    miniChartDataArr = [];
}