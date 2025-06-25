import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"

export const populateCreatedByUpdatedBy = asyncHandler(async (req, resizeBy, next) => {
    //authentication first using "verifyJWT"
    const org = req.org
    if(!org || !org._id){
        throw new ApiErr(400, "Unauthorized: Organization context missing")
    }

    //Attach createdBy and UpdatedBy fields automatically
    const userId = org.authorisedPerson?._id || org._id

    //Main operation
    if(req.method==="POST" || req.method==="PUT"){
        if(!req.body.createdBy) req.body.createdBy = userId;
        req.body.updatedBy = userId;
    }
})