import { Router } from "express"
import {
    createFinancialProfile,
    getAllFinancialProfiles
} from "../controllers/financialProfile.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/createProfile").post(populateCreatedByUpdatedBy, createFinancialProfile)
router.route("/").get(getAllFinancialProfiles)

export default router