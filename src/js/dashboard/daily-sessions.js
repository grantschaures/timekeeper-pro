import { dailyDay, dailyDate, rightDailyArrow, rightDailyArrowGray, leftDailyArrow, miniChartLabels, miniChartContainers, dailyBlocks, calendarContainer } from '../modules/dashboard-elements.js';
import { dailyContainer, general } from '../modules/dashboard-objects.js';
import { sessionState } from '../modules/state-objects.js';

import { setBounds, alterBounds } from './label-distribution.js'; // need to add to editHTML

export function checkViewportWidth() {
    if ((window.innerWidth >= 865) && (window.innerWidth <= 1050)) {
        dailyDay.style.fontSize = '22px';
        dailyDate.style.fontSize = '14px';
    } else {
        dailyDay.style.fontSize = '24px';
        dailyDate.style.fontSize = '16px';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('resize', checkViewportWidth);
})

document.addEventListener("stateUpdated", function() {
    setInitialDate(); // set regardless of whether or not user is logged in

    if (sessionState.loggedIn) {

        // ARROWS EVENT LISTENERS
        leftDailyArrow.addEventListener("click", function() {
            alterBounds('shiftdown', dailyContainer, null, rightDailyArrow, rightDailyArrowGray);
            // console.log(dailyContainer);

            // update miniChartLabels
            updateMiniChartLabels();
    
            // visualize data (call function to display mini charts)
    
        })
        
        rightDailyArrow.addEventListener("click", function() {
            alterBounds('shiftup', dailyContainer, null, rightDailyArrow, rightDailyArrowGray);
            // console.log(dailyContainer);

            // update miniChartLabels
            updateMiniChartLabels();


            // visualize data (call function to display mini charts)
    
        })

        // MINI CHART CANVAS SELECTION EVENT LISTENERS
        dailyBlocks[0].addEventListener("click", function() { // Sunday
            setAndDisplaySelectedDate(0);
        });

        dailyBlocks[1].addEventListener("click", function() { // Monday
            setAndDisplaySelectedDate(1);
        });
        
        dailyBlocks[2].addEventListener("click", function() { // Tuesday
            setAndDisplaySelectedDate(2);
        });
        
        dailyBlocks[3].addEventListener("click", function() { // Wednesday
            setAndDisplaySelectedDate(3);
        });
        
        dailyBlocks[4].addEventListener("click", function() { // Thursday
            setAndDisplaySelectedDate(4);
        });
        
        dailyBlocks[5].addEventListener("click", function() { // Friday
            setAndDisplaySelectedDate(5);
        });
        
        dailyBlocks[6].addEventListener("click", function() { // Saturday
            setAndDisplaySelectedDate(6);
        });

        // CALENDAR
        calendarContainer.addEventListener('click', function() {
            console.log("I'm gonna have to build this thing myself")
        })
    }
})

function setAndDisplaySelectedDate(weekIndex) {

    dailyContainer.selectedDate = dailyContainer.weeklyDatesArr[weekIndex];
    let selectedDateText = getSelectedDateText();
    dailyDay.innerText = selectedDateText.dayOfWeek;
    dailyDate.innerText = selectedDateText.monthDayYear;

}

function getSelectedDateText() {
    let selectedDate = dailyContainer.selectedDate;

    const date = moment(selectedDate, 'YYYY-MM-DD');

    const dayOfWeek = date.format('dddd');

    const monthDayYear = date.format('MMMM D, YYYY');

    return {
        dayOfWeek,
        monthDayYear
    };
}

function updateMiniChartLabels() {
    // create array of the 7 labels based on the upper and lower bounds
    // if general.currentDay is before or equal to the upper bound, then create an array of letters representing the days of the week
    // else, create an array of dates (e.g. '9/3' representing the days)
    let miniChartLabelArr = getMiniChartLabelArr();

    // apply labels to miniLabels
    for (let i = 0; i < 7; i++) {
        miniChartLabels[i].textContent = miniChartLabelArr[i];
    }
}

function getMiniChartLabelArr() {
    let currentDay = moment(general.currentDay, 'YYYY-MM-DD');
    let upperBound = moment(dailyContainer.upperBound, 'YYYY-MM-DD');
    let lowerBound = moment(dailyContainer.lowerBound, 'YYYY-MM-DD');
    let chartLabelArr = [];
    let chartDateLabelArr = [];
    let weeklyDatesArr = [];

    // initializing the weeklyDatesArr progerammatically for reference later
    while (lowerBound.isSameOrBefore(upperBound)) {
        let day = lowerBound.format('YYYY-MM-DD');
        weeklyDatesArr.push(day);
        chartDateLabelArr.push(formatDateString(day));
        lowerBound.add(1, 'days');
    }
    dailyContainer.weeklyDatesArr = weeklyDatesArr;

    if (currentDay.isSameOrBefore(upperBound)) {
        chartLabelArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    } else {
        chartLabelArr = chartDateLabelArr;
    }

    return chartLabelArr;
}

function formatDateString(dateStr) {
    // Split the date string into parts (YYYY, MM, DD)
    const [year, month, day] = dateStr.split('-');

    // Remove leading zeros from month and day, and then join with a slash
    return `${parseInt(month)}\/${parseInt(day)}`;
}

export async function setDailyContainer() { // called from populate-dashboard.js
    await setBounds(dailyContainer, null, rightDailyArrow, rightDailyArrowGray);
    updateMiniChartLabels();
}

function setInitialDate() {
    const now = new Date();

    // set initial selectedDate to be current date
    dailyContainer.selectedDate = general.currentDay;
    
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