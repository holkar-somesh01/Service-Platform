const asyncHandler = require("express-async-handler")
const { upload } = require("../utils/upload")
const { checkEmpty } = require("../utils/check.empty")
const cloudinary = require("../utils/cloudinary.config")
const Auth = require("../model/Auth")
const Booking = require("../model/Booking")


exports.UpdateProfile = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Multer Error", error: err })
        }
        const { agencyName, location, experience, skills, available, price } = req.body
        const { isError, error } = checkEmpty({ agencyName, location, experience, skills, available, price })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        let photo
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            photo = secure_url
        }
        await Auth.findByIdAndUpdate(req.user, { agencyName, location, experience, skills, available, price, photo })
        res.json({ message: "Profile Update Success", })
    })
})

exports.fetchProfile = asyncHandler(async (req, res) => {
    const result = await Auth.findById(req.user)
    res.json({ message: "Fetch Success", result })
})
exports.FetchBookingHistory = asyncHandler(async (req, res) => {
    const result = await Booking.find({ profetion: req.user }).sort({ updatedAt: -1 }).populate("profetion").populate("customer")
    res.json({ message: "Booking Fetch  Sucess", result })
})

exports.updateBookingRequest = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { isAccept } = req.body
    await Booking.findByIdAndUpdate(id, { isAccept })
    res.json({ message: "Booking Request Update Success" })
})