export async function updateUserSettings(settings) {
    try {
        const response = await fetch('/api/data/update-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ settings })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log("Settings updated successfully:", data);
    } catch (error) {
        console.error('Failed to update settings:', error);
    }
}
