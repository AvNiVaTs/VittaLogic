import { Router } from "express"
import {
    registerSalary,
    updateSalaryDetails,
    getEmpSalaryDetails,
    searchSalaryByEmpName,
    getEligibleEmpForSalary,
    getDropDownData
} from "../controllers/employeeSalary.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/register").post(verifyJWT, populateCreatedByUpdatedBy, registerSalary)
router.route("/update/:salaryId").patch(verifyJWT, populateCreatedByUpdatedBy, updateSalaryDetails)
router.route("/employee/:employeeId").get(verifyJWT, getEmpSalaryDetails)
router.route("/search").get(verifyJWT, searchSalaryByEmpName)
router.route("/eligible").get(verifyJWT, getEligibleEmpForSalary)
router.route("/dropdown-data").get(verifyJWT, getDropDownData)

export default router