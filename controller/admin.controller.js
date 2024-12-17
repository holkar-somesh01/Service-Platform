const asyncHandler = require("express-async-handler")
const Auth = require("../model/Auth")
const { checkEmpty } = require("../utils/check.empty")
const bcrypt = require("bcryptjs")
const validator = require("validator")

exports.GetAdminAgencies = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: "Your Not Login, Please Login Again" })
    }
    const result = await Auth.find({ adminId: req.user, role: "agencyAdmin" })
    console.log(result)
    return res.json({ message: "Fetch Success", result })
})
exports.getAllCustomers = asyncHandler(async (req, res) => {
    const result = await Auth.find({ role: "customer" })
    return res.json({ message: "Fetch Success", result })
})
exports.ActivateAgency = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { isactive } = req.body
    await Auth.findByIdAndUpdate(id, { isactive })
    return res.json({ message: "Activate or De-Activate Success" })
})
exports.registerAdminProfetions = asyncHandler(async (req, res) => {
    const { name, email, password, mobile, role } = req.body
    const { isError, error } = checkEmpty({ name, email, password, mobile, role })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide Strong Password" })
    }
    const isFound = await Auth.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "Email Already registered with us" })
    }
    const hashPass = await bcrypt.hash(password, 10)
    await Auth.create({ name, email, mobile, password: hashPass, role, adminId: req.user })
    res.json({ message: "PROFETIONS  REGISTER SUCCESS" })
})
exports.getAdminProfetions = asyncHandler(async (req, res) => {
    const result = await Auth.find({ adminId: req.user })
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