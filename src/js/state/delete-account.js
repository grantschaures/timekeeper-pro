export async function deleteUserAccount() {
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
            alert("Your account and all associated data have been deleted.");
            const data = await response.json();
            console.log("Account deleted successfully:", data);
        }


    } catch (error) {
        console.error('Failed to delete user account:', error);
    }
}