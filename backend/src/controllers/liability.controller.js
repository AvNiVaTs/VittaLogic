import {Liability} from "../models/liability.model.js"
import {InternalTransaction} from "../models/internalTransaction.model.js"
import {FinancialAccount} from "../models/companyFinancial.model.js"
import {Vendor} from "../models/vendor.model.js"
import {Approval} from "../models/approval.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {getNextSequence} from "../utils/getNextSequence.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const calculatePaidAmount = async(liability_id) => {
    const transaction = await InternalTransaction.find({
        reference_type: "Liability",
        liability_id
    })

    return transaction.reduce((sum, tx) => sum + parseFloat(tx.amount.toString()), 0);
}

const createLiability = asyncHandler(async (req, res) => {
    const {
        liability_name,
        liability_type,
        start_date,
        due_date,
        principle_amount,
        interest_type,
        interest_rate,
        payment_terms,
        current_status,
        priority,
        liability_account,
        liability_vendor,
        approval_id
    } = req.body

    if(!liability_name || !liability_type || !start_date || !due_date || !principle_amount || !interest_type || !interest_rate || !payment_terms || !current_status || !priority || !liability_account || !liability_vendor || !approval_id){
        throw new ApiErr(400, "All required fields must be filled")
    }

    const attachmentPath = req.files?.attachment[0]?.path
    if(!attachmentPath){
        throw new ApiErr(400, "Attachment required")
    }

    const attachment = await uploadOnCloudinary(attachmentPath)
    if(!attachment){
        throw new ApiErr(400, "Attachment required")
    }

    const liaId = `LIAB-${(await getNextSequence("liability_id")).toString().padStart(5, "0")}`
    const paidAmount = await calculatePaidAmount(liaId)

    const  liability = await Liability.create({
        liability_id: liaId,
        liability_name,
        liability_type,
        start_date,
        due_date,
        principle_amount,
        paid_amount: paidAmount,
        interest_type,
        interest_rate,
        payment_terms,
        current_status,
        priority,
        liability_account,
        liability_vendor,
        attachment: attachment.url,
        approval_id,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    if(!liability){
        throw new ApiErr(404, "Something went wrong")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, liability, "Liability created successfully")
    )
})

const getAllLiabilities = asyncHandler(async (req, res) => {
    const liabilities = await Liability.find().sort({createdAt: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, liabilities, "All liabilities fetched")
    )
})

const searchLiability = asyncHandler(async (req, res) => {
    const {id, name} = req.query
    if(!id && !name){
        throw new ApiErr(400, "Provide id or name to search")
    }

    const query = id?{liability_id: id} : {liability_name: {
        $regex: name,
        $options: "i"
    }}

    const result = await Liability.find(query)
    if(!result){
        throw new ApiErr(400, "Nothing found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, result, "Found results")
    )
})

const filterLiabilities = asyncHandler(async (req, res) => {
    const {type, priority} = req.query
    if(!type && !priority){
        throw new ApiErr(400, "Provide type or priority to filter")
    }

    const filter = {}
    if(type) filter.liability_type = type
    if(priority) filter.priority = priority

    const result = await Liability.find(filter)
    if(!result){
        throw new ApiErr(400, "Nothing found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, result, "Results fetched")
    )
})

const sortByPaidAmount = asyncHandler(async (req, res) => {
    const liabilities = await Liability.find().sort({paid_amount: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, liabilities, "Sorted")
    )
})

const updateLiability = asyncHandler(async (req, res) => {
    const {id} = req.params
    const allowedUpdates = ["due_date", "interest_rate", "payment_terms", "current_status"]
    
    const updates = {}
    for(let k of allowedUpdates){
        if(req.body[k]!==undefined){
            updates[k] = req.body[k]
        }
    }
    updates.updatedBy = req.body.updatedBy

    const updated = await Liability.findOneAndUpdate({liability_id: id}, updates, {new: true})
    if(!updated){
        throw new ApiErr(404, "Liability not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updated, "Details updated successfully")
    )
})

const liabilityAccountsDropdown = asyncHandler(async (req, res) => {
    const accounts = await FinancialAccount.find({ account_type: "Liability" });

    const options = accounts.map(account => ({
        label: `${account.account_id}-${account.account_name}`,
        value: account.account_id
    }));

    return res.status(200).json(new ApiResponse(200, options, "Liability account options fetched"));
});

const liabilityVendorsDropdown = asyncHandler(async (req, res) => {
    const vendors = await Vendor.find({ vendor_type: "Liability" });

    const options = vendors.map(vendor => ({
        label: `${vendor.vendor_id}-${vendor.company_Name}`,
        value: vendor.vendor_id
    }));

    return res.status(200).json(new ApiResponse(200, options, "Liability vendor options fetched"));
});

const liabilityApprovalsDropdown = asyncHandler(async (req, res) => {
    const approvals = await Approval.find({ approvalfor: "Liability" });

    const options = approvals.map(approval => ({
        label: `${approval.approval_id}-${approval.reason}`,
        value: approval.approval_id
    }));

    return res.status(200).json(new ApiResponse(200, options, "Liability approval options fetched"));
});

export {
    createLiability,
    getAllLiabilities,
    searchLiability,
    filterLiabilities,
    sortByPaidAmount,
    updateLiability,
    liabilityAccountsDropdown,
    liabilityVendorsDropdown,
    liabilityApprovalsDropdown
}