import { Router } from "express"
import {
    createLiability,
    getAllLiabilities,
    searchLiability,
    filterLiabilities,
    sortByPaidAmount,
    updateLiability,
    liabilityAccountsDropdown,
    liabilityVendorsDropdown,
    liabilityApprovalsDropdown
} from "../controllers/liability.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router()

router.route("/createLiability").post(verifyJWT, populateCreatedByUpdatedBy, upload.fields([{name: "attachment", maxCount: 1}]), createLiability)
router.route("/").get(verifyJWT, getAllLiabilities)
router.route("/search").get(verifyJWT, searchLiability)
router.route("/filter").get(verifyJWT, filterLiabilities)
router.route("/sort/paid-amount").get(verifyJWT, sortByPaidAmount)
router.route("/update/:id").patch(verifyJWT, populateCreatedByUpdatedBy, updateLiability)
router.route("/dropdown/accounts").get(verifyJWT, liabilityAccountsDropdown)
router.route("/dropdown/vendors").get(verifyJWT, liabilityVendorsDropdown)
router.route("/dropdown/approvals").get(verifyJWT, liabilityApprovalsDropdown)

export default router