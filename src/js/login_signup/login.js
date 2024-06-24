import { initializeGUI } from '../utility/initialize_gui.js';

document.addEventListener("DOMContentLoaded", function () {
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    const forgotPasswordBtn = document.getElementById("forgotPassword_h3");
    const createAccountBtn = document.getElementById("createAccount2_h3");

    loginSubmitBtn.addEventListener("click", async function() {
        addUser();
    });

    createAccountBtn.addEventListener("click", async function() {
        window.location.href = "/signup";
    })

    // googleSignInBtn.addEventListener("click", async function() {
    //     alert("You just selected Google sign in!");
    //     // trigger google sign in
    // })

    forgotPasswordBtn.addEventListener("click", function() {
        window.location.href = "/reset-password";
    })

    document.addEventListener('keydown', (event) => handleLoginEnter(event));
});

function handleLoginEnter(event) {

    if ((event.key === 'Enter') && (document.activeElement.id === 'passwordInput')) {
        event.preventDefault();
        addUser();
    }
};

// similar function present in index.js
window.addUser = function() {
    const email = document.getElementById("emailInputSignin").value;
    const password = document.getElementById("passwordInput").value;

    const user = {
        email: email,
        password: password
    };

    fetch("/api/api/validateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            alert("Your email or password is incorrect. Please try again.");
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log("Server response:", response);
        return response.json();  // Assuming you want to process JSON response
    })
    .then(data => {
        // console.log("Server response:", data);
        if (data.loginSuccess === true) {
            console.log("Login was successful!")
            initializeGUI();
        }
    })
    .catch(error => {
        console.error(error);
        // Handle the error (e.g., display an error message to the user).
    });
}
