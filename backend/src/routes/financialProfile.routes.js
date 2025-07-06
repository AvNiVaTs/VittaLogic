import { Router } from "express"
import {
    createFinancialProfile,
    getAllFinancialProfiles
} from "../controllers/financialProfile.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/createProfile").post(verifyJWT, populateCreatedByUpdatedBy, createFinancialProfile)
router.route("/").get(verifyJWT, getAllFinancialProfiles)

export default router