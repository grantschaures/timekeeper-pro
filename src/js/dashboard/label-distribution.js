import { dashboardData, labelDistContainer, general } from '../modules/dashboard-objects.js';
import { labelDistributionElement, labelDistributionMonth, labelDistributionTimeFrame, labelDistributionWeek, labelDistributionYear, labelLinesContainer, labelNamesContainer, labelTimesContainer, leftLabelDistributionArrow, metricDistributionMonth, metricDistributionTimeFrame, metricDistributionWeek, metricDistributionYear, rightLabelDistributionArrow } from '../modules/dashboard-elements.js';
import { timeConvert } from '../modules/index-objects.js';
import { sessionState } from '../modules/state-objects.js';

import { userTimeZone } from '../utility/identification.js';

// initialization of labelDistContainer (called in populate-dashboard.js)
export function populateLabelDistContainer(dashboardData, labelDistContainer) {
    general.currentDay = getCurrentDay(); // get current day (used for label dist & main charts)

    // set default lower and upper bounds
    setBounds(labelDistContainer, labelDistributionTimeFrame);

    // initial visualization of data
    visualizeLabelData(dashboardData, labelDistContainer);
}

function checkViewportWidth() {
    if (window.innerWidth <= 1385) {
        labelDistributionWeek.innerText = "W";
        labelDistributionMonth.innerText = "M";
        labelDistributionYear.innerText = "Y";

        // temporary additions
        metricDistributionWeek.innerText = "W";
        metricDistributionMonth.innerText = "M";
        metricDistributionYear.innerText = "Y";
    } else {
        labelDistributionWeek.innerText = "Week";
        labelDistributionMonth.innerText = "Month";
        labelDistributionYear.innerText = "Year";

        // temporary additions
        metricDistributionWeek.innerText = "Week";
        metricDistributionMonth.innerText = "Month";
        metricDistributionYear.innerText = "Year";

    }

    if (window.innerWidth <= 610) {
        labelDistributionTimeFrame.style.display = "none";

        // temporary addition
        metricDistributionTimeFrame.style.display = "none";
    } else {
        labelDistributionTimeFrame.style.display = "flex";

        // temporary addition
        metricDistributionTimeFrame.style.display = "flex";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('resize', checkViewportWidth);
})

document.addEventListener("stateUpdated", function() {
    // add click event listeners for week, month, year and label dist arrow btns
    if (sessionState.loggedIn) {
        labelDistributionWeek.addEventListener("click", function() {
            // add class
            labelDistributionWeek.classList.add('labelDistributionSelected');
    
            // remove class
            labelDistributionMonth.classList.remove('labelDistributionSelected');
            labelDistributionYear.classList.remove('labelDistributionSelected');
    
            // set timeFrame
            labelDistContainer.timeFrame = 'week';
    
            // call function which resets bounds
            setBounds(labelDistContainer, labelDistributionTimeFrame);
    
            // visualize data
            updateLabelData(dashboardData, labelDistContainer);
        })
        
        labelDistributionMonth.addEventListener("click", function() {
            // add class
            labelDistributionMonth.classList.add('labelDistributionSelected');
            
            // remove class
            labelDistributionWeek.classList.remove('labelDistributionSelected');
            labelDistributionYear.classList.remove('labelDistributionSelected');
            
            // set timeFrame
            labelDistContainer.timeFrame = 'month';
            
            // call function which resets bounds
            setBounds(labelDistContainer, labelDistributionTimeFrame);
    
            // visualize data
            updateLabelData(dashboardData, labelDistContainer);
    
        })
        
        labelDistributionYear.addEventListener("click", function() {
            // add class
            labelDistributionYear.classList.add('labelDistributionSelected');
            
            // remove class
            labelDistributionWeek.classList.remove('labelDistributionSelected');
            labelDistributionMonth.classList.remove('labelDistributionSelected');
            
            // set timeFrame
            labelDistContainer.timeFrame = 'year';
            
            // call function which resets bounds
            setBounds(labelDistContainer, labelDistributionTimeFrame);
    
            // visualize data
            updateLabelData(dashboardData, labelDistContainer);
    
        })
    
        leftLabelDistributionArrow.addEventListener("click", function() {
            // decrease current bounds
            alterBounds('shiftdown', labelDistContainer, labelDistributionTimeFrame);
    
            // visualize data
            updateLabelData(dashboardData, labelDistContainer);
    
        })
        
        rightLabelDistributionArrow.addEventListener("click", function() {
            // increase current bounds
            alterBounds('shiftup', labelDistContainer, labelDistributionTimeFrame);
    
            // visualize data
            updateLabelData(dashboardData, labelDistContainer);
    
        })
    } else {
        const labelDistMessage = document.createElement('div');
        labelDistMessage.innerText = "Log in to see your label time distribution";
        labelDistMessage.classList.add('notLoggedInMessage');
        labelDistMessage.style.paddingBottom = '75px';
        labelDistributionElement.style.height = '100%';
        labelDistributionElement.style.justifyContent = 'center';
        labelNamesContainer.style.display = 'none';
        labelLinesContainer.style.display = 'none';
        labelTimesContainer.style.display = 'none';
        labelDistributionElement.appendChild(labelDistMessage);
    }
})

