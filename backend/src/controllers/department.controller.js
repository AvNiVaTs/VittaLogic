import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Department } from "../models/department.model.js"
import { getNextSequence } from "../utils/getNextSequence.js"
import { DepartmentBudget } from "../models/departmentBudget.model.js"

const registerDepartment = asyncHandler(async (req, res) => {
    //get department details from frontend
    const {departmentName, description} = req.body

    //validation - not empty
    if(!departmentName?.trim()){
        throw new ApiErr(400, "Fill all the required fields")
    }

    //check if department already exists: departmentName
    const existedDepartment = await Department.findOne({departmentName})
    if(existedDepartment){
        throw new ApiErr(409, "Department already exists")
    }

    //create dept object - create entry in db
    const departmentId = `DEPT-${(await getNextSequence("department")).toString().padStart(5, "0")}`
    const dept = await Department.create({
        department_id: departmentId,
        departmentName,
        description,
        createdBy: req.body.createdBy
    })

    //check for creation
    const createdDept = await Department.findById(dept.department_id)
    if(!createdDept){
        throw new ApiErr(500, "Something went wrong")
    }

    //return res
    return res
    .status(200)
    .json(
        new ApiResponse(200, createdDept, "Department created successfully")
    )
})

const getDeptEntry = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(200, req.dept, "Current Department fetched")
})

const editDeptEntry = asyncHandler(async (res, reg) => {
    const {departmentName, description} = req.body

    if(!departmentName){
        throw new ApiErr(400, "Department name required")
    }

    const dept = await Department.findByIdAndUpdate(
        req.dept?.department_id,
        {
            $set: {
                departmentName,
                departmentDescription: description
            }
        },
        { new: true }
    )

    return res
    .status(200)
    .json(new ApiErr(200, dept, "Department details updated"))
})

const searchDeptByName = asyncHandler(async (req, res) => {
    const {name} = req.query

    if(!name || name.trim()===""){
        throw new ApiErr(400, "Department name required to search")
    }

    const departments = await Department.find({
        departmentName: {
            $regex: name.trim(),
            $options: "i"
        }//case-insensitive
    }).populate("createdBy", "fullName")//populate by creatorName

    if(departments.length === 0){
        throw new ApiErr(404, "No departments found matching the search term")
    }

    return res
    .status(200)
    .json(200, departments, "Department details fetched Successfully")
})

const getDeptOptions = asyncHandler(async (req, res) => {
    const usedDeptIds = await DepartmentBudget.distinct("departmentId")

    const depts = await Department.find({
        _id: {
            $in: usedDeptIds
        }
    }, "_id department_id departmentName")

    const options = depts.map(dep => ({
        value: dep._id,
        label: `${dep.departmentId} - ${dep.departName}`
    }))

    return res
    .status(200)
    .json(
        new ApiResponse(200, options, "Department with budget fetched successfully")
    )
})

export {
    registerDepartment,
    getDeptEntry,
    editDeptEntry,
    searchDeptByName,
    getDeptOptions
}