import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Department } from "../models/department.model.js"
import { getNextSequence } from "../utils/getNextSequence.js"
import { DepartmentBudget } from "../models/departmentBudget.model.js"
import { Approval } from "../models/approval.model.js"

const registerBudget = asyncHandler(async (req, res) => {
    const {
        departmentId,
        timePeriodFrom,
        timePeriodTo,
        allocatedAmount,
        budgetNote,
        approval_id
    } = req.body

    if(!departmentId || !timePeriodFrom || !timePeriodTo || allocatedAmount===undefined || !approval_id){
        throw new ApiErr(400, "Please fill all required fields")
    }

    const dept = await Department.findOne({department_id: departmentId})
    if(!dept){
        throw new ApiErr(404, "Department not found")
    }

    const approval = await Approval.findOne({approval_id: approval_id, approvalfor: "Department Budget", status: "Approved"})
    if(!approval){
        throw new ApiErr(400, "Invalid approval_id")
    }

    const budgetId = `BUDG-${(await getNextSequence("budget")).toString().padStart(5, "0")}`

    const budget = await DepartmentBudget.create({
        createdBy: req.body.createdBy,
        departmentId,
        budgetId,
        timePeriodFrom,
        timePeriodTo,
        allocatedAmount,
        budgetNote,
        approvalId: approval.approval_id,
        updatedBy: req.body.updatedBy
    })

    if(!budget){
        throw new ApiErr(500, "Something went wrong")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, budget, "Department budget created")
    )
})

const getDeptBudget = asyncHandler(async (req, res) => {
  const { departmentId } = req.query;

  if (!departmentId) {
    throw new ApiErr(400, "Department ID is required");
  }

  const budget = await DepartmentBudget.find({ departmentId })
    .populate({
      path: "createdBy",
      select: "employeeId",
      localField: "createdBy",
      foreignField: "employeeId",
      model: "Employee",
      justOne: true
    })
    .populate({
      path: "updatedBy",
      select: "employeeId",
      localField: "updatedBy",
      foreignField: "employeeId",
      model: "Employee",
      justOne: true
    });

  if (!budget || budget.length === 0) {
    throw new ApiErr(404, "No budget found for the given department");
  }

  const department = await Department.findOne({ department_id: departmentId });

  if (!department) {
    throw new ApiErr(404, "Department not found");
  }

  const enrichedBudgets = budget.map((b) => ({
    ...b.toObject(),
    department: {
      department_id: department.department_id,
      departmentName: department.departmentName
    }
  }));

  return res.status(200).json(
    new ApiResponse(200, enrichedBudgets, "Department budgets fetched successfully")
  );
});

const getApprovalDropdownForBudget = asyncHandler(async (req, res) => {
  const approvals = await Approval.find({ approvalfor: "Department Budget" })
    .select("approval_id reason min_expense max_expense");

  const formattedApprovals = approvals.map(a => ({
    approval_id: a.approval_id,
    displayText: `${a.approval_id} - ${a.reason}\n₹${parseFloat(a.min_expense.toString())} - ₹${parseFloat(a.max_expense.toString())}`
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedApprovals, "Approval dropdown options fetched")
  );
});


export {
    registerBudget,
    getDeptBudget,
    getApprovalDropdownForBudget
}