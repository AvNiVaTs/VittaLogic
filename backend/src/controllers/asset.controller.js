import fs from "fs"
import { Asset } from "../models/assets.model.js"
import { InternalTransaction } from "../models/internalTransaction.model.js"
import { PurchaseTransaction } from "../models/purchaseTransaction.model.js"
import { SaleTransaction } from "../models/saleTransaction.model.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { getNextSequence } from "../utils/getNextSequence.js"

// Asset
const getAssetDetailsFromPurchaseTransactionOnCard = asyncHandler(async (req, res) => {
  const purchases = await PurchaseTransaction.find({ referenceType: "Asset" });

  if (!Array.isArray(purchases) || purchases.length === 0) {
    throw new ApiErr(404, "Purchase transaction not found for assets");
  }

  const result = [];

  for (const purchase of purchases) {
    const refId = purchase.referenceId;

    // Log each referenceId being checked
    console.log("Checking referenceId:", refId);

    const linkedAsset = await Asset.findOne({
      linkedreferenceId: refId,
      assetType: { $exists: true, $ne: null, $ne: "" },
      assetSubtype: { $exists: true, $ne: null, $ne: "" },
    });

    // Log asset if found
    if (linkedAsset) {
      console.log("Skipping: asset already exists for", refId);
      continue;
    }

    // Include in result if no linked asset exists
    result.push({
      assetName: purchase.assetDetails.assetName,
      referenceId: refId,
      quantity: purchase.assetDetails.quantity,
      transactionId: purchase.transactionId,
      totalAmount: purchase.purchaseAmount,
      costPerUnit: purchase.purchaseAmount / purchase.assetDetails.quantity,
      vendorId: purchase.vendorId,
      purchaseDate: purchase.purchaseDate,
    });
  }

  return res.status(200).json(new ApiResponse(200, result, "Eligible asset purchases fetched for asset entry card"));
});

const createAssets = asyncHandler(async (req, res) => {
  const {
    referenceId,
    assetType,
    assetSubtype,
    description
  } = req.body;

  const purchase = await PurchaseTransaction.findOne({ referenceId });
  if (!purchase || purchase.referenceType !== "Asset") {
    throw new ApiErr(404, "Valid PurchaseTransaction with referenceType 'Asset' not found");
  }

  const {
    assetName,
    quantity
  } = purchase.assetDetails;

  const unitCost = purchase.purchaseAmount / quantity;

  let attachmentUrl = null;
  if (req.files?.attachment?.[0]?.path) {
    const attachmentPath = req.files.attachment[0].path;
    const attachment = await uploadOnCloudinary(attachmentPath);
    if (attachment?.url) {
      attachmentUrl = attachment.url;
    }
    if (fs.existsSync(attachmentPath)) {
      fs.unlinkSync(attachmentPath);
    }
  }

  const baseSeq = (await getNextSequence("asset_Id")).toString().padStart(5, "0");

  const assetsToCreate = [];
  for (let i = 1; i <= quantity; i++) {
    const assetId = `AST-${baseSeq}-${i}`;

    assetsToCreate.push({
      assetId,
      linkedreferenceId: referenceId,
      assetName,
      assetType,
      assetSubtype,
      vendorId: purchase.vendorId,
      purchaseCost: purchase.purchaseAmount,
      numberOfAssets: quantity,
      unitCost,
      purchaseDate: purchase.purchaseDate,
      description,
      documents: attachmentUrl,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy,
      maintenanceDetails: {},  
      disposalDetails: {},      
      depreciationDetails: {}
    });
  }

  const createdAssets = await Asset.insertMany(assetsToCreate);

  return res
    .status(201)
    .json(new ApiResponse(201, createdAssets, `${createdAssets.length} assets created successfully`));
});

const updateAssetAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  updates.updatedBy = req.body.updatedBy;

  // Auto-clear assignment fields if unassigning
  if (updates.assignmentStatus === "Unassigned") {
    updates.assignedDepartment = null;
    updates.assignedToEmployee = null;
    updates.assignedDate = null;
  }

  const asset = await Asset.findOneAndUpdate({ assetId: id }, updates, {
    new: true,
    runValidators: true,
  });

  if (!asset) throw new ApiErr(404, "Asset not found");

  return res
    .status(200)
    .json(new ApiResponse(200, asset, "Asset updated successfully"));
});

