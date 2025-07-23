// Imports
import { Asset } from "../models/assets.model.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { getNextSequence } from "../utils/getNextSequence.js"

// 1. CREATE DEPRECIATION ENTRY
const createDepreciation = asyncHandler(async (req, res) => {
  const {
    assetId,
    depreciationMethod,
    depreciationRate,
    usefulLifeYears,
    totalUnitsProduced,
    unitsUsedThisYear,
    depreciationStartDate,
    notes
  } = req.body;

  const asset = await Asset.findOne({ assetId });
  if (!asset) throw new ApiErr(404, "Asset not found");

  const cost = asset.unitCost;
  const salvageValue = asset.salvageValue || 0;
  const usefulLife = usefulLifeYears || asset.usefulLifeYears;

  if (!usefulLife) {
    throw new ApiErr(400, "Useful life is required if not already defined");
  }

  if (depreciationMethod === "Written Down Method" && !depreciationRate) {
    throw new ApiErr(400, "Depreciation rate is required for Written Down Method");
  }

  if (
    depreciationMethod === "Units of Production Method" &&
    (!totalUnitsProduced || !unitsUsedThisYear)
  ) {
    throw new ApiErr(400, "Total units produced and units used this year are required for Units of Production Method");
  }

  const depreciationId = `DEP-${(await getNextSequence("depreciation_Id")).toString().padStart(5, "0")}`;

  let annualDepreciation = 0;

  switch (depreciationMethod) {
    case "Straight Line Method":
      annualDepreciation = (cost - salvageValue) / usefulLife;
      break;

    case "Written Down Method":
      annualDepreciation = cost * (depreciationRate / 100);
      break;

    case "Double Declining Method":
      annualDepreciation = cost * (2 / usefulLife);
      break;

    case "Units of Production Method":
      const perUnitCost = (cost - salvageValue) / totalUnitsProduced;
      annualDepreciation = perUnitCost * unitsUsedThisYear;
      break;

    case "Sum-of-the-Years Digits Method":
      const syd = (usefulLife * (usefulLife + 1)) / 2;
      const year = 1; // Assuming year 1 for now
      annualDepreciation = ((usefulLife - year + 1) / syd) * (cost - salvageValue);
      break;

    default:
      throw new ApiErr(400, "Unsupported depreciation method");
  }

  const bookValue = cost - annualDepreciation;
  const depreciationPercent = ((cost - bookValue) / cost) * 100;

  const depreciationData = {
    depreciationId,
    depreciationMethod,
    depreciationStartDate: depreciationStartDate || new Date(),
    salvageValue,
    usefulLifeYears: usefulLife,
    depreciationRate: depreciationMethod === "Written Down Method" ? depreciationRate : undefined,
    totalExpectedUnits: depreciationMethod === "Units of Production Method" ? totalUnitsProduced : undefined,
    actualUnitsUsed: depreciationMethod === "Units of Production Method" ? unitsUsedThisYear : undefined,
    annualDepreciation: parseFloat(annualDepreciation.toFixed(2)),
    currentBookValue: parseFloat(bookValue.toFixed(2)),
    depreciatedPercentage: parseFloat(depreciationPercent.toFixed(2)),
    notes: notes || "",
    createdBy: req.body.createdBy
  };

  asset.depreciationDetails = depreciationData;
  await asset.save();

  return res.status(201).json(new ApiResponse(201, asset, "Depreciation entry created successfully"));
});

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
    value: asset.assetId,
    label: `${asset.assetId} - ${asset.assetName}`
  }))

  return res
    .status(200)
    .json(new ApiResponse(200, dropdown, "Assets fetched for dropdown"))
})

// 3. GET DEPRECIATION TRACKING CARD DETAILS
const getDepreciationTrackingDetails = asyncHandler(async (req, res) => {
  // Find all assets where a depreciation method is set
  const assets = await Asset.find({ 
    "depreciationDetails.depreciationMethod": { $exists: true, $ne: null }
  });

  if (!assets.length) throw new ApiErr(404, "No depreciating assets found");

  const detailsList = assets.map(asset => {
    const dep = asset.depreciationDetails;

    const details = {
      assetName: asset.assetName,
      assetId: asset.assetId,
      assetType: asset.assetType,
      depreciationMethod: dep.depreciationMethod,
      purchaseCost: asset.unitCost,
      bookValue: dep.currentBookValue,
      annualDepreciation: dep.annualDepreciation,
      enteredBy: dep.createdBy,
      depreciationPercent: dep.depreciatedPercentage,
      notes: dep.notes || ""
    };

    if (dep.depreciationMethod === "Units of Production Method") {
      details.totalUnitsProduced = dep.totalExpectedUnits;
      details.unitsUsedThisYear = dep.actualUnitsUsed;
    }

    return details;
  });

  return res.status(200).json(
    new ApiResponse(200, detailsList, "Depreciation tracking details fetched successfully")
  );
});



// Export
export {
  createDepreciation,
  getAssetDropdownByType,
  getDepreciationTrackingDetails
}

