import { populateDashboard } from '../dashboard/populate-dashboard.js'; // minified

export async function updateNotesEntry(notesObj) {
    try {
        const response = await fetch('/api/data/update-notes-entry', {
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

            if (response.status === 420) {
                alert("Your session has expired. Please log in again.");
                window.location.href = "/login";
            }

            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("notes updated successfully:", data);

        populateDashboard(data.noteSessionData.sessions, data.noteSessionData.note, data.noteSessionData.notesEntries);
    } catch (error) {
        console.error('Failed to update notes entries:', error);
    }
}