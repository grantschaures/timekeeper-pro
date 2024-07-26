export async function addSession(session) {
    console.log(session);
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
        console.log("Settings updated successfully:", data);
    } catch (error) {
        console.error('Failed to add session:', error);
        // alert("Your session has expired. Please log in again.");
        // window.location.href = "/login";
    }
}