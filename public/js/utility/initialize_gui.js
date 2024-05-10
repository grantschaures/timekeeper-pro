export function initializeGUI() {
    console.log("initializeGUI() function called");

    // Assuming the JWT is sent automatically with cookies
    fetch('/api/user/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Authorization header might not be necessary if using cookies
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Apply user-specific settings to the GUI
        // console.log("User data received:", data);
        updateGUI(data);
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });
}

function updateGUI(userData) {
    // Update the GUI elements based on userData
    // e.g., apply themes, layout preferences, etc.
}
