import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"

const URL = API_URL + "/members"

let inputUsername
let inputEmail
let inputPassword
let inputFirstName
let inputLastName
let inputStreet
let inputCity
let inputZip

export function initSignup() {
  //Initialize nodes used more than once
  inputUsername = document.getElementById("input-username")
  inputEmail = document.getElementById("input-email")
  inputPassword = document.getElementById("input-password")
  inputFirstName = document.getElementById("input-firstname")
  inputLastName = document.getElementById("input-lastname")
  inputStreet = document.getElementById("input-street")
  inputCity = document.getElementById("input-city")
  inputZip = document.getElementById("input-zip")

  document.getElementById("form").onsubmit = saveMember
  document.getElementById("goto-login").onclick = () => {
    document.getElementById("goto-login").style.display = "none"
  }
  clearInputFields()
  setStatusMsg("")
}

/**
 * Set's the status message, either styled as an error, or as a normal message
 * @param {String} msg The status message to display
 * @param {boolean} [isError] true, to style in red
 */
function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}

function clearInputFields() {
  inputUsername.value = ""
  inputEmail.value = ""
  inputPassword.value = ""
  inputFirstName.value = ""
  inputLastName.value = ""
  inputStreet.value = ""
  inputCity.value = ""
  inputZip.value = ""
}

async function saveMember(evt) {
  evt.preventDefault()
  setStatusMsg("")
  //Create the DTO object that must be sent with the body in the POST Request
  const memberRequest = {}
  memberRequest.username = inputUsername
  memberRequest.email = inputEmail
  memberRequest.password = inputPassword
  memberRequest.firstName = inputFirstName
  memberRequest.lastName = inputLastName
  memberRequest.street = inputStreet
  memberRequest.city = inputCity
  memberRequest.zip = inputZip

  const postOptions = {}
  postOptions.method = "POST"
  postOptions.headers = { "Content-type": "application/json" }

  postOptions.body = JSON.stringify(memberRequest)
  try {
    const newMember = await fetch(URL, postOptions).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg(`Successfully created member "${newMember.username}"`)
    document.getElementById("goto-login").style.display = "block"

  } catch (err) {
    setStatusMsg(err.message + FETCH_NO_API_ERROR, true)
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    }

  }

}
