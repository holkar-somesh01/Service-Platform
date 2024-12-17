const router = require("express").Router()
const customerController = require("../controller/customer.controller")
const { customerProtected } = require("../middleware/Protected")

router
    .put("/update-profile", customerProtected, customerController.UpdateProfile)
    .get("/fetch-profile", customerProtected, customerController.fetchProfile)
    .get("/fetch-all-profetion", customerController.FetchAllProfetions)
    .post("/book-profetion", customerProtected, customerController.BookProfetion)
    .get("/Fetch-Booking-History", customerProtected, customerController.FetchBookingHistory)

module.exports = router