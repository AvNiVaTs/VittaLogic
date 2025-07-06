import { Router } from "express"
import {
    registerDepartment,
    getDeptEntry,
    searchDeptByName,
    getDeptOptions,
    editDeptEntry
} from "../controllers/department.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"
import { deptMiddleware } from "../middleware/dept.middleware.js"

const router = Router()

router.route("/register").post(verifyJWT, populateCreatedByUpdatedBy, registerDepartment)
router.route("/current").get(verifyJWT, deptMiddleware, getDeptEntry)
router.route("/edit").patch(verifyJWT, deptMiddleware, populateCreatedByUpdatedBy, editDeptEntry)
router.route("/search").get(verifyJWT, searchDeptByName)
router.route("/dropdown-options").get(verifyJWT, getDeptOptions)

export default router