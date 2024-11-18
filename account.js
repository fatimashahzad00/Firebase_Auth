import { auth, onAuthStateChanged } from './firebaseapp.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, display their information
        const userInfo = document.getElementById('userInfo');
        userInfo.innerHTML = `
            <p>User ID: ${user.uid}</p>
            <p>Name: ${user.displayName ? user.displayName : 'No name provided'}</p>
            <p>Email: ${user.email}</p>
        `;
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'login.html';
    }
});