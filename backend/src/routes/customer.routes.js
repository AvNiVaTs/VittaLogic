import { Router } from "express"
import {
    createCustomer,
    getAllCustomer,
    updateCust,
    deleteCustomer,
    searchCustomerById,
    searchCustomerByName,
    filterCustomerByPriority
} from "../controllers/customer.controller.js"
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

router.route("/registerCustomer").post(populateCreatedByUpdatedBy, createCustomer)
router.route("/").get(getAllCustomer)
router.route("/update/:id").patch(populateCreatedByUpdatedBy, updateCust)
router.route("/delete/:id").delete(deleteCustomer)
router.route("/by-id/:id").get(searchCustomerById)
router.route("/search").get(searchCustomerByName)
router.route("/filter").get(filterCustomerByPriority)

router.route("/payment/create").post(populateCreatedByUpdatedBy, createCustomerPayment)
router.route("/payment/").get(getAllCustomerPayments)
router.route("/payment/update/:id").patch(populateCreatedByUpdatedBy, updateCustomerPayment)
router.route("/payment/delete/:id").delete(deleteCustomerPayment)
router.route("/payment/filter").get(filterPaymentByStatus)
router.route("/payment/dropdown/customers").get(getCustomerDropDownOptions)

export default router