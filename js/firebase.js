import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_Hu-XdS1FGJWFrysakUpAbefioJ6uKCE",
  authDomain: "appointment-f8a63.firebaseapp.com",
  projectId: "appointment-f8a63",
  storageBucket: "appointment-f8a63.firebasestorage.app",
  messagingSenderId: "480997401679",
  appId: "1:480997401679:web:05dcdd59800e9bb2cdf63a",
  measurementId: "G-207WPQK4ER"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
