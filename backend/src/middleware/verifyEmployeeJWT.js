// middlewares/verifyEmployeeJWT.js
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErr } from "../utils/ApiError.js";
import { Employee } from "../models/employee.model.js";

export const verifyEmployeeJWT = asyncHandler(async (req, res, next) => {
    // Get token from cookie or header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiErr(401, "Unauthorized - No access token provided");
    }

    try {
        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find employee using decoded ID
        const employee = await Employee.findById(decodedToken._id).select("-password");

        if (!employee) {
            throw new ApiErr(401, "Unauthorized - Invalid employee token");
        }

        // Attach employee to request object
        req.employee = employee;

        next();
    } catch (err) {
        throw new ApiErr(401, err?.message || "Unauthorized - Invalid token");
    }
});
