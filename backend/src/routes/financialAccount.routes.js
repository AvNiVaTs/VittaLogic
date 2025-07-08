import { Router } from "express"
import {
    createFinancialAccount,
    getFinancialAccounts,
    updateAccountStatus,
    getAccountById
} from "../controllers/financialAccount.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/createAcc").post(populateCreatedByUpdatedBy, createFinancialAccount)
router.route("/").get(getFinancialAccounts)
router.route("/update-status/:accId").patch(populateCreatedByUpdatedBy, updateAccountStatus)
router.route("/:accId").get(getAccountById)

export default router