import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAy8QZg1ReZIxswwzOf1D3Zak4e2U2HKWQ",
    authDomain: "d-vel-b334f.firebaseapp.com",
    projectId: "d-vel-b334f",
    storageBucket: "d-vel-b334f.firebasestorage.app",
    messagingSenderId: "635217885403",
    appId: "1:635217885403:web:3acecc549b4103bfb6b4fe",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();