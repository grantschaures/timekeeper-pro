// Import necessary functions
import { initializeGUI } from '../utility/initialize-gui.js'; // minified
import { userAgent, userDevice, userTimeZone } from '../utility/identification.js'; // minified

// handleCredentialResponse attached to window object to ensure global availability
window.handleCredentialResponse = function(response) {
    const idToken = response.credential;

    fetch('/api/api/verifyIdToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: idToken, userAgent: userAgent, userDevice: userDevice, userTimeZone: userTimeZone })
    })
    .then(response => response.json())
    .then(data => {
        if (data.loginSuccess === true) {
            initializeGUI();
        } else {
            alert("An error occured on the server. We apologize for the inconvenience. Please try again later.")
        }
    })
    .catch(error => {
        console.error("Error verifying ID token:", error);
    });
};
