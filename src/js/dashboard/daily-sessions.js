import { dailyDay, dailyDate, rightDailyArrow, rightDailyArrowGray, leftDailyArrow, miniChartLabels, miniChartContainers, dailyBlocks, calendarIconContainer, calendarPopup, monthSelection, yearSelection, calendarHeaderCells, leftCalendarArrow, rightCalendarArrow, rightCalendarArrowGray, calendarBody, todayBtn, sessionViewBackBtn } from '../modules/dashboard-elements.js';
import { dailyContainer, general, flags, calendarContainer } from '../modules/dashboard-objects.js';
import { tempCounters } from '../modules/index-objects.js';
import { sessionState } from '../modules/state-objects.js';

import { setBounds, alterBounds, setRightArrowType } from './label-distribution.js';

export function checkViewportWidth() {
    if ((window.innerWidth >= 865) && (window.innerWidth <= 1050)) {
        dailyDay.style.fontSize = '22px';
        dailyDate.style.fontSize = '14px';
        monthSelection.style.fontSize = '12px'
        yearSelection.style.fontSize = '12px'
        monthSelection.style.width = '90px';
        yearSelection.style.width = '65px';

        calendarHeaderCells.forEach(cell => {
            cell.style.fontSize = '14px';
        })
    } else {
        dailyDay.style.fontSize = '24px';
        dailyDate.style.fontSize = '16px';
        monthSelection.style.fontSize = '14px'
        yearSelection.style.fontSize = '14px'
        monthSelection.style.width = '100px';
        yearSelection.style.width = '70px';
        calendarHeaderCells.forEach(cell => {
            cell.style.fontSize = '16px';
        })
    }
}

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('resize', checkViewportWidth);
})

