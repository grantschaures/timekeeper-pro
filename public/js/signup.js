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
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }
    })
    .catch(error => {
        console.error('Error during fetch operation:', error.message);
        // Handle errors
    });
}