import { Router } from "express"
import {
    registerDepartment,
    getDeptEntry,
    searchDeptByName,
    getDeptOptions,
    editDeptEntry
} from "../controllers/department.controller.js"
import { registerBudget, getDeptBudget } from "../controllers/departmentBudget.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/register").post(populateCreatedByUpdatedBy, registerDepartment)
router.route("/current").get(getDeptEntry)
router.route("/edit").patch(populateCreatedByUpdatedBy, editDeptEntry)
router.route("/search").get(searchDeptByName)
router.route("/dropdown-options").get(getDeptOptions)

router.route("/budget/create").post(populateCreatedByUpdatedBy, registerBudget)
router.route("/budget/").get(getDeptBudget)

export default router