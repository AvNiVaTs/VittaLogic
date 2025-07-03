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

router.route("/registerVendor").post(verifyJWT, populateCreatedByUpdatedBy, createVendorPayment)
router.route("/").get(verifyJWT, getAllVendorPayments)
router.route("/by-id/:id").get(verifyJWT, getVendorPaymentById)
router.route("/update/:id").patch(verifyJWT, populateCreatedByUpdatedBy, updateVendorPayment)
router.route("/delete/:id").delete(verifyJWT, deleteVendorPayment)
router.route("/search").get(verifyJWT, searchVendorPayment)
router.route("/vendors/dropdown").get(verifyJWT, getVendorsForDropDown)

export default router