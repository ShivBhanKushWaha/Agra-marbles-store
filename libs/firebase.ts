// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9tNgjvvgDb5dVobY4Xk6HeY11anv5FJo",
  authDomain: "taj-marbles.firebaseapp.com",
  projectId: "taj-marbles",
  storageBucket: "taj-marbles.appspot.com",
  messagingSenderId: "1063656238070",
  appId: "1:1063656238070:web:10292fdea2de434f3b75d7"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
