// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2U5TWDc6JR2XFelPC6h5eZO0q1OSUx20",
  authDomain: "steficoin.firebaseapp.com",
  projectId: "steficoin",
  storageBucket: "steficoin.firebasestorage.app",
  messagingSenderId: "184374448124",
  appId: "1:184374448124:web:5d35562aea23b463dcac79",
  databaseURL: "https://steficoin-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
