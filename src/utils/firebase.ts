// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCx8WuCy8fwQc6L0HZ_UOJs9al1klqTbto",
    authDomain: "the-masq-dashboard.firebaseapp.com",
    projectId: "the-masq-dashboard",
    storageBucket: "the-masq-dashboard.firebasestorage.app",
    messagingSenderId: "248559074078",
    appId: "1:248559074078:web:f2cc676e14bf6d722ae70f",
    measurementId: "G-DP4ZMR9WLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);