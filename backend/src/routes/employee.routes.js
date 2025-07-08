import { Router } from "express"
import {
    registerEmployee,
    loginEmp,
    logoutEmp,
    changeCurrPassword,
    updatedEmpDetails,
    deleteEmp,
    assignPermissions,
    searchEmpDept
} from "../controllers/employee.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerEmp").post(populateCreatedByUpdatedBy, registerEmployee)
router.route("/login").post(loginEmp)
router.route("/logout").post(logoutEmp)
router.route("/change-password").post(populateCreatedByUpdatedBy, changeCurrPassword)
router.route("/update/:employee_id").patch(populateCreatedByUpdatedBy, updatedEmpDetails)
router.route("/delete/:id").delete(deleteEmp)
router.route("/assign-permissions/:id").patch(populateCreatedByUpdatedBy, assignPermissions)
router.route("/search-by-dept/:departmentName").get(searchEmpDept)

export default router