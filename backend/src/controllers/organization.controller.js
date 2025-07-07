import { Organization } from "../models/organization.model.js";
import { Department } from "../models/department.model.js";
import { Employee } from "../models/employee.model.js";
import { getNextSequence } from "../utils/getNextSequence.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiErr } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const generatorAccessAndRefreshTokens = async(orgId) => {
    try{
        const org = await Organization.findById(orgId)

        const accessToken = org.generateAccessToken()
        const refreshToken = org.generateRefreshToken()

        org.refreshToken = refreshToken
        await org.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }
    catch(err){
        throw new ApiErr(500, "Something went wrong while generating refresh and access token")
    }
}

const registerOrg = asyncHandler(async (req, res) => {
    const {
        organizationName,
        panNumber,
        website,
        email,
        contactNumber,
        gstin,
        address,
        country,
        pincode,
        authorizedPerson,
        bankName,
        ifscCode,
        bankAccountNumber
    } = req.body;

    // Field validation remains the same
    if ([
        organizationName,
        panNumber,
        website,
        email,
        contactNumber,
        gstin,
        address,
        country,
        pincode,
        bankName,
        ifscCode,
        bankAccountNumber
    ].some((field) => field?.trim() === "")) {
        throw new ApiErr(400, "All fields are required");
    }

    if (!authorizedPerson ||
        [
            authorizedPerson.firstName,
            authorizedPerson.lastName,
            authorizedPerson.email,
            authorizedPerson.designation,
            authorizedPerson.contactNumber,
            authorizedPerson.password,
            authorizedPerson.confirmpassword
        ].some(field => typeof field !== "string" || field.trim() === "")) {
        throw new ApiErr(400, "All authorized person fields are required");
    }

    // Check for existing org
    const existedOrg = await Organization.findOne({ email });
    if (existedOrg) {
        throw new ApiErr(409, "Organization with email already exists");
    }

    // Create org
    const org = await Organization.create({
        organizationName,
        panNumber,
        website,
        email,
        contactNumber,
        gstin,
        address,
        country,
        pincode,
        authorizedPerson: {
            firstName: authorizedPerson.firstName,
            lastName: authorizedPerson.lastName,
            email: authorizedPerson.email,
            designation: authorizedPerson.designation,
            contactNumber: authorizedPerson.contactNumber,
            password: authorizedPerson.password,
            confirmpassword: authorizedPerson.confirmpassword
        },
        bankName,
        ifscCode,
        bankAccountNumber,
        createdBy: null,
        updatedBy: null
    });

    const createdOrg = await Organization.findById(org._id).select(
        "-authorizedPerson.password -authorizedPerson.confirmpassword -refreshToken"
    );

    if (!createdOrg) {
        throw new ApiErr(500, "Something went wrong while registering the organization");
    }

    //register authorized person department
    let financeDepartment = await Department.findOne({ departmentName: "Finance" });

    if (!financeDepartment) {

        const deptId = `DEPT-${(await getNextSequence("department")).toString().padStart(5, "0")}`;
        
        financeDepartment = await Department.create({
            department_id: deptId,
            departmentName: "Finance",
            departmentDescription: "Auto-created default department during organization setup",
            createdBy: null,
            updatedBy: null
        })
    }

    // Now create authorized person as an employee
    const fullName = `${authorizedPerson.firstName} ${authorizedPerson.lastName}`;
    const empId = `EMP-${(await getNextSequence("employee")).toString().padStart(5, "0")}`;
    const hashedPassword = await bcrypt.hash(authorizedPerson.password, 10);
    const employee = await Employee.create({
        employeeId: empId,
        employeeName: fullName,
        emailAddress: authorizedPerson.email,
        contactNumber: authorizedPerson.contactNumber,
        password: hashedPassword,
        designation: authorizedPerson.designation,
        dateOfJoining: org.createdAt,
        role: "Application Manager",
        department: financeDepartment._id,
        level: 4,
        servicePermissions: [
            'Department Service',
            'Employee Service',
            'Transaction Service',
            'Asset Service',
            'Company Financials Service',
            'Vendor Service',
            'Customer Service',
            'Dashboard Service',
            'Approval Service'
        ]
    });

    // Update createdBy and updatedBy with own ID
    employee.createdBy = employee._id;
    employee.updatedBy = employee._id;
    await employee.save();

    if (!financeDepartment.createdBy) {
        financeDepartment.createdBy = employee._id;
        financeDepartment.updatedBy = employee._id;
        await financeDepartment.save();
    }

    return res.status(201).json(
        new ApiResponse(200, createdOrg, "Organization registered successfully")
    );
})

const loginOrg = asyncHandler(async (req, res) => {
    //req.body -> data
    const {email, authorizedPerson} = req.body

    //email check
    if(!email){
        throw new ApiErr(400, "Email is required")
    }

    if (!authorizedPerson || !authorizedPerson.password) {
        throw new ApiErr(400, "Password is required");
    }    
    
    //find org
    const org = await Organization.findOne({ email }).select("+authorizedPerson.password +authorizedPerson.confirmpassword")
    if(!org){
        throw new ApiErr(404, "Organization does not exists")
    }

    //password check
    const isPasswordValid = await org.isPasswordCorrect(authorizedPerson.password)
    if(!isPasswordValid){
        throw new ApiErr(401, "Invalid Organization Credentials")
    }

    //access and refreshToken
    const {accessToken, refreshToken} = await generatorAccessAndRefreshTokens(org._id)

    //send cookies
    const loggedInOrg = await Organization.findById(org._id).select("-authorizedPerson.password -authorizedPerson.confirmpassword -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            org: loggedInOrg, accessToken, refreshToken
        }, "Organization logged in successfully")
    )
})

const logoutOrg = asyncHandler(async (req, res) => {
    await Organization.findByIdAndUpdate(
        req.org._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "Organization logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiErr(401, "Unauthorized Request")
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const org = await Organization.findById(decodedToken?._id)

        if(!org){
            throw new ApiErr(401, "Invalid refresh token")
        }

        if(incomingRefreshToken !== org?.refreshToken){
            throw new ApiErr(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, newRefreshToken} = await generatorAccessAndRefreshTokens(org._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
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
    const {oldPassword, newPassword} = req.body

    const org = await Organization.findById(req.org?._id).select('authorizedPerson.password')

    const isPasswordCorrect = await org.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiErr(400, "Invalid Password")
    }

    org.authorizedPerson.password = newPassword
    await org.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentOrg = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json({
        status: 200,
        data: req.org,
        message: "Current organization info fetched successfully"
    })
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, mobileNumber } = req.body

    if(!fullName || !email || !mobileNumber){
        throw new ApiErr(400, "All fields are required")
    }

    const org = await Organization.findByIdAndUpdate(req.org?._id, {
        $set: {
            "authorizedPerson.fullName": fullName,
            "authorizedPerson.email": email,
            "authorizedPerson.mobileNumber": mobileNumber
        }
    }, {new: true}).select("-authorizedPerson.password -authorizedPerson.confirmpassword -refreshToken")

    org.updatedBy = req.employee?._id || req.org?._id || "System";

    await org.save();

    return res
    .status(200)
    .json(new ApiResponse(200, org, "Authorized person details updated successfully"))
})

export {
    registerOrg,
    loginOrg,
    logoutOrg,
    refreshAccessToken,
    changeCurrPassword,
    getCurrentOrg,
    updateAccountDetails
}