// modification of visualization
function updateLabelData(dashboardData, labelDistContainer) {
    // iterate through each daily labelTimes value
    // if labelTime key is part of the current labels AND date is within upper and lower bound dates
    let noteDataLabels = dashboardData.noteData.labels;
    let labels = {};

    // initialize labels to empty values
    for (let key in noteDataLabels) {
        if (noteDataLabels.hasOwnProperty(key)) {
            labels[key] = 0;
        }
    }

    // iterate through dashboardData.dailyArr adding up deep work time
    let dashboardDataDailyArr = dashboardData.dailyArr;
    for (let i = 0; i < dashboardDataDailyArr.length; i++) {
        if((moment(dashboardDataDailyArr[i].date, 'YYYY-MM-DD').isSameOrAfter(moment(labelDistContainer.lowerBound, 'YYYY-MM-DD'))) && (moment(dashboardDataDailyArr[i].date, 'YYYY-MM-DD').isSameOrBefore(moment(labelDistContainer.upperBound, 'YYYY-MM-DD')))) {
            let labelTimes = dashboardDataDailyArr[i].labelTimes;
            for (let key in labelTimes) {
                if (labels.hasOwnProperty(key)) {
                    labels[key] += labelTimes[key];
                }
            }
        }
    }

    // identifying which label ids aren't associated w/ any time
    let emptyKeys = [];
    let totalLabelTime = 0;
    let emptyDistribution = false;
    for (let key in labels) {
        totalLabelTime += labels[key];

        if (labels[key] === 0) {
            emptyKeys.push(key);
        }
    }

    if (totalLabelTime === 0) {
        emptyDistribution = true;
    }

    let highestPercent = 0;
    let highestPercentKey;

    // calculate highest percentage of deep work time
    Object.keys(labels).forEach(key => {
        let currentPercent = Math.round((labels[key] / totalLabelTime) * 100);
        if (currentPercent > highestPercent) {
            highestPercent = currentPercent;
            highestPercentKey = key;
        }
    })

    Object.keys(labels).forEach(key => {

        const labelTime = labels[key] / timeConvert.msPerHour;
        const labelTimeHours = Math.floor(labelTime);
        const labelTimeMinutes = Math.floor((labelTime - labelTimeHours) * 60);
        const labelTimePercent = Math.round((labels[key] / totalLabelTime) * 100);

        let labelTimeStr;
        if (emptyKeys.includes(key)) {
            labelTimeStr = '0h 0m (0%)';
        } else {
            labelTimeStr = `${labelTimeHours}h ${labelTimeMinutes}m (${labelTimePercent}%)`;
        }
        document.getElementById('labelTime-' + key).innerText = labelTimeStr;

        let labelLinePercentWidth;
        if (emptyDistribution) {
            labelLinePercentWidth = 0;
        } else {
            labelLinePercentWidth = Math.round(labelTimePercent / highestPercent * 100);
        }
        document.getElementById('labelLine-' + key).style.width = labelLinePercentWidth + '%';
    });
}

