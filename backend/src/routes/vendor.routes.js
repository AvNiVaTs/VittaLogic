import { Router } from "express"
import {
    registerVendor,
    getAllVendor,
    updateVendor,
    deleteVendor,
    searchVendorById,
    searchVendorByName,
    filterVendorByType
} from "../controllers/vendor.controller.js"
import {
    createVendorPayment,
    getAllVendorPayments,
    getVendorPaymentById,
    updateVendorPayment,
    deleteVendorPayment,
    searchVendorPayment,
    getVendorsForDropDown
} from "../controllers/vendorPayment.controller.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerVendor").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, registerVendor)
router.route("/").get(getAllVendor)
router.route("/update/:id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateVendor)
router.route("/delete/:id").delete(deleteVendor)
router.route("/search-by-id/:id").get(searchVendorById)
router.route("/search-by-name/:name").get(searchVendorByName)
router.route("/filter").get(filterVendorByType)

router.route("/payment/registerVendorPay").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, createVendorPayment)
router.route("/payment/").get(getAllVendorPayments)
router.route("/payment/by-id/:id").get(getVendorPaymentById)
router.route("/payment/update/:payment_id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateVendorPayment)
router.route("/payment/delete/:payment_id").delete(deleteVendorPayment)
router.route("/payment/search").get(searchVendorPayment)
router.route("/payment/dropdown").get(getVendorsForDropDown)

export default router