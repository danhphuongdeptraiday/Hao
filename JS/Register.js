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
let email_register = document.getElementById("email_input_register");
let password_register = document.getElementById("password_input_register");
let register_btn = document.getElementById("register_btn");
let username_register = document.getElementById("username_input_register");

///////////////////////////////////////////////////////////////////// Đăng ký 1 tài khoản
register_btn.addEventListener("click", function () {
  let email = email_register.value;
  let password = password_register.value;
  let username = username_register.value;
  let color = generatingRandomColor()

  createUserWithEmailAndPassword(auth, email, password) // Check xem cái user này tồn tại chưa
    .then((userCredential) => {
      const user = userCredential.user;
      set(ref(database, "users/" + user.uid), {
        email: email,
        password: password,
        username: username,
        color: color
      }).then(() => {
        alert("Signed up successfully!")
        window.location.href = "Login.html"
      });
    })
    .catch((err) => {
      const errorCode = err.code;
      const errorMess = err.message;

      alert(errorMess);
    });
});


function generatingRandomColor() {
  const listOfColor = ["color1", "color2", "color3", "color4", "color5", "color6"]
  let randomInteger = Math.floor(Math.random() * 6)
  return listOfColor[randomInteger]
}