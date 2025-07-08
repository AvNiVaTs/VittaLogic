import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"

export const populateCreatedByUpdatedBy = asyncHandler(async (req, res, next) => {
    const org = req.org;

    if (!org || !org._id || !org.authorizedPerson?.employeeId) {
        throw new ApiErr(400, "Unauthorized: Organization context missing");
    }

    const employeeId = org.authorizedPerson.employeeId;

    if (!employeeId) {
        throw new ApiErr(400, "Authorized employee not found");
    }


    const method = req.method.toUpperCase();
    if (["POST", "PUT", "PATCH"].includes(method)) {
        if (!req.body.createdBy) req.body.createdBy = employeeId;
        req.body.updatedBy = employeeId;
    }

    next();
});