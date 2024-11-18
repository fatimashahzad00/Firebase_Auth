import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAl6z3SnjEmvoaOUY3I38WwVm-ET4TmZEs",
    authDomain: "projects-56f17.firebaseapp.com",
    projectId: "projects-56f17",
    storageBucket: "projects-56f17.firebasestorage.app",
    messagingSenderId: "986856572039",
    appId: "1:986856572039:web:dacb4359ef92baae36a422"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut }