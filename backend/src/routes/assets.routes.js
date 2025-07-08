import {Router} from "express"
import {createEnteredAsset} from "../controllers/enteredAsset.controller.js"
import {
    createAssetFromEnteredAsset,
    assignedAsset,
    unassignedAsset,
    filterAssets,
    searchAssets,
    getDepartments,
    getEmployeesByDepartment
} from "../controllers/asset.controller.js"
import {populateCreatedByUpdatedBy} from "../middleware/populateEmpInfo.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router()

//entered asset
router.route("/enterAsset").post(populateCreatedByUpdatedBy, createEnteredAsset)

//asset
router.route("/").post(populateCreatedByUpdatedBy, upload.fields([{name: "attachment", maxCount: 1}]), createAssetFromEnteredAsset)
router.route("/assign").put(populateCreatedByUpdatedBy, assignedAsset)
router.route("/unassign").put(populateCreatedByUpdatedBy, unassignedAsset)
router.route("/filter").get(filterAssets)
router.route("/search").get(searchAssets)
router.route("/dropdown/departments").get(getDepartments)
router.route("/dropdown/employees").get(getEmployeesByDepartment)

export default router