// Import the functions you need from the SDKs you need
import {
  get,
  getDatabase,
  set,
  update,
  ref,
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

let isScrolling;
let scrollText = document.getElementsByClassName("scroll_text")
scrollText[0].style.display = "inline"
document.addEventListener('scroll', function () {
  window.clearTimeout(isScrolling)
  isScrolling = setTimeout(function () {
    const content = document.getElementById('postContainer');
    if (window.scrollY + window.innerHeight >= content.scrollHeight) {
      scrollText[0].style.display = "none"
    } else {
      scrollText[0].style.display = "inline"
    }
  }, 0)
})


//////////////////////////////////////////////// DISPLAY ACCOUNT EMAIL AND SIGNOUT
let postContainer = document.getElementById("postContainer")
let account_email = document.getElementById("account_email")
let text_1 = document.getElementById("account_text_1")
let text_2 = document.getElementById("account_text_2")
let signout = document.getElementById("signout")
let addButton = document.getElementsByClassName("add_post")
let avatar = document.getElementById("avatar")
let data_account
signout.addEventListener("click", function () {
  localStorage.setItem("ACCOUNT", JSON.stringify(""))
  alert("Signed out successfully!")
  account_email.innerHTML = ""
  text_1.innerHTML = JSON.parse(localStorage.getItem("ACCOUNT"))
  text_2.innerHTML = "Create your account for free!"
  localStorage.setItem("ALLPOSTS", JSON.stringify(""))
  window.location.reload()
})


if (JSON.parse(localStorage.getItem("ACCOUNT")) === "") {
  text_1.innerHTML = JSON.parse(localStorage.getItem("ACCOUNT"))
  text_2.innerHTML = "Create your account for free!"
  avatar.innerHTML = ""
  avatar.innerHTML = `
    <img src="/avatar.webp" alt="avatar" class="avatar_image" />
  `
  let text = document.createElement('div');
  text.className = "notification_box"
  text.innerHTML = `
    <b>Create your account for free!</b>
      `;
  postContainer.appendChild(text);
} else {
  data_account = JSON.parse(localStorage.getItem("DATA"))
  account_email.innerHTML = data_account.username
  text_1.innerHTML = "Hello"
  text_2.innerHTML = "!"
  addButton.innerText = 'fff'
  let avatar_name = data_account.username.charAt(0).toUpperCase()
  avatar.innerText = avatar_name
  let color = data_account.color
  avatar.classList.add(color)

  //////////////////////////////////////////////// GET DATA FROM FIREBASE
  let searchResults = document.getElementById("search_results")

  let firstPromise = new Promise((resolve, reject) => {
    onValue(ref(database, "users/"), (snap) => {
      let data = snap.val()
      let newData = Object.values(data) //Data
      let postsArray = []
      for (let i = 0; i <= (newData.length) - 1; i++) {
        if (i === newData.length - 1) {
          if (newData[i].post) {
            let postArray = newData[i].post
            for (let k = 0; k <= (postArray.length) - 1; k++) {
              postsArray.unshift(postArray[k])
              if (k === postArray.length - 1) {
                //////////////////////////////////////////////// ARRANGE POSTS ORDER BY TIME
                for (let i = 0; i < postsArray.length; i++) {
                  let max = i
                  for (let k = i + 1; k < postsArray.length; k++) {
                    if (postsArray[k].time_code >= postsArray[max].time_code) {
                      max = k
                    }
                  }
                  if (postsArray[i] !== postsArray[max]) {
                    let temp = postsArray[i]
                    postsArray[i] = postsArray[max]
                    postsArray[max] = temp
                  }
                }
                localStorage.setItem("ALLPOSTS", JSON.stringify(postsArray))
                resolve()
              }
            }
          } else {
            //////////////////////////////////////////////// ARRANGE POSTS ORDER BY TIME
            for (let i = 0; i < postsArray.length; i++) {
              let max = i
              for (let k = i + 1; k < postsArray.length; k++) {
                if (postsArray[k].time_code >= postsArray[min].time_code) {
                  max = k
                }
              }
              if (postsArray[i] != postsArray[max]) {
                let temp = postsArray[i]
                postsArray[i] = postsArray[max]
                postsArray[max] = temp
              }
              console.log(postsArray)
            }
            localStorage.setItem("ALLPOSTS", JSON.stringify(postsArray))
            resolve()
          }
        } else {
          if (newData[i].post) {
            let postArray = newData[i].post
            for (let k = 0; k <= (postArray.length) - 1; k++) {
              postsArray.unshift(postArray[k])
            }
            resolve()
          } else {
            resolve()
          }
        }
      }
    })
  })


  const searchInput = document.getElementById("search_input")
  const searchButton = document.getElementById("search_button")

  searchButton.addEventListener("click", function () {
    let inputValue = searchInput.value.toLowerCase().trim().replace(/  /g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    executeDataAsync(inputValue)

  })

  const executeDataAsync = async (inputValue) => {
    let data = null
    if (data === null) {
      let text = document.createElement('div');
      text.className = "notification_box"
      text.innerHTML = `
          <b>Loading Posts...</b>
            `;
      postContainer.appendChild(text);
    }
    await firstPromise



    //////////////////////////////////////////////// RENDER ALL POST 
    let postsArray = JSON.parse(localStorage.getItem("ALLPOSTS"))
    if (postsArray.length === 0) {
      postContainer.innerHTML = ""
      let text = document.createElement('div');
      text.className = "notification_box"
      text.innerHTML = `
        <b>No post was found:(((((</b>
        <p>Make your own post for free!</p>
          `;
      postContainer.appendChild(text);
      scrollText[0].style.display = "none"
      searchResults.innerText = `0 post were found.`
    } else {
      let secondPromise = new Promise((resolve, reject) => {
        postContainer.innerHTML = ""
        if (inputValue === undefined) {
          for (let i = 0; i <= (postsArray.length - 1); i++) {
            let time = postsArray[i].time
            let postBox = document.createElement('div');
            let avatar_name = postsArray[i].username.charAt(0).toUpperCase()
            postBox.className = "post"
            postBox.innerHTML = `
                <div class="post_1" id="${postsArray[i].postId}">
                <div class="user" id="${postsArray[i].postId}">
                <div class="avatar_2 ${postsArray[i].color}" id="avatar">${avatar_name}</div>
                  <div class="user_username">${postsArray[i].username}</div>
                </div>
                <div class="imgBox">
                  <img src="${postsArray[i].image}" alt="${postsArray[i].title}" class="post_img">
                </div>
                <p class="post_date">${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minute}</p>
                <b class="post_title">${postsArray[i].title}</b>
                <div class="line"></div>
                <p class="post_description">${postsArray[i].description}</p>
              </div>
  
              <div class="post_2">
                <b class="post_comments">Comments</b>
                <p class="comment_text">scroll down to see more...</p>
                <div class="comment_container" id="${postsArray[i].postId}"></div>
                <div class="comment_section" id="${postsArray[i].postId}">
                  <input class="comment" placeholder="type"/>
                  <button class="comment_button"><i class="fa-regular fa-paper-plane"></i></button>
                </div>
              </div>
                  `;

            postContainer.appendChild(postBox);

            if (i === postsArray.length - 1) {
              let text
              if (postsArray.length >= 2) {
                text = " posts"
              } else {
                text = " post"
              }
              searchResults.innerText = `${postsArray.length} ${text} were found.`
              resolve()
            }
          }
        } else {
          localStorage.setItem("ALERT", JSON.stringify("YES"))
          let numberOfResults = 0
          for (let i = 0; i <= (postsArray.length - 1); i++) {
            let result = (postsArray[i].title + " " + postsArray[i].description).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            if (result.indexOf(inputValue) > -1) {
              numberOfResults += 1
              localStorage.setItem("ALERT", JSON.stringify("NO"))
              let time = postsArray[i].time
              let postBox = document.createElement('div');
              let avatar_name = postsArray[i].username.charAt(0).toUpperCase()
              postBox.className = "post"
              postBox.innerHTML = `
                  <div class="post_1" id="${postsArray[i].postId}">
                  <div class="user" id="${postsArray[i].postId}">
                  <div class="avatar_2 ${postsArray[i].color}" id="avatar">${avatar_name}</div>
                    <div class="user_username">${postsArray[i].username}</div>
                  </div>
                  <div class="imgBox">
                    <img src="${postsArray[i].image}" alt="${postsArray[i].title}" class="post_img">
                  </div>
                  <p class="post_date">${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minute}</p>
                  <b class="post_title">${postsArray[i].title}</b>
                  <div class="line"></div>
                  <p class="post_description">${postsArray[i].description}</p>
                </div>
    
                <div class="post_2">
                  <b class="post_comments">Comments</b>
                  <p class="comment_text">scroll down to see more...</p>
                  <div class="comment_container" id="${postsArray[i].postId}"></div>
                  <div class="comment_section" id="${postsArray[i].postId}">
                    <input class="comment" placeholder="type"/>
                    <button class="comment_button"><i class="fa-regular fa-paper-plane"></i></button>
                  </div>
                </div>
                    `;

              postContainer.appendChild(postBox);
            }


            if (i === postsArray.length - 1) {
              let text
              if (numberOfResults >= 2) {
                text = " posts"
              } else {
                text = " post"
              }
              searchResults.innerText = `${numberOfResults} ${text} were found.`
              let alert = JSON.parse(localStorage.getItem("ALERT"))
              if (alert === "YES") {
                let text = document.createElement('div');
                text.className = "notification_box"
                text.innerHTML = `
                <b>No post was found:(((((</b>
                <p>Make your own post for free!</p>
            `;
                postContainer.appendChild(text);
                scrollText[0].style.display = "none"
              }
              resolve()
            }
          }
        }
      })
      //////////////////////////////////////////////// COMMENT
      const executeCommentAsync = async () => {
        await secondPromise
        let commentInput = document.getElementsByClassName("comment")
        let commentBtn = document.getElementsByClassName("comment_button")
        let commentContainer = document.getElementsByClassName("comment_container")

        for (let i = 0; i <= commentBtn.length - 1; i++) {
          //////////////////////////////////////////////// RENDER COMMENT FUNCTION
          let id = commentContainer[i].getAttribute('id')
          let index = postsArray.findIndex(
            (post) => post.postId === id
          )

          let commentArray = postsArray[index].comment
          if (commentArray !== undefined) {
            for (let k = 1; k <= commentArray.length; k++) {
              let avatar_letter = commentArray[commentArray.length - k].username.charAt(0).toUpperCase()
              let time = commentArray[commentArray.length - k].time
              let commentContent = document.createElement('div');
              commentContent.className = "comment_box"
              commentContent.innerHTML = `
              <div class="comment_avatar ${commentArray[commentArray.length - k].color}">${avatar_letter}</div>
              <div class="comment_content">
                <div class="comment_details">
                  <div class="comment_username">${commentArray[commentArray.length - k].username}</div>
                  <p class="comment_date">${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minute}</p>
                  </div>
                <div class="comment_value">${commentArray[commentArray.length - k].value}</div>
              </div>
              `
              commentContainer[i].appendChild(commentContent);
            }
          } else {
            let commentContent = document.createElement('div');
            commentContent.className = "comment_notification"
            commentContent.innerHTML = `
            You're the first to comment!
          `
            commentContainer[i].appendChild(commentContent);
          }

          //////////////////////////////////////////////// ADDING COMMENT FUNCTION

          commentBtn[i].addEventListener("click", function () {
            if (JSON.parse(localStorage.getItem("ACCOUNT")) === "") {
              alert("You must have an account in order to post any comments!")
            } else {
              let date = new Date()
              let time = {
                year: date.getFullYear().toString(),
                month: addZero((date.getMonth() + 1).toString()),
                day: addZero(date.getDate().toString()),
                hour: addZero(date.getHours().toString()),
                minute: addZero(date.getMinutes().toString()),
              }

              let username = data_account.username
              let color = data_account.color
              if (commentInput[i].value.replace(/ /g, '') === "") {
                alert("Please add comments before posting them.")
              } else {
                let avatar_letter = username.charAt(0).toUpperCase()
                let id = commentBtn[i].parentElement.getAttribute('id')
                let index = postsArray.findIndex(
                  (post) => post.postId === id
                )
                let selectedPost = postsArray[index]
                let userId = selectedPost.userId
                let newPostsArray = postsArray.filter((post) => post.userId === userId)

                let secondIndex = newPostsArray.findIndex(
                  (post) => post.postId === id
                )

                if (newPostsArray[secondIndex].comment === undefined) {
                  let value = commentInput[i].value
                  newPostsArray[secondIndex].comment = [{ value, username, color, time }]
                  update(ref(database, "users/" + selectedPost.userId), {
                    post: newPostsArray
                  }).then(() => {
                  }).catch((error) => {
                    alert(error)
                  })
                  let commentNotificationBox = document.getElementsByClassName("comment_notification")
                  commentNotificationBox[i].innerText = ``
                  commentNotificationBox[i].style.margin = "0"
                  let commentBox = document.createElement('div');
                  commentBox.className = "comment_box"
                  commentBox.innerHTML = `
                <div class="comment_avatar ${color}">${avatar_letter}</div>
                <div class="comment_content">
                  <div class="comment_details">
                    <div class="comment_username">${username}</div>
                    <p class="comment_date">${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minute}</p>
                  </div>
                  <div class="comment_value">${commentInput[i].value}</div>
                </div>
                `

                  commentContainer[i].appendChild(commentBox);
                } else {
                  let newComment = newPostsArray[secondIndex].comment
                  let value = commentInput[i].value
                  newComment.unshift({ value, username, color, time })
                  newPostsArray[secondIndex].comment = newComment
                  let commentBox = document.createElement('div');
                  commentBox.className = "comment_box"
                  commentBox.innerHTML = `      
                <div class="comment_avatar ${color}">${avatar_letter}</div>
                <div class="comment_content">
                  <div class="comment_details">
                    <div class="comment_username">${username}</div>
                    <p class="comment_date">${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minute}</p>
                  </div>
                  <div class="comment_value">${commentInput[i].value}</div>
                </div>
                `

                  commentContainer[i].appendChild(commentBox);

                  update(ref(database, "users/" + selectedPost.userId), {
                    post: newPostsArray
                  }).then(() => {
                  }).catch((error) => {
                    alert(error)
                  })
                }
              }
            }
          })
        }

      }
      executeCommentAsync()
    }
  }

  executeDataAsync()
}
function addZero(i) {
  let i2 = Number(i)
  if (i2 < 10) {
    i = "0" + i
  }
  return i;
}



