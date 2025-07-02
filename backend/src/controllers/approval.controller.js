import { Approval } from "../models/approval.model.js"
import { Employee } from "../models/employee.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { getNextSequence } from "../utils/getNextSequence.js"

const createApproval = asyncHandler(async (req, res) => {
    const {
        approvalfor,
        approval_to,
        min_expense,
        max_expense,
        priority,
        tentative_date,
        reason
    } = req.body

    if(!approvalfor || !approval_to || !min_expense || !max_expense || !priority || !tentative_date || !reason){
        throw new ApiErr(400, "All mandatory fields must be filled")
    }

    const appId = `APP-${(await getNextSequence("approval_id")).toString().padStart(5, "0")}`
    const approval = await Approval.create({
        approval_id: appId,
        approvalfor,
        approval_to,
        min_expense,
        max_expense,
        priority,
        tentative_date,
        reason,
        approval_created_by: req.body.createdBy
    })

    if(!approval){
        throw new ApiErr(400, "Something went wrong while creating approval request")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, approval, "Approval request generated successfully")
    )
})

const getApprovalReceived = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {priority} = req.query

    const query = {approval_to: id}
    if(priority){
        query.priority = priority
    }

    const approvals = await Approval.find(query).populate("approval_created_by", "name role")

    if(!approvals){
        throw new ApiErr(400, "No approval request found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, approvals, "Approval requests fetched successfully")
    )
})

const getApprovalHistory = asyncHandler(async (req, res) => {
    const {id} = req.params
    const { status, sort = "desc"} = req.query

    const query = { approval_created_by: id}
    if(status) query.status = status

    const approvals = await Approval.find(query).sort({createdBy: sort==="asc" ? 1:-1}).populate("approval_to", "name role")

    return res
    .status(200)
    .json(
        new ApiResponse(200, approvals, "Approval History fetched successfully")
    )
})

const updateApprovalStatus = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {status, approver_note} = req.body

    if(!["Approved", "Rejected", "On Hold"].includes(status)){
        throw new ApiErr(400, "Invalid Status")
    }

    const updated = await Approval.findOneAndUpdate(
        {approval_id: id},
        {
            status,
            approver_note,
            decision_time: new Date(),
            decision_date: new Date()
        },
        {new: true, runValidator: true}
    )

    if(!updated){
        throw new ApiErr(404, "Approval record not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updated, `Approval ${status.toLowerCase()}`)
    )
})

const getEligibleApprovers = asyncHandler(async (req, res) => {
    const createdById = req.body.createdBy

    const sender = await Employee.findById(createdById)
    if(!sender){
        throw new ApiErr(404, "Approval sender not found")
    }

    const eligible = await Employee.find({
        level: sender.level+1,
        servicePermissions: {$in: ["Approval Service"]}
    })

    const dropdownOptions = eligible.map(emp => ({
        employeeId: emp._id,
        label: `${emp.name} - ${emp.role}`
    }))

    return res
    .status(200)
    .json(
        new ApiResponse(200, dropdownOptions, "Eligible approvers fetched")
    )
})

export {
    createApproval,
    getApprovalReceived,
    getApprovalHistory,
    updateApprovalStatus,
    getEligibleApprovers
}