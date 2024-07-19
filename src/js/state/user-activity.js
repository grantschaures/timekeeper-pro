export async function userActivity(userTimeZone) {
    try {
        const response = await fetch('/api/data/user-activity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userTimeZone })
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
        console.error('Failed to update activity info:', error);
        alert("Your session has expired. Please log in again.");
        window.location.href = "/login";
    }
}