export async function updateShowingTimeLeft(showingTimeLeft) {
    try {
        const response = await fetch('/api/data/update-showing-time-left', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ showingTimeLeft })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log("Settings updated successfully:", data);
    } catch (error) {
        console.error('Failed to update settings:', error);
    }
}