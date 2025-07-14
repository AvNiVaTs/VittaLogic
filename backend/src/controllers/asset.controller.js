// import { Asset } from "../models/assets.model.js"
// import { EnteredAsset } from "../models/enteredAsset.model.js"
// import { Department } from "../models/department.model.js"
// import { Employee } from "../models/employee.model.js"
// import { getNextSequence } from "../utils/getNextSequence.js"
// import { asyncHandler } from "../utils/asyncHandler.js"
// import { ApiErr } from "../utils/ApiError.js"
// import { ApiResponse } from "../utils/ApiResponse.js"

// const createAssetFromEnteredAsset = asyncHandler(async (req, res) => {
//     const { enteredAssetId, assetType, assetSubType, description, documents } = req.body

//     if(!enteredAssetId || !assetType || !assetSubType){
//         throw new ApiErr(400, "Required fields are missing")
//     }

//     const ea = await EnteredAsset.findById(enteredAssetId)
//     if(!ea){
//         throw new ApiErr(404, "Asset not found")
//     }

//     const quantity = parseInt(ea.quantity)
//     if(!quantity || quantity<1){
//         throw new ApiErr(400, "Invalid quantity entered")
//     }

//     const attachmentPath = req.files?.attachment[0]?.path
//     if(!attachmentPath){
//         throw new ApiErr(400, "Attachment required")
//     }

//     const attachment = await uploadOnCloudinary(attachmentPath)
//     if(!attachment){
//         throw new ApiErr(400, "Attachment required")
//     }

//     const id = `AST-${(await getNextSequence("asset_id")).toString().padStart(5, "0")}`

//     const createdAssets = []
//     for(let i=1; i<=quantity; i++){
//         const asset = await Asset.create({
//             assetId: `${id}-${i}`,
//             linked_reference_id: ea.linked_reference_id,
//             assetName: ea.asset_name,
//             assetType,
//             assetSubType,
//             assignedStatus: "Unassigned",
//             status: "Active",
//             purchaseFrom: ea.vendor,
//             purchaseDate: ea.purchase_date,
//             purchaseCost: ea.cost_per_unit,
//             numberOfAssets: ea.quantity,
//             description,
//             documents: attachment.url,
//             enteredBy: req.body.createdBy,
//             updatedBy: req.body.updatedBy
//         })
//         createdAssets.push(asset)
//     }

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, createdAssets, "Assets created successfully")
//     )
// })

// const assignedAsset = asyncHandler(async (req, res) => {
//     const { assetId, assignedToDepartment, assignedTo } = req.body

//     const asset = await Asset.findOne({assetId})
//     if(!asset){
//         throw new ApiErr(404, "Asset not found")
//     }

//     asset.assignedStatus = "Assigned"
//     asset.assignedToDepartment = assignedToDepartment,
//     asset.assignedTo = assignedTo
//     await asset.save()

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, asset, "Asset assigned successfully")
//     )
// })

// const unassignedAsset = asyncHandler(async (req, res) => {
//     const {assetId} = req.body

//     const asset = await Asset.findOne({assetId})
//     if(!asset){
//         throw new ApiErr(404, "Asset not found")
//     }

//     asset.assignedStatus = "Unassigned"
//     asset.assignedTo = null
//     asset.assignedToDepartment = null
//     await asset.save()

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, asset, "Asset Unassigned")
//     )
// })

// const filterAssets = asyncHandler(async (req, res) => {
//     const {status, assignedStatus} = req.query

//     const query = {}
//     if(status) query.status = status
//     if(assignedStatus) query.assignedStatus = assignedStatus

//     const assets = await Asset.find(query).sort({createdAt: -1})

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, assets, "Assets filtered")
//     )
// })

// const searchAssets = asyncHandler(async (req, res) => {
//     const {assetId, assetName} = req.query

//     let query = {}
//     if(assetId) query.assetId = {$regex: assetId, $options: "i"}
//     if(assetName) query.assetName = {$regex: assetName, $options: "i"}

//     const result = await Asset.find(query)

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, result, "Asset searched")
//     )
// })

// const getDepartments = asyncHandler(async (req, res) => {
//     const department = await Department.find()

//     if(!department || department.length===0){
//         return res.status(200).json(
//             new ApiResponse(200, [], "No department found")
//         )
//     }

//     const options = department.map(d => ({
//         label: d.departmentName,
//         value: d.department_id
//     }))

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, options)
//     )
// })

// const getEmployeesByDepartment = asyncHandler(async (req, res) =>{
//     const {departmentId} = req.query
//     if(!departmentId){
//         throw new ApiErr(400, "DepartmentId required")
//     }

//     const employee = await Employee.find({department: departmentId})
//     if(!employee || employee.length===0){
//         return res.status(200).json(
//             new ApiResponse(200, [], "No employee found in this department")
//         )
//     }
//     const options = employee.map(emp => ({
//         label: `${emp.employeeId}-${emp.employeeName}`,
//         value: emp.employeeId
//     }))

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, options)
//     )
// })

// export {
//     createAssetFromEnteredAsset,
//     assignedAsset,
//     unassignedAsset,
//     filterAssets,
//     searchAssets,
//     getDepartments,
//     getEmployeesByDepartment
// }