const updateAssetStatus = asyncHandler(async (req, res) => {
  const { assetId } = req.params;
  const { status, updatedBy } = req.body;

  const asset = await Asset.findOneAndUpdate(
    { assetId },
    { status, updatedBy },
    { new: true, runValidators: false } // disable validation here
  );

  if (!asset) throw new ApiErr(404, "Asset not found");

  return res.status(200).json(new ApiResponse(200, asset, "Asset status updated"));
});

const deleteAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const asset = await Asset.findOneAndDelete({ assetId: id });
  if (!asset) throw new ApiErr(404, "Asset not found");

  return res.status(200).json(new ApiResponse(200, asset, "Asset deleted successfully"));
});

const searchAsset = asyncHandler(async (req, res) => {
  const { assetId, assetName, assetType, assignmentStatus, maintenanceId, status } = req.query;
  const filter = {};

  if (assetId) filter.assetId = assetId;
  if (assetName) filter.assetName = { $regex: assetName, $options: "i" };
  if (assetType) filter.assetType = assetType;
  if (assignmentStatus) filter.assignmentStatus = assignmentStatus;
  if (status) filter.status = status;
  if (maintenanceId) filter["maintenanceDetails.maintenance_Id"] = maintenanceId;

  const assets = await Asset.find(filter);
  return res.status(200).json(new ApiResponse(200, assets, "Assets fetched successfully"));
});

// const getAssetForEditCard = asyncHandler(async (req, res) => {
//   const { assetId } = req.params;
//   const asset = await Asset.findOne({ asset_Id: assetId });
//   if (!asset) throw new ApiErr(404, "Asset not found");

//   const department = asset.assignedToDepartment
//     ? await Department.findOne({ department_Id: asset.assignedToDepartment })
//     : null;

//   const result = {
//     assetId: asset.asset_Id,
//     assetName: asset.asset_Name,
//     assetType: asset.assetType,
//     purchaseCost: asset.unitCost,
//     status: asset.status,
//     assignedToEmployee: asset.assignedToEmployee,
//     assignedToDepartment: asset.assignedToDepartment,
//     assignedToDepartmentName: department?.department_Name || null,
//   };

//   return res.status(200).json(new ApiResponse(200, result, "Asset details for edit card fetched successfully"));
// });

const getAssetListCards = asyncHandler(async (req, res) => {
  const assets = await Asset.find();

  const cards = await Promise.all(
    assets.map(async (asset) => {

      return {
        assetName: asset.assetName,
        assetId: asset.assetId,
        assetType: asset.assetType,
        status: asset.status,
        assignmentStatus: asset.assignmentStatus,
        purchaseCost: asset.unitCost,
        assignedToEmployee: asset.assignedToEmployee,
        assignedToDepartment: asset.assignedDepartment
      };
    })
  );

  return res.status(200).json(new ApiResponse(200, cards, "Asset list cards fetched"));
});

const getAssetDropdown = asyncHandler(async (req, res) => {
  const { assetType, assetSubtype, status } = req.query;

  if (!assetType) {
    throw new ApiErr(400, "assetType is required");
  }

  const forbiddenStatuses = ["Awaiting Disposal", "Disposed"];

  if (status && forbiddenStatuses.includes(status)) {
    throw new ApiErr(400, `Status '${status}' is not allowed`);
  }

  const filter = { assetType };
  if (assetSubtype) filter.assetSubtype = assetSubtype;
  if (status) filter.status = status;

  const assets = await Asset.find(filter).select("assetId assetName");

  const dropdown = assets.map(asset => ({
    value: asset.assetId,
    label: `${asset.assetId} - ${asset.assetName}`,
  }));

  return res.status(200).json(new ApiResponse(200, dropdown, "Asset dropdown fetched"));
});

// const getAssetAssignmentHistory = asyncHandler(async (req, res) => {
//   const { assetId } = req.params;

//   const asset = await Asset.findOne({ asset_Id: assetId });
//   if (!asset) throw new ApiErr(404, "Asset not found");

//   // Assuming asset.assignmentHistory is an array of assignment records
//   const assignmentHistory = asset.assignmentHistory || [];

//   return res.status(200).json(new ApiResponse(200, assignmentHistory, "Assignment history fetched"));
// });

const getAssetById = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  const asset = await Asset.findOne({ assetId });
  if (!asset) throw new ApiErr(404, "Asset not found");

  return res.status(200).json(new ApiResponse(200, asset, "Asset fetched successfully"));
});

// const getAssetTransactionHistory = asyncHandler(async (req, res) => {
//   const { assetId } = req.params;

