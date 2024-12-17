const router = require("express").Router()
const profetionController = require("../controller/profetion.controller")
const { profetionsProtected } = require("../middleware/Protected")

router
    .put("/update-profile", profetionsProtected, profetionController.UpdateProfile)
    .get("/fetch-profile", profetionsProtected, profetionController.fetchProfile)
    .get("/Fetch-Booking-History", profetionsProtected, profetionController.FetchBookingHistory)
    .put("/update-Booking-Request/:id", profetionsProtected, profetionController.updateBookingRequest)

module.exports = router