// Import the functions you need from the SDKs you need
import {
  get,
  getDatabase,
  set,
  ref,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const database = getDatabase(app)
// const analytics = getAnalytics(app);

//////////////////////////////////////////////// DISPLAY ACCOUNT EMAIL AND SIGNOUT


import { v4 as uuidv4 } from "https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/esm-browser/index.js";
window.uuidv4 = uuidv4;

let titleInput = document.getElementById("titleInput")
let imgInput = document.getElementById("imgInput")
let descriptionInput = document.getElementById("descriptionInput")
let add_btn = document.getElementById("addPostBTN")
let user_id = JSON.parse(localStorage.getItem("ACCOUNT")).userId
let firstPromise = new Promise((resolve, reject) => {
  onValue(ref(database, "users/" + user_id), (snap) => {
    let data = snap.val()
    localStorage.setItem("DATA", JSON.stringify(data))
  })
  resolve()
})

//////////////////////////////////////////////// ADD
const executeDataAsync = async () => {
  await firstPromise
  let data = JSON.parse(localStorage.getItem("DATA"))
  let lastLogin = JSON.parse(localStorage.getItem("ACCOUNT")).lastLogin
  add_btn.addEventListener("click", function () {
    if (data === null) {
      alert("You must have an account to add your post!")
    } else {
      let post = data.post
      let ID = window.uuidv4()
      let date = new Date()
      let time = {
        year: date.getFullYear().toString(),
        month: addZero((date.getMonth() + 1).toString()),
        day: addZero(date.getDate().toString()),
        hour: addZero(date.getHours().toString()),
        minute: addZero(date.getMinutes().toString()),
      }
      if (post === undefined) {
        let postArray = [{
          postId: ID,
          userId: user_id,
          title: titleInput.value,
          image: imgInput.value,
          description: descriptionInput.value,
          username: data.username,
          color: data.color,
          time: time,
          time_code: date.getTime(),
        }]
  
        update(ref(database, "users/" + user_id), {
          email: data.email,
          password: data.password,
          username: data.username,
          lastLogin: lastLogin,
          post: postArray,
        }).then(() => {
          alert("Success")
          window.location.href = "Admin.html"
        }).catch((error) => {
          alert(error)
        })
  
      } else {
        let postArray = post
        postArray.unshift({
          postId: ID,
          userId: user_id,
          title: titleInput.value,
          image: imgInput.value,
          description: descriptionInput.value,
          username: data.username,
          color: data.color,
          time: time,
          time_code: date.getTime(),
        })
  
        update(ref(database, "users/" + user_id), {
          email: data.email,
          password: data.password,
          username: data.username,
          lastLogin: lastLogin,
          post: postArray,
        }).then(() => {
          alert("Success")
          window.location.href = "Admin.html"
        }).catch((error) => {
          alert(error)
        })
      }
    }
  })


}
executeDataAsync()

function addZero(i) {
  let i2 = Number(i)
  if (i2 < 10) {
    i = "0" + i
  }
  return i;
}