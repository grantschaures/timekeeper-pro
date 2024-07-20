export async function lastIntervalSwitch(intervalSwitchCount, sessionStartTime) {
    try {
        const response = await fetch('/api/data/last-interval-switch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ intervalSwitchCount, sessionStartTime })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log(data);
    } catch (error) {
        console.error('Failed to update last interval switch date:', error);
        alert("Your session has expired. Please log in again.");
        window.location.href = "/login";
    }
}