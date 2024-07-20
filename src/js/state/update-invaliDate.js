export async function updateInvaliDate(invaliDate) {
    try {
        const response = await fetch('/api/data/update-invaliDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ invaliDate })
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
        console.error('Failed to update invaliDate:', error);
        alert("Your session has expired. Please log in again.");
        window.location.href = "/login";
    }
}