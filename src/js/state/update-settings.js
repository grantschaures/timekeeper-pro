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
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log("User updated successfully:", data);
    } catch (error) {
        console.error('Failed to update user:', error);
    }
}