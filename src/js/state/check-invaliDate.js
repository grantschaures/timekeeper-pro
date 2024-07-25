// send request to server to check if start of session was before invaliDate
// if so, clear invaliDate & reset GUI, but DON'T log the session
export async function checkInvaliDate(sessionStartTime) {
    try {
        const response = await fetch('/api/data/check-invaliDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionStartTime })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // eventually return boolean value representing whether log action should take place or not
        let logSessionActivity = data.logSession;
        return logSessionActivity;

    } catch (error) {
        console.error('Failed to update check invaliDate:', error);
    }
}