//   // Fetch purchase, maintenance, sale transactions related to asset
//   const purchase = await PurchaseTransaction.findOne({ referenceId: assetId });
//   const sales = await SaleTransaction.find({ "assetDetails.assetId": assetId });
//   const maintenanceTxns = await InternalTransaction.find({
//     referenceType: "Maintenance / Repair",
//     "maintenanceRepairDetails.assetId": assetId,
//   });

//   const history = {
//     purchase,
//     sales,
//     maintenanceTxns,
//   };

//   return res.status(200).json(new ApiResponse(200, history, "Asset transaction history fetched"));
// });

//Asset Disposal

// const getAssetForDisposalEditCard = asyncHandler(async (req, res) => {
//   const { assetId } = req.params;
//   const asset = await Asset.findOne({ asset_Id: assetId });
//   if (!asset) throw new ApiErr(404, "Asset not found");

//   const result = {
//     assetId: asset.asset_Id,
//     assetName: asset.asset_Name,
//     assetType: asset.assetType,
//     purchaseCost: asset.unitCost,
//     status: asset.status,
//     disposalReason: asset.disposalDetails?.disposalReason || null,
//     saleAmount: asset.disposalDetails?.saleAmount || null,
//   };

//   return res.status(200).json(new ApiResponse(200, result, "Asset disposal card data fetched successfully"));
// });

const markAssetForDisposal = asyncHandler(async (req, res) => {
  const { assetId, disposalReason } = req.body;

  const asset = await Asset.findOne({ assetId });
  if (!asset) throw new ApiErr(404, "Asset not found");

  const disposalId = `DISP-${(await getNextSequence("disposal_Id")).toString().padStart(5, "0")}`;

  asset.status = "Awaiting Disposal";
  asset.disposalDetails = {
    disposalId,
    disposalReason,
    requestDate: new Date(),
    createdBy : req.body.createdBy
  };

  await asset.save();

  return res.status(200).json(new ApiResponse(200, asset, "Asset marked for disposal"));
});


const getDisposedAssetsDetails = asyncHandler(async (req, res) => {
  // Fetch all assets where status is either Awaiting Disposal or Disposed
  const assets = await Asset.find({
    status: { $in: ["Awaiting Disposal", "Disposed"] },
  });

  if (!assets || assets.length === 0) {
    throw new ApiErr(404, "No assets found with Awaiting Disposal or Disposed status");
  }

  const result = [];

  for (const asset of assets) {
    const baseData = {
      assetId: asset.assetId,
      assetName: asset.assetName,
      status: asset.status,
      assetType: asset.assetType,
      purchaseCost: asset.purchaseCost,
      createdBy: asset.createdBy,
      disposalReason: asset.disposalDetails?.disposalReason || "Not Provided",
    };

    if (asset.status === "Disposed") {
      // Fetch sale transaction details
      const sale = await SaleTransaction.findOne({
        "assetDetails.assetId": asset.assetId,
        transactionType: "Asset Sale",
      });

      if (sale) {
        // Update disposalDetails if not already saved
        if (
          !asset.disposalDetails.transactionId ||
          !asset.disposalDetails.saleAmount ||
          !asset.disposalDetails.saleDate
        ) {
          asset.disposalDetails.transactionId = sale.transactionId;
          asset.disposalDetails.saleAmount = sale.saleAmount;
          asset.disposalDetails.saleDate = sale.saleDate;
          await asset.save();
        }

        baseData.saleAmount = sale.saleAmount;
      }
    }

    result.push(baseData);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Disposed and Awaiting Disposal assets fetched successfully"));
});



const getAssetsEligibleForDisposalDropdown = asyncHandler(async (req, res) => {
  const { assetType, assetSubtype } = req.query;

  console.log("▶ HIT /asset/eligible-for-disposal");
  console.log("▶ assetType:", assetType);
  console.log("▶ assetSubtype:", assetSubtype);

  if (!assetType || !assetSubtype) {
    throw new ApiErr(400, "Asset Type and Asset Subtype are required");
  }

  const assets = await Asset.find({
    assetType,
    assetSubtype,
    status: { $nin: ["Awaiting Disposal", "Disposed"] },
  }).select("assetId assetName");

  console.log("▶ Assets found:", assets.length);

  if (!assets || assets.length === 0) {
    throw new ApiErr(404, "No eligible assets found");
  }

  const dropdown = assets.map(asset => ({
    label: `${asset.assetId} - ${asset.assetName}`,
    value: asset.assetId,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, dropdown, "Eligible assets fetched for disposal dropdown"));
});


// const getAssetDisposalList = asyncHandler(async (req, res) => {
//   const assets = await Asset.find({
//     status: "Awaiting Disposal",
//   });

//   const list = assets.map(asset => ({
//     assetId: asset.asset_Id,
//     assetName: asset.asset_Name,
//     assetType: asset.assetType,
//     purchaseCost: asset.unitCost,
//     status: asset.status,
//     disposalReason: asset.disposalDetails?.disposalReason || null,
//     saleAmount: asset.disposalDetails?.saleAmount || null,
//   }));

//   return res.status(200).json(new ApiResponse(200, list, "Assets awaiting disposal fetched"));
// });

//Asset Maintenance
const fetchMaintenanceTransactionDetails = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  const maintenanceTxn = await InternalTransaction.findOne({
    referenceType: "Maintenance / Repair",
    "maintenanceRepairDetails.assetId": assetId,
  });

  if (!maintenanceTxn) {
    throw new ApiErr(404, "No maintenance transaction found for the given asset ID");
  }

  const details = {
    transactionId: maintenanceTxn.transactionId,
    amount: maintenanceTxn.amount,
    transactionDate: maintenanceTxn.transactionDate,
    status: maintenanceTxn.status,
    maintenanceType: maintenanceTxn.maintenanceRepairDetails?.maintenanceType,
    referenceId: maintenanceTxn.maintenanceRepairDetails?.referenceId,
  };

  return res.status(200).json(new ApiResponse(200, details, "Maintenance transaction details fetched"));
});

