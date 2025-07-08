import { Router } from "express"
import { registerBudget, getDeptBudget } from "../controllers/departmentBudget.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/create").post(populateCreatedByUpdatedBy, registerBudget)
router.route("/").get(getDeptBudget)

export default router