document.addEventListener("stateUpdated", function() {
    setInitialDate(); // set regardless of whether or not user is logged in
    if (sessionState.loggedIn) {
        // call initializeWeeklyDataArr() here
        // that will, only once at the start, create an array of objects containing a lowerbound key, with a weekly array value
        // - first obj starts with lowerbound key representing first day of the first week the user submitted a session
        // - objs get pushed onto the array up until the week of the current day (regardless of when the user submitted their most recent session)
        // the weekly array contians 7 objects with two key-value pairs
        // (1) dailyObj: {} --> We'll need to ensure that it contains a targetTimeSum (the sum of target times out of all the sessions)
        // (2) sessionsObj: {} or [{}, {}] or null, which represents a single session, multiple sessions, or no sessions, respectively

        // ARROWS EVENT LISTENERS
        leftDailyArrow.addEventListener("click", function() {
            alterBounds('shiftdown', dailyContainer, null, rightDailyArrow, rightDailyArrowGray);
            // console.log(dailyContainer);

            // update miniChartLabels
            updateMiniChartLabels();

            flags.dailyArrowClicked = true;
    
            // visualize data (call function to display mini charts)
            document.dispatchEvent(new Event('displayMiniCharts'));
    
        })
        
        rightDailyArrow.addEventListener("click", function() {
            alterBounds('shiftup', dailyContainer, null, rightDailyArrow, rightDailyArrowGray);
            // console.log(dailyContainer);

            // update miniChartLabels
            updateMiniChartLabels();

            flags.dailyArrowClicked = true;

            // visualize data (call function to display mini charts)
            document.dispatchEvent(new Event('displayMiniCharts'));
    
        })

        // MINI CHART CANVAS SELECTION EVENT LISTENERS
        dailyBlocks[0].addEventListener("click", function() { // Sunday
            miniChartSelectionActions(0);
        });
        
        dailyBlocks[1].addEventListener("click", function() { // Monday
            miniChartSelectionActions(1);
        });
        
        dailyBlocks[2].addEventListener("click", function() { // Tuesday
            miniChartSelectionActions(2);
        });
        
        dailyBlocks[3].addEventListener("click", function() { // Wednesday
            miniChartSelectionActions(3);
        });
        
        dailyBlocks[4].addEventListener("click", function() { // Thursday
            miniChartSelectionActions(4);
        });
        
        dailyBlocks[5].addEventListener("click", function() { // Friday
            miniChartSelectionActions(5);
        });
        
        dailyBlocks[6].addEventListener("click", function() { // Saturday
            miniChartSelectionActions(6);
        });

        // CALENDAR
        calendarIconContainer.addEventListener('click', function() {
            let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            
            if (!flags.calendarPopupShowing) {
                flags.calendarPopupShowing = true;
                calendarPopup.style.display = 'flex';
                setTimeout(() => {
                    calendarPopup.style.opacity = '1';
                    calendarPopup.style.transform = 'scale(1)';
                }, 0)

                if (viewportWidth <= 670) {
                    document.getElementById('dashboardCat6').style.display = 'none';
                }

                // ensure calendar body is updated if mini-chart is clicked on
                let current = getMonthYearDay(general.currentDay);
                updateCalendarBody(current);
                
            } else {
                flags.calendarPopupShowing = false;
                calendarPopup.style.opacity = '0';
                calendarPopup.style.transform = 'scale(0.90)';
                setTimeout(() => {
                    calendarPopup.style.display = 'none';
                }, 150)
                if (tempCounters.dashboardCatIdsArrIndex === 5) {
                    document.getElementById('dashboardCat6').style.display = 'flex';
                }
            }
        })

        monthSelection.addEventListener('change', function() {
            alterMonthYear('monthChange');
        })
        
        yearSelection.addEventListener('change', function() {
            alterMonthYear('yearChange');
        })
        
        // ADD: event listener for left calendar arrow
        leftCalendarArrow.addEventListener('click', function() {
            alterMonthYear('shiftDown');
        })
        
        // ADD: event listener for right calendar arrow
        rightCalendarArrow.addEventListener('click', function() {
            alterMonthYear('shiftUp');
        })

        // These callback functions will alter a month-year value (e.g. month: 9, year: 2024)
        // (1) Left Arrow: Decrement value
        // (2) Right Arrow: Increment value
        // (3) Month Dropdown: alter month
        // (4) Year Input: alter year
        // After change, update calendar UI to reflect change

        calendarBody.addEventListener('click', function(event) {
            let eventTargetClassListStr = event.target.classList.value;
            let eventTargetId = event.target.id;
            let selectedCellId = calendarContainer.selectedCellId;

            if ((eventTargetClassListStr === 'no-select calendarCell') || (eventTargetClassListStr === 'no-select calendarCell currentDay')) {

                // close the session view container if open
                if (flags.sessionViewContainerShowing) {
                    sessionViewBackBtn.click();
                }
                
                // removing previous selection class (if it exists and isn't the target)
                if ((selectedCellId) && (selectedCellId !== eventTargetId)) {
                    document.getElementById(selectedCellId).classList.remove('selectedDay');
                }

                // UI Changes
                document.getElementById(eventTargetId).classList.add('selectedDay');
                calendarContainer.selectedCellId = eventTargetId;
                
                // set the selectedDate field of the calendarContainer
                // based on the month, year, and number associated with the cell
                let day = document.getElementById(eventTargetId).innerText;
                dailyContainer.selectedDate = constructSelectedDateString(calendarContainer.year, calendarContainer.month, day);

                // (1) the new lower and upper bound (for the week) based on dailyContainer.selectedDate
                updateDailyBounds();

                // (2) the index of the week
                let weekIndex = getWeekIndex();

                updateMiniChartLabels();
                setAndDisplaySelectedDate(weekIndex);
                document.dispatchEvent(new Event('displayMiniCharts'));

                calendarIconContainer.click();
            }
        })

        todayBtn.addEventListener('click', function() {

            setInitialDate();
            calendarIconContainer.click();

            // close the session view container if open
            if (flags.sessionViewContainerShowing) {
                sessionViewBackBtn.click();
            }
        })
    }
})

function miniChartSelectionActions(chartIndex) {
    setAndDisplaySelectedDate(chartIndex);
    document.dispatchEvent(new Event('displayDayView'));

    // close the session view container if open
    if (flags.sessionViewContainerShowing) {
        sessionViewBackBtn.click();
    }
}

export function updateDailyContainer(selectedDate) { // from main chart click
    dailyContainer.selectedDate = selectedDate;

    if (flags.sessionViewContainerShowing) {
        sessionViewBackBtn.click();
    }

    // (1) the new lower and upper bound (for the week) based on dailyContainer.selectedDate
    updateDailyBounds();

    // (2) the index of the week
    let weekIndex = getWeekIndex();

    updateMiniChartLabels();
    setAndDisplaySelectedDate(weekIndex);
    document.dispatchEvent(new Event('displayMiniCharts'));

    // if calendar popup is open, close it
    if (flags.calendarPopupShowing) {
        calendarIconContainer.click();
    }
}

function getWeekIndex() {
    let selectedDate = dailyContainer.selectedDate;
    let [year, month, day] = selectedDate.split('-').map(Number);
    let date = new Date(year, month - 1, day);

    return date.getDay();
}

