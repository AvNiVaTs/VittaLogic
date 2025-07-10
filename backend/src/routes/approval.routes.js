import { Router } from "express";
import {
    createApproval,
    getApprovalReceived,
    getApprovalHistory,
    updateApprovalStatus,
    getEligibleApprovers
} from "../controllers/approval.controller.js"
import { verifyEmployeeJWT } from "../middleware/verifyEmployeeJWT.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js";

const router = Router()

router.route("/createApproval").post(verifyEmployeeJWT, populateCreatedByUpdatedBy, createApproval)
router.route("/received/:id").get(getApprovalReceived)
router.route("/history/:id").get(getApprovalHistory)
router.route("/update-status/:id").patch(verifyEmployeeJWT, populateCreatedByUpdatedBy, updateApprovalStatus)
router.route("/eligible-approvers").get(getEligibleApprovers)

export default router