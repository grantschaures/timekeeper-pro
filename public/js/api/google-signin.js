// response.credential is the JWT web token
// handleCredentialResponse callback triggered when Google sign-in is successful
function handleCredentialResponse(response) {
    // Send the ID token (response.credential) to the backend for verification
    const idToken = response.credential;

    // Use fetch or another method to send the ID token to the server
    fetch('/api/api/verifyIdToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken: idToken })
    })
    .then(response => response.json())
    .then(data => {
        // Process the response from the server
        console.log("Server response:", data); //display user data from backend
    })
    .catch(error => {
        console.error("Error verifying ID token:", error);
    });

    window.location.href = "/";
}