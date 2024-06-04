export async function updateNotes(notesObj) {
    try {
        const response = await fetch('/api/data/update-notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notesObj })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("notes updated successfully:", data);
    } catch (error) {
        console.error('Failed to update notes:', error);
    }
}