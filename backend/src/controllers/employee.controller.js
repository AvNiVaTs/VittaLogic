import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { Department } from "../models/department.model.js"
import { Employee } from "../models/employee.model.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { getNextSequence } from "../utils/getNextSequence.js"

const generatorAccessAndRefreshTokensForEmp = async(empId) => {
    try{
        const emp = await Employee.findOne({ employeeId: empId })

        const accessToken = emp.generateAccessTokenforEmp()
        const refreshToken = emp.generateRefreshTokenforEmp()

        emp.refreshToken = refreshToken
        await emp.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }
    catch(err){
        throw new ApiErr(500, "Something went wrong while generating refresh and access token")
    }
}

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

    const existingDept = await Department.findOne({department_id: department})
    if(!existingDept){
        throw new ApiErr(404, "Selected department does not exists")
    }
    const deptId = existingDept.department_id;

    const empId = `EMP-${(await getNextSequence("employee")).toString().padStart(5, "0")}`

    const newEmp = await Employee.create({
        employeeId: empId,
        employeeName,
        emailAddress,
        contactNumber,
        password,
        designation,
        dateOfJoining,
        department: deptId,
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
    const { emailAddress, password, serviceName} = req.body
    if(!emailAddress || !password){
        throw new ApiErr(400, "Email and password are required")
    }

    const emp = await Employee.findOne({emailAddress}).select("+password")
    // console.log("Entered password:", password);
    // console.log("Stored hash:", emp?.password);
    if(!emp){
        throw new ApiErr(404, "Employee not found")
    }

    const validPassword = await emp.isPasswordCorrect(password)
    if(!validPassword){
        throw new ApiErr(401, "Invalid employee credentials")
    }

    const isAllowed = emp.servicePermissions?.includes(serviceName);
    if (!isAllowed) {
        throw new ApiErr(403, "Access to this service is forbidden for this employee");
    }

    const {accessToken, refreshToken} = await generatorAccessAndRefreshTokensForEmp(emp.employeeId)
    const loggedInEmp = await Employee.findOne({ employeeId: emp.employeeId }).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax"
    }

    return res
    .status(200)
    .cookie("empAccessToken", accessToken, options)
    .cookie("empRefreshToken", refreshToken, options)
    .json(new ApiResponse(200, {employee: loggedInEmp, servicePermissions: emp.servicePermissions, accessToken, refreshToken}, "Login successful"))
})

