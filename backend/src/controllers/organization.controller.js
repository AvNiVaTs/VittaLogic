import { ApiErr } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Organization } from "../models/organization.model.js"
import jwt from "jsonwebtoken"

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
    //get org details
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

      //validation - not empty
      if([
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
      ].some((field) => field?.trim()==="")){
        throw new ApiErr(400, "All fields are required")
      }

      //check if org already exists: email
      const existedOrg = await Organization.findOne({email})
      if(existedOrg){
        throw new ApiErr(409, "Organization with email already exists")
      }

      //create org object - create entry in db
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
        bankAccountNumber
      });

      //remove password and refresh token field from response
      const createdOrg = await Organization.findById(org._id).select(
        "-authorizedPerson.password -authorizedPerson.confirmpassword -refreshToken"
      )

      //check for org creation
      if(!createdOrg){
        throw new ApiErr(500, "Something went wrong while registering the organization")
      }

      //return result
      return res.status(201).json(
        new ApiResponse(200, createdOrg, "User registered successfully")
      )
})

const loginOrg = asyncHandler(async (req, res) => {
    //req.body -> data
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
    } = req.body

    //email check
    if(!email){
        throw new ApiErr(400, "Email is required")
    }
    
    //find org
    const org = await Organization.findOne({email})
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
        httpsOnly: true,
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

    const org = await Organization.findById(req.org?._id)

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