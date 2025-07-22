import { Approval } from "../models/approval.model.js";
import { FinancialAccount } from "../models/companyFinancial.model.js";
import { Department } from "../models/department.model.js";
import { PurchaseTransaction } from "../models/purchaseTransaction.model.js";
import { Vendor } from "../models/vendor.model.js";
import { VendorPayment } from "../models/vendorPayment.model.js";
import { ApiErr } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getNextSequence } from "../utils/getNextSequence.js";

const createPurchaseTransaction = asyncHandler(async (req, res) => {
  const {
    departmentWhoPurchased,
    purchaseDate,
    vendorType,
    vendorId,
    paymentId,
    approvalId,
    referenceType,
    assetDetails,
    serviceDetails,
    purchaseAmount,
    transactionType,
    transactionMode,
    transactionSubmode,
    debitAccount,
    creditAccount,
    status,
    narration,
    createdBy,
  } = req.body;

  if (debitAccount === "NA" && creditAccount === "NA") {
    throw new ApiErr(400, "Both Debit and Credit accounts cannot be NA");
  }

  // ✅ Vendor check
  const vendor = await Vendor.findOne({ vendor_id: vendorId });
  if (!vendor) throw new ApiErr(404, "Vendor not found");

  if (!vendor.vendor_type.includes(vendorType)) {
    throw new ApiErr(400, `Vendor type mismatch: Vendor does not belong to type '${vendorType}'`);
  }

  // ✅ VendorPayment check
  const vendorPayment = await VendorPayment.findOne({ payment_id: paymentId });
  if (!vendorPayment) throw new ApiErr(404, "Vendor Payment not found");

  if (vendorPayment.vendor_id !== vendorId) {
    throw new ApiErr(400, "Vendor Payment is not associated with the selected Vendor");
  }

  // ✅ Approval check
  const approval = await Approval.findOne({ approval_id: approvalId });
  if (!approval) throw new ApiErr(404, "Approval not found");

  if (approval.approvalfor !== "Vendor Payment") {
    throw new ApiErr(400, `Approval is not applicable for 'Vendor Payment'. Found: '${approval.approvalfor}'`);
  }

  // ✅ Parse and validate assetDetails or serviceDetails
  let cleanAssetDetails = null;
  let cleanServiceDetails = null;

  if (referenceType === "Asset") {
    let parsedAssetDetails = assetDetails;

    if (!parsedAssetDetails) {
      throw new ApiErr(400, "Missing assetDetails for referenceType 'Asset'");
    }

    if (typeof parsedAssetDetails === "string") {
      try {
        parsedAssetDetails = JSON.parse(parsedAssetDetails);
      } catch (err) {
        throw new ApiErr(400, "Invalid JSON in assetDetails");
      }
    }

    if (!parsedAssetDetails?.assetName && !parsedAssetDetails?.name) {
      throw new ApiErr(400, "Missing assetName in assetDetails");
    }

    cleanAssetDetails = {
      assetName: parsedAssetDetails.assetName || parsedAssetDetails.name,
      quantity: Number(parsedAssetDetails.quantity),
    };
  }

  if (referenceType === "Service") {
    let parsedServiceDetails = serviceDetails;

    if (!parsedServiceDetails) {
      throw new ApiErr(400, "Missing serviceDetails for referenceType 'Service'");
    }

    if (typeof parsedServiceDetails === "string") {
      try {
        parsedServiceDetails = JSON.parse(parsedServiceDetails);
      } catch (err) {
        throw new ApiErr(400, "Invalid JSON in serviceDetails");
      }
    }

    // ✅ Force single service detail into array (for future extensibility)
    if (!Array.isArray(parsedServiceDetails)) {
      parsedServiceDetails = [parsedServiceDetails];
    }

    parsedServiceDetails.forEach((service) => {
      if (!service?.serviceName) {
        throw new ApiErr(400, "Missing serviceName in serviceDetails");
      }
      if (typeof service.serviceDurationMonths !== "number") {
        throw new ApiErr(400, "Invalid or missing serviceDurationMonths in serviceDetails");
      }
    });

    cleanServiceDetails = parsedServiceDetails;
  }

  // ✅ Handle attachment upload
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

  // ✅ Generate IDs
  const transactionId = `PUR_TXN-${(await getNextSequence("purchase_transaction"))
    .toString()
    .padStart(5, "0")}`;
  const referenceId = `REF-${(await getNextSequence("transaction"))
    .toString()
    .padStart(5, "0")}`;

  // ✅ Create transaction
  const transaction = await PurchaseTransaction.create({
    transactionId,
    referenceId,
    enteredBy: createdBy,
    departmentWhoPurchased,
    purchaseDate,
    vendorType,
    vendorId,
    paymentId,
    approvalId,
    referenceType,
    assetDetails: cleanAssetDetails,
    serviceDetails: cleanServiceDetails,
    purchaseAmount,
    transactionType,
    transactionMode,
    transactionSubmode,
    debitAccount,
    creditAccount,
    status,
    narration,
    attachments: attachmentUrl,
  });

  // ✅ Update vendorPayment paid amount
  if (purchaseAmount > 0) {
    const currentPaid = parseFloat(vendorPayment.paid_amount || 0);
    const newPaidAmount = currentPaid + parseFloat(purchaseAmount || 0);
    vendorPayment.paid_amount = newPaidAmount;

    if (newPaidAmount >= parseFloat(vendorPayment.payment_amount_in_indian_currency)) {
      vendorPayment.status = "Completed";
    }

    await vendorPayment.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, transaction, "Purchase Transaction created successfully"));
});



