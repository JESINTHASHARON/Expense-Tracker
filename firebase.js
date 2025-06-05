// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfhKc6kdrp20Tz2hjuPAXe6Ha5kAkqIS0",
  authDomain: "expensetracker-e2bf5.firebaseapp.com",
  projectId: "expensetracker-e2bf5",
  storageBucket: "expensetracker-e2bf5.appspot.com",
  messagingSenderId: "475104043110",
  appId: "1:475104043110:web:20d35817a138e645300da7",
  measurementId: "G-3G3WZ7ZC13"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
