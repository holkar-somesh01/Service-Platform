const router = require("express").Router()
const AuthController = require("../controller/auth.controller")
const { agencyAdminProtected } = require("../middleware/Protected")

router
    .post("/login-agency-admin", AuthController.loginAgencyAdmin)
    .post("/logout-agency-admin", AuthController.logoutAgencyAdmin)

    .post("/register-profetion", agencyAdminProtected, AuthController.registerProfetions)
    .post("/login-profetion", AuthController.loginProfetions)
    .post("/logout-profetion", AuthController.logoutProfetion)

    .post("/register-customer", AuthController.registerCustomer)
    .post("/login-customer", AuthController.loginCustomer)
    .post("/logout-customer", AuthController.logoutCustomer)

module.exports = router