const getDepartmentsForDropdown = asyncHandler(async (req, res) => {
  const departments = await Department.find({}, "department_id departmentName");

  const formatted = departments.map((dept) => ({
    value: dept.department_id,
    label: `${dept.department_id}-${dept.departmentName}`,
  }));

  return res.status(200).json(
    new ApiResponse(200, formatted, "Departments dropdown data fetched")
  );
});

const getVendorsByTypeForDropdown = asyncHandler(async (req, res) => {
  const { vendorType } = req.query;
  if (!vendorType) throw new ApiErr(400, "Vendor type is required");

  const vendors = await Vendor.find({ vendor_type: vendorType }, "vendor_id company_Name");

  const formatted = vendors.map((vendor) => ({
    value: vendor.vendor_id,
    label: `${vendor.vendor_id}-${vendor.company_Name}`,
  }));

  return res.status(200).json(
    new ApiResponse(200, formatted, "Vendors dropdown data fetched")
  );
});

const getVendorPaymentsForDropdown = asyncHandler(async (req, res) => {
  const { vendorId } = req.query;
  if (!vendorId) throw new ApiErr(400, "Vendor ID is required");

  const payments = await VendorPayment.find(
    { vendor_id: vendorId, status: { $ne: "Completed" } },
    "payment_id payment_amount_in_indian_currency paid_amount"
  );

  const formatted = payments.map((pay) => {
    const remaining = parseFloat(pay.payment_amount_in_indian_currency) - parseFloat(pay.paid_amount);
    const remainingAmount = remaining < 0 ? 0 : remaining;
    return {
      value: pay.payment_id,
      label: `${pay.payment_id} (₹${remainingAmount})`,
    };
  });

  return res.status(200).json(
    new ApiResponse(200, formatted, "Vendor payment dropdown data fetched")
  );
});

const getApprovedApprovalsForDropdown = asyncHandler(async (req, res) => {
  const approvals = await Approval.find(
    { status: "Approved", approvalfor: "Vendor Payment" },
    "approval_id reason"
  );

  const formatted = approvals.map((appr) => ({
    value: appr.approval_id,
    label: `${appr.approval_id}-${appr.reason}`,
  }));

  return res.status(200).json(
    new ApiResponse(200, formatted, "Approved approvals dropdown data fetched")
  );
});

const getFinancialDebitAccountDropdown = asyncHandler(async (req, res) => {
  const debitAccounts = await FinancialAccount.find(
    { account_category: "Debit Account" },
    "account_id account_name"
  );

  const formatAccounts = (accounts) => [
    ...accounts.map((acc) => ({
      value: acc.account_id,
      label: `${acc.account_id}-${acc.account_name}`,
    })),
  ];

  return res.status(200).json(
    new ApiResponse(200, {
      debitAccounts: formatAccounts(debitAccounts)
    }, "Financial accounts dropdown data fetched")
  );
});

const getFinancialCreditAccountDropdown = asyncHandler(async (req, res) => {
  const creditAccounts = await FinancialAccount.find(
    { account_category: "Credit Account" },
    "account_id account_name"
  );

  const formatAccounts = (accounts) => [
    ...accounts.map((acc) => ({
      value: acc.account_id,
      label: `${acc.account_id}-${acc.account_name}`,
    })),
  ];

  return res.status(200).json(
    new ApiResponse(200, {
      creditAccounts: formatAccounts(creditAccounts)
    }, "Financial accounts dropdown data fetched")
  );
});

export {
  createPurchaseTransaction, getApprovedApprovalsForDropdown, getDepartmentsForDropdown, getFinancialCreditAccountDropdown, getFinancialDebitAccountDropdown, getVendorPaymentsForDropdown, getVendorsByTypeForDropdown
};