const searchAssetsOnMaintenanceList = asyncHandler(async (req, res) => {
  const { maintenanceId, assetId, assetName, assetType, status } = req.query;
  const filter = {};

  if (maintenanceId) filter["maintenanceDetails.maintenance_Id"] = maintenanceId;
  if (assetId) filter.asset_Id = assetId;
  if (assetName) filter.asset_Name = { $regex: assetName, $options: "i" };
  if (assetType) filter.assetType = assetType;
  if (status) filter.status = status;

  const assets = await Asset.find(filter);
  return res.status(200).json(new ApiResponse(200, assets, "Assets on maintenance list fetched"));
});

const getMaintenanceHistory = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  const asset = await Asset.findOne({ asset_Id: assetId });
  if (!asset) throw new ApiErr(404, "Asset not found");

  // Sum all maintenance costs linked to this asset
  let totalMaintenanceCost = 0;

  const maintenanceDetailsWithFinancials = await Promise.all(
    asset.maintenanceDetails.map(async (md) => {
      // Find related transaction in InternalTransaction for this maintenance Id
      const txn = await InternalTransaction.findOne({
        referenceType: "Maintenance / Repair",
        "maintenanceRepairDetails.referenceId": md.maintenance_Id,
      });

      if (txn) totalMaintenanceCost += txn.amount;

      return {
        maintenanceId: md.maintenance_Id,
        maintenanceType: md.maintenanceType,
        requestType: md.requestType,
        requestStatus: md.requestStatus,
        createdAt: md.createdAt,
        serviceProvider: md.serviceProvider || null,
        serviceStartDate: md.serviceStartDate,
        serviceEndDate: md.serviceEndDate,
        maintenancePeriod:
          (new Date(md.serviceEndDate) - new Date(md.serviceStartDate)) / (1000 * 3600 * 24), // in days
        transactionId: txn?.transactionId || null,
        maintenanceCost: txn?.amount || 0,
        serviceNote: md.serviceNote || null,
      };
    })
  );

  const result = {
    assetName: asset.asset_Name,
    assetId: asset.asset_Id,
    totalMaintenanceCost,
    maintenanceDetails: maintenanceDetailsWithFinancials,
  };

  return res.status(200).json(new ApiResponse(200, result, "Maintenance history fetched"));
});

const getMaintenanceCardDetails = asyncHandler(async (req, res) => {
  const { assetId, maintenanceId } = req.query;

  if (!assetId || !maintenanceId) {
    throw new ApiErr(400, "assetId and maintenanceId are required");
  }

  const asset = await Asset.findOne({
    asset_Id: assetId,
    "maintenanceDetails.maintenance_Id": maintenanceId,
  });

  if (!asset) throw new ApiErr(404, "Maintenance details not found for given asset and maintenance ID");

  const maintenanceDetail = asset.maintenanceDetails.find(md => md.maintenance_Id === maintenanceId);

  const details = {
    assetName: asset.asset_Name,
    assetId: asset.asset_Id,
    requestType: maintenanceDetail.requestType,
    requestStatus: maintenanceDetail.requestStatus,
    serviceProvider: maintenanceDetail.serviceProvider || null,
    serviceNote: maintenanceDetail.serviceNote || null,
    status: asset.status,
    updatedBy: maintenanceDetail.updatedBy,
    serviceStartDate: maintenanceDetail.serviceStartDate,
    serviceEndDate: maintenanceDetail.serviceEndDate,
  };

  return res.status(200).json(new ApiResponse(200, details, "Maintenance card details fetched"));
});

