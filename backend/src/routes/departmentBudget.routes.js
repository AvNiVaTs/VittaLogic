import { Router } from "express"
import { registerBudget, getDeptBudget } from "../controllers/departmentBudget.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/create").post(verifyJWT, populateCreatedByUpdatedBy, registerBudget)
router.route("/").get(verifyJWT, getDeptBudget)

export default router