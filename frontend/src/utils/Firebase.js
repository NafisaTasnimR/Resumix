// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import { GoogleAuthProvider } from "firebase/auth";
//const firebase_api = process.env.REACT_APP_FIREBASE_API_KEY;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBBAZyji3n2Fb7YZk9Nx8-oqpLex3lTFw0",
  authDomain: "resumix-cc8ee.firebaseapp.com",
  projectId: "resumix-cc8ee",
  storageBucket: "resumix-cc8ee.firebasestorage.app",
  messagingSenderId: "427633988936",
  appId: "1:427633988936:web:0fe07fac15853f4463cf7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };