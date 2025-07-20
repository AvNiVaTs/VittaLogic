// Imports
import { Asset } from "../models/assets.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { getNextSequence } from "../utils/getNextSequence.js"

// 1. CREATE DEPRECIATION ENTRY
const createDepreciation = asyncHandler(async (req, res) => {
  const {
    assetId,
    depreciationMethod,
    usefulLifeYears,
    totalUnitsProduced,
    unitsUsedThisYear
  } = req.body

  const asset = await Asset.findOne({ asset_Id: assetId })
  if (!asset) throw new ApiErr(404, "Asset not found")

  const purchaseCost = asset.purchaseCost
  const salvageValue = asset.salvageValue || 0
  const usefulLife = usefulLifeYears || asset.usefulLifeYears
  const existingDepreciations = asset.depreciationDetails || []

  const depreciationId = `DEP-${(await getNextSequence("depreciation_Id")).toString().padStart(5, "0")}`;

  let annualDepreciation = 0
  let bookValue = 0
  let depreciationPercent = 0

  switch (depreciationMethod) {
    case "Straight Line": {
      annualDepreciation = (purchaseCost - salvageValue) / usefulLife
      bookValue = purchaseCost - annualDepreciation * (existingDepreciations.length + 1)
      break
    }
    case "Written Down": {
      bookValue = purchaseCost
      for (let i = 0; i <= existingDepreciations.length; i++) {
        annualDepreciation = bookValue * (1 - Math.pow(salvageValue / purchaseCost, 1 / usefulLife))
        bookValue -= annualDepreciation
      }
      break
    }
    case "Double Declining": {
      const rate = 2 / usefulLife
      bookValue = purchaseCost
      for (let i = 0; i <= existingDepreciations.length; i++) {
        annualDepreciation = bookValue * rate
        bookValue -= annualDepreciation
      }
      break
    }
    case "Units of Production": {
      if (!totalUnitsProduced || !unitsUsedThisYear) {
        throw new ApiErr(400, "Total units produced and units used this year are required for Units of Production method")
      }
      const perUnit = (purchaseCost - salvageValue) / totalUnitsProduced
      annualDepreciation = perUnit * unitsUsedThisYear
      bookValue = purchaseCost - existingDepreciations.reduce((acc, cur) => acc + cur.annualDepreciation, 0) - annualDepreciation
      break
    }
    case "SYD": {
      const syd = (usefulLife * (usefulLife + 1)) / 2
      const n = existingDepreciations.length + 1
      annualDepreciation = ((usefulLife - n + 1) / syd) * (purchaseCost - salvageValue)
      bookValue = purchaseCost - existingDepreciations.reduce((acc, cur) => acc + cur.annualDepreciation, 0) - annualDepreciation
      break
    }
    default:
      throw new ApiErr(400, "Unsupported depreciation method")
  }

  depreciationPercent = ((purchaseCost - bookValue) / purchaseCost) * 100

  const depreciationData = {
    depreciationId,
    depreciationMethod,
    annualDepreciation: parseFloat(annualDepreciation.toFixed(2)),
    bookValue: parseFloat(bookValue.toFixed(2)),
    depreciationPercent: parseFloat(depreciationPercent.toFixed(2)),
    createdBy: req.body.createdBy
  }

  if (depreciationMethod === "Units of Production") {
    depreciationData.totalUnitsProduced = totalUnitsProduced
    depreciationData.unitsUsedThisYear = unitsUsedThisYear
  }

  asset.depreciationDetails.push(depreciationData)
  await asset.save()

  return res.status(201).json(new ApiResponse(201, asset, "Depreciation entry created successfully"))
})

// 2. GET ASSET DROPDOWN BY TYPE (Asset Id - Asset Name)
const getAssetDropdownByType = asyncHandler(async (req, res) => {
  const { assetType } = req.query

  if (!assetType) {
    throw new ApiErr(400, "Asset type is required")
  }

  const assets = await Asset.find({
    assetType,
    status: { $nin: ["Awaiting Disposal", "Disposed"] }
  })

  const dropdown = assets.map(asset => ({
    value: asset.asset_Id,
    label: `${asset.asset_Id} - ${asset.asset_Name}`
  }))

  return res
    .status(200)
    .json(new ApiResponse(200, dropdown, "Assets fetched for dropdown"))
})

// 3. GET DEPRECIATION TRACKING CARD DETAILS
const getDepreciationTrackingDetails = asyncHandler(async (req, res) => {
  const { assetId } = req.params

  const asset = await Asset.findOne({ asset_Id: assetId })
  if (!asset) throw new ApiErr(404, "Asset not found")

  const lastDep = asset.depreciationDetails?.[asset.depreciationDetails.length - 1]
  if (!lastDep) throw new ApiErr(404, "No depreciation record found for this asset")

  const details = {
    assetName: asset.asset_Name,
    assetId: asset.asset_Id,
    assetType: asset.assetType,
    depreciationMethod: lastDep.depreciationMethod,
    purchaseCost: asset.unitCost,
    bookValue: lastDep.bookValue,
    annualDepreciation: lastDep.annualDepreciation,
    enteredBy: lastDep.createdBy,
    depreciationPercent: lastDep.depreciationPercent,
    notes: lastDep.notes || ""
  }

  if (lastDep.depreciationMethod === "Units of Production") {
    details.totalUnitsProduced = lastDep.totalUnitsProduced
    details.unitsUsedThisYear = lastDep.unitsUsedThisYear
  }

  return res
    .status(200)
    .json(new ApiResponse(200, details, "Depreciation tracking details fetched successfully"))
})


// Export
export {
  createDepreciation,
  getAssetDropdownByType,
  getDepreciationTrackingDetails
}