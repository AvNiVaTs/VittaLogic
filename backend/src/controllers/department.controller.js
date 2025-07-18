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
        departmentDescription: description,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    //check for creation
    const createdDept = await Department.findOne({department_id: dept.department_id})
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

const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find()
    .populate({
      path: "createdBy",
      model: "Employee",
      select: "employeeName emailAddress",
      localField: "createdBy",      // Field in Department
      foreignField: "employeeId",   // Field in Employee
      justOne: true
    })
    .populate({
      path: "updatedBy",
      model: "Employee",
      select: "employeeName emailAddress",
      localField: "updatedBy",
      foreignField: "employeeId",
      justOne: true
    })
    .select("-__v");

  if (!departments || departments.length === 0) {
    throw new ApiErr(404, "No departments found");
  }

  return res.status(200).json(
    new ApiResponse(200, departments, "All departments fetched successfully")
  );
})

const getDeptEntry = asyncHandler(async (req, res) => {
    const department = await Department.findOne({ departmentId: req.employee.departmentId });

    if (!department) {
        throw new ApiErr(404, "Department not found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, department, "Current Department fetched")
    )
})

const editDeptEntry = asyncHandler(async (req, res) => {
    const {departmentId, departmentName, description} = req.body

    if(!departmentName){
        throw new ApiErr(400, "Department name required")
    }

    const dept = await Department.findOneAndUpdate(
        {department_id: departmentId},
        {
            $set: {
                departmentName,
                departmentDescription: description,
                updatedBy: req.body.updatedBy
            }
        },
        { new: true }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, dept, "Department details updated"))
})

const searchDeptByName = asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    throw new ApiErr(400, "Department name required to search");
  }

  const departments = await Department.find({
    departmentName: {
      $regex: new RegExp(name.trim(), "i") // case-insensitive search
    }
  })
    .populate({
      path: "createdBy",
      model: "Employee",
      select: "employeeName", // `fullName` is not in schema; likely meant `employeeName`
      localField: "createdBy",
      foreignField: "employeeId",
      justOne: true
    });

  if (departments.length === 0) {
    throw new ApiErr(404, "No departments found matching the search term");
  }

  return res.status(200).json(
    new ApiResponse(200, departments, "Department details fetched successfully")
  );
})

const getDeptOptions = asyncHandler(async (req, res) => {
  const usedDeptIds = await DepartmentBudget.distinct("departmentId");

  const depts = await Department.find({
    department_id: { $in: usedDeptIds }
  }, "department_id departmentName");

  const options = depts.map(dep => ({
    value: dep.department_id,
    label: `${dep.department_id} - ${dep.departmentName}`
  }));

  return res.status(200).json(
    new ApiResponse(200, options, "Departments with budget fetched successfully")
  );
});


export {
    registerDepartment,
    getAllDepartments,
    getDeptEntry,
    editDeptEntry,
    searchDeptByName,
    getDeptOptions
}