import { auth } from "./firebaseapp.js"
import { updateProfile, updateEmail, sendEmailVerification, updatePassword, deleteUser } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

export function getCurrentUser() {
    return auth.currentUser;
}

export async function updateProfileData(displayName) {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateProfile(user, { displayName: displayName });
            return { success: true, message: "Profile updated successfully" }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }
    else {
        return { success: false, message: "No user is currently signed in" }
    }
}

export async function updateUserEmail(newEmail) {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateEmail(user, newEmail);
            return { success: true, message: "Email updated successfully!" };
        } catch (error) {
            return { success: false, message: "Failed to update email: " + error.message };
        }
    } else {
        return { success: false, message: "No user is currently signed in." };
    }
}


export async function sendVerificationEmail() {
    const user = auth.currentUser;
    if (user) {
        try {
            await sendEmailVerification(user);
            return { success: true, message: "Verification email sent!" };
        } catch (error) {
            return { success: false, message: "Failed to send verification email: " + error.message };
        }
    } else {
        return { success: false, message: "No user is currently signed in." };
    }
}

export async function updateUserPassword(newPassword) {
    const user = auth.currentUser;
    if (user) {
        try {
            await updatePassword(user, newPassword);
            return { success: true, message: "Password updated successfully!" };
        } catch (error) {
            return { success: false, message: "Failed to update password: " + error.message };
        }
    } else {
        return { success: false, message: "No user is currently signed in." };
    }
}

export async function deleteUserAccount() {
    const user = auth.currentUser;
    if (user) {
        try {
            await deleteUser(user);
            return { success: true, message: "User account deleted successfully!" };
        } catch (error) {
            return { success: false, message: "Failed to delete user account: " + error.message };
        }
    } else {
        return { success: false, message: "No user is currently signed in." };
    }
}