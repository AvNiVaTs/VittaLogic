import { Router } from "express"
import {
    registerSalary,
    updateSalaryDetails,
    getEmpSalaryDetails,
    searchSalaryByEmpName,
    getEligibleEmpForSalary,
    getDropDownData
} from "../controllers/employeeSalary.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/register").post(populateCreatedByUpdatedBy, registerSalary)
router.route("/update/:salaryId").patch(populateCreatedByUpdatedBy, updateSalaryDetails)
router.route("/employee/:employeeId").get(getEmpSalaryDetails)
router.route("/search").get(searchSalaryByEmpName)
router.route("/eligible").get(getEligibleEmpForSalary)
router.route("/dropdown-data").get(getDropDownData)

export default router