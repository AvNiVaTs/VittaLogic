import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"
import {Department} from "../models/department.model.js"

export const deptMiddleware = asyncHandler(async (req, res, next) => {
    const dept = await Department.findOne({ /* logic using req.user or params */ });

    if (!dept) throw new ApiErr(404, "Department not found");

    req.dept = dept;
    next();
});
