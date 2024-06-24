addEventListener("DOMContentLoaded", function () {
    const needToGoBackBtn = document.getElementById("needToGoBackText2_h3");
    const resetPasswordSubmitBtn = document.getElementById("resetPasswordSubmitBtn");
    const emailInputResetPassword = document.getElementById("emailInputResetPassword");

    resetPasswordSubmitBtn.addEventListener("click", async function() {
        const userEmail = emailInputResetPassword.value;

        // Validate the email if needed
        if (isValidEmail(userEmail)) {
            // Make an HTTP request to your server
            await resetPassword(userEmail);
        } else {
            alert("Invalid email address. Please try again.");
        }
    });

    needToGoBackBtn.addEventListener("click", async function() {
        window.location.href = "/login";
    })

    document.addEventListener('keydown', (event) => handleResetPasswordEnter(event, emailInputResetPassword, resetPasswordSubmitBtn));
});

function handleResetPasswordEnter(event, email) {

    if ((event.key === 'Enter') && (document.activeElement === email)) {
        event.preventDefault();
        resetPasswordSubmitBtn.click();
    }
};

function isValidEmail(email) {
    // You can add your email validation logic here
    // For a simple check, you can use a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function resetPassword(email) {

    fetch('/api/users/resetPassword', {
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
    document.getElementById('resetPasswordWindow').style.display = "none";
    document.getElementById('resetPasswordEmailSentWindow').style.display = "flex";

    setTimeout(() => {
        document.getElementById('resetPasswordEmailSentWindow').style.opacity = "1";
    }, 10)
}