const logoutEmp = asyncHandler(async (req, res) => {
    if (!req.employee || !req.employee.employeeId) {
        throw new ApiErr(401, "Unauthorized. Employee not found in request.");
    }

    await Employee.findOneAndUpdate(
        {employeeId: req.employee.employeeId},
        {
            $set: {
                refreshToken: undefined
            }
        },
        {new: true}
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax"
    }

    return res
    .status(200)
    .clearCookie("empAccessToken", options)
    .clearCookie("empRefreshToken", options)
    .json(new ApiResponse(200, "Logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.empRefreshToken || req.body.empRefreshToken

    if(!incomingRefreshToken){
        throw new ApiErr(401, "Unauthorized Access")
    }

    try{
        const decoded = jwt.verify(incomingRefreshToken, process.env.EMP_REFRESH_TOKEN_SECRET)

        const emp = await Employee.findOne({employeeId: decoded?.employeeId})

        if(!emp){
            throw new ApiErr(401, "Invalid Refresh Token")
        }

        if(incomingRefreshToken!==emp?.refreshToken){
            throw new ApiErr(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax"
        }

        const {accessToken, newRefreshToken} = await generatorAccessAndRefreshTokensForEmp(emp.employeeId)
        
        return res
        .status(200)
        .cookie("empAccessToken", accessToken, options)
        .cookie("empRefreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, {
                accessToken, refreshToken: newRefreshToken
            }, "Access token refreshed")
        )
    }catch(err){
        throw new ApiErr(401, err?.message || "Invalid Refresh Token")
    }
})

const changeCurrPassword = asyncHandler(async (req, res) => {
    const {emailAddress, oldPassword, newPassword} = req.body
    // console.log("Received oldPassword:", oldPassword);
    
    const emp = await Employee.findOne({emailAddress}).select("+password")
    // console.log("Employee found:", emp);
    // console.log("Stored password hash:", emp?.password);
    if(!emp){
        throw new ApiErr(404, "Employee not found")
    }

    const match = await emp.isPasswordCorrect(oldPassword)
    if(!match){
        throw new ApiErr(401, "Old Password is incorrect")
    }

    emp.password = newPassword
    emp.updatedBy = req.emp?.employeeId || emp.updatedBy;
    await emp.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
})

const updatedEmpDetails = asyncHandler(async (req, res) => {
    const {employee_id} = req.params

    const updates = req.body

    if (typeof updates.department === "string" && !mongoose.Types.ObjectId.isValid(updates.department)) {
        const departmentDoc = await Department.findOne({ departmentName: updates.department });
    
        if (!departmentDoc) {
          throw new ApiErr(400, "Invalid department name: No such department found");
        }
    
        updates.department = departmentDoc._id;
    }

    if (updates.password) {
        throw new ApiErr(400, "Not allowed to update password");
    }

    updates.updatedBy = req.body.updatedBy

    const updatedEmp = await Employee.findOneAndUpdate({employeeId: employee_id}, updates, {
        new: true,
        runValidators: true
    })
    if(!updatedEmp){
        throw new ApiErr(404, "Employee not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedEmp, "Employee details updated")
    )
})

const deleteEmp = asyncHandler(async (req, res) => {
    const {id} = req.params

    const deleted = await Employee.findOneAndDelete({employeeId: {$regex: `^${id}$`, $options: 'i'}})
    if(!deleted){
        throw new ApiErr(404, "Employee not able deleted")
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

    const emp = await Employee.findOne({employeeId: {$regex: `^${id}$`, $options: 'i'}})
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

const getAllEmployees = asyncHandler(async (req, res) => {
    // Step 1: Fetch all employees
    const employees = await Employee.find({})
        .select("employeeId employeeName emailAddress contactNumber designation dateOfJoining department role level");

    if (!employees || employees.length === 0) {
        throw new ApiErr(404, "No employees found");
    }

    // Step 2: Get unique department IDs from employees
    const departmentIds = [...new Set(employees.map(emp => emp.department))];

    // Step 3: Fetch department details manually
    const departments = await Department.find({
        department_id: { $in: departmentIds }
    }).select("department_id departmentName");

    // Step 4: Map departments by ID for quick lookup
    const deptMap = {};
    departments.forEach(dep => {
        deptMap[dep.department_id] = dep.departmentName;
    });

    // Step 5: Attach departmentName to each employee
    const enrichedEmployees = employees.map(emp => ({
        ...emp.toObject(),
        department: {
            department_id: emp.department,
            departmentName: deptMap[emp.department] || "Unknown"
        }
    }));

    return res.status(200).json(
        new ApiResponse(200, enrichedEmployees, "All employees fetched successfully")
    );
})

const searchEmpDept = asyncHandler(async (req, res) => {
    const {departmentName} = req.params
    console.log("Searching for department name:", departmentName);

    const deptDoc = await Department.findOne({
        departmentName: { $regex: `^${departmentName}$`, $options: "i" },
    });
    console.log("Department found:", deptDoc);
    
    if (!deptDoc) {
    throw new ApiErr(404, "Department not found with given name");
    }

    // Find all employees in this department
    const employees = await Employee.find({ department: deptDoc._id }).select(
    "employeeId employeeName department designation level"
    );

    if(!employees){
        throw new ApiErr(400, "No employee found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees in department fetched"))
})

const getDepartmentsForDropdown = asyncHandler(async (req, res) => {
    const departments = await Department.find({}, "department_id departmentName");

    if (!departments || departments.length === 0) {
        throw new ApiErr(404, "No departments found");
    }

    const dropdownOptions = departments.map(dept => ({
        label: `${dept.department_id} - ${dept.departmentName}`,
        value: dept.department_id  // this value will be sent to backend
    }));

    return res
        .status(200)
        .json(new ApiResponse(200, dropdownOptions, "Departments fetched successfully for dropdown"));
});

export {
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
}