// initial visualization
function visualizeLabelData(dashboardData, labelDistContainer) {

    // remove any remnant elements in labelNamesContainer, labelLinesContainer, or labelTimesContainer
    labelNamesContainer.innerHTML = '';
    labelLinesContainer.innerHTML = '';
    labelTimesContainer.innerHTML = '';

    // iterate through each daily labelTimes value
    // if labelTime key is part of the current labels AND date is within upper and lower bound dates
    let noteDataLabels = dashboardData.noteData.labels;
    let labels = {};

    // initialize labels to empty values
    for (let key in noteDataLabels) {
        if (noteDataLabels.hasOwnProperty(key)) {
            labels[key] = 0;
        }
    }

    // iterate through dashboardData.dailyArr
    let dashboardDataDailyArr = dashboardData.dailyArr;
    for (let i = 0; i < dashboardDataDailyArr.length; i++) {
        if((moment(dashboardDataDailyArr[i].date, 'YYYY-MM-DD').isSameOrAfter(moment(labelDistContainer.lowerBound, 'YYYY-MM-DD'))) && (moment(dashboardDataDailyArr[i].date, 'YYYY-MM-DD').isSameOrBefore(moment(labelDistContainer.upperBound, 'YYYY-MM-DD')))) {
            let labelTimes = dashboardDataDailyArr[i].labelTimes;
            for (let key in labelTimes) {
                if (labels.hasOwnProperty(key)) {
                    labels[key] += labelTimes[key];
                }
            }
        }
    }

    let emptyKeys = [];
    let totalLabelTime = 0;
    for (let key in labels) {
        totalLabelTime += labels[key];

        if (labels[key] === 0) {
            emptyKeys.push(key);
        }
    }

    let highestPercent = 0;
    // calculate highest percent
    Object.keys(labels).forEach(key => {
        let currentPercent = Math.round((labels[key] / totalLabelTime) * 100);
        if (currentPercent > highestPercent) {
            highestPercent = currentPercent;
        }
    })

    Object.keys(labels).forEach(key => {

        // Create labelName element
        let labelName = dashboardData.noteData.labels[key];

        if (labelName.length > 20) {
            labelName = labelName.slice(0, 20) + "...";
        }

        const labelNameDiv = document.createElement('div');
        labelNameDiv.id = "labelName-" + key;
        labelNameDiv.classList.add('labelName');
        labelNameDiv.innerText = labelName;
        labelNamesContainer.appendChild(labelNameDiv);

        // Create labelTime elements
        const labelTime = labels[key] / timeConvert.msPerHour;
        const labelTimeHours = Math.floor(labelTime);
        const labelTimeMinutes = Math.floor((labelTime - labelTimeHours) * 60);
        const labelTimePercent = Math.round((labels[key] / totalLabelTime) * 100);

        let labelTimeStr;
        if (emptyKeys.includes(key)) {
            labelTimeStr = '0h 0m (0%)';
        } else {
            labelTimeStr = `${labelTimeHours}h ${labelTimeMinutes}m (${labelTimePercent}%)`;
        }
        
        const labelTimeDiv = document.createElement('div');
        labelTimeDiv.classList.add('labelTime');
        labelTimeDiv.id = "labelTime-" + key;
        labelTimeDiv.innerText = labelTimeStr;
        labelTimesContainer.appendChild(labelTimeDiv);

        // Create labelLine elements
        const labelLineDiv = document.createElement('div');
        labelLineDiv.classList.add('labelLine');
        labelLineDiv.id = "labelLine-" + key;
        const labelLineContainerDiv = document.createElement('div');
        labelLineContainerDiv.classList.add('labelLineContainer');
        labelLineContainerDiv.id = "labelLineContainer-" + key;
        
        let labelLinePercentWidth = Math.round(labelTimePercent / highestPercent * 100);
        labelLineDiv.style.width = labelLinePercentWidth + '%';

        labelLineContainerDiv.appendChild(labelLineDiv);
        labelLinesContainer.appendChild(labelLineContainerDiv);
    });
}

