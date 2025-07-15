import { SaleTransaction } from "../models/saleTransaction.model.js";
import { Customer } from "../models/customer.model.js";
import { CustomerPayment } from "../models/customerPayment.model.js";
import { Approval } from "../models/approval.model.js";
import { Asset } from "../models/assets.model.js";
import { FinancialAccount } from "../models/companyFinancial.model.js";

import { getNextSequence } from "../utils/getNextSequence.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErr } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Sale Transaction
const createSaleTransaction = asyncHandler(async (req, res) => {
  const {
    saleDate,
    customerType,
    customerId,
    paymentId,
    approvalId,
    saleName,
    saleAmount,
    transactionType,
    assetDetails,
    transactionMode,
    transactionSubmode,
    debitAccount,
    creditAccount,
    narration,
    attachments,
    status
  } = req.body;

  const transactionId = `SAL-${await getNextSequence("saleTransaction")}`;
  const referenceId = `REF-${await getNextSequence("referenceId")}`;

  if (debitAccount === "NA" && creditAccount === "NA") {
    throw new ApiErr(400, "Only one of Debit or Credit account can be N/A");
  }

  if (transactionType === "Asset Sale" && !assetDetails?.assetId) {
    throw new ApiErr(400, "Asset details are required for Asset Sale");
  }

  const saleTransaction = await SaleTransaction.create({
    transactionId,
    referenceId,
    enteredBy: req.body.createdBy,
    saleDate,
    customerType,
    customerId,
    paymentId,
    approvalId,
    saleName,
    saleAmount,
    transactionType,
    assetDetails,
    transactionMode,
    transactionSubmode,
    debitAccount,
    creditAccount,
    narration,
    attachments,
    status
  });

  // Update Paid Amount in CustomerPayment
  if (saleAmount > 0 && paymentId) {
    const customerPayment = await CustomerPayment.findById(paymentId);
    if (!customerPayment) {
      throw new ApiErr(404, "Linked customer payment not found");
    }
    customerPayment.paid_amount += saleAmount;
    await customerPayment.save();
  }

  // Mark asset as Disposed if Asset Sale and Completed
  if (
    transactionType === "Asset Sale" &&
    assetDetails?.assetId &&
    status === "Completed"
  ) {
    await Asset.findOneAndUpdate(
      { assetId: assetDetails.assetId },
      { assetStatus: "Disposed" }
    );
  }

  return res.status(201).json(
    new ApiResponse(201, saleTransaction, "Sale transaction created successfully")
  );
});

// Mark Sale Transaction as Completed
const completeSaleTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const saleTransaction = await SaleTransaction.findOne({transactionId: id});
  if (!saleTransaction) throw new ApiErr(404, "Sale transaction not found");

  saleTransaction.status = "Completed";
  await saleTransaction.save();

  await CustomerPayment.findOneAndUpdate({paymentId: saleTransaction.paymentId}, {
    status: "Completed"
  });

  if (saleTransaction.transactionType === "Asset Sale" && saleTransaction.assetDetails?.assetId) {
    await Asset.findOneAndUpdate(
      { assetId: saleTransaction.assetDetails.assetId },
      { assetStatus: "Disposed" }
    );
  }

  return res.status(200).json(
    new ApiResponse(200, saleTransaction, "Sale transaction marked as completed")
  );
});

// Dropdown Controllers
const getCustomersByType = asyncHandler(async (req, res) => {
  const { customerType } = req.query;
  const customers = await Customer.find({ customerType });
  const options = customers.map(c => ({
    label: `${c.customer_Id} - ${c.company_Name}`,
    value: c.customer_Id
  }));
  return res.status(200).json(new ApiResponse(200, options, "Customers fetched"));
});

const getPendingPaymentsByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.query;
  const payments = await CustomerPayment.find({
    customerId,
    status: { $ne: "Completed" }
  });
  const options = payments.map(p => ({
    label: `${p.paymentId} - (₹${p.paymentAmount} - ₹${p.paid_amount})`,
    value: p.paymentId
  }));
  return res.status(200).json(new ApiResponse(200, options, "Payments fetched"));
});

const getApprovedCustomerPaymentApprovals = asyncHandler(async (req, res) => {
  const approvals = await Approval.find({
    approvalFor: "Customer Payment",
    approvalStatus: "Approved"
  });
  const options = approvals.map(a => ({
    label: `${a.approval_id} - ${a.reason}`,
    value: a.approval_id
  }));
  return res.status(200).json(new ApiResponse(200, options, "Approvals fetched"));
});

const getAssetsForAssetSale = asyncHandler(async (req, res) => {
  const { assetType } = req.query;
  const assets = await Asset.find({ assetType, assetStatus: "Awaiting Disposal" });
  const options = assets.map(a => ({
    label: `${a.assetId} - ${a.assetName}`,
    value: a.assetId
  }));
  return res.status(200).json(new ApiResponse(200, options, "Assets fetched"));
});

const getAssetDetailsById = asyncHandler(async (req, res) => {
  const { assetId } = req.query;
  const asset = await Asset.findOne({ assetId });
  if (!asset) throw new ApiErr(404, "Asset not found");

  return res.status(200).json(
    new ApiResponse(200, {
      assetName: asset.assetName,
      assetStatus: asset.assetStatus,
      disposalId: asset.disposalDetails?.disposalId || null
    }, "Asset details fetched")
  );
});

const getDebitAccounts = asyncHandler(async (req, res) => {
  const accounts = await FinancialAccount.find({ account_category: "Debit Account" });
  const options = [
    { label: "N/A", value: "NA" },
    ...accounts.map(a => ({
        label: `${a.account_id} - ${a.account_name}`,
        value: a.account_id
    }))
  ];
  return res.status(200).json(new ApiResponse(200, options, "Debit accounts fetched"));
});

const getCreditAccounts = asyncHandler(async (req, res) => {
  const accounts = await FinancialAccount.find({ account_category: "Credit Account" });
  const options = [
    { label: "N/A", value: "NA" },
    ...accounts.map(a => ({
        label: `${a.account_id} - ${a.account_name}`,
        value: a.account_id
    }))
  ];
  return res.status(200).json(new ApiResponse(200, options, "Credit accounts fetched"));
});

export {
  createSaleTransaction,
  completeSaleTransaction,
  getCustomersByType,
  getPendingPaymentsByCustomer,
  getApprovedCustomerPaymentApprovals,
  getAssetsForAssetSale,
  getAssetDetailsById,
  getDebitAccounts,
  getCreditAccounts
};