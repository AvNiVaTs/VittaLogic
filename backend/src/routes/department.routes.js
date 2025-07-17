import { Router } from "express"
import {
    registerDepartment,
    getAllDepartments,
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
router.route("/alldepts").get(getAllDepartments)
router.route("/test-dept").get((req, res) => {
  console.log("✅ /test-dept hit")
  res.send("Test route working!")
})
router.route("/current").get(getDeptEntry)
router.route("/edit").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, editDeptEntry)
router.route("/search").get(searchDeptByName)
router.route("/dropdown-options").get(getDeptOptions)

router.route("/budget/create").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, registerBudget)
router.route("/budget/").get(getDeptBudget)

export default router