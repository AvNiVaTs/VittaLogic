import {VendorPayments, VendorPayments} from "../models/vendorPayment.model.js"
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

    const newPayment = await VendorPayments.create({
        payment_id: payment_id,
        vendor_id,
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
    const payment = await VendorPayments.find()
    .populate("vendor_id", "company_name")
    .sort({createdAt: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment, "Vendor payments fetched")
    )
})

const getVendorPaymentById = asyncHandler(async (req, res) => {
    const {id} = req.params
    const payment = await VendorPayments.findById(id).populate("vendor_id", "company_name")

    if(!payment){
        throw new ApiErr(400, "Payment not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment, "Vendor found")
    )
})

const updateVendor = asyncHandler(async (req, res) => {
    const {id} = req.params
    const updates = req.body

    const payment = await VendorPayments.findById(id);
    if(!payment){
        throw new ApiErr(400, "Payment not found")
    }

    if(updates.payment_amount_in_vendor_currency || updates.exchangeRate){
        const amount = updates.payment_amount_in_vendor_currency ?? payment.payment_amount_in_vendor_currency
        const rate = updates.exchangeRate ?? updates.exchangeRate
        updates.payment_amount_in_indian_currency = toNumber(amount)*toNumber(rate)
    }

    updates.updatedBy = req.body.updatedBy

    const updated = await VendorPayments.findByIdAndUpdate(id, updates, {new: true})

    return res
    .status(200)
    .json(
        new ApiResponse(200, updated, "Payment updated")
    )
})

const deleteVendorPayment = asyncHandler(async (req, res) => {
    const {id} = req.params
    const deleted = await VendorPayments.findByIdAndDelete(id)

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
    const {company_Name, status, method, purpose} = req.query
    const query = {}

    if(status) query.status = status
    if(method) query.payment_method = method
    if(purpose) query.purpose = {
        $regex: purpose,
        $options: "i"
    }

    let vendorIds = []
    if(company_Name){
        const vendors = await Vendor.find(
            {
                company_Name_: {
                    $regex: company_Name,
                    $option: "i"
                }
            },
            "payment_id"
        )

        vendorIds = vendors.map(v => v.payment_id)
        query.vendor_id = {
            $in: vendorIds
        }
    }

    const payment = await VendorPayments.find(query).populate("vendor_id", "company_Name")

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment, "Vendor Payment details found")
    )
})

export {
    createVendorPayment,
    getAllVendorPayments,
    getVendorPaymentById,
    updateVendor,
    deleteVendorPayment,
    searchVendorPayment
}