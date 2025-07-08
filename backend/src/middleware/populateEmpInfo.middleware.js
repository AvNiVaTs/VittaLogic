// middlewares/populateCreatedByUpdatedBy.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErr } from "../utils/ApiError.js";

export const populateCreatedByUpdatedBy = asyncHandler(async (req, res, next) => {
  const employee = req.employee;

  if (!employee || !employee.employeeId) {
    throw new ApiErr(401, "Unauthorized: Employee info missing");
  }

  const method = req.method.toUpperCase();

  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (!req.body.createdBy) {
      req.body.createdBy = employee.employeeId;
    }
    req.body.updatedBy = employee.employeeId;
  }

  next();
});