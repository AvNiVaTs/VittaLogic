import { Router } from "express"
import {
    registerDepartment,
    getDeptEntry,
    searchDeptByName,
    getDeptOptions,
    editDeptEntry
} from "../controllers/department.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/register").post(populateCreatedByUpdatedBy, registerDepartment)
router.route("/current").get(getDeptEntry)
router.route("/edit").patch(populateCreatedByUpdatedBy, editDeptEntry)
router.route("/search").get(searchDeptByName)
router.route("/dropdown-options").get(getDeptOptions)

export default router