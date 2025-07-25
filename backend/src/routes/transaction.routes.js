import { Router } from "express"
import {
    createInternalTransaction,
    getAssetIdByAssetTypeDropdown,
    getAssetsForMaintenanceRepair,
    getDepartmentsForSalaryDropdown,
    getEmployeesByDepartmentForSalary,
    getInternalCreditAccounts,
    getInternalDebitAccounts,
    getInternalTransactionDropdownApprovals,
    getLiabilitiesByType
} from "../controllers/internalTransaction.controller.js"
import {
    createPurchaseTransaction,
    getApprovedApprovalsForDropdown,
    getDepartmentsForDropdown,
    getFinancialCreditAccountDropdown,
    getFinancialDebitAccountDropdown,
    getVendorPaymentsForDropdown,
    getVendorsByTypeForDropdown
} from "../controllers/purchaseTransaction.controller.js"
import {
    completeSaleTransaction,
    createSaleTransaction,
    getApprovedCustomerPaymentApprovals,
    getAssetDetailsById,
    getAssetsForAssetSale,
    getCustomersByType,
    getPendingPaymentsByCustomer,
    getSalesCreditAccounts,
    getSalesDebitAccounts
} from "../controllers/salesTransaction.controller.js"
import { getTransactionHistory } from "../controllers/transactionHistory.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"

const router = Router()

//Sales Transaction
router.route("/registerSale").post(verifyEmployeeJWT, upload.fields([{name: "attachment", maxCount: 1}]), populateCreatedByUpdatedBy, createSaleTransaction)
router.route("/updateCompleteSale/:id").patch(verifyEmployeeJWT, completeSaleTransaction)
router.route("/dropdown/customers").get(getCustomersByType);
router.route("/dropdown/pending-payment").get(getPendingPaymentsByCustomer);
router.route("/dropdown/approvals").get(getApprovedCustomerPaymentApprovals);
router.route("/dropdown/assets").get(getAssetsForAssetSale);
router.route("/dropdown/asset-details").get(getAssetDetailsById);
router.route("/dropdown/debit-account").get(getSalesDebitAccounts);
router.route("/dropdown/credit-account").get(getSalesCreditAccounts);

//Internal Transaction
router.route("/internal/create").post(verifyEmployeeJWT, upload.fields([{name: "attachment", maxCount: 1}]), populateCreatedByUpdatedBy, createInternalTransaction)
router.route("/dropdown/salaryDept").get(getDepartmentsForSalaryDropdown)
router.route("/dropdown/emp-dept-salary").get(getEmployeesByDepartmentForSalary)
router.route("/dropdown/liabilityType").get(getLiabilitiesByType)
router.route("/dropdown/asset-repair").get(getAssetsForMaintenanceRepair)
router.route("/dropdown/internal-debit").get(getInternalDebitAccounts)
router.route("/dropdown/internal-credit").get(getInternalCreditAccounts)
router.route("/dropdown/approve").get(getInternalTransactionDropdownApprovals)
router.route("/dropdown/assetByType/:assetType").get(getAssetIdByAssetTypeDropdown)

//Purchase Transaction
router.route("/purchase/create").post(verifyEmployeeJWT, upload.fields([{name: "attachment", maxCount: 1}]), populateCreatedByUpdatedBy, createPurchaseTransaction)
router.route("/dropdown/dept").get(getDepartmentsForDropdown)
router.route("/dropdown/venType").get(getVendorsByTypeForDropdown)
router.route("/dropdown/venPay").get(getVendorPaymentsForDropdown)
router.route("/dropdown/approved").get(getApprovedApprovalsForDropdown)
router.route("/dropdown/purchase-debit").get(getFinancialDebitAccountDropdown)
router.route("/dropdown/purchase-credit").get(getFinancialCreditAccountDropdown)

//Transaction History
router.route("/history").get(getTransactionHistory)

export default router