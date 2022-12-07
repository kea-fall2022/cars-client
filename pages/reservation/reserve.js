
import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"
import { handleHttpErrors, makeOptions } from "../../utils.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const URL = API_URL + "/cars"

let carIdInput
let carUsernameInput
let carReservationDate
let initialized = false

export async function initReservation() {

  //Initialise nodes used more than once
  if (!initialized) {
    carIdInput = document.getElementById("car-id")
    carUsernameInput = document.getElementById("user-name")
    carReservationDate = document.getElementById("reservation-date")
    initialized = true
  }
  document.getElementById("error").innerText = ""
  try {
    document.getElementById("table-rows").innerHTML = ""
    const options = makeOptions("GET", null, true)
    const cars = await fetch(URL, options).then(handleHttpErrors)
    document.getElementById("table-rows").onclick = setupReservationModal
    const carRows = cars.map(car => `
  <tr>
  <td>${car.id}</td>
  <td>${car.brand}</td>
  <td>${car.model}</td>
  <td>${car.pricePrDay}</td>
  <td><button data-car=${JSON.stringify(car)} id="${car.id}-car-id" class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#reservation-modal">Reserve car</button> </td>      
  </tr>
  `).join("\n")

    const safeRows = sanitizeStringWithTableRows(carRows);
    document.getElementById("table-rows").innerHTML = safeRows
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true, "error")
    } else {
      setStatusMsg(err.message + FETCH_NO_API_ERROR, true, "error")
      console.error(err.message + FETCH_NO_API_ERROR)
    }
  }
}

async function setupReservationModal(evt) {
  const btn = evt.target
  if (!btn.id.includes("-car-id")) {
    return //Not a reserve button that was clicked
  }
  const car = JSON.parse(btn.dataset.car)
  const headerText = `Reserve car: (${car.id}), ${car.brand}, ${car.model}, price: ${car.pricePrDay}`
  document.getElementById("reservation-modal-label").innerText = headerText

  carIdInput.value = car.id
  //carUsernameInput.value = ""
  document.getElementById("user-name").innerText = localStorage.getItem("user")
  carReservationDate.value = ""
  setStatusMsg("", false)
  document.getElementById("btn-reservation").onclick = reserveCar
}

async function reserveCar() {
  const URL = API_URL + "/reservations"
  const reservationRequest = {}
  reservationRequest.carId = carIdInput.value
  //reservationRequest.username = carUsernameInput.value
  reservationRequest.date = carReservationDate.value

  const options = makeOptions("POST", reservationRequest, true)
  try {
    await fetch(URL, options).then(handleHttpErrors)
    setStatusMsg("Car was succesfully reserved, enter a new date, or press close", false)

  } catch (ex) {
    const errorMsg = ex.apiError ? ex.apiError.message : ex.message
    setStatusMsg(errorMsg, true)
  }
}

/**
 * Set's the status message, either styled as an error, or as a normal message
 * @param {String} msg The status message to display
 * @param {boolean} [isError] true, to style in red
 * @param {String} [node] Use this to provide a node to set the error on. If left out, it will assume a node with the id 'status'
 */
function setStatusMsg(msg, isError, node) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = node ? document.getElementById(node) : document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}