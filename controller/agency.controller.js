const asyncHandler = require("express-async-handler")
const { upload } = require("../utils/upload")
const { checkEmpty } = require("../utils/check.empty")
const cloudinary = require("../utils/cloudinary.config")
const Auth = require("../model/Auth")

exports.UpdateProfile = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Multer Error", error: err })
        }
        const isFound = await Auth.findById(req.user)
        if (!isFound.isactive) {
            return res.status(400).json({ message: "Your Accound Is Deactivated" })
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
    if (!result.isactive) {
        return res.status(400).json({ message: "Your Accound Is Deactivated" })
    }
    res.json({ message: "Fetch Success", result })
})
exports.fetchAgencyProfetion = asyncHandler(async (req, res) => {
    console.log(req.user)
    const result = await Auth.find({ agencyAdminId: req.user })
    res.json({ message: "Fetch Success", result })
})
exports.getAgencyProfetions = asyncHandler(async (req, res) => {
    const result = await Auth.find({ agencyAdminId: req.user })
    const arr = []
    for (let i = 0; i < result.length; i++) {
        if (result[i].role === "plumber" ||
            result[i].role === "electrician" ||
            result[i].role === "farmer" ||
            result[i].role === "carpainter") {
            arr.push(result[i])
        }
    }
    return res.json({ message: "Fetch Success", result: arr })
})
exports.ActivateProfetion = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { isactive } = req.body
    await Auth.findByIdAndUpdate(id, { isactive })
    return res.json({ message: "Activate or De-Activate Success" })
})