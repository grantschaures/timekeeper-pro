addEventListener("DOMContentLoaded", function () {
    const logBackInBtn = document.getElementById("logBackIn2_h3");
    const signUpSubmitBtn = document.getElementById("signupSubmitBtn");

    signUpSubmitBtn.addEventListener("click", async function() {
        const userEmail = document.getElementById("emailInputSignup").value;

        // Validate the email if needed
        if (isValidEmail(userEmail)) {
            // Make an HTTP request to your server
            await createUser(userEmail);
            document.getElementById("emailInputSignup").value = "";
        } else {
            alert("Invalid email address. Please try again.");
        }
    });

    logBackInBtn.addEventListener("click", async function() {
        window.location.href = "/login";
    })
});

function isValidEmail(email) {
    // You can add your email validation logic here
    // For a simple check, you can use a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function createUser(email) {

    fetch('/api/users/emailsignup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                // `data` is now a JavaScript object you can work with.
                // For example, if the server returns a JSON object with a "message" field,
                // you can access it here.
                alert(data.message);
                throw new Error(data.message); // Throws an error with your custom message
            });
        }
    })
    .catch(error => {
        console.error('Error during fetch operation:', error.message);
        // Handle errors
    });
}