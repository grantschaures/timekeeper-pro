addEventListener("DOMContentLoaded", function () {
    const passwordInputSignup = document.getElementById('passwordInputSignup');
    const confirmPasswordInputSignup = document.getElementById('confirmPasswordInputSignup');
    const setNewPasswordSubmitBtn = document.getElementById('setNewPasswordSubmitBtn');

    setNewPasswordSubmitBtn.addEventListener("click", async function() {
        const validationResult = validatePassword(passwordInputSignup.value);
        
        if (validationResult.isValid) {
            if (passwordMatchCheck(passwordInputSignup, confirmPasswordInputSignup)) {
                const submitPasswordUrl = '/api/api/verifyPassword';
                const token = window.location.pathname.split('/').pop();

                // Prepare the data to be sent in the request
                const requestData = {
                    password: passwordInputSignup.value,
                    token: token
                };

                // Use fetch API to make a POST request to the server
                try {
                    const response = await fetch(submitPasswordUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData), // Convert the JavaScript object to a JSON string
                    });

                    if (response.ok) { // If the response is OK (status code in the range 200-299)
                        // inform user that they've successfully verified their account
                        accountVerified();

                        // const result = await response.json();
                    } else {
                        // Server responded with a status outside the 200 range, handle error
                        console.error('Failed to submit password:', response.statusText);
                        alert('There was a problem with setting your password. Please try again.');
                    }
                } catch (error) {
                    console.error('Error submitting password:', error);
                    alert('An error occurred. Please try again.');
                }

            } else {
                alert("Please ensure both your passwords match and try again.")
            }
        } else {
            // Construct a message based on the failed rules
            let message = "Invalid Password. Please make sure your password meets the following criteria:";
            if (!validationResult.rules.length) {
                message += "\n - At least 8 characters";
            }
            if (!validationResult.rules.uppercase) {
                message += "\n - Contains at least one uppercase letter";
            }
            if (!validationResult.rules.lowercase) {
                message += "\n - Contains at least one lowercase letter";
            }
            if (!validationResult.rules.number) {
                message += "\n - Contains at least one number";
            }
            if (!validationResult.rules.specialChar) {
                message += "\n - Contains at least one special character";
            }
            
            alert(message);
        }
    });

    document.addEventListener('keydown', (event) => handleSetPasswordEnter(event, confirmPasswordInputSignup, setNewPasswordSubmitBtn));
});

function handleSetPasswordEnter(event, confirmPasswordInputSignup, setNewPasswordSubmitBtn) {

    if ((event.key === 'Enter') && (document.activeElement === confirmPasswordInputSignup)) {
        event.preventDefault();
        setNewPasswordSubmitBtn.click();
    }
};

/**
 * Create Function to ensure password is strong
 */
function validatePassword(password) {
    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[\!\@\#\$\%\^\&\*\(\)\-\+\=\{\}\[\]\:\;\"\'\<\>\,\.\?\/\~\|\ \\]/.test(password)
    };

    const isValid = Object.values(rules).every(value => value);
    return {
        isValid,
        rules
    };
}

function passwordMatchCheck(password, confirmPassword) {
    return password.value === confirmPassword.value;
}

function accountVerified() {
    document.getElementById('setNewPasswordWindow').style.display = "none";
    document.getElementById('accountVerifiedWindow').style.display = "flex";
    setTimeout(() => {
        document.getElementById('accountVerifiedWindow').style.opacity = "1";
    }, 500)
}