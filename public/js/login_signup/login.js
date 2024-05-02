addEventListener("DOMContentLoaded", function () {
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    const forgotPasswordBtn = document.getElementById("forgotPassword_h3");
    const createAccountBtn = document.getElementById("createAccount2_h3");
    const googleSignInBtn = document.getElementById("googleSignInBtn");

    loginSubmitBtn.addEventListener("click", async function() {
        await addUser();
    });

    createAccountBtn.addEventListener("click", async function() {
        window.location.href = "/signup";
    })

    googleSignInBtn.addEventListener("click", async function() {
        alert("You just selected Google sign in!");
        // trigger google sign in
    })
});

async function addUser() {
    try {
        const email = document.getElementById("emailInputSignin").value;
        const password = document.getElementById("passwordInput").value;

        const user = {
            email: email,
            password: password
        };

        const response = await fetch("/api/api/validateUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        
        if (!response.ok) {
            alert("Your email or password is incorrect. Please try again.");
            throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
            window.location.href = "/";
        }
        
        // const results = await response.json();
        // console.log("Added user with ID: " + results._id); //testing


    } catch (error) {
        console.error(error);
        // Handle the error (e.g., display an error message to the user).
    }
}