// app.js
import { auth } from './firebase.js';
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

document.getElementById("login").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => window.location.href = "dashboard.html")
    .catch(error => alert("Login failed: " + error.message));
});
