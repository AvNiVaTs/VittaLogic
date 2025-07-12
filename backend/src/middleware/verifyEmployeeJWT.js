// middlewares/verifyEmployeeJWT.js
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErr } from "../utils/ApiError.js";
import { Employee } from "../models/employee.model.js";

export const verifyEmployeeJWT = asyncHandler(async (req, res, next) => {
    // console.log("Cookies:", req.cookies)
    try{
        const token = req.cookies.empAccessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token from Header/Cookie:", token);

        if (!token) {
            throw new ApiErr(401, "Unauthorized - No access token provided");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.EMP_ACCESS_TOKEN_SECRET);
        // console.log("Decoded Token:", decoded)


        // Find employee using decoded ID
        const employee = await Employee.findOne({ employeeId: decoded.employeeId });

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
