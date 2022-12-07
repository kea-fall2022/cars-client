import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"

const URL = API_URL + "/auth/login"

export function initLogin() {
  document.getElementById("btn-login").onclick = login
}

async function login() {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  const loginRequest = {
    username,  //Shortcut for username: username
    password
  }

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginRequest)
  }

  try {
    const res = await fetch(URL, options).then(handleHttpErrors)
    setLoginStatus(res)
  }
  catch (err) {
    if (err.apiError) {
      document.getElementById("error").innerText = err.apiError.message
    } else {
      document.getElementById("error").innerText = err.message + FETCH_NO_API_ERROR
    }
  }
}

function setLoginStatus(res) {
  localStorage.setItem("user", res.username)
  localStorage.setItem("token", res.token)
  localStorage.setItem("roles", res.roles)
  toogleLoginStatus(true)
  window.router.navigate("/")
}

//Exported so it can be called by the router
export function logout() {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  localStorage.removeItem("roles")
  toogleLoginStatus(false)
  window.router.navigate("/")
}
//Exportet since it must be used from index.js
export function toogleLoginStatus(loggedIn) {
  document.getElementById("login-container").style.display = loggedIn ? "none" : "block"
  document.getElementById("logout-container").style.display = loggedIn ? "block" : "none"
}

