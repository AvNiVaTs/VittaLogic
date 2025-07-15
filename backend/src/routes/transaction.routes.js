import { Router } from "express"
import {
    createSaleTransaction,
    completeSaleTransaction,
    getCustomersByType,
    getPendingPaymentsByCustomer,
    getApprovedCustomerPaymentApprovals,
    getAssetsForAssetSale,
    getAssetDetailsById,
    getDebitAccounts,
    getCreditAccounts
} from "../controllers/salesTransaction.controller.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerSale").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, createSaleTransaction)
router.route("/updateCompleteSale/:id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, completeSaleTransaction)

router.route("/dropdown/customers").get(getCustomersByType);
router.route("/dropdown/pending-payment").get(getPendingPaymentsByCustomer);
router.route("/dropdown/approvals").get(getApprovedCustomerPaymentApprovals);
router.route("/dropdown/assets").get(getAssetsForAssetSale);
router.route("/dropdown/asset-details").get(getAssetDetailsById);
router.route("/dropdown/debit-account").get(getDebitAccounts);
router.route("/dropdown/credit-account").get(getCreditAccounts);

export default router