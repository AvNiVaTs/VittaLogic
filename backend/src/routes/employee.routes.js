import { Router } from "express"
import {
    registerEmployee,
    loginEmp,
    logoutEmp,
    changeCurrPassword,
    updatedEmpDetails,
    deleteEmp,
    assignPermissions,
    searchEmpDept,
    getEmpActivityLog
} from "../controllers/employee.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerEmp").post(populateCreatedByUpdatedBy, registerEmployee)
router.route("/login").post(loginEmp)
router.route("/logout").post(verifyJWT, logoutEmp)
router.route("/change-password").post(verifyJWT, populateCreatedByUpdatedBy, changeCurrPassword)
router.route("/update/:id").patch(verifyJWT, populateCreatedByUpdatedBy, updatedEmpDetails)
router.route("/delete/:id").delete(verifyJWT, deleteEmp)
router.route("/assign-permissions/:id").patch(verifyJWT, populateCreatedByUpdatedBy, assignPermissions)
router.route("/search-by-dept/:deptId").get(verifyJWT, searchEmpDept)
router.route("/activity-log").get(verifyJWT, getEmpActivityLog)

export default router