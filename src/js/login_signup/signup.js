addEventListener("DOMContentLoaded", function () {
    const logBackInBtn = document.getElementById("logBackIn2_h3");
    const signUpSubmitBtn = document.getElementById("signupSubmitBtn");
    const emailInputSignup = document.getElementById("emailInputSignup");

    signUpSubmitBtn.addEventListener("click", async function() {
        const userEmail = emailInputSignup.value;

        // Validate the email if needed
        if (isValidEmail(userEmail)) {
            // Make an HTTP request to your server
            await createUser(userEmail);
        } else {
            alert("Invalid email address. Please try again.");
        }
    });

    logBackInBtn.addEventListener("click", async function() {
        window.location.href = "/login";
    })

    document.addEventListener('keydown', (event) => handleSignupEmailEnter(event, emailInputSignup, signUpSubmitBtn));
});

function handleSignupEmailEnter(event, email, signUpSubmitBtn) {

    if ((event.key === 'Enter') && (document.activeElement === email)) {
        event.preventDefault();
        signUpSubmitBtn.click();
    }
};

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
        } else {
            activationLinkSent();
        }
    })
    .catch(error => {
        console.error('Error during fetch operation:', error.message);
        // Handle errors
    });
}

function activationLinkSent() {
    document.getElementById('signupWindow').style.display = "none";
    document.getElementById('activationLinkSentWindow').style.display = "flex";

    setTimeout(() => {
        document.getElementById('activationLinkSentWindow').style.opacity = "1";
    }, 10)
}