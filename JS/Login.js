//////////////////////////////////////////////////////////////////////////// Import CHUNG

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";

import {
  get,
  getDatabase,
  set,
  ref,
  onValue,
  update,
  remove,
  push,
  child,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAM-KTP6h8qu2e5JACDidoN42G7jDle_UI",
  authDomain: "jsi-34-3.firebaseapp.com",
  projectId: "jsi-34-3",
  storageBucket: "jsi-34-3.appspot.com",
  messagingSenderId: "908059064158",
  appId: "1:908059064158:web:3489a5c040d1ba7a1001cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// Dùng DOM
let email_login = document.getElementById("email_input_login");
let password_login = document.getElementById("password_input_login");
let login_btn = document.getElementById("login_btn");


login_btn.addEventListener("click", function () {
  let email = email_login.value;
  let password = password_login.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      let date = new Date();
      localStorage.setItem("ACCOUNT", JSON.stringify({
        email: email,
        userId: user.uid,
        lastLogin: date
      }))
      update(ref(database, "users/" + user.uid), {
        lastLogin: date
      });

    })
    .then(() => {
      alert("Logged in successfully!");
      location.href = "./Admin.html"; 
      
    })
    .catch((err) => {
      const errorCode = err.code;
      const errorMess = err.message;

      alert(errorMess);
    });
});