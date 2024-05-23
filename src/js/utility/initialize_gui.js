import { sessionState } from '../modules/state-objects.js';

export function initializeGUI() {
    fetch('/api/user/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Apply user-specific settings to the GUI
        if (data.tokenVerified === true) {
            refreshGUI();
        }
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });
}

function refreshGUI() {
    sessionState.loggedIn = true;
    window.location.href = "/";
}