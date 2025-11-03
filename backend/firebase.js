// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAAuFyGBzkytAl0eTB3WvQRA1kV5f72_nA",
	authDomain: "fin-ai-c69c0.firebaseapp.com",
	projectId: "fin-ai-c69c0",
	storageBucket: "fin-ai-c69c0.firebasestorage.app",
	messagingSenderId: "328140639189",
	appId: "1:328140639189:web:0cc5272b9f4a3bccb8cb5c",
	measurementId: "G-1XME07N1YJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);