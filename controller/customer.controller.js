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
        const { location } = req.body
        const { isError, error } = checkEmpty({ location })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        let photo
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            photo = secure_url
        }
        await Auth.findByIdAndUpdate(req.user, { location, photo })
        res.json({ message: "Profile Update Success" })
    })
})

exports.fetchProfile = asyncHandler(async (req, res) => {
    const result = await Auth.findById(req.user)
    res.json({ message: "Fetch Success", result })
})
exports.FetchAllProfetions = asyncHandler(async (req, res) => {
    const result = await Auth.find()
    const arr = []
    for (let i = 0; i < result.length; i++) {
        if ((result[i].role === "plumber" ||
            result[i].role === "electrician" ||
            result[i].role === "farmer" ||
            result[i].role === "carpainter") && result[i].isactive === true) {
            arr.push(result[i])
        }
    }
    res.json({ message: "Fetch Success", result: arr })
})
exports.BookProfetion = asyncHandler(async (req, res) => {
    const { profetion, date, reason, location } = req.body
    const { isError, error } = checkEmpty({ profetion, date, reason, location })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    await Booking.create({ customer: req.user, profetion, date, reason, location })
    res.json({ message: "Booking Sucess" })
})
exports.FetchBookingHistory = asyncHandler(async (req, res) => {
    const result = await Booking.find({ customer: req.user }).sort({ updatedAt: -1 }).populate("profetion").populate("customer")
    res.json({ message: "Booking Fetch  Sucess", result })
})