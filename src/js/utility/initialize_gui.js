export function initializeGUI() {
    fetch('/api/user/data', {
        method: 'GET'
    })
    .then(response => { // fetch returns promise that resolves to response object

        if (!response.ok) { // if res.status not in 200 range
            if (response.status === 401) { // unauthorized status
                alert("An error occured when attempting to login");
            }
            throw new Error(`HTTP error! status: ${response.status}`); // rejects fetch promise and executes .catch block immediately
        }
        return response.json();
    })
    .then(data => {
        // Apply user-specific settings to the GUI
        if (data.tokenVerified === true) {
            window.location.href = "/"; // refresh page
        }
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });
}