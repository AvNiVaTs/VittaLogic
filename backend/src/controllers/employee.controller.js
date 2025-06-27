import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Employee} from "../models/employee.model.js"
import {Department} from "../models/department.model.js"
import { getNextSequence } from "../utils/generateEmployeeId.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const jwtSecret = process.env.JWT_SECRET

const registerEmployee = asyncHandler(async (req, res) => {
    const {
        employeeName,
        emailAddress,
        contactNumber,
        password,
        designation,
        dateOfJoining,
        department,
        role,
        level,
        servicePermissions
    } = req.body

    if(
        !employeeName ||
        !emailAddress ||
        !contactNumber ||
        !password ||
        !designation ||
        !dateOfJoining ||
        !department ||
        !role
    ){
        throw new ApiErr(400, "All required field must be provided")
    }

    const existingEmployee = await Employee.findOne({
        $or: [{emailAddress}, {contactNumber}]
    })
    if(existingEmployee){
        throw new ApiErr(409, "Employee with given or contact already exists")
    }

    const existingDept = await Department.findById(department)
    if(!existingDept){
        throw new ApiErr(404, "Selected department does not exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const empId = `EMP-${await getNextSequence("employeeId")}`

    const newEmp = await Employee.create({
        employeeId: empId,
        employeeName,
        emailAddress,
        contactNumber,
        password: hashedPassword,
        designation,
        dateOfJoining,
        department,
        role,
        level,
        servicePermissions,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, newEmp, "Employee registered successfully")
    )
})

const loginEmp = asyncHandler(async (req, res) => {
    const { emailAddress, password} = req.body
    if(!emailAddress || !password){
        throw new ApiErr(400, "Email and password are required")
    }

    const emp = await Employee.findOne({emailAddress})
    if(!emp){
        throw new ApiErr(404, "Employee not found")
    }

    const validPassword = await bcrypt.compare(password, emp.password)
    if(!validPassword){
        throw new ApiErr(401, "Invalid credentials")
    }

    const token = jwt.sign({id: emp._id}, jwtSecret, {expiresIn: "1h"})

    return res
    .status(200)
    .json(new ApiResponse(200, {token, servicePermissions: emp.servicePermissions}, "Login successful"))
})

const logoutEmp = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"))
})

const changeCurrPassword = asyncHandler(async (req, res) => {
    const {emailAddress, oldPassword, newPassword} = req.body
    
    const emp = await Employee.findOne({emailAddress})
    if(!emp){
        throw new ApiErr(404, "Employee not found")
    }

    const match = await bcrypt.compare(oldPassword, emp.password)
    if(!match){
        throw new ApiErr(401, "Old Password is incorrect")
    }

    emp.password = await bcrypt.hash(newPassword, 10)
    emp.updatedBy = req.body.updatedBy
    await emp.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Password changed successfully")
    )
})

const updatedEmpDetails = asyncHandler(async (req, res) => {
    const {id} = req.params

    const updates = req.body
    updates.updatedBy = req.body.updatedBy

    const updatedEmp = await Employee.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    })
    if(!updatedEmp){
        throw new ApiErr(404, "Employee not find")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedEmp, "Employee details updated")
    )
})

const deleteEmp = asyncHandler(async (req, res) => {
    const {id} = req.params

    const deleted = await Employee.findByIdAndUpdate(id)
    if(!deleted){
        throw new ApiErr(404, deleted, "Employee deleted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deleted, "Employee deleted")
    )
})

const assignPermissions = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {servicePermissions} = req.body

    const emp = await Employee.findById(id)
    if(!emp){
        throw new ApiErr(404, "Employee not found")
    }

    emp.servicePermissions = servicePermissions
    emp.updatedBy = req.body.updatedBy
    await emp.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, emp, "Permissions updated")
    )
})

const searchEmpDept = asyncHandler(async (req, res) => {
    const {departmentId} = req.params

    const employees = await Employee.find({department: departmentId}).select(
        "employeeId employeeName designation level"
    )

    return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees in department fetched"))
})

const getEmpActivityLog = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, [], "Activity log fetched (not implemented)")
    )
})

export {
    registerEmployee,
    loginEmp,
    logoutEmp,
    changeCurrPassword,
    updatedEmpDetails,
    deleteEmp,
    assignPermissions,
    searchEmpDept,
    getEmpActivityLog
}