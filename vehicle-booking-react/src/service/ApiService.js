import axios from "axios";

export default class ApiService {

    static BASE_URL = "http://localhost:4040";

    static getHeader(contentType = "application/json") {
        const token = localStorage.getItem("token");
     

        const headers = {
            Authorization: `Bearer ${token}`
        };

        // Only add Content-Type if it's provided and not for multipart/form-data
        if (contentType && contentType !== "multipart/form-data") {
            headers["Content-Type"] = contentType;
        }

        return headers;
    }

    /** AUTH */

    /* This registers a new user */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration);
        return response.data;
    }

    /* This logs in a registered user */
    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails);
        return response.data;
    }

    /*** USERS */

    /* This gets all users */
    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /* This gets the user profile of the logged-in user */
    static async getUserProfile() {
        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /* This gets a single user by ID */
    static async getUser(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /* This gets user bookings by user ID */
    static async getUserBookings(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /* This deletes a user by ID */
    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /** Vehicle */

    /* This adds a new vehicle to the database */
    static async addVehicle(formData) {
        const result = await axios.post(`${this.BASE_URL}/vehicles/add`, formData, {
            headers: this.getHeader('multipart/form-data')
        });
        return result.data;
    }

     /* This updates a vehicle */
    static async updateVehicle(vehicleId, formData) {
      const result = await axios.put(`${this.BASE_URL}/vehicles/update/${vehicleId}`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return result.data;
    }
    /* This gets all available vehicles */
    static async getAllAvailableVehicles() {
        const result = await axios.get(`${this.BASE_URL}/vehicles/all-available-vehicles`);
        return result.data;
    }

    /* This gets available vehicles by date and type */
    static async getAvailableVehiclesByDateAndType(checkInDate, checkOutDate, vehicleType) {
        const result = await axios.get(
            `${this.BASE_URL}/vehicles/available-vehicles-by-date-and-type?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&vehicleType=${vehicleType}`
        );
        return result.data;
    }

    /* This gets all vehicle types from the database */
    static async getVehicleTypes() {
        const response = await axios.get(`${this.BASE_URL}/vehicles/types`);
        return response.data;
    }

    /* This gets all vehicles from the database */
    static async getAllVehicles() {
       const result = await axios.get(`${this.BASE_URL}/vehicles/all`)
        return result.data
    }

    /* This gets a vehicle by ID */
    static async getVehicleById(vehicleId) {
        const result = await axios.get(`${this.BASE_URL}/vehicles/vehicle-by-id/${vehicleId}`);
        return result.data;
    }

    /* This deletes a vehicle by ID */
    static async deleteVehicle(vehicleId) {
        const result = await axios.delete(`${this.BASE_URL}/vehicles/delete/${vehicleId}`, {
            headers: this.getHeader()
        });
        return result.data;
    }


    /** BOOKING */

    /* This saves a new booking to the database */
    static async bookVehicle(vehicleId, userId, booking) {
        console.log("USER ID IS: " + userId);
        const response = await axios.post(`${this.BASE_URL}/bookings/book-vehicle/${vehicleId}/${userId}`, booking, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /* This gets all bookings from the database */
    static async getAllBookings() {
        const result = await axios.get(`${this.BASE_URL}/bookings/all`, {
            headers: this.getHeader()
        });
        return result.data;
    }

    /* This gets a booking by the confirmation code */
    static async getBookingByConfirmationCode(bookingCode) {
        const result = await axios.get(`${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`);
        return result.data;
    }

    /* This cancels a booking by ID */
    static async cancelBooking(bookingId) {
        const result = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, {
            headers: this.getHeader()
        });
        return result.data;
    }

    /** AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }
}
