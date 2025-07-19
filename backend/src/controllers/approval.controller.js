import { Approval } from "../models/approval.model.js"
import { Department } from "../models/department.model.js"
import { Employee } from "../models/employee.model.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
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

    const emp = await Employee.findOne({ employeeId: approval_to });
    if (!emp) {
        throw new ApiErr(404, "No employee found with the given employeeId");
    }

    const appId = `APP-${(await getNextSequence("approval_id")).toString().padStart(5, "0")}`
    const approval = await Approval.create({
        approval_id: appId,
        approvalfor,
        approval_to: emp.employeeId,
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
  const { priority } = req.query;
  const emp = req.employee;

  const query = {
    approval_to: emp.employeeId,
    status: { $ne: "Approved" }, // exclude already approved
  };

  if (priority) {
    query.priority = new RegExp(`^${priority}$`, "i");
  }

  const approvals = await Approval.find(query);

  if (!approvals || approvals.length === 0) {
    throw new ApiErr(404, "No pending approval requests found");
  }

  const enrichedApprovals = await Promise.all(
    approvals.map(async (approval) => {
      const creator = await Employee.findOne(
        { employeeId: approval.approval_created_by },
        "employeeName role department employeeId"
      );

      let department = null;
      if (creator?.department) {
        department = await Department.findOne(
          {department_id: creator.department},
          "department_id departmentName"
        );
      }

      const recipient = await Employee.findOne(
        { employeeId: approval.approval_to },
        "employeeName employeeId"
      );

      return {
        ...approval.toObject(),
        approval_created_by: {
          employeeId: creator?.employeeId || approval.approval_created_by,
          name: creator?.employeeName || "Unknown",
          role: creator?.role || "Unknown",
          department: department?{
            department_id: department.department_id,
            departmentName: department.departmentName,
          } : "Unknown",
        },
        approval_to: {
          employeeId: approval.approval_to,
          name: recipient?.employeeName || "Unknown",
        },
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, enrichedApprovals, "Approval requests fetched successfully")
  );
})

const getApprovalHistory = asyncHandler(async (req, res) => {
  try {
    const { status, sort = "desc" } = req.query;
    const employee = req.employee;

    const query = {
      $or: [
        { approval_created_by: employee.employeeId },
        { approval_to: employee.employeeId }
      ]
    };

    if (status) query.status = status;

    const approvals = await Approval.find(query).sort({
      createdAt: sort === "asc" ? 1 : -1,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, approvals, "Approval History fetched successfully"));
  } catch (error) {
    console.error("Error fetching approval history:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
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
  const createdById = req.query.createdBy;
  if (!createdById) {
    throw new ApiErr(400, "createdBy is required");
  }
  const sender = await Employee.findOne({ employeeId: { $regex: `^${createdById}$`, $options: "i" } });
  if (!sender) {
    throw new ApiErr(404, "Approval sender not found");
  }
  const eligible = await Employee.find({
    level: sender.level + 1,
    servicePermissions: { $in: ["Approval Service"] }
  }).select('employeeId employeeName role'); // Ensure required fields are selected
  const dropdownOptions = eligible.map(emp => ({
    employeeId: emp.employeeId,
    label: `${emp.employeeName || 'Unknown'} - ${emp.role || emp.designation || 'Unknown'}` // Fallbacks
  }));
  return res
    .status(200)
    .json(new ApiResponse(200, dropdownOptions, "Eligible approvers fetched"));
});

export {
    createApproval, getApprovalHistory, getApprovalReceived, getEligibleApprovers, updateApprovalStatus
}

