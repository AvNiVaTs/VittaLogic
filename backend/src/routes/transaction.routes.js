import { Router } from "express"
import { upload } from "../middleware/multer.middleware.js"
import {
    createSaleTransaction,
    completeSaleTransaction,
    getCustomersByType,
    getPendingPaymentsByCustomer,
    getApprovedCustomerPaymentApprovals,
    getAssetsForAssetSale,
    getAssetDetailsById,
    getSalesDebitAccounts,
    getSalesCreditAccounts
} from "../controllers/salesTransaction.controller.js"
import {
    createInternalTransaction,
    getDepartmentsForSalaryDropdown,
    getEmployeesByDepartmentForSalary,
    getLiabilitiesByType,
    getAssetsForMaintenanceRepair,
    getInternalDebitAccounts,
    getInternalCreditAccounts
} from "../controllers/internalTransaction.controller.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

//Sales Transaction
router.route("/registerSale").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, createSaleTransaction)
router.route("/updateCompleteSale/:id").patch(verifyEmployeeJWT, upload.fields([{name: "attachment", maxCount: 1}]), completeSaleTransaction)
router.route("/dropdown/customers").get(getCustomersByType);
router.route("/dropdown/pending-payment").get(getPendingPaymentsByCustomer);
router.route("/dropdown/approvals").get(getApprovedCustomerPaymentApprovals);
router.route("/dropdown/assets").get(getAssetsForAssetSale);
router.route("/dropdown/asset-details").get(getAssetDetailsById);
router.route("/dropdown/debit-account").get(getSalesDebitAccounts);
router.route("/dropdown/credit-account").get(getSalesCreditAccounts);

//Internal Transaction
router.route("/internal/create").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, createInternalTransaction)
router.route("/dropdown/salaryDept").get(getDepartmentsForSalaryDropdown)
router.route("/dropdown/emp-dept-salary").get(getEmployeesByDepartmentForSalary)
router.route("/dropdown/liabilityType").get(getLiabilitiesByType)
router.route("/dropdown/asset-repair").get(getAssetsForMaintenanceRepair)
router.route("/dropdown/internal-debit").get(getInternalDebitAccounts)
router.route("/dropdown/internal-credit").get(getInternalCreditAccounts)

export default router