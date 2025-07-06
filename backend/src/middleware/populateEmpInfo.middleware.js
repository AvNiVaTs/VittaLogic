import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"

export const populateCreatedByUpdatedBy = asyncHandler(async (req, res, next) => {
    const org = req.org;

    if (!org || !org._id) {
        throw new ApiErr(400, "Unauthorized: Organization context missing");
    }

    const userId = org?.authorizedPerson?._id || org?._id;
    if (!userId) {
        throw new ApiErr(400, "Unauthorized: User ID missing from organization context");
    }

    const method = req.method.toUpperCase();
    if (["POST", "PUT", "PATCH"].includes(method)) {
        if (!req.body.createdBy) req.body.createdBy = userId;
        req.body.updatedBy = userId;
    }

    next();
});