import { EmployeeSalary } from "../models/employeeSalary.model.js";
import { Employee } from "../models/employee.model.js"
import { Department } from "../models/department.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {getNextSequence} from "../utils/getNextSequence.js"

const registerSalary = asyncHandler(async (req, res) => {
    const {
        employee,
        department,
        role,
        payMonth,
        baseSalary,
        bonus=0,
        deduction=0,
        paymentDate
    } = req.body

    if(!employee || !department || !role || !payMonth || !baseSalary || !paymentDate){
        throw new ApiErr(400, "All required fields must be filled")
    }

    const netSal = baseSalary + bonus - deduction
    const salId = `SAL-${await getNextSequence("salaryId")}`

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
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, newSalary, "Salary registered successfully")
    )
})

const updateSalaryDetails = asyncHandler(async (req, res) => {
    const {salaryId} = req.params
    const {baseSalary, bonus=0, deduction=0, paymentDate} = req.body

    const salary = await EmployeeSalary.findOne({salaryId})
    if(!salary){
        throw new ApiErr(404, "Salary record not found")
    }

    salary.baseSalary = baseSalary
    salary.bonus = bonus
    salary.deduction = deduction
    salary.netSalary = baseSalary + bonus - deduction
    salary.paymentDate = paymentDate
    salary.updatedBy = req.body.updatedBy

    await salary.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, salary, "Salary updated successfully")
    )
})

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
    const department = await Department.find().select("departmentId departmentName")
    const roles = await Employee.find().distinct("designation")

    return res
    .status(200)
    .json(
        new ApiResponse(200, {department, roles}, "Data fetched")
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