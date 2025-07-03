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
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerCustomer").post(verifyJWT, populateCreatedByUpdatedBy, createCustomer)
router.route("/").get(verifyJWT, getAllCustomer)
router.route("/update/:id").patch(verifyJWT, populateCreatedByUpdatedBy, updateCust)
router.route("/delete/:id").delete(verifyJWT, deleteCustomer)
router.route("/by-id/:id").get(verifyJWT, searchCustomerById)
router.route("/search").get(verifyJWT, searchCustomerByName)
router.route("/filter").get(verifyJWT, filterCustomerByPriority)

export default router