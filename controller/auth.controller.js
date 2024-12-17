const Admin = require("../model/Admin")
const { checkEmpty } = require("../utils/check.empty")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const Auth = require("../model/Auth")

// Admin Auth
exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide Strong Password" })
    }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "Email Already registered with us" })
    }
    const hashPass = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hashPass, role: "admin" })
    res.json({ message: "ADMIN REGISTER SUCCESS" })
})
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { error, isError } = checkEmpty({ email, password });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }
    try {
        const isFound = await Admin.findOne({ email });
        if (!isFound) {
            return res.status(400).json({ message: "User Email OR Mobile Not Found" });
        }
        if (isFound.role !== "admin") {
            return res.status(400).json({ message: "Your Role Not Matched" });
        }
        const isVerify = await bcrypt.compare(password, isFound.password);
        if (!isVerify) {
            return res.status(400).json({ message: "Password Do Not Match" });
        }
        const token = jwt.sign({ userId: isFound._id }, process.env.JWT_KEY, { expiresIn: "15d" })
        res.cookie("superAdmin", token, {
            maxAge: 1000 * 60 * 60 * 24 * 15,
            httpOnly: true
        })
        res.json({
            message: "Credentials Verify Success.",
            result: {
                _id: isFound._id,
                name: isFound.name,
                email: isFound.email,
                mobile: isFound.mobile,
                role: isFound.role,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("superAdmin")
    res.json({ message: "Admin Logout Success" })
})


//  AGENCY ADMIN REGISTER WITH SUPER ADMIN
exports.registerAgencyAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, mobile } = req.body
    const { isError, error } = checkEmpty({ name, email, password, mobile })
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
    await Auth.create({ name, email, mobile, password: hashPass, role: "agencyAdmin", adminId: req.user })
    res.json({ message: "AGENCY ADMIN REGISTER SUCCESS" })
})
exports.loginAgencyAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { error, isError } = checkEmpty({ email, password });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }
    try {
        const isFound = await Auth.findOne({ email });
        if (!isFound.isactive === true) {
            return res.status(400).json({ message: "Your Accound Is Deactivated" })
        }
        if (!isFound) {
            return res.status(400).json({ message: "User Email Not Found" });
        }
        if (isFound.role !== "agencyAdmin") {
            return res.status(400).json({ message: "Your Role Not Matched" });
        }
        const isVerify = await bcrypt.compare(password, isFound.password);
        if (!isVerify) {
            return res.status(400).json({ message: "Password Do Not Match" });
        }
        const token = jwt.sign({ userId: isFound._id }, process.env.JWT_KEY, { expiresIn: "15d" })
        res.cookie("agencyAdmin", token, {
            maxAge: 1000 * 60 * 60 * 24 * 15,
            httpOnly: true
        })
        res.json({
            message: "AGENCY ADMIN LOGIN SUCCESS",
            result: {
                _id: isFound._id,
                name: isFound.name,
                email: isFound.email,
                mobile: isFound.mobile,
                role: isFound.role,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
exports.logoutAgencyAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("agencyAdmin")
    res.json({ message: "AGENCY ADMIN LOGOUT SUCCESS" })
})



//  PROFETION AUTH WITH AGENCY ADMIN
exports.registerProfetions = asyncHandler(async (req, res) => {
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
    const Agency = await Auth.findById(req.user)
    if (!Agency.isactive) {
        return res.status(400).json({ message: "Your Accound Is Deactivated" })
    }
    const isFound = await Auth.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "Email Already registered with us" })
    }
    const hashPass = await bcrypt.hash(password, 10)
    await Auth.create({ name, email, mobile, password: hashPass, role, agencyAdminId: req.user })
    res.json({ message: "PROFETIONS  REGISTER SUCCESS" })
})
exports.loginProfetions = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { error, isError } = checkEmpty({ email, password });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }
    try {
        const isFound = await Auth.findOne({ email });
        if (!isFound.isactive) {
            return res.status(400).json({ message: "Your Accound Is Deactivated" })
        }
        if (!isFound) {
            return res.status(400).json({ message: "User Email Not Found" });
        }
        if (isFound.role !== "plumber" &&
            isFound.role !== "electrician" &&
            isFound.role !== "farmer" &&
            isFound.role !== "carpainter"
        ) {
            console.log(isFound.role, "From condition")
            return res.status(400).json({ message: "Your Role Not Matched" });
        }
        const isVerify = await bcrypt.compare(password, isFound.password);
        if (!isVerify) {
            return res.status(400).json({ message: "Password Do Not Match" });
        }
        const token = jwt.sign({ userId: isFound._id }, process.env.JWT_KEY, { expiresIn: "15d" })
        res.cookie("profetion", token, {
            maxAge: 1000 * 60 * 60 * 24 * 15,
            httpOnly: true
        })
        res.json({
            message: "PROFETIONS LOGIN SUCCESS",
            result: {
                _id: isFound._id,
                name: isFound.name,
                email: isFound.email,
                mobile: isFound.mobile,
                role: isFound.role,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
exports.logoutProfetion = asyncHandler(async (req, res) => {
    res.clearCookie("profetion")
    res.json({ message: "PROFETION LOGOUT SUCCESS" })
})

//  CUSTOMER AUTH
exports.registerCustomer = asyncHandler(async (req, res) => {
    const { name, email, password, mobile } = req.body
    const { isError, error } = checkEmpty({ name, email, password, mobile })
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
    await Auth.create({ name, email, mobile, password: hashPass, role: "customer" })
    res.json({ message: "CUSTOMER  REGISTER SUCCESS" })
})
exports.loginCustomer = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { error, isError } = checkEmpty({ email, password });
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error });
    }
    try {
        const isFound = await Auth.findOne({ email });
        if (!isFound) {
            return res.status(400).json({ message: "User Email Not Found" });
        }
        if (!isFound.isactive) {
            return res.status(400).json({ message: "Your Accound Is Deactivated" })
        }
        if (isFound.role !== "customer") {
            return res.status(400).json({ message: "Your Role Not Matched" });
        }
        const isVerify = await bcrypt.compare(password, isFound.password);
        if (!isVerify) {
            return res.status(400).json({ message: "Password Do Not Match" });
        }
        const token = jwt.sign({ userId: isFound._id }, process.env.JWT_KEY, { expiresIn: "15d" })
        res.cookie("customer", token, {
            maxAge: 1000 * 60 * 60 * 24 * 15,
            httpOnly: true
        })
        res.json({
            message: "CUSTOMER LOGIN SUCCESS",
            result: {
                _id: isFound._id,
                name: isFound.name,
                email: isFound.email,
                mobile: isFound.mobile,
                role: isFound.role,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
exports.logoutCustomer = asyncHandler(async (req, res) => {
    res.clearCookie("customer")
    res.json({ message: "CUSTOMER LOGOUT SUCCESS" })
})