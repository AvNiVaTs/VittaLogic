import { Router } from "express"
import { loginOrg, logoutOrg, refreshAccessToken, registerOrg } from "../controllers/organization.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerOrg)
router.route("/login").post(loginOrg)

//secure routes
router.route("/logout").post(verifyJWT, logoutOrg)
router.route("/refresh-token").post(refreshAccessToken)

export default router