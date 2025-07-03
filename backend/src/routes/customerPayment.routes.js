import { Router } from "express"
import {
    createCustomerPayment,
    getAllCustomerPayments,
    updateCustomerPayment,
    deleteCustomerPayment,
    filterPaymentByStatus,
    getCustomerDropDownOptions
} from "../controllers/customerPayment.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/create").post(verifyJWT, populateCreatedByUpdatedBy, createCustomerPayment)
router.route("/").get(verifyJWT, getAllCustomerPayments)
router.route("/update/:id").patch(verifyJWT, populateCreatedByUpdatedBy, updateCustomerPayment)
router.route("/delete/:id").delete(verifyJWT, deleteCustomerPayment)
router.route("/filter").get(verifyJWT, filterPaymentByStatus)
router.route("/dropdown/customers").get(verifyJWT, getCustomerDropDownOptions)

export default router