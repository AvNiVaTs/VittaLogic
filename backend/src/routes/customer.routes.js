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
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerCustomer").post(populateCreatedByUpdatedBy, createCustomer)
router.route("/").get(getAllCustomer)
router.route("/update/:id").patch(populateCreatedByUpdatedBy, updateCust)
router.route("/delete/:id").delete(deleteCustomer)
router.route("/by-id/:id").get(searchCustomerById)
router.route("/search").get(searchCustomerByName)
router.route("/filter").get(filterCustomerByPriority)

export default router