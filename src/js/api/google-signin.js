// Import necessary functions
import { initializeGUI } from '../utility/initialize_gui.js'; // minified
import { userAgent, userDevice } from '../utility/identification.js'; // minified

// Attach handleCredentialResponse to the window object to ensure global availability
window.handleCredentialResponse = function(response) {
    // console.log("handleCredentialResponse Called");
    const idToken = response.credential;

    fetch('/api/api/verifyIdToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: idToken, userAgent: userAgent, userDevice: userDevice })
    })
    .then(response => response.json())
    .then(data => {
        if (data.loginSuccess === true) {
            console.log("Login was successful");
            initializeGUI();
        }
    })
    .catch(error => {
        console.error("Error verifying ID token:", error);
    });
};
