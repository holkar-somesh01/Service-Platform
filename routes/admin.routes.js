const router = require("express").Router()
const AdminController = require("../controller/admin.controller")
const AuthController = require("../controller/auth.controller")
const { adminProtected } = require("../middleware/Protected")



router
    .post("/register-admin", AuthController.registerAdmin)
    .post("/login-admin", AuthController.loginAdmin)
    .post("/logout-admin", AuthController.logoutAdmin)
    .post("/register-agency-admin", adminProtected, AuthController.registerAgencyAdmin)
    .get("/get-admin-agency", adminProtected, AdminController.GetAdminAgencies)
    .put("/activate-agency/:id", adminProtected, AdminController.ActivateAgency)
    .get("/get-all-customer", adminProtected, AdminController.getAllCustomers)
    .post("/add-admin-profetion", adminProtected, AdminController.registerAdminProfetions)
    .get("/get-admin-profetion", adminProtected, AdminController.getAdminProfetions)

module.exports = router