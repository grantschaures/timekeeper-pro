addEventListener("DOMContentLoaded", function () {
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    loginSubmitBtn.addEventListener("click", async function () {
        await addUser();
    });
});

async function addUser() {
    try {
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;

        const user = {
            email: email,
            password: password
        };

        
        const response = await fetch("/api/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const results = await response.json();
        // console.log("Added user with ID: " + results._id); //testing

        document.getElementById("emailInput").value = "";
        document.getElementById("passwordInput").value = "";

    } catch (error) {
        console.error("Error:", error);
        // Handle the error (e.g., display an error message to the user)
    }
}