import { auth } from "./firebaseapp.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

let confirmationResult;

export function setupRecaptcha() {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': (_response) => {
            // reCAPTCHA solved, enable sign-in button
            document.getElementById('phoneSignInButton').disabled = false;
        }
    });

    window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
    });
}

export async function signInWithPhone(phoneNumber) {
    try {
        const appVerifier = window.recaptchaVerifier;
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        return { success: true, message: "SMS sent. Please enter the code." };
    } catch (error) {
        console.error("Error sending SMS:", error);
        return { success: false, message: "Error sending SMS: " + error.message };
    }
}

export async function verifyCode(code) {
    if (!confirmationResult) {
        return { success: false, message: "Please request SMS code first." };
    }

    try {
        const result = await confirmationResult.confirm(code);
        const user = result.user;
        return { success: true, user, message: "Phone authentication successful!" };
    } catch (error) {
        console.error("Error confirming code:", error);
        return { success: false, message: "Error confirming code: " + error.message };
    }
}

export function resetRecaptcha() {
    grecaptcha.reset(window.recaptchaWidgetId);
}
