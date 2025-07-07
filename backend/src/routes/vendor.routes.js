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
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/registerVendor").post(verifyJWT, populateCreatedByUpdatedBy, registerVendor)
router.route("/").get(verifyJWT, getAllVendor)
router.route("/update/:id").patch(verifyJWT, populateCreatedByUpdatedBy, updateVendor)
router.route("/delete/:id").delete(verifyJWT, deleteVendor)
router.route("/search-by-id/:id").get(verifyJWT, searchVendorById)
router.route("/search-by-name/:id").get(verifyJWT, searchVendorByName)
router.route("/filter").get(verifyJWT, filterVendorByType)

export default router