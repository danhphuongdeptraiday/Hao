// Import the functions you need from the SDKs you need
import {
  get,
  getDatabase,
  set,
  ref,
  onValue,
  update,
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
let account_email = document.getElementById("account_email")
let text_1 = document.getElementById("account_text_1")
let text_2 = document.getElementById("account_text_2")
let signout = document.getElementById("signout")
let addButton = document.getElementsByClassName("add_post")
let avatar = document.getElementById("avatar")

signout.addEventListener("click", function () {
  localStorage.setItem("ACCOUNT", JSON.stringify(""))
  alert("Signed out successfully!")
  account_email.innerHTML = ""
  text_1.innerHTML = JSON.parse(localStorage.getItem("ACCOUNT"))
  text_2.innerHTML = "Create your account for free!"
  window.location.reload()
})


//////////////////////////////////////////////// GET DATA FROM FIREBASE
let postContainer = document.getElementById("postContainer")
let searchResults = document.getElementById("search_results")
let user = JSON.parse(localStorage.getItem("ACCOUNT"))
if (user === "") {
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
  let user_id = JSON.parse(localStorage.getItem("ACCOUNT")).userId
  let firstPromise = new Promise((resolve, reject) => {
    onValue(ref(database, "users/" + user_id), (snap) => {
      let data = snap.val()

      localStorage.setItem("DATA", JSON.stringify(data))
      resolve()
    })
  })

  const searchInput = document.getElementById("search_input")
  const searchButton = document.getElementById("search_button")

  searchButton.addEventListener("click", function () {
    let inputValue = searchInput.value.toLowerCase().trim().replace(/  /g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    executeDataAsync(inputValue)

  })

  //////////////////////////////////////////////// RENDER POSTS
  const executeDataAsync = async (inputValue) => {
    let data = null
    if (data === null) {
      let text = document.createElement('div');
      text.className = "notification_box"
      text.innerHTML = `
          <b>Loading Posts...</b>
            `;
      postContainer.appendChild(text);
      avatar.innerHTML = `
      <p class="loading_text_1">Loading...</p>
      `
      text_2.innerHTML = "Loading..."

    }
    await firstPromise
    data = JSON.parse(localStorage.getItem("DATA"))
    let post = data.post
    let username = data.username

    account_email.innerHTML = data.username
    text_1.innerHTML = "Hello"
    text_2.innerHTML = "!"
    addButton.innerText = 'fff'
    let avatar_name = data.username.charAt(0).toUpperCase()
    avatar.innerText = avatar_name
    let color = data.color
    avatar.classList.add(color)



    let secondPromise = new Promise((resolve, reject) => {
      postContainer.innerHTML = ""
      if (post === undefined) {
        let text = document.createElement('div');
        text.className = "notification_box"
        text.innerHTML = `
            <b>No post was found:(((((</b>
            <p>Make your own post for free!</p>
              `;
        postContainer.appendChild(text);
        scrollText[0].style.display = "none"
        searchResults.innerText = `0 post were found.`
        resolve()
      } else {
        if (inputValue === undefined) {
          for (let i = 0; i <= (post.length - 1); i++) {
            let postBox = document.createElement('div');
            postBox.className = "post"
            postBox.id = post[i].postId
            let time = post[i].time
            postBox.innerHTML = `
                <div class="post_1" id="${post[i].postId}">
                  <div class="user" id="${post[i].postId}">
                    <div class="user1">
                    <div>
                      <div class="avatar_2 ${color}" id="avatar">${avatar_name}</div>
                      </div>
                      <div class="user_username">${username}</div>
                    </div>
                    <div class="user2" id="${post[i].postId}">
                      <button class="edit">Edit</button>
                      <button class="delete">Delete</button>
                    </div>
  
                  </div>
                  <div class="imgBox">
                    <img src="${post[i].image}" alt="${post[i].title}" class="post_img">
                  </div>
                  <p class="post_date">${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minute}</p>
                  <b class="post_title">${post[i].title}</b>
                  <div class="line"></div>
                  <div class="post_description">${post[i].description}</div>
                </div>
  
                <div class="post_2">
                  <b class="post_comments">Comments</b>
                  <p class="comment_text">scroll down to see more...</p>
                  <div class="comment_container" id="${post[i].postId}"></div>
                  <div class="comment_section" id="${post[i].postId}">
                    <input class="comment" placeholder="type"/>
                    <button class="comment_button"><i class="fa-regular fa-paper-plane"></i></button>
                  </div>
                </div>
                  `;

            postContainer.appendChild(postBox);

            if (i === post.length - 1) {
              let text
              if (post.length >= 2) {
                text = " posts"
              } else {
                text = " post"
              }
              searchResults.innerText = `${post.length} ${text} were found.`
              resolve()
            }
          }
        } else {
          localStorage.setItem("ALERT", JSON.stringify("YES"))
          let numberOfResults = 0
          for (let i = 0; i <= (post.length - 1); i++) {
            let result = (post[i].title + " " + post[i].description).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            if (result.indexOf(inputValue) > -1) {
              numberOfResults += 1
              localStorage.setItem("ALERT", JSON.stringify("NO"))
              let time = post[i].time
              let postBox = document.createElement('div');
              postBox.className = "post"
              postBox.id = post[i].postId
              postBox.innerHTML = `
              <div class="post_1" id="${post[i].postId}">
                <div class="user" id="${post[i].postId}">
                  <div class="user1">
                  <div>
                    <div class="avatar_2 ${color}" id="avatar">${avatar_name}</div>
                    </div>
                    <div class="user_username">${username}</div>
                  </div>
                  <div class="user2" id="${post[i].postId}">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                  </div>

                </div>
                <div class="imgBox">
                  <img src="${post[i].image}" alt="${post[i].title}" class="post_img">
                </div>
                <p class="post_date">${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minute}</p>
                <b class="post_title">${post[i].title}</b>
                <div class="line"></div>
                <div class="post_description">${post[i].description}</div>
              </div>

              <div class="post_2">
                <b class="post_comments">Comments</b>
                <p class="comment_text">scroll down to see more...</p>
                <div class="comment_container" id="${post[i].postId}"></div>
                <div class="comment_section" id="${post[i].postId}">
                  <input class="comment" placeholder="type"/>
                  <button class="comment_button"><i class="fa-regular fa-paper-plane"></i></button>
                </div>
              </div>
                `;

              postContainer.appendChild(postBox);
            }
            if (i === post.length - 1) {
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
                searchResults.innerText = `0 post were found.`
              }
              resolve()
            }
          }
        }
      }
    })

    //////////////////////////////////////////////// COMMENT FUNCTION
    const executeAsync = async () => {
      let data = JSON.parse(localStorage.getItem("DATA"))
      await secondPromise

      let commentInput = document.getElementsByClassName("comment")
      let commentBtn = document.getElementsByClassName("comment_button")
      let commentContainer = document.getElementsByClassName("comment_container")

      //RENDER COMMENTS FOR EACH POST
      for (let i = 0; i <= commentBtn.length - 1; i++) {
        let posts = JSON.parse(localStorage.getItem("DATA")).post
        let id = commentContainer[i].getAttribute('id')
        let index = posts.findIndex(
          (post) => post.postId === id
        )
        let commentArray = posts[index].comment

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
            <p class="comment_value">${commentArray[commentArray.length - k].value}</p>
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

        //ADDING COMMENTS
        commentBtn[i].addEventListener("click", function () {
          if (commentInput[i].value.replace(/ /g, '') === "") {
            alert("Please add comments before posting them.")
          } else {
            let date = new Date()
            console.log(date)
            let time = {
              year: date.getFullYear().toString(),
              month: addZero((date.getMonth() + 1).toString()),
              day: addZero(date.getDate().toString()),
              hour: addZero(date.getHours().toString()),
              minute: addZero(date.getMinutes().toString()),
            }

            let id = commentBtn[i].parentElement.getAttribute('id')
            let posts = JSON.parse(localStorage.getItem("DATA")).post
            let username = JSON.parse(localStorage.getItem("DATA")).username
            let avatar_letter = username.charAt(0).toUpperCase()
            let index = posts.findIndex(
              (post) => post.postId === id
            )

            if (posts[index].comment === undefined) {
              let value = commentInput[i].value
              posts[index].comment = [{ value, username, color, time }]
              localStorage.setItem("DATA", JSON.stringify({
                ...data,
                post: posts
              }))
              update(ref(database, "users/" + user_id), {
                post: posts
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
                <p class="comment_value">${commentInput[i].value}</p>
              </div>
            `
              commentContainer[i].appendChild(commentBox);
            } else {
              let newComment = posts[index].comment
              let value = commentInput[i].value
              newComment.unshift({ value, username, color, time })
              posts[index].comment = newComment

              let commentBox = document.createElement('div');
              commentBox.className = "comment_box"
              commentBox.innerHTML = `
            <div class="comment_avatar ${color}">${avatar_letter}</div>
            <div class="comment_content">
              <div class="comment_details">
                <div class="comment_username">${username}</div>
                <p class="comment_date">${time.day}/${time.month}/${time.year} - ${time.hour}:${time.minute}</p>
              </div>
              <p class="comment_value">${commentInput[i].value}</p>
            </div>
            `
              commentContainer[i].appendChild(commentBox);
              localStorage.setItem("DATA", JSON.stringify({
                ...data,
                post: posts
              }))
              update(ref(database, "users/" + user_id), {
                post: posts
              }).then(() => {
              }).catch((error) => {
                alert(error)
              })
            }
          }
        })
      }

      //////////////////////////////////////////////// DELETE POST FUNCTION
      let modalContainer = document.getElementById("modal")
      let postsBox = document.getElementsByClassName("post")
      const deleteFunction = () => {
        let removeBtn = document.getElementsByClassName("delete")
        for (let i = 0; i <= removeBtn.length - 1; i++) {
          removeBtn[i].addEventListener("click", function () {
            let child = document.getElementsByClassName('modal')
            if (child.length !==0) {
              modalContainer.removeChild(child[0])
            }

            let id = removeBtn[i].parentElement.getAttribute('id')
            localStorage.setItem("DELETEDPOSTID", JSON.stringify(id))
            modalContainer.style.height = '100vh'
            modalContainer.style.background = "rgb(0, 0, 0, 0.7)"
            let modal = document.createElement('div');
            modal.className = "modal"
            modal.innerHTML = `
                <p>Are you sure??</p>
                <button class="cancel_button">No</button>
                <button class="remove_button">Yes</button>
              `
            modalContainer.appendChild(modal)
            executeRemoveAsync()
            return
          })
        }
      }
      deleteFunction()


      const executeRemoveAsync = async () => {
        let cancelBtn = document.getElementsByClassName("cancel_button")
        cancelBtn[0].addEventListener("click", function () {
          modalContainer.innerHTML = ''
          modalContainer.style.height = '0'
          localStorage.removeItem("DELETEDPOSTID")
        })

        let deleteBtn = document.getElementsByClassName("remove_button")

        deleteBtn[0].addEventListener("click", function () {
          let posts = JSON.parse(localStorage.getItem("DATA")).post
          let id = JSON.parse(localStorage.getItem("DELETEDPOSTID"))
          let index = posts.findIndex(
            (post) => post.postId === id
          )
          posts.splice(index, 1)
          update(ref(database, "users/" + user_id), {
            post: posts
          }).then(() => {
          }).catch((error) => {
            alert(error)
          })

          modalContainer.innerHTML = ''
          modalContainer.style.height = '0'
          localStorage.removeItem("DELETEDPOSTID")

          let newPostsBox = Object.values(postsBox)
          let index2 = newPostsBox.findIndex(
            (post) => post.getAttribute('id') === id
          )

          if (newPostsBox.length === 1) {
            let text = document.createElement('div');
            text.className = "notification_box"
            text.innerHTML = `
              <b>No post was found:(((((</b>
              <p>Make your own post for free!</p>
                `;
            postContainer.innerHTML = ''
            postContainer.appendChild(text);
            searchResults.innerText = `0 post were found.`
          } else {
            postContainer.removeChild(postsBox[index2])
            console.log(postsBox)
            let text
            if (postsBox.length >= 2) {
              text = " posts"
            } else {
              text = " post"
            }
            searchResults.innerText = `${postsBox.length} ${text} were found.`
            deleteFunction()
          }
        })
      }

      //////////////////////////////////////////////// EDIT POST FUNCTION
      let editBtn = document.getElementsByClassName("edit")
      let fourthPromise = new Promise((resolve, reject) => {
        for (let i = 0; i <= editBtn.length - 1; i++) {
          editBtn[i].addEventListener("click", function () {
            let id = editBtn[i].parentElement.getAttribute('id')
            localStorage.setItem("EDITEDPOSTID", JSON.stringify(id))
            modalContainer.style.height = '100vh'
            modalContainer.style.background = "rgb(0, 0, 0, 0.7)"
            let modal = document.createElement('div');
            modal.className = "edit_modal"
            modal.innerHTML = `
            <p>Edit your post.</p>
              <input placeholder="  title" type="text" id="titleInput">
              <input placeholder="  image url" type="text" id="imgInput">
              <textarea placeholder=" description" cols="50" rows="10" id="descriptionInput"></textarea>
            <div>
              <button class="cancel_editing_button">Cancel</button>
              <button class="change_button">Change</button>
            </div>
          `
            modalContainer.appendChild(modal)
            resolve()
            executeEditAsync()
          })
        }
      })

      const executeEditAsync = async () => {
        await fourthPromise
        let id = JSON.parse(localStorage.getItem("EDITEDPOSTID"))
        let posts = JSON.parse(localStorage.getItem("DATA")).post
        let index = posts.findIndex(
          (post) => post.postId === id
        )
        let titleInput = document.getElementById("titleInput")
        let imgInput = document.getElementById("imgInput")
        let descriptionInput = document.getElementById("descriptionInput")
        titleInput.defaultValue = posts[index].title
        imgInput.defaultValue = posts[index].image
        descriptionInput.defaultValue = posts[index].description

        let cancelBtn = document.getElementsByClassName("cancel_editing_button")
        let changeBtn = document.getElementsByClassName("change_button")
        cancelBtn[0].addEventListener("click", function () {
          modalContainer.innerHTML = ''
          modalContainer.style.height = '0'
        })

        changeBtn[0].addEventListener("click", function () {
          posts[index].title = titleInput.value
          posts[index].image = imgInput.value
          posts[index].description = descriptionInput.value
          update(ref(database, "users/" + user_id), {
            post: posts
          })
          modalContainer.innerHTML = ''
          modalContainer.style.height = '0'
          const titleBox = document.getElementsByClassName("post_title")
          const imgBox = document.getElementsByClassName("post_img")
          const descriptionBox = document.getElementsByClassName("post_description")
          for (let i = 0; i <= posts.length - 1; i++) {
            if (titleBox[i].parentElement.getAttribute('id') === id) {
              titleBox[i].innerText = posts[index].title
              imgBox[i].innerText = posts[index].image
              descriptionBox[i].innerText = posts[index].description
            }
          }
        })
      }

    }
    executeAsync()
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