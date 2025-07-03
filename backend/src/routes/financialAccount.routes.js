import { Router } from "express"
import {
    createFinancialAccount,
    getFinancialAccounts,
    updateAccountStatus,
    getAccountById
} from "../controllers/financialAccount.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/createAcc").post(verifyJWT, populateCreatedByUpdatedBy, createFinancialAccount)
router.route("/").get(verifyJWT, getFinancialAccounts)
router.route("/update-status/:accId").patch(verifyJWT, populateCreatedByUpdatedBy, updateAccountStatus)
router.route("/:accId").get(verifyJWT, getAccountById)

export default router