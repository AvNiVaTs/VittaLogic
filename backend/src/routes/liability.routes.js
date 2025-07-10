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
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router()

router.route("/createLiability").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, upload.fields([{name: "attachment", maxCount: 1}]), createLiability)
router.route("/").get(getAllLiabilities)
router.route("/search").get(searchLiability)
router.route("/filter").get(filterLiabilities)
router.route("/sort/paid-amount").get(sortByPaidAmount)
router.route("/update/:id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateLiability)
router.route("/dropdown/accounts").get(liabilityAccountsDropdown)
router.route("/dropdown/vendors").get(liabilityVendorsDropdown)
router.route("/dropdown/approvals").get(liabilityApprovalsDropdown)

export default router