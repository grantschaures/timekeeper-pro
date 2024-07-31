import { initializeGUI } from '../utility/initialize_gui.js'; // minified
import { userAgent, userDevice } from '../utility/identification.js'; // minified

document.addEventListener("DOMContentLoaded", function () {
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    const forgotPasswordBtn = document.getElementById("forgotPassword_h3");
    const createAccountBtn = document.getElementById("createAccount2_h3");
    const email = document.getElementById("emailInputSignin").value;
    const password = document.getElementById("passwordInput").value;

    loginSubmitBtn.addEventListener("click", async function() {

        if (isValidEmail(email)) {
            addUser(email, password);
        } else {
            alert("Invalid email address. Please try again.");
        }
    });

    createAccountBtn.addEventListener("click", async function() {
        window.location.href = "/signup";
    })

    forgotPasswordBtn.addEventListener("click", function() {
        window.location.href = "/reset-password";
    })

    document.addEventListener('keydown', (event) => handleLoginEnter(event));
});

function handleLoginEnter(event) {

    if ((event.key === 'Enter') && (document.activeElement.id === 'passwordInput')) {
        event.preventDefault();
        loginSubmitBtn.click();
    }
};

// similar function present in index.js
window.addUser = function(email, password) {

    const user = {
        email: email,
        password: password
    };

    fetch("/api/api/validateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user, userAgent: userAgent, userDevice: userDevice })
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 429) {
                // Handle rate limit exceeded error
                return response.json().then(data => {
                    alert(data.message); // Display the rate limit exceeded message to the user
                    throw new Error(`HTTP error! Status: ${response.status} - ${data.message}`);
                });
            } else {
                alert("Your email or password is incorrect. Please try again.");
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }
        return response.json();  // Assuming you want to process JSON response
    })
    .then(data => {
        // console.log("Server response:", data);
        if (data.loginSuccess === true) {
            console.log("Login was successful!");
            initializeGUI();
        }
    })
    .catch(error => {
        console.error(error);
        // Handle the error (e.g., display an error message to the user).
    });
}

function isValidEmail(email) {
    // You can add your email validation logic here
    // For a simple check, you can use a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}