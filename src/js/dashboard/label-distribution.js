import { userTimeZone } from "../utility/identification.js";
import { dashboardData, labelDistContainer } from "../modules/dashboard-objects.js";
import { labelDistributionMonth, labelDistributionWeek, labelDistributionYear, labelLinesContainer, labelNamesContainer, labelTimesContainer, leftLabelDistributionArrow, rightLabelDistributionArrow } from "../modules/dashboard-elements.js";
import { timeConvert } from "../modules/index-objects.js";

// initialization of labelDistContainer (called in populate-dashboard.js)
export function populateLabelDistContainer(dashboardData, labelDistContainer) {
    labelDistContainer.currentDay = getCurrentDay(); // get current day

    // set default lower and upper bounds
    setBounds(labelDistContainer.timeFrame);

    visualizeLabelData(dashboardData, labelDistContainer);
}

document.addEventListener("stateUpdated", function() {
    // add click event listeners for week, month, year and label dist arrow btns
    labelDistributionWeek.addEventListener("click", function() {
        // add class
        labelDistributionWeek.classList.add('labelDistributionSelected');

        // remove class
        labelDistributionMonth.classList.remove('labelDistributionSelected');
        labelDistributionYear.classList.remove('labelDistributionSelected');

        // set timeFrame
        labelDistContainer.timeFrame = 'week';

        // call function which resets bounds
        setBounds(labelDistContainer.timeFrame);

        // visualize data

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
        setBounds(labelDistContainer.timeFrame);

        // visualize data

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
        setBounds(labelDistContainer.timeFrame);

        // visualize data

    })

    leftLabelDistributionArrow.addEventListener("click", function() {
        // decrease current bounds
        alterBounds(labelDistContainer.timeFrame, 'shiftdown');

        // visualize data

    })
    
    rightLabelDistributionArrow.addEventListener("click", function() {
        // increase current bounds
        alterBounds(labelDistContainer.timeFrame, 'shiftup');

        // visualize data

    })
})

function visualizeLabelData(dashboardData, labelDistContainer) {
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
    let highestPercentKey;

    // calculate highest percent
    Object.keys(labels).forEach(key => {
        let currentPercent = Math.round((labels[key] / totalLabelTime) * 100);
        if (currentPercent > highestPercent) {
            highestPercent = currentPercent;
            highestPercentKey = key;
        }
    })

    console.log(emptyKeys);

    Object.keys(labels).forEach(key => {

        // Create labelName element
        const labelName = dashboardData.noteData.labels[key];
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
    
    Object.keys(labels).forEach(key => {
        let labelTimeStr = document.getElementById("labelTime-" + key).innerText;
        let initialPercent = labelTimeStr.match(/(\d+)%/)[1]; // Access the captured group
        let finalPercent = Math.round(initialPercent / highestPercent * 100); // Adjusted to get percentage correctly
        document.getElementById("labelLine-" + key).style.width = finalPercent;
    });
}

function alterBounds(timeFrame, type) {
    const currentDate = moment(labelDistContainer.currentDay, 'YYYY-MM-DD');
    const upperBoundDate = moment(labelDistContainer.upperBound, 'YYYY-MM-DD');

    if ((type === 'shiftup') && (upperBoundDate.isBefore(currentDate))) {
        labelDistContainer.lowerBound = moment(labelDistContainer.lowerBound, 'YYYY-MM-DD').add(1, timeFrame).format('YYYY-MM-DD');
        labelDistContainer.upperBound = moment(labelDistContainer.upperBound, 'YYYY-MM-DD').add(1, timeFrame).format('YYYY-MM-DD');
    } else if (type === 'shiftdown') {
        labelDistContainer.lowerBound = moment(labelDistContainer.lowerBound, 'YYYY-MM-DD').subtract(1, timeFrame).format('YYYY-MM-DD');
        labelDistContainer.upperBound = moment(labelDistContainer.upperBound, 'YYYY-MM-DD').subtract(1, timeFrame).format('YYYY-MM-DD');
    }

    console.log(labelDistContainer.lowerBound)
    console.log(labelDistContainer.upperBound)
}

function setBounds(timeFrame) {
    // Parse the input date
    const date = moment(labelDistContainer.currentDay, 'YYYY-MM-DD'); // current

    // Get the lower bound (Sunday)
    const lowerBound = date.clone().startOf(timeFrame).format('YYYY-MM-DD');

    // Get the upper bound (Saturday)
    const upperBound = date.clone().endOf(timeFrame).format('YYYY-MM-DD');

    labelDistContainer.lowerBound = lowerBound;
    labelDistContainer.upperBound = upperBound;

    console.log(labelDistContainer.lowerBound)
    console.log(labelDistContainer.upperBound)
}

function getCurrentDay() {
    const date = moment.tz(Date.now(), userTimeZone);
    const year = date.format('YYYY');
    const month = date.format('MM');
    const day = date.format('DD');

    return `${year}-${month}-${day}`;
}