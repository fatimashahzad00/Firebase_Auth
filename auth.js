import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebaseapp.js';
import { updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"; 


const signUpForm = document.querySelector('#signupForm');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const closeModal = document.getElementById('closeModal');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');


if (signUpForm) {
    signUpForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const lastname = document.getElementById('signupLastname').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        // console.log(name, lastname, email, password);

        // Custom validation
        if (!name || !lastname) {
            showError('Name and Lastname are required!');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (!isValidPassword(password)) {
            showError('Password must be at least 8 characters long and include at least one number and one letter.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            // Sign up the user with the email and password
            .then((userCredential) => {
                const user = userCredential.user;
                //  Update user profile with name and lastname
                return updateProfile(user, {
                    displayName: name + " " + lastname,
                });
            })
            .then(() => {
                // console.log('User account created successfully!');
                showSuccess('User account created successfully!');
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            })
            .catch((error) => {
                const errorMessage = error.message;
                showError('Signup failed: ' + errorMessage);
            });

    })

    closeModal.onclick = function () {
        errorModal.style.display = "none";
        successModal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == errorModal) {
            errorModal.style.display = "none";
        }
        if (event.target == successModal) {
            successModal.style.display = "none";
        }
    }
}

// Helper function to validate email
function isValidEmail(email) {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to validate password
function isValidPassword(password) {
    // Password must be at least 8 characters long and include at least one number and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
}

function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = "flex";
}

function showSuccess(message) {
    successMessage.textContent = message;
    successModal.style.display = "flex";
}

// Login Form from firebase
const LoginForm = document.querySelector('#loginForm');

if (LoginForm) {
    LoginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        console.log(email, password);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Login in 
                const user = userCredential.user;
                console.log(user);
                showSuccess('Login successful!')
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

            })
            .catch((error) => {
                const errorMessage = error.message;
                showError('Signup failed: ' + errorMessage);
            });

    })
}