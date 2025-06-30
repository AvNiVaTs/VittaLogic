import {VendorPayment} from "../models/vendorPayment.model.js"
import {Vendor} from "../models/vendor.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {getNextSequence} from "../utils/getNextSequence.js"

const toNumber = (decimal) => parseFloat(decimal?.toString() || 0)

const createVendorPayment = asyncHandler(async (req, res) => {
    const {
        vendor_id,
        payment_amount_in_vendor_currency,
        exchangeRate,
        due_date,
        purpose,
        payment_method,
        status
    } = req.body

    if(!vendor_id || !payment_amount_in_vendor_currency || !exchangeRate || !due_date || !purpose || !payment_method){
        throw new ApiErr(400, "Fill all required fields")
    }

    const vendorExists = await Vendor.findById(vendor_id)
    if(!vendorExists){
        throw new ApiErr(404, "Vendor not found");
    }

    const payment_id = `VEN_PAY-${await getNextSequence("payment_id")}`
    const indianAmount = toNumber(payment_amount_in_vendor_currency)*toNumber(exchangeRate)

    const newPayment = await VendorPayment.create({
        payment_id: payment_id,
        vendor_id,
        currency: vendorExists.currency,
        payment_amount_in_vendor_currency,
        exchangeRate,
        payment_amount_in_indian_currency: indianAmount,
        due_date,
        purpose,
        payment_method,
        status,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, newPayment, "Vendor payment created")
    )
})

const getAllVendorPayments = asyncHandler(async (req, res) => {
    const payment = await VendorPayment.find()
    .populate("vendor_id", "company_Name")
    .sort({createdAt: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment, "Vendor payments fetched")
    )
})

const getVendorPaymentById = asyncHandler(async (req, res) => {
    const {id} = req.params
    const payment = await VendorPayment.findById(id).populate("vendor_id", "company_Name vendor_id")

    if(!payment){
        throw new ApiErr(400, "Payment not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment, "Vendor found")
    )
})

const updateVendorPayment = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {due_date, status} = req.body

    const payment = await VendorPayment.findById(id);
    if(!payment){
        throw new ApiErr(400, "Payment not found")
    }

    const updates = {}

    if(due_date) updates.due_date = due_date
    if(status) updates.status = status
    updates.updatedBy = req.body.updatedBy

    const updated = await VendorPayment.findByIdAndUpdate(id, updates, {new: true})

    return res
    .status(200)
    .json(
        new ApiResponse(200, updated, "Payment updated")
    )
})

const deleteVendorPayment = asyncHandler(async (req, res) => {
    const {id} = req.params
    const deleted = await VendorPayment.findByIdAndDelete(id)

    if(!deleted){
        throw new ApiErr(400, "Something went wrong")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deleted, "Payment deleted")
    )
})

const searchVendorPayment = asyncHandler(async (req, res)=>{
    const {company_Name, vendor_id, payment_id, status} = req.query
    const query = {}

    if(status) query.status = status
    if(payment_id) query.payment_id = payment_id.trim()
    if(vendor_id) query.vendor_id = vendor_id

    if(company_Name){
        const vendors = await Vendor.find(
            {
                company_Name: {
                    $regex: company_Name,
                    $option: "i"
                }
            },
            "vendor_id"
        )

        const vendorIds = vendors.map(v => v.payment_id)
        
        if(vendorIds.length>0){
            query.vendor_id = {
                $in: vendorIds
            }
        }else{
            return res.status(200).json(
                new ApiResponse(200, [], "No vendor payment found for given company name")
            )
        }
    }

    const payment = await VendorPayment.find(query).populate("vendor_id", "company_Name vendor_id")

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment, "Vendor Payment details found")
    )
})

const getVendorsForDropDown = asyncHandler(async (req, res) => {
    const vendors = await Vendor.find({}, "vendor_id company_Name")

    const formatted = vendors.map(vendor=>({
        value: vendor.vendor_id,
        label: `${vendor.vendor_id}-${vendor.company_Name}`
    }))

    return res
    .status(200)
    .json(
        new ApiResponse(200, formatted, "Vendor dropdown data fetched")
    )
})

export {
    createVendorPayment,
    getAllVendorPayments,
    getVendorPaymentById,
    updateVendorPayment,
    deleteVendorPayment,
    searchVendorPayment,
    getVendorsForDropDown
}