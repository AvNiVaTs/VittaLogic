import { Router } from "express";
import {
    createApproval,
    getApprovalReceived,
    getApprovalHistory,
    updateApprovalStatus,
    getEligibleApprovers
} from "../controllers/approval.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {populateCreatedByUpdatedBy} from "../middleware/populateEmpInfo.middleware.js"

const router = Router()

router.route("/createApproval").post(verifyJWT, populateCreatedByUpdatedBy, createApproval)
router.route("/received/:id").get(verifyJWT, getApprovalReceived)
router.route("/history/:id").get(verifyJWT, getApprovalHistory)
router.route("/update-status/:id").patch(verifyJWT, populateCreatedByUpdatedBy, updateApprovalStatus)
router.route("/eligible-approvers").post(verifyJWT, populateCreatedByUpdatedBy, getEligibleApprovers)

export default router