export function alterBounds(type, container, timeFrameElement) {
    const currentDate = moment(general.currentDay, 'YYYY-MM-DD');
    const upperBoundDate = moment(container.upperBound, 'YYYY-MM-DD');

    if ((type === 'shiftup') && (upperBoundDate.isBefore(currentDate))) {
        container.lowerBound = moment(container.lowerBound, 'YYYY-MM-DD').add(1, container.timeFrame).format('YYYY-MM-DD');
        container.upperBound = moment(container.upperBound, 'YYYY-MM-DD').add(1, container.timeFrame).format('YYYY-MM-DD');
    } else if (type === 'shiftdown') {
        container.lowerBound = moment(container.lowerBound, 'YYYY-MM-DD').subtract(1, container.timeFrame).format('YYYY-MM-DD');
        container.upperBound = moment(container.upperBound, 'YYYY-MM-DD').subtract(1, container.timeFrame).format('YYYY-MM-DD');
    }

    displayTimeFrame(container, timeFrameElement);
}

export function setBounds(container, timeFrameElement) {
    // Parse the input date
    const date = moment(general.currentDay, 'YYYY-MM-DD'); // current

    // Get the lower bound (Sunday)
    const lowerBound = date.clone().startOf(container.timeFrame).format('YYYY-MM-DD');

    // Get the upper bound (Saturday)
    const upperBound = date.clone().endOf(container.timeFrame).format('YYYY-MM-DD');

    container.lowerBound = lowerBound;
    container.upperBound = upperBound;

    displayTimeFrame(container, timeFrameElement);
}

function displayTimeFrame(container, timeFrameElement) {
    let timeFrameStr;
    if (container.timeFrame === 'week') {
        timeFrameStr = formatWeekSpan(container.lowerBound, container.upperBound);
    } else if (container.timeFrame === 'month') {
        timeFrameStr = formatMonthSpan(container.lowerBound);
    } else { // year
        timeFrameStr = formatYearSpan(container.lowerBound);
    }

    timeFrameElement.innerText = timeFrameStr;
}

function formatYearSpan(initialDate) {
    const date = parseUTCDate(initialDate);
    const year = date.getFullYear();
    return year;
}

function formatMonthSpan(initialDate) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const date = parseUTCDate(initialDate);

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Check if the year of the input dates is the same as the current year
    if (year === currentYear) {
        return `${month}`;
    } else {
        return `${month} '${String(year).slice(-2)}`;
    }
}

function formatWeekSpan(initialDate, finalDate) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const date1 = parseUTCDate(initialDate);
    const date2 = parseUTCDate(finalDate);

    const month1 = monthNames[date1.getMonth()];
    const day1 = getDayWithSuffix(date1.getDate());
    const year1 = date1.getFullYear();

    const month2 = monthNames[date2.getMonth()];
    const day2 = getDayWithSuffix(date2.getDate());
    const year2 = date2.getFullYear();

    if (year1 === currentYear && year2 === currentYear) {
        if (month1 === month2) {
            return `${month1} ${day1} - ${day2}`;
        } else {
            return `${month1} ${day1} - ${month2} ${day2}`;
        }
    } else if (year1 === year2) {
        const abbreviatedYear = String(year1).slice(-2);
        if (month1 === month2) {
            return `${month1} ${day1} - ${day2} '${abbreviatedYear}`;
        } else {
            return `${month1} ${day1} - ${month2} ${day2} '${abbreviatedYear}`;
        }
    } else {
        const abbreviatedYear1 = String(year1).slice(-2);
        const abbreviatedYear2 = String(year2).slice(-2);
        return `${month1} ${day1} '${abbreviatedYear1} - ${month2} ${day2} '${abbreviatedYear2}`;
    }
}

function getDayWithSuffix(day) {
    if (day > 3 && day < 21) return day + 'th'; // catch for 11th to 19th
    switch (day % 10) {
        case 1:  return day + "st";
        case 2:  return day + "nd";
        case 3:  return day + "rd";
        default: return day + "th";
    }
}

function parseUTCDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function getCurrentDay() {
    const date = moment.tz(Date.now(), userTimeZone);
    const year = date.format('YYYY');
    const month = date.format('MM');
    const day = date.format('DD');

    return `${year}-${month}-${day}`;
}