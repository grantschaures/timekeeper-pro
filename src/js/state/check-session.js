import { popupOverlay, previousSessionStartedPopup } from '../modules/dom-elements.js';
export async function checkSession() {
    try {
        const response = await fetch('/api/data/check-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // We'll have to create popup for user if a previous session is already running
        console.log(data.sessionStatus);

        if (data.sessionStatus) {
            popupOverlay.style.display = "flex";
            previousSessionStartedPopup.style.display = "flex";
            setTimeout(() => {
                previousSessionStartedPopup.style.opacity = '1';
            }, 100)
        }

    } catch (error) {
        console.error('Failed to update check if session is running:', error);
        alert("Your session has expired. Please log in again.");
        window.location.href = "/login";
    }
}