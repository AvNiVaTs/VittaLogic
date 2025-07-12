import {FinancialAccount} from "../models/companyFinancial.model.js" 
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {getNextSequence} from "../utils/getNextSequence.js"

const createFinancialAccount = asyncHandler(async (req, res) => {
    const {
        account_type,
        account_category,
        account_name,
        parent_account_id,
        description,
        opening_balance
    } = req.body

    const accId = `ACC-${(await getNextSequence("account_id")).toString().padStart(5, "0")}`
    const newAcc = await FinancialAccount.create({
        account_id: accId,
        account_type,
        account_category,
        account_name,
        parent_account_id,
        description,
        opening_balance,
        current_balance: opening_balance,
        enteredBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    if(!newAcc){
        throw new ApiErr(400, "Something went wrong while creating account")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, newAcc, "Financial Account created successfully")
    )
})

const getFinancialAccounts = asyncHandler(async (req, res) => {
    const {search, is_active} = req.query
    const query = {}

    if(search){
        query.$or = [
            {
                account_name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                account_id: {
                    $regex: search,
                    $options: "i"
                }
            }
        ]
    }

    if(is_active==="true" || is_active==="false"){
        query.is_active = is_active==="true"
    }

    const acc = await FinancialAccount.find(query).sort({createdAt: -1})
    if(!acc){
        throw new ApiErr(404, "Account not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, acc, "Account fetched successfully")
    )
})

const updateAccountStatus = asyncHandler(async (req, res) => {
    const {accId} = req.params
    const {is_active} = req.body

    const acc = await FinancialAccount.findOne({account_id: accId})
    if(!acc){
        throw new ApiErr(404, "Account not found")
    }

    acc.is_active = is_active
    acc.updatedBy = req.body.updatedBy

    await acc.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, acc, "Account status updated successfully")
    )
})

const getAccountById = asyncHandler(async (req, res) => {
    const {accId} = req.params
    const acc = await FinancialAccount.findOne({account_id: accId})

    if(!acc){
        throw new ApiErr(404, "Account not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, acc, "Account details fetched successfully")
    )
})

export{
    createFinancialAccount,
    getFinancialAccounts,
    updateAccountStatus,
    getAccountById
}