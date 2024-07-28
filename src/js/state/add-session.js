import { tempStorage, flags as summaryFlags } from "../modules/summary-stats.js";

export async function addSession(session) {
    // console.log(session);
    try {
        const response = await fetch('/api/data/update-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("Report updated successfully with new session:", data);

        setTimeout(() => {
            summaryFlags.canSubmitSessionSummary = true;
        }, 1000)

        //update tempStorage w/ sessionId
        tempStorage.sessionId = data.sessionId;
        
    } catch (error) {
        console.error('Failed to add session:', error);
    }
}