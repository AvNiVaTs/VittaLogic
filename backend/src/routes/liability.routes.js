import { Router } from "express"
import {
    createLiability,
    filterLiabilities,
    getAllLiabilities,
    liabilityAccountsDropdown,
    liabilityApprovalsDropdown,
    liabilityVendorsDropdown,
    searchLiability,
    sortByPaidAmount,
    updateLiability
} from "../controllers/liability.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"

const router = Router()

router.route("/createLiability").post(verifyEmployeeJWT, upload.fields([{name: "attachment", maxCount: 1}]), populateCreatedByUpdatedBy, createLiability)
router.route("/getAll").get(getAllLiabilities)
router.route("/search").get(searchLiability)
router.route("/filter").get(filterLiabilities)
router.route("/sort/paid-amount").get(sortByPaidAmount)
router.route("/update/:id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateLiability)
router.route("/dropdown/accounts").get(liabilityAccountsDropdown)
router.route("/dropdown/vendors").get(liabilityVendorsDropdown)
router.route("/dropdown/approvals").get(liabilityApprovalsDropdown)

export default router