function updateDailyBounds() {
    let selectedDate = moment(dailyContainer.selectedDate, 'YYYY-MM-DD');
    let currentDate = moment(general.currentDay, 'YYYY-MM-DD'); // current

    // Get the lower bound (Sunday)
    const lowerBound = selectedDate.clone().startOf(dailyContainer.timeFrame).format('YYYY-MM-DD');

    // Get the upper bound (Saturday)
    const upperBound = selectedDate.clone().endOf(dailyContainer.timeFrame).format('YYYY-MM-DD');

    dailyContainer.lowerBound = lowerBound;
    dailyContainer.upperBound = upperBound;

    setRightArrowType(dailyContainer, currentDate, rightDailyArrow, rightDailyArrowGray); // white or gray
}

function constructSelectedDateString(year, month, day) {
    if (isSingleDigit(month)) {
        month = prependNumber(month, 0);
    }

    if (isSingleDigit(day)) {
        day = prependNumber(day, 0);
    }

    let selectedDateString = `${year}-${month}-${day}`;
    return selectedDateString;
}

function prependNumber(originalNum, numToPrepend) {
    return numToPrepend.toString() + originalNum.toString();
}

function isSingleDigit(num) {
    return num >= -9 && num <= 9;
}

/**
 * (1) update month and year fields in calendarContainer
 * (2) set the right arrow type (white or gray)
 * (3) Once again, we need to update calendar UI to reflect change
 * 
 * Parameters:
 * (1) type: value is either 'shiftup', 'shiftdown', 'monthChange', or 'yearChange'
 */
function alterMonthYear(type) {
    // initialize the month or year to their respective fields in the calendarContainer object
    let current = getMonthYearDay(general.currentDay);
    let currentYear = current.year;

    if (type === 'monthChange') {
        calendarContainer.month = parseInt(monthSelection.value); // 1 - 12
        // NOTE: for month + year combos that are ahead in time form current date,
        // allow that month to be selected, but simply gray out all of the dates to inhibit selection

        hideGrayCalendarArrow(currentYear);
        showGrayCalendarArrow(currentYear);

    } else if (type === 'yearChange') {
        if (parseInt(yearSelection.value) > currentYear) {
            yearSelection.value = currentYear;
        } else if (parseInt(yearSelection.value) < 1000) {
            yearSelection.value = 1000; // minumum value
        }
        calendarContainer.year = parseInt(yearSelection.value);

        hideGrayCalendarArrow(currentYear);
        showGrayCalendarArrow(currentYear);

    } else if (type === 'shiftDown') {
        // decrease the month value by 1
        // ...unless month is already 1, then switch back to 12 and decrement year by 1
        if (calendarContainer.month === 1) {
            calendarContainer.month = 12;
            calendarContainer.year--;
        } else {
            calendarContainer.month--;
        }

        monthSelection.value = calendarContainer.month;
        yearSelection.value = calendarContainer.year;

        hideGrayCalendarArrow(currentYear);

    } else if (type === 'shiftUp') {
        if ((calendarContainer.month === 12) && (calendarContainer.year < currentYear)) {
            calendarContainer.month = 1;
            calendarContainer.year++;
            
        } else {
            calendarContainer.month++;
        }

        monthSelection.value = calendarContainer.month;
        yearSelection.value = calendarContainer.year;
        
        showGrayCalendarArrow(currentYear);
    }

    updateCalendarBody(current);
}

function updateCalendarBody(current) {
    let month = calendarContainer.month;
    let year = calendarContainer.year;

    // based on the month and year + current day, fill in the rows and apply appropriate classes
    let monthDaysArr = getDaysInMonth(month, year);
    let weekdayIndex = getWeekdayIndex(month, year);
    const calendarCells = document.querySelectorAll('.calendarCell');

    let selectedDate = getMonthYearDay(dailyContainer.selectedDate);
    let selectedMonth = selectedDate.month;
    let selectedYear = selectedDate.year;
    let selectedDay = selectedDate.day;

    calendarContainer.selectedCellId = null; // resetting selectedCellId

    let j = 0;
    for (let i = 0; i < calendarCells.length; i++) {
        
        calendarCells[i].classList = 'no-select calendarCell'; // resetting classlist
        calendarCells[i].textContent = ''; // resetting content

        if ((month === selectedMonth) && (year === selectedYear) && (j + 1 === selectedDay)) {
            calendarCells[i].classList.add('selectedDay');
            calendarContainer.selectedCellId = calendarCells[i].id;
        }

        if ((i < weekdayIndex) || (j >= monthDaysArr.length)) {
            calendarCells[i].classList.add('invisible');
            
        } else {
            if (year === current.year) {
                if (month === current.month) {
                    if (j + 1 === current.day) {
                        calendarCells[i].classList.add('currentDay');

                    } else if (j + 1 > current.day) { // future date
                        calendarCells[i].classList.add('unselectable');

                    }
                } else if (month > current.month) { // future date
                    calendarCells[i].classList.add('unselectable');

                }
            }
            calendarCells[i].textContent = monthDaysArr[j];
            j++;
        }
    }
}

