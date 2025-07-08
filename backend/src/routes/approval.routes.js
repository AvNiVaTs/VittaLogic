import { Router } from "express";
import {
    createApproval,
    getApprovalReceived,
    getApprovalHistory,
    updateApprovalStatus,
    getEligibleApprovers
} from "../controllers/approval.controller.js"
import { populateCreatedByUpdatedBy } from "../middleware/populateEmpInfo.middleware.js";

const router = Router()

router.route("/createApproval").post(populateCreatedByUpdatedBy, createApproval)
router.route("/received/:id").get(getApprovalReceived)
router.route("/history/:id").get(getApprovalHistory)
router.route("/update-status/:id").patch(populateCreatedByUpdatedBy, updateApprovalStatus)
router.route("/eligible-approvers").post(populateCreatedByUpdatedBy, getEligibleApprovers)

export default router