import { dailyDay, dailyDate } from '../modules/dashboard-elements.js';

document.addEventListener("stateUpdated", function() {
    setInitialDate();
})

export function setDailyContainer() {
    console.log('hi');
}

function setInitialDate() {
    const now = new Date();
    
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