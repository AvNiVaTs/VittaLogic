import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {getNextSequence} from "../utils/getNextSequence.js"
import {Vendor} from "../models/vendor.model.js"

const registerVendor = asyncHandler(async (req, res) => {
    const {
        company_Name,
        company_Address,
        vendor_type,
        contactPerson,
        vendor_location,
        indianBankDetails,
        internationalBankDetails
    } = req.body

    if([company_Name, company_Address, vendor_type, contactPerson, vendor_location].some((field) => field?.trim()==="")){
        throw new ApiErr(400, "All required fields are required")
    }

    if(vendor_location==="Indian" && !indianBankDetails){
        throw new ApiErr(400, "All required Bank Details must be filled")
    }
    if(vendor_location==="International" && !internationalBankDetails){
        throw new ApiErr(400, "All required Bank Details must be filled")
    }

    const venId = `VEN-${await getNextSequence("vendor_id")}`

    const vendor = await Vendor.create({
        vendor_id: venId,
        company_Name,
        company_Address,
        vendor_type,
        contactPerson: {
            name: contactPerson.name,
            email: contactPerson.email,
            number: contactPerson.number
        },
        vendor_location,
        indianBankDetails: vendor_location==="Indian"? indianBankDetails : undefined,
        internationalBankDetails: vendor_location==="International"? internationalBankDetails : undefined,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    const createdVendor = await Vendor.findById(vendor.vendor_id)
    if(!createdVendor){
        throw new ApiErr(400, "Something went wrong while registering the Vendor")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdVendor, "Vendor successfully added to Database")
    )
})

const getAllVendor = asyncHandler(async (req, res) => {
    const vendor = await Vendor.find().sort({createdAt: -1})

    if(!vendor || vendor.length===0){
        throw new ApiErr(404, "Vendor not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, vendor, "Vendors fetched successfully")
    )
})

const updateVendor = asyncHandler(async (req, res) => {
    const {id} = req.params

    const updates = req.body
    updates.updatedBy = req.body.updatedBy

    const updatedVen = await Vendor.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    })

    if(!updatedVen){
        throw new ApiErr(404, "Vendor not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedVen, "Vendor details updated successfully")
    )
})

const deleteVendor = asyncHandler(async (req, res) => {
    const {id} = req.params

    const deleted = await Vendor.findByIdAndDelete(id)
    if(!deleted){
        throw new ApiErr(404, "Vendor not able to delete")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deleted, "Vendor deleted")
    )
})

const searchVendorById = asyncHandler(async (req, res) => {
    const {id} = req.params

    const vendor = await Vendor.find({vendor_id: id})

    if(!vendor){
        throw new ApiErr(400, "Vendor not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, vendor, "Vendor by id fetched")
    )
})

const searchVendorByName = asyncHandler(async (req, res) => {
    const {name} = req.params
    
    const vendor = await Vendor.find({company_Name: name})

    if(!vendor){
        throw new ApiErr(400, "Vendor not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, vendor, "Vendor by company name fetched")
    )
})

export {
    registerVendor,
    getAllVendor,
    updateVendor,
    deleteVendor,
    searchVendorById,
    searchVendorByName
}