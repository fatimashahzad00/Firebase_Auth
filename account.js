import { auth, onAuthStateChanged } from './firebaseapp.js';
import { getCurrentUser, updateProfileData, updateUserEmail, updateUserPassword, sendVerificationEmail, deleteUserAccount } from './userManagement.js';


const updateProfileForm = document.getElementById('updateProfileForm');
const updateEmailForm = document.getElementById('updateEmailForm');
const verifyEmailButton = document.getElementById('verifyEmailButton');
const updatePasswordForm = document.getElementById('updatePasswordForm');
const deleteAccountButton = document.getElementById('deleteAccountButton');


const userid = document.getElementById('userID');
const username = document.getElementById('displayName');
const useremail = document.getElementById('email');
const useremailverified = document.getElementById('emailVerified');

onAuthStateChanged(auth, (user) => {
    if (user) {
        displayUserInfo(user);
    } else {
        window.location.href = 'login.html';
    }
});

function displayUserInfo(user) {

    userid.innerHTML = `${user.uid}`;
    username.innerHTML = `${user.displayName || 'No name provided'}`;
    useremail.innerHTML = `${user.email}`;
    useremailverified.innerHTML = `${user.emailVerified ? 'Yes' : 'No'}`;
}

updateProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const displayName = document.getElementById('displayName').value;
    const result = await updateProfileData(displayName);
    alert(result.message);
    if (result.success) {
        displayUserInfo(getCurrentUser());
    }
});

updateEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEmail = document.getElementById('newEmail').value;
    const result = await updateUserEmail(newEmail);
    alert(result.message);
    if (result.success) {
        displayUserInfo(getCurrentUser());
    }
});

verifyEmailButton.addEventListener('click', async () => {
    const result = await sendVerificationEmail();
    alert(result.message);
});

updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const result = await updateUserPassword(newPassword);
    alert(result.message);
});

deleteAccountButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const result = await deleteUserAccount();
        alert(result.message);
        if (result.success) {
            window.location.href = 'index.html';
        }
    }
});

