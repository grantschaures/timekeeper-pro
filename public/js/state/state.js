import { sessionState } from '../modules/state-objects.js';

document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
});

function checkUserSession() {
    // Make a request to a server endpoint that will validate the session
    fetch('/api/state/sessionValidation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.isLoggedIn) {
            updateGUIForLoggedInUser(data.user);
            sessionState.loggedIn = true;
        }
    })
    .catch(error => console.error('Error validating user session:', error));
}

function updateGUIForLoggedInUser(userData) {
    document.getElementById('loginIcon').style.display = "none";
    document.getElementById('logoutIcon').style.display = "flex";
    document.getElementById('logInOutBtn').innerText = "Log Out";
    document.getElementById('productivity-chill-mode').innerText = "Logins: " + userData.logins;

    // also edit the account page in settings to welcome the user
}