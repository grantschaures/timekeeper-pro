export async function deleteUserAccount(settings) {
    try {
        const response = await fetch('/api/data/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response status:', response.status);
            console.error('Response body:', errorText);
            throw new Error('Network response was not ok');
        } else {
            alert("Your account and all associated data has been deleted.");
            const data = await response.json();
            console.log("Account deleted successfully:", data);
        }


    } catch (error) {
        console.error('Failed to delete user account:', error);
        alert("Your session has expired. Please log in again.");
        window.location.href = "/login";
    }
}