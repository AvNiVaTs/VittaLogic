import { Router } from "express"
import {
    createCustomerPayment,
    getAllCustomerPayments,
    updateCustomerPayment,
    deleteCustomerPayment,
    filterPaymentByStatus,
    getCustomerDropDownOptions
} from "../controllers/customerPayment.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/create").post(populateCreatedByUpdatedBy, createCustomerPayment)
router.route("/").get(getAllCustomerPayments)
router.route("/update/:id").patch(populateCreatedByUpdatedBy, updateCustomerPayment)
router.route("/delete/:id").delete(deleteCustomerPayment)
router.route("/filter").get(filterPaymentByStatus)
router.route("/dropdown/customers").get(getCustomerDropDownOptions)

export default router