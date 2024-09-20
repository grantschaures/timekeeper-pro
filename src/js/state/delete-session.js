import { flags as dashboardFlags } from '../modules/dashboard-objects.js';
import { populateDashboard } from '../dashboard/populate-dashboard.js'; // minified

/**
 * On backend, we will do the following:
 * (1) Add deleted session to the deletedSessions arr in the user's report
 * - Side note: the report is probably also where we'll store the dashboard-related settings
 * (2) We'll finally delete the actual session from the Sessions collection 
 */

export async function deleteSession(sessionId) {
    try {
        const response = await fetch('/api/data/delete-session', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId }) // Send sessionId in the request body
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        } else {
            const data = await response.json();
            console.log("Session deleted successfully:", data);

            // update dashboard!
            dashboardFlags.remainOnSelectedDate = true;
            populateDashboard(data.noteSessionData.sessions, data.noteSessionData.note, data.noteSessionData.notesEntries);
        }
    } catch (error) {
        console.error('Failed to delete user account:', error);
    }
}