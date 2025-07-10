import { Router } from "express"
import {
    createFinancialProfile,
    getAllFinancialProfiles
} from "../controllers/financialProfile.controller.js"
import {
    createFinancialAccount,
    getFinancialAccounts,
    updateAccountStatus,
    getAccountById
} from "../controllers/financialAccount.controller.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/createProfile").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, createFinancialProfile)
router.route("/").get(getAllFinancialProfiles)

router.route("/createAcc").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, createFinancialAccount)
router.route("/accounts/").get(getFinancialAccounts)
router.route("/account/update-status/:accId").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateAccountStatus)
router.route("/account/:accId").get(getAccountById)

export default router