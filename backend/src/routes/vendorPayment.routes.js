import { Router } from "express"
import {
    createVendorPayment,
    getAllVendorPayments,
    getVendorPaymentById,
    updateVendorPayment,
    deleteVendorPayment,
    searchVendorPayment,
    getVendorsForDropDown
} from "../controllers/vendorPayment.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerVendorPay").post(populateCreatedByUpdatedBy, createVendorPayment)
router.route("/").get(getAllVendorPayments)
router.route("/by-id/:id").get(getVendorPaymentById)
router.route("/update/:id").patch(populateCreatedByUpdatedBy, updateVendorPayment)
router.route("/delete/:id").delete(deleteVendorPayment)
router.route("/search").get(searchVendorPayment)
router.route("/vendors/dropdown").get(getVendorsForDropDown)

export default router