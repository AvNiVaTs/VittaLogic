import {FinancialProfile} from "../models/companyFinancial.model.js" 
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {getNextSequence} from "../utils/getNextSequence.js"

const createFinancialProfile = asyncHandler(async (req, res) => {
    const {reserve_capital_cash, reserve_capital_bank} = req.body

    const finId = `FIN-${(await getNextSequence("finance_id")).toString().padStart(5, "0")}`
    const newProfile = await FinancialProfile.create({
        updated_by: req.body.updatedBy,
        created_by: req.body.createdBy,
        finance_id: finId,
        reserve_capital_cash,
        reserve_capital_bank
    })

    if(!newProfile){
        throw new ApiErr(404, "Something went wrong")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, newProfile, "Financial profile created successfully")
    )
})

const getAllFinancialProfiles = asyncHandler(async (req, res) => {
    const profile = await FinancialProfile.find().sort({createdAt: -1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, profile, "All financial profiles fetched")
    )
})

export {
    createFinancialProfile,
    getAllFinancialProfiles
}