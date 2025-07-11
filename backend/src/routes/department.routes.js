import { Router } from "express"
import {
    registerDepartment,
    getDeptEntry,
    searchDeptByName,
    getDeptOptions,
    editDeptEntry
} from "../controllers/department.controller.js"
import { registerBudget, getDeptBudget } from "../controllers/departmentBudget.controller.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/register").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, registerDepartment)
router.route("/current").get(verifyEmployeeJWT, getDeptEntry)
router.route("/edit").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, editDeptEntry)
router.route("/search").get(searchDeptByName)
router.route("/dropdown-options").get(getDeptOptions)

router.route("/budget/create").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, registerBudget)
router.route("/budget/").get(getDeptBudget)

export default router