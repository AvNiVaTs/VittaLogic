import { EmployeeSalary } from "../models/employeeSalary.model.js";
import { Employee } from "../models/employee.model.js"
import { Department } from "../models/department.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {getNextSequence} from "../utils/getNextSequence.js"

const registerSalary = asyncHandler(async (req, res) => {
    const {
        employee,       // employeeId
        department,     // departmentId
        role,
        payMonth,
        baseSalary,
        bonus = 0,
        deduction = 0,
        paymentDate
    } = req.body;

    if (!employee || !department || !role || !payMonth || !baseSalary || !paymentDate) {
        throw new ApiErr(400, "All required fields must be filled");
    }

    // 1. Fetch employee and verify existence
    const emp = await Employee.findOne({ employeeId: employee });
    if (!emp) {
        throw new ApiErr(404, "Employee not found");
    }

    // 2. Check if the provided department matches the employee's department
    if (emp.department !== department) {
        throw new ApiErr(400, "Provided department does not match the employee's department");
    }

    if (emp.role !== role) {
        throw new ApiErr(400, "Provided role does not match the employee's department");
    }

    // 3. Calculate net salary
    const netSal = baseSalary + bonus - deduction;
    const salId = `SAL-${(await getNextSequence("salaryId")).toString().padStart(5, "0")}`;

    // 4. Create salary record
    const newSalary = await EmployeeSalary.create({
        salaryId: salId,
        employee,
        department,
        role,
        payMonth,
        baseSalary,
        bonus,
        deduction,
        netSalary: netSal,
        paymentDate,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    });

    return res.status(200).json(
        new ApiResponse(200, newSalary, "Salary registered successfully")
    );
});

const updateSalaryDetails = asyncHandler(async (req, res) => {
    const { salaryId } = req.params;
    const { baseSalary, bonus = 0, deduction = 0, paymentDate, updatedBy } = req.body;

    if (baseSalary === undefined || baseSalary === null || !paymentDate || !updatedBy) {
        throw new ApiErr(400, "Base salary, payment date, and updatedBy are required");
    }

    const salary = await EmployeeSalary.findOne({ salaryId });
    if (!salary) {
        throw new ApiErr(404, "Salary record not found");
    }

    // Optional but recommended:
    // Verify employee still exists and has the same department/role
    const emp = await Employee.findOne({ employeeId: salary.employee });
    if (!emp) {
        throw new ApiErr(404, "Employee linked to this salary record no longer exists");
    }

    if (emp.department !== salary.department) {
        throw new ApiErr(400, "Mismatch between employee's current department and salary record");
    }

    if (emp.role !== salary.role) {
        throw new ApiErr(400, "Mismatch between employee's current role and salary record");
    }

    // Update values
    salary.baseSalary = baseSalary;
    salary.bonus = bonus;
    salary.deduction = deduction;
    salary.netSalary = baseSalary + bonus - deduction;
    salary.paymentDate = paymentDate;
    salary.updatedBy = updatedBy;

    await salary.save();

    return res.status(200).json(
        new ApiResponse(200, salary, "Salary updated successfully")
    );
});


const getEmpSalaryDetails = asyncHandler(async (req, res) =>{
    const {employeeId} = req.params

    const salaryRec = await EmployeeSalary.find({employee: employeeId})
    .populate("department", "departmentName")
    .populate("role", "designation")
    .sort({payMonth: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, salaryRec, "Salary details fetched")
    )
})

const searchSalaryByEmpName = asyncHandler(async (req, res)=>{
    const {name} = req.query

    const matchedEmps = await Employee.find({
        employeeName: {
            $regex: name,
            $options: "i"
        }
    }).select("employeeId")

    const salaryRec = await EmployeeSalary.find({
        employee: {
            $in: matchedEmps.map(emp=>emp.employeeId)
        }
    })
    .populate("employee", "employeeName")
    .populate("department", "departmentName")

    return res
    .status(200)
    .json(
        new ApiResponse(200, salaryRec, "Salary of employee successfully fetched")
    )
})

const getEligibleEmpForSalary = asyncHandler(async (req, res) => {
    const {payMonth} = req.query
    if(!payMonth){
        throw new ApiErr(400, "Pay month is required")
    }

    const salaryIds = await EmployeeSalary.find({payMonth}).distinct("employee")

    const eligibleEmps = await Employee.find({
        employeeId: {
            $nin: salaryIds
        }
    }).select("employeeId employeeName")

    return res
    .status(200)
    .json(
        new ApiResponse(200, eligibleEmps, "Employee fetched")
    )
})

const getDropDownData = asyncHandler(async (req, res) => {
    const departments = await Department.find().select("departmentId departmentName")
    const departmentOptions = departments.map(d => ({
        label: `${d.departmentId} - ${d.departmentName}`,
        value: d.departmentId
    }))

    const employees = await Employee.find().select("employeeId employeeName")
    const employeeOptions = employees.map(e => ({
        label: `${e.employeeId} - ${e.employeeName}`,
        value: e.employeeId
    }))

    const roles = await Employee.find().distinct("designation")

    return res.status(200).json(
        new ApiResponse(200, { departments: departmentOptions, employees: employeeOptions, roles }, "Dropdown data")
    )
})

export {
    registerSalary,
    updateSalaryDetails,
    getEmpSalaryDetails,
    searchSalaryByEmpName,
    getEligibleEmpForSalary,
    getDropDownData
}