// const getAssetMaintenanceSummary = asyncHandler(async (req, res) => {
//   const assets = await Asset.find();

//   const summary = assets.map(asset => {
//     const maintenanceCount = asset.maintenanceDetails ? asset.maintenanceDetails.length : 0;
//     return {
//       assetId: asset.asset_Id,
//       assetName: asset.asset_Name,
//       maintenanceCount,
//     };
//   });

//   return res.status(200).json(new ApiResponse(200, summary, "Maintenance summary fetched"));
// });

const syncMaintenanceStatus = asyncHandler(async (req, res) => {
  const { assetId, maintenanceType, serviceStartDate, serviceEndDate, createdBy, serviceProvider, serviceNote } = req.body;

  const asset = await Asset.findOne({ asset_Id: assetId });
  if (!asset) throw new ApiErr(404, "Asset not found");

  const maintenanceId = `MAINT-${(await getNextSequence("maintenance_Id")).toString().padStart(5, "0")}`;
  const now = new Date();

  let status = asset.status;
  let requestType = "";
  let requestStatus = "";

  if (["Maintenance Needed", "Repair Needed"].includes(maintenanceType)) {
    if (now < new Date(serviceStartDate)) {
      status = maintenanceType;
      requestType = maintenanceType === "Maintenance Needed" ? "Maintenance" : "Repair";
      requestStatus = "Requested";
    } else if (now >= new Date(serviceStartDate) && now <= new Date(serviceEndDate)) {
      status = maintenanceType === "Maintenance Needed" ? "Under Maintenance" : "Under Repair";
      requestType = maintenanceType === "Maintenance Needed" ? "Maintenance" : "Repair";
      requestStatus = "In Progress";
    } else if (now > new Date(serviceEndDate)) {
      status = "Active";
      requestType = maintenanceType === "Maintenance Needed" ? "Maintenance" : "Repair";
      requestStatus = "Completed";
    }
  }

  asset.status = status;
  asset.maintenanceDetails.push({
    maintenance_Id: maintenanceId,
    serviceStartDate,
    serviceEndDate,
    maintenanceType,
    requestType,
    requestStatus,
    createdBy: req.body.createdBy,
    updatedBy: req.body.updatedBy,
    serviceProvider,
    serviceNote,
  });

  await asset.save();
  return res.status(200).json(new ApiResponse(200, asset, "Maintenance status synced"));
});

//Asset Depreciation
// const getAssetDepreciationDetails = asyncHandler(async (req, res) => {
//   const { assetId } = req.params;

//   const asset = await Asset.findOne({ asset_Id: assetId });
//   if (!asset) throw new ApiErr(404, "Asset not found");

//   const depreciation = asset.depreciationDetails || {};

//   return res.status(200).json(new ApiResponse(200, depreciation, "Depreciation details fetched"));
// });

// const updateAssetDepreciation = asyncHandler(async (req, res) => {
//   const { assetId } = req.params;
//   const updates = req.body;

//   const asset = await Asset.findOne({ asset_Id: assetId });
//   if (!asset) throw new ApiErr(404, "Asset not found");

//   asset.depreciationDetails = { ...asset.depreciationDetails, ...updates };

//   await asset.save();

//   return res.status(200).json(new ApiResponse(200, asset.depreciationDetails, "Depreciation updated"));
// });

export {
  createAssets,
  deleteAsset,
  fetchMaintenanceTransactionDetails,
  getAssetById,
  getAssetDetailsFromPurchaseTransactionOnCard,
  // getAssetDisposalList,
  // getAssetForEditCard,
  getAssetDropdown,
  // getAssetForDisposalEditCard, 
  getAssetListCards,
  // getAssetMaintenanceSummary, 
  getAssetsEligibleForDisposalDropdown, getDisposedAssetsDetails,
  // getAssetTransactionHistory, 
  getMaintenanceCardDetails,
  getMaintenanceHistory,
  markAssetForDisposal,
  searchAsset,
  searchAssetsOnMaintenanceList,
  syncMaintenanceStatus,
  updateAssetAssignment,
  updateAssetStatus
}

