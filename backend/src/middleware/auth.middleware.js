import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {Organization} from "../models/organization.model.js"

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token){
            throw new ApiErr(401, "Unauthorized Person")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const org = await Organization.findById(decodedToken?._id).select("-authorizedPerson.password -refreshToken")

        if(!org){
            throw new ApiErr(401, "Invalid Access Token")
        }

        req.org = org;
        next()
    }
    catch(err){
        throw new ApiErr(401, err?.message || "Invalid Access Token")
    }
})