function getWeekdayIndex(month, year) {
    const firstDay = new Date(year, month - 1, 1);

    const dayOfWeek = firstDay.getDay();

    return dayOfWeek;
}

function getDaysInMonth(month, year) {
    const lastDay = new Date(year, month, 0).getDate(); // Month is 1-based, so no need to subtract 1

    const daysArray = [];
    for (let day = 1; day <= lastDay; day++) {
        daysArray.push(day);
    }

    return daysArray;
}

function hideGrayCalendarArrow(currentYear) {
    if ((calendarContainer.month < 12) || (calendarContainer.year < currentYear)) {
        rightCalendarArrow.style.display = 'flex'; // hide white right arrow
        rightCalendarArrowGray.style.display = 'none'; // show gray white arrow
    }
}

function showGrayCalendarArrow(currentYear) {
    if ((calendarContainer.month === 12) && (calendarContainer.year === currentYear)) {
        rightCalendarArrow.style.display = 'none'; // hide white right arrow
        rightCalendarArrowGray.style.display = 'flex'; // show gray white arrow
    }
}

function setAndDisplaySelectedDate(weekIndex) {

    // Programmatic updates
    dailyContainer.selectedDate = dailyContainer.weeklyDatesArr[weekIndex];

    // UI updates
    let selectedDateText = getSelectedDateText();
    dailyDay.innerText = selectedDateText.dayOfWeek;
    dailyDate.innerText = selectedDateText.monthDayYear;

    miniChartLabels[dailyContainer.weekIndex].style.textDecoration = '';
    miniChartLabels[dailyContainer.weekIndex].style.fontSize = '9px';

    miniChartLabels[weekIndex].style.textDecoration = 'underline';
    miniChartLabels[weekIndex].style.fontSize = '11px';

    // Display the daily container day view
    dailyContainer.weekIndex = weekIndex;
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

    // check if selectedDate is within the current week
    // if not, remove underline
    // if so, apply underline

    let weeklyDateArr = dailyContainer.weeklyDatesArr;
    let selectedDate = dailyContainer.selectedDate;

    if (weeklyDateArr.includes(selectedDate)) {
        miniChartLabels[dailyContainer.weekIndex].style.textDecoration = 'underline'; // add new underline
        miniChartLabels[dailyContainer.weekIndex].style.fontSize = '11px'; // add new underline

    } else {
        miniChartLabels[dailyContainer.weekIndex].style.textDecoration = ''; // remove previous underline
        miniChartLabels[dailyContainer.weekIndex].style.fontSize = '9px'; // add new underline

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

/**
 * This function achieves the following:
 * (1) Sets dailyDay & dailyDate text
 * (2) Sets the selectedDate field for the dailyContainer object
 * (3) Sets the month & year fields for the calendarContainer object
 * (4) Sets the value and max for the yearSelection input element
 * (5) Sets the value for the monthSelection input element
 * (6) Initializes the calendarBody UI
 * (7) Displays mini-charts
 */
export async function setInitialDate() {

    if (!flags.remainOnSelectedDate) {

        const now = new Date();
        // set initial selectedDate to be current date
        dailyContainer.selectedDate = general.currentDay;

        // set month and year fields of calendarContainer
        let current = getMonthYearDay(general.currentDay);
        calendarContainer.month = current.month;
        calendarContainer.year = current.year;

        // set the value and the max of the yearSelection input
        yearSelection.value = calendarContainer.year; // UI
        yearSelection.max = calendarContainer.year;

        // set the value of the monthSelection element
        monthSelection.value = calendarContainer.month; // UI

        // Initialize the calendarBody
        updateCalendarBody(current);
        
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

        // when this is called after initial call
        if (dailyContainer.dayViewSummaryChartSeen) {
            miniChartLabels[dailyContainer.weekIndex].style.textDecoration = '';
            miniChartLabels[dailyContainer.weekIndex].style.fontSize = '9px';
        }
        dailyContainer.weekIndex = getWeekIndex();

        await setBounds(dailyContainer, null, rightDailyArrow, rightDailyArrowGray);
        updateMiniChartLabels();
    }

    // visualize data (call function to display mini charts)
    // if not logged in, display empty mini-charts; set calendarContainer.miniChartsDisplayType to 'empty'
    // else, set it to 'filled'
    document.dispatchEvent(new Event('displayMiniCharts'));

    flags.remainOnSelectedDate = false;
}

function getMonthYearDay(dateStr) {
    let [year, month, day] = dateStr.split('-');

    month = parseInt(month);
    year = parseInt(year);
    day = parseInt(day);

    let monthYearDay = {
        month: month,
        year: year,
        day: day
    }

    return monthYearDay;
}