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
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerVendor").post(populateCreatedByUpdatedBy, registerVendor)
router.route("/").get(getAllVendor)
router.route("/update/:id").patch(populateCreatedByUpdatedBy, updateVendor)
router.route("/delete/:id").delete(deleteVendor)
router.route("/search-by-id/:id").get(searchVendorById)
router.route("/search-by-name/:id").get(searchVendorByName)
router.route("/filter").get(filterVendorByType)

export default router