// response.credential is the JWT web token
// handleCredentialResponse callback triggered when Google sign-in is successful
function handleCredentialResponse(response) {

    // const responsePayload = decodeJwtResponse(response.credential);
    // console.log("ID: " + responsePayload.sub);
    // console.log("iss: " + responsePayload.iss);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    // console.log("Email: " + responsePayload.email);
    // console.log("iat: " + responsePayload.iat);

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
        // console.log("Server response:", data);
    })
    .catch(error => {
        console.error("Error verifying ID token:", error);
    }); 
}


// extracts payload containing user details
// function decodeJwtResponse(token) {
//     var base64Url = token.split(".")[1];
//     var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     var jsonPayload = decodeURIComponent(
//     atob(base64)
//         .split("")
//         .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//         })
//         .join("")
//     );

//     return JSON.parse(jsonPayload);
// }

/**
 * NOTES: Google default scopes allow access to user's Google ID, name, profile image URL, and email address
 */