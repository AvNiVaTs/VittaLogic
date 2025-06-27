import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Department } from "../models/department.model.js"
import { getNextSequence } from "../utils/getNextSequence.js"
import { DepartmentBudget } from "../models/departmentBudget.model.js"

const registerBudget = asyncHandler(async (req, res) => {
    const {
        departmentId,
        timePeriodFrom,
        timePeriodTo,
        allocatedAmount,
        budgetNote
    } = req.body

    if(!departmentId || !timePeriodFrom || !timePeriodTo || allocatedAmount===undefined){
        throw new ApiErr(400, "Please fill all required fields")
    }

    const dept = await Department.findById(departmentId)
    if(!dept){
        throw new ApiErr(404, "Department not found")
    }

    const budgetId = `BUDG-${(await getNextSequence("budget")).toString().padString(5, "0")}`

    const budget = await DepartmentBudget.create({
        createdBy: req.body.createdBy,
        departmentId,
        budgetId,
        timePeriodFrom,
        timePeriodTo,
        allocatedAmount,
        budgetNote
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
    const { departmentId } = req.query

    if(!departmentId){
        throw new ApiErr(400, "Department ID is required")
    }

    const budget = await Department.find({departmentId})
    .populate("departmentId", "departmentName department_id")
    .populate("createdBy", "fullname email")

    if(budget.length==0){
        throw new ApiErr(404, "No budget found for the given department")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, budget, "Department budgets fetched successfully")
    )
})

const editDeptBudget = asyncHandler(async (req, res) => {
    const {allocatedAmount, budgetNote} = req.body

    if(allocatedAmount===undefined || allocatedAmount===null){
        throw new ApiErr(400, "Amount allocation needed")
    }

    const budgetId = req.params.id || req.deptBudget?._id
    if(!budgetId){
        throw new ApiErr(400, "Budget ID not provided")
    }

    const updateBudget = await DepartmentBudget.findByIdAndUpdate(
        budgetId,
        {
            $set: {
                allocatedAmount,
                budgetNote
            }
        }, {new: true}
    )

    if(!updateBudget){
        throw new ApiErr(404, "Budget not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deptBudget, "Budget details updated")
    )
})

export {
    registerBudget,
    getDeptBudget,
    editDeptBudget
}