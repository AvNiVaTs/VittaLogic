import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErr } from "../utils/ApiError.js";

export const checkServicePermission = asyncHandler(async (req, res, next) => {
  const employee = req.employee;

  if (!employee || !employee.servicePermissions) {
    throw new ApiErr(403, "Unauthorized: Employee not found or permissions missing");
  }

  // Infer the service name from the request path
  const path = req.baseUrl || req.originalUrl || "";
  const serviceMatch = path.match(/\/([a-zA-Z]+)/);

  let inferredService = serviceMatch?.[1] || "";

  // Convert to Title Case + ' Service'
  inferredService = inferredService.charAt(0).toUpperCase() + inferredService.slice(1).toLowerCase() + " Service";

  // Check if employee has permission
  if (!employee.servicePermissions.includes(inferredService)) {
    throw new ApiErr(403, `Access denied: Missing permission for '${inferredService}'`);
  }

  next();
});