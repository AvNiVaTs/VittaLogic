import { EnteredAsset } from "../models/enteredAsset.model.js";
import { PurchaseTransaction } from "../models/purchaseTransaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const createEnteredAsset = asyncHandler(async (req, res) => {
    const {transaction_id} = req.body

    if(!transaction_id){
        throw new ApiErr(400, "transaction_id is required")
    }

    const transaction = await PurchaseTransaction.findOne({transaction_id})
    if(!transaction){
        throw new ApiErr(404, "Purchase transaction not found")
    }

    const {reference_id, purchase_amount, purchase_date, vendor_id, AssetDetails} = transaction
    if(!AssetDetails || !Array.isArray(AssetDetails) || AssetDetails.length===0){
        throw new ApiErr(400, "No Asset details found")
    }

    const createdAsset = []

    for(let asset of AssetDetails){
        if(!asset.asset_name || !asset.quantity) continue

        const costPerUnit = parseFloat(purchase_amount)/parseFloat(asset.quantity)

        const newAsset = await EnteredAsset.create({
            asset_name: asset.asset_name,
            linked_reference_id: reference_id,
            quantity: asset.quantity,
            transaction_id: transaction.transaction_id,
            total_amount: purchase_amount,
            cost_per_unit: costPerUnit,
            purchase_date,
            vendor: vendor_id
        })

        createdAsset.push(newAsset)
    }

    if(createdAsset.length===0){
        throw new ApiErr(400, "No valid asset entries could be created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, createdAsset, "Assets entered successfully")
    )
})

export {createEnteredAsset}