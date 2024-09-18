import { flags as dashboardFlags } from '../modules/dashboard-objects.js';
import { populateDashboard } from '../dashboard/populate-dashboard.js'; // minified

export async function updateSessionSummaryData(sessionId, summaryData) {
    try {
        const response = await fetch('/api/data/update-session-summary-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId, summaryData })
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
        console.log("session summary updated successfully:", data);

        // update dashboard!
        dashboardFlags.remainOnSelectedDate = true;
        populateDashboard(data.noteSessionData.sessions, data.noteSessionData.note, data.noteSessionData.notesEntries);
    } catch (error) {
        console.error('Failed to update session summary:', error);
    }
}