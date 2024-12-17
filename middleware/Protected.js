const jwt = require("jsonwebtoken")

// ADMIN Protected
exports.adminProtected = (req, res, next) => {
    const { superAdmin } = req.cookies
    if (!superAdmin) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    // Token Verify
    jwt.verify(superAdmin, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid Token" })
        }
        req.user = decode.userId
    })
    next()
}
// AGENCY ADMIN Protected
exports.agencyAdminProtected = (req, res, next) => {
    const { agencyAdmin } = req.cookies
    if (!agencyAdmin) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    // Token Verify
    jwt.verify(agencyAdmin, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid Token" })
        }
        req.user = decode.userId
    })
    next()
}
// Profetions Protected
exports.profetionsProtected = (req, res, next) => {
    const { profetion } = req.cookies
    if (!profetion) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    // Token Verify
    jwt.verify(profetion, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid Token" })
        }
        req.user = decode.userId
    })
    next()
}
// Customer Protected
exports.customerProtected = (req, res, next) => {
    const { customer } = req.cookies
    if (!customer) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    // Token Verify
    jwt.verify(customer, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid Token" })
        }
        req.user = decode.userId
    })
    next()
}