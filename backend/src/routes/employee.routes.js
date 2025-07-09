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

router.route("/registerEmp").post(populateCreatedByUpdatedBy, registerEmployee)
router.route("/login").post(loginEmp)
router.route("/logout").post(logoutEmp)
router.route("/change-password").post(populateCreatedByUpdatedBy, changeCurrPassword)
router.route("/update/:employee_id").patch(populateCreatedByUpdatedBy, updatedEmpDetails)
router.route("/delete/:id").delete(deleteEmp)
router.route("/assign-permissions/:id").patch(populateCreatedByUpdatedBy, assignPermissions)
router.route("/search-by-dept/:departmentName").get(searchEmpDept)

router.route("/salary/register").post(populateCreatedByUpdatedBy, registerSalary)
router.route("/salary/update/:salaryId").patch(populateCreatedByUpdatedBy, updateSalaryDetails)
router.route("/salary/employee/:employeeId").get(getEmpSalaryDetails)
router.route("/salary/search").get(searchSalaryByEmpName)
router.route("/salary/eligible").get(getEligibleEmpForSalary)
router.route("/salary/dropdown-data").get(getDropDownData)

export default router