import { Router } from "express"
import {
    registerEmployee,
    loginEmp,
    logoutEmp,
    refreshAccessToken,
    changeCurrPassword,
    updatedEmpDetails,
    deleteEmp,
    assignPermissions,
    getAllEmployees,
    searchEmpDept,
    getDepartmentsForDropdown
} from "../controllers/employee.controller.js"
import {
    getDropDownData,
    getEligibleEmpForSalary,
    getEmpSalaryDetails,
    registerSalary,
    searchSalaryByEmpName,
    updateSalaryDetails
} from "../controllers/employeeSalary.controller.js"

import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"

const router = Router()

//Public Routes
router.route("/login").post(loginEmp)
router.route("/refresh-token").post(refreshAccessToken)

//Protected Routes
router.route("/registerEmp").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, registerEmployee)
router.route("/logout").post(verifyEmployeeJWT, logoutEmp)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, changeCurrPassword)
router.route("/update/:employee_id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updatedEmpDetails)
router.route("/delete/:id").delete(deleteEmp)
router.route("/assign-permissions/:id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, assignPermissions)
router.route("/allEmps").get(getAllEmployees)
router.route("/search-by-dept/:departmentName").get(searchEmpDept)
router.route("/dropdown").get(verifyEmployeeJWT, getDepartmentsForDropdown)

router.route("/salary/register").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, registerSalary)
router.route("/salary/update/:salaryId").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateSalaryDetails)
router.route("/salary/employee/:employeeId").get(getEmpSalaryDetails)
router.route("/salary/search").get(searchSalaryByEmpName)
router.route("/salary/eligible").get(getEligibleEmpForSalary)
router.route("/salary/dropdown-data").get(getDropDownData)

export default router