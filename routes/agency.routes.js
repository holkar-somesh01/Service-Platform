const router = require("express").Router()
const AgencyController = require("../controller/agency.controller")
const { agencyAdminProtected } = require("../middleware/Protected")

router
    .put("/update-profile", agencyAdminProtected, AgencyController.UpdateProfile)
    .get("/fetch-profile", agencyAdminProtected, AgencyController.fetchProfile)
    .get("/fetch-profetions", agencyAdminProtected, AgencyController.fetchAgencyProfetion)
    .put("/activate-profetion/:id", agencyAdminProtected, AgencyController.ActivateProfetion)
    .get("/get-agency-profetion", agencyAdminProtected, AgencyController.getAgencyProfetions)

module.exports = router