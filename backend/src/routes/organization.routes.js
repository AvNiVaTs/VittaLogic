import { Router } from "express"
import { changeCurrPassword, getCurrentOrg, loginOrg, logoutOrg, refreshAccessToken, registerOrg, updateAccountDetails } from "../controllers/organization.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerOrg)
router.route("/login").post(loginOrg)

//secure routes
router.route("/logout").post(verifyJWT, logoutOrg)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrPassword)
router.route("/current-user").get(verifyJWT, getCurrentOrg)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)


export default router