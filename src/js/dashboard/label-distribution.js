import { userTimeZone } from "../utility/identification.js";
import { dashboardData, labelDistContainer } from "../modules/dashboard-objects.js";
import { labelDistributionMonth, labelDistributionWeek, labelDistributionYear, leftLabelDistributionArrow, rightLabelDistributionArrow } from "../modules/dashboard-elements.js";

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

        // call function which reinitializes data
    })
    
    labelDistributionMonth.addEventListener("click", function() {
        // add class
        labelDistributionMonth.classList.add('labelDistributionSelected');
        
        // remove class
        labelDistributionWeek.classList.remove('labelDistributionSelected');
        labelDistributionYear.classList.remove('labelDistributionSelected');
        
        // set timeFrame
        labelDistContainer.timeFrame = 'month';
        
        // call function which reinitializes data
    })
    
    labelDistributionYear.addEventListener("click", function() {
        // add class
        labelDistributionYear.classList.add('labelDistributionSelected');
        
        // remove class
        labelDistributionWeek.classList.remove('labelDistributionSelected');
        labelDistributionMonth.classList.remove('labelDistributionSelected');
        
        // set timeFrame
        labelDistContainer.timeFrame = 'year';
        
        // call function which reinitializes data
    })

    leftLabelDistributionArrow.addEventListener("click", function() {
        // decrease current bounds
    })

    rightLabelDistributionArrow.addEventListener("click", function() {
        // increase current bounds
    })
})

// initialization of labelDistContainer (called in populate-dashboard.js)
export function populateLabelDistContainer(dashboardData, noteData, labelDistContainer) {
    // get day
    labelDistContainer.currentDay = getCurrentDay();

    // set lower and upper bounds
    setBounds(labelDistContainer.timeFrame);
    console.log(labelDistContainer.lowerBound)
    console.log(labelDistContainer.upperBound)



}

function setBounds(timeFrame) {
    // Parse the input date
    const date = moment(labelDistContainer.currentDay, 'YYYY-MM-DD');

    // Get the lower bound (Sunday)
    const lowerBound = date.clone().startOf(timeFrame).format('YYYY-MM-DD');

    // Get the upper bound (Saturday)
    const upperBound = date.clone().endOf(timeFrame).format('YYYY-MM-DD');

    labelDistContainer.lowerBound = lowerBound;
    labelDistContainer.upperBound = upperBound;
}

function getCurrentDay() {
    const date = moment.tz(Date.now(), userTimeZone);
    const year = date.format('YYYY');
    const month = date.format('MM');
    const day = date.format('DD');

    return `${year}-${month}-${day}`;
}