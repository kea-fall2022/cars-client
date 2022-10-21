export const API_URL = "http://localhost:8080/api"

//This is probably a better idea, than exporting only the value above. Not URL-details are held one place
export const CAR_URL = `${API_URL}\cars`
export const MEMBER_URL = `${API_URL}/member`
export const RESERVATION_URL = `${API_URL}/reservations`

export const FETCH_NO_API_ERROR = " (Is the API online or did the endpoint exists ?)"