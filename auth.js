import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from './firebaseapp.js';
import { updateProfile, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { signInWithGoogle } from './googleAuth.js';
import { setupRecaptcha, signInWithPhone, verifyCode, resetRecaptcha } from './phoneAuth.js';


const forgetPasswordBtn = document.getElementById('forgetPassword');
const googleSignInBtn = document.getElementById('googleSignIn');
const signUpForm = document.querySelector('#signupForm');
const LoginForm = document.querySelector('#loginForm');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const closeModal = document.getElementById('closeModal');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const phoneSignInForm = document.getElementById('phoneSignInForm');
const phoneVerificationForm = document.getElementById('phoneVerificationForm');


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
                const authUser = auth.currentUser;
                return sendEmailVerification(authUser)
            })
            .then(() => {
                showSuccess('User account created successfully! Please check your email to verify your account.');
                waitForEmailVerification();
            })
            .catch((error) => {
                const errorMessage = error.message;
                showError('Signup failed: ' + errorMessage);
            });

    })

    function waitForEmailVerification() {
        const user = user.currentUser;
        const intervalId = setInterval(() => {
            user.reload().then(() => {
                if (user.emailVerified) {
                    clearInterval(intervalId);
                    showSuccess('Email verified! You can now login.');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1000)
                }
            })
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            showError('Email verification timed out. Please try again.');
        }, 300000)
    }

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


if (LoginForm) {
    LoginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        console.log(email, password);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                if (user.emailVerified) {
                    showSuccess('Login successful!')
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else{
                    showError('Please verify your email before logging in.');
                    sendEmailVerification(user)
                        .then(() => {
                            showSuccess('Email verification sent! Please check your email to verify your account.');
                            waitForEmailVerification();
                        })
                        .catch((error) => {
                             const errorMessage = error.message;
                             showError('Failed to send verification email: ' + errorMessage);
                         });
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                showError('Signup failed: ' + errorMessage);
            });
        })
}

function updateNavigation(user) {
    const nav1 = document.getElementById('navbar1');
    const nav2 = document.getElementById('navbar2');

    if (user) {
        // User is signed in
        if (nav1) nav1.style.display = 'none';
        if (nav2) nav2.style.display = 'block';
    } else {
        // No user is signed in
        if (nav1) nav1.style.display = 'block';
        if (nav2) nav2.style.display = 'none';
    }
}

// Add an auth state listener
auth.onAuthStateChanged((user) => {
    updateNavigation(user);
});

// Call updateNavigation initially
updateNavigation(auth.currentUser);

if (forgetPasswordBtn) {
    forgetPasswordBtn.addEventListener('click', function() {
        const email = prompt("Please enter your email address:");
        if (email) {
            if (!isValidEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }
            
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    showSuccess('Password reset email sent. Please check your inbox.');
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    showError('Failed to send password reset email: ' + errorMessage);
                });
        }
    });
}

// Sign in with Googlg
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        const result = await signInWithGoogle();
        if (result.success) {
            showSuccess('Google sign-in successful!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showError('Google sign-in failed: ' + result.errorMessage);
        }
    });
}

// Phone number sign-in
if (phoneSignInForm) {
    setupRecaptcha();
    phoneSignInForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const phoneNumber = document.getElementById('phoneNumber').value;
        const result = await signInWithPhone(phoneNumber);
        if (result.success) {
          console.log(result.message);
            phoneSignInForm.style.display = 'none';
            phoneVerificationForm.style.display = 'block';
        } else {
            showError(result.message);
            resetRecaptcha();
        }
    });
}

if (phoneVerificationForm) {
    phoneVerificationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const code = document.getElementById('verificationCode').value;
        const result = await verifyCode(code);
        if (result.success) {
            showSuccess(result.message);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showError(result.message);
        }
    });
}
