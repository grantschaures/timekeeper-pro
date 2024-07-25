export async function sessionCompletion(userTimeZone) {
    try {
        const response = await fetch('/api/data/session-completion', {
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

            if (response.status === 420) {
                alert("Your session has expired. Please log in again.");
                window.location.href = "/login";
            }

            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log(data);
    } catch (error) {
        console.error('Failed to update activity info:', error);
    }
}