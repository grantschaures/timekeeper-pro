document.addEventListener('updateStreak', () => {
    checkUserSession();
});

function checkUserSession() {
    // Make a request to a server endpoint that will validate the session
    fetch('/api/state/sessionValidation', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        updateStreak(data.sessions);
    })
    .catch(error => console.error('Error validating user session:', error));
}

export function updateStreak(sessionData) {
    const sessionTimeArr = sessionData.map(({ timeZone, endTime }) => ({ timeZone, endTime }));

    const activityTimeData = sessionTimeArr; // contains array of objects w/ timeZone and activityDateUTC
    const activityDates = activityTimeData.map(entry => convertUTCToLocalTimeZone(entry.endTime, entry.timeZone));

    let streak = calculateConsecutiveDays(activityDates);
    streaksCount.innerText = streak;
}

// // // // // // //
// HELPER FUNCTIONS
// // // // // // //

function calculateConsecutiveDays(activityDates) {

    if (activityDates.length === 0) return 0; // base case (it's not a recursive function but who cares)

    activityDates.sort((a, b) => b - a); // sort dates in descending order
    let uniqueActivityDates = removeSameDayElements(activityDates); // remove extra dates on same day

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight
    
    let streak = 0;
    let i = 0;

    const date = uniqueActivityDates[i];
    date.setHours(0, 0, 0, 0); // Normalize date to midnight
    
    const diffInDays = (today - date) / (1000 * 60 * 60 * 24);
    
    if (diffInDays === 0 || diffInDays === 1) {
        streak = 1;
    } else if (diffInDays > 1) {
        return 0;
    }
    
    i++;
    let consecutive = true;

    while (i <uniqueActivityDates.length && consecutive) {
        const prevDate = uniqueActivityDates[i - 1];
        const currDate = uniqueActivityDates[i];
        currDate.setHours(0, 0, 0, 0); // Normalize date to midnight
        const daysDifference = (prevDate - currDate) / (1000 * 60 * 60 * 24);

        if (daysDifference === 1) {
            streak++;
        } else {
            consecutive = false;
        }

        i++;
    }

    return streak;
}

function removeSameDayElements(dates) {
    return dates.filter((date, index, arr) => {
        if (index === 0) return true; // Keep the first element
        const prevDate = arr[index - 1];
        // Compare year, month, and day
        return !(date.getFullYear() === prevDate.getFullYear() &&
                 date.getMonth() === prevDate.getMonth() &&
                 date.getDate() === prevDate.getDate());
    });
}

function convertUTCToLocalTimeZone(date, timeZone) {

    let localDate = moment.utc(date).tz(timeZone).format();
    let newDate = new Date(localDate);

    return newDate;
}