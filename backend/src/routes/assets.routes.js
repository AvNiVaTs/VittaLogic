import { Router } from "express"
import {
    createAssets,
    deleteAsset,
    fetchMaintenanceTransactionDetails,
    getAssetById,
    getAssetDetailsFromPurchaseTransactionOnCard,
    getAssetDisposalList,
    // getAssetForEditCard,
    getAssetDropdown,
    getAssetForDisposalEditCard,
    getAssetListCards,
    getAssetMaintenanceSummary,
    getAssetsEligibleForDisposalDropdown,
    getAssetTransactionHistory,
    getMaintenanceCardDetails,
    getMaintenanceHistory,
    markAssetForDisposal,
    searchAsset,
    searchAssetsOnMaintenanceList,
    syncMaintenanceStatus,
    updateAssetAssignment,
    updateAssetStatus,
    updateDisposalReason,
    updateDisposedAssets,
} from "../controllers/asset.controller.js"
import {
    createDepreciation,
    getAssetDropdownByType,
    getDepreciationTrackingDetails
} from "../controllers/assetDepreciation.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"

const router = Router()

//asset
router.route("/purchase-details").get(getAssetDetailsFromPurchaseTransactionOnCard)
router.route("/create").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, upload.fields([{name: "attachment", maxCount: 2}]), createAssets)
router.route("/update-assignment/:id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateAssetAssignment)
router.route("/update-status/:assetId").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateAssetStatus)
router.route("/delete/:id").delete(deleteAsset)
router.route("/search").get(searchAsset)
// router.route("/editCard-details/:assetId").get(getAssetForEditCard)
router.route("/list").get(getAssetListCards)
router.route("/asset-dropdown").get(getAssetDropdown)
router.route("/:assetId").get(getAssetById)
router.route("/transaction-history/:assetId").get(getAssetTransactionHistory)

//asset disposal
router.route("/disposal/:assetId").get(getAssetForDisposalEditCard)
router.route("/asset-for-disposal").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, markAssetForDisposal)
router.route("/update-disposal").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateDisposedAssets)
router.route("/eligible-for-disposal").get(getAssetsEligibleForDisposalDropdown)
router.route("/disposal/update-reason/:assetId").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateDisposalReason)
router.route("/disposal/list").get(getAssetDisposalList)

//asset maintenance
router.route("/maintenance/transaction-details/:assetId").get(fetchMaintenanceTransactionDetails)
router.route("/maintenance/search").get(searchAssetsOnMaintenanceList)
router.route("/maintenance/history/:assetId").get(getMaintenanceHistory)
router.route("/maintenance/card-details").get(getMaintenanceCardDetails)
router.route("/maintenance/summary").get(getAssetMaintenanceSummary)
router.route("/sync-maintenance").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, syncMaintenanceStatus)

//asset depreciation
// router.route("/depreciation/details/:assetId").get(getAssetDepreciationDetails)
// router.route("/depreciation/update/:assetId").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateAssetDepreciation)
router.route("/depreciation/create").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, createDepreciation)
router.route("/depreciation/dropdown/asset").get(getAssetDropdownByType)
router.route("/depreciation/tracking/:assetId").get(getDepreciationTrackingDetails)

export default router