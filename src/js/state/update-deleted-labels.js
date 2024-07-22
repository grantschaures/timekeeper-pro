export async function updateDeletedLabels(deletedLabel) {
    try {
        const response = await fetch('/api/data/update-deleted-labels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ deletedLabel })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log("notes updated successfully:", data);
    } catch (error) {
        console.error('Failed to update deleted labels:', error);
        alert("Your session has expired. Please log in again.");
        window.location.href = "/login";
    }
}