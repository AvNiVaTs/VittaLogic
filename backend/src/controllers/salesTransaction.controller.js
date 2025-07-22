import fs from "fs";
import { Approval } from "../models/approval.model.js";
import { Asset } from "../models/assets.model.js";
import { FinancialAccount } from "../models/companyFinancial.model.js";
import { Customer } from "../models/customer.model.js";
import { CustomerPayment } from "../models/customerPayment.model.js";
import { SaleTransaction } from "../models/saleTransaction.model.js";
import { ApiErr } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getNextSequence } from "../utils/getNextSequence.js";

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
    status
  } = req.body;

  const transactionId = `SALE_TXN-${(await getNextSequence("sale_transaction")).toString().padStart(5, "0")}`;
  const referenceId = `REF-${(await getNextSequence("transaction")).toString().padStart(5, "0")}`;

  if (debitAccount === "NA" && creditAccount === "NA") {
    throw new ApiErr(400, "Only one of Debit or Credit account can be N/A");
  }

  if (transactionType === "Asset Sale" && !assetDetails?.assetId) {
    throw new ApiErr(400, "Asset details are required for Asset Sale");
  }

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

  const saleTransaction = await SaleTransaction.create({
    transactionId,
    referenceId,
    enteredBy: req.body.createdBy,
    updatedBy: req.body.updatedBy,
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
    attachments: attachmentUrl,
    status
  });

  if (saleAmount > 0 && paymentId) {
    const customerPayment = await CustomerPayment.findOne({ customer_payment_id: paymentId });
    if (!customerPayment) {
      throw new ApiErr(404, "Linked customer payment not found");
    }

    const paidAmount = parseFloat(customerPayment.paid_amount.toString());
    const updatedPaidAmount = paidAmount + saleAmount;

    customerPayment.paid_amount = mongoose.Types.Decimal128.fromString(updatedPaidAmount.toString());

    const totalDue = parseFloat(customerPayment.payment_amount_in_inr.toString());
    if (updatedPaidAmount >= totalDue) {
      customerPayment.status = "Completed";
    }

    await customerPayment.save();
  }

  if (
    transactionType === "Asset Sale" &&
    assetDetails?.assetId &&
    status === "Completed"
  ) {
    await Asset.findOneAndUpdate(
      { assetId: assetDetails.assetId },
      { status: "Disposed" }
    );
  }

  return res.status(201).json(
    new ApiResponse(201, saleTransaction, "Sale transaction created successfully")
  );
});

// Mark Sale Transaction as Completed
const completeSaleTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const saleTransaction = await SaleTransaction.findOne({ transactionId: id });
  if (!saleTransaction) throw new ApiErr(404, "Sale transaction not found");

  saleTransaction.status = "Completed";
  saleTransaction.updatedBy = req.body.updatedBy
  await saleTransaction.save();

  await CustomerPayment.findOneAndUpdate(
    { paymentId: saleTransaction.paymentId },
    { status: "Completed" }
  );

  if (
    saleTransaction.transactionType === "Asset Sale" &&
    saleTransaction.assetDetails?.assetId
  ) {
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

  const query = customerType
    ? { customer_Types: { $regex: `^${customerType}$`, $options: "i" } }
    : {};

  const customers = await Customer.find(query);

  const options = customers.map(c => ({
    label: `${c.customer_Id} - ${c.company_Name}`,
    value: c.customer_Id
  }));

  return res.status(200).json(new ApiResponse(200, options, "Customers fetched"));
});

const getPendingPaymentsByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.query;

  const payments = await CustomerPayment.find({
    customer_id: customerId,
    status: { $in: ["Pending","Overdue", "Processing", "On Hold"] }
  });

  const options = payments.map(p => {
    const remaining = parseFloat(p.payment_amount_in_inr || 0) - parseFloat(p.paid_amount || 0);

    return {
      label: `${p.customer_payment_id} (₹${remaining.toFixed(2)})`,
      value: p.customer_payment_id
    };
  });

  return res.status(200).json(new ApiResponse(200, options, "Pending payments fetched"));
});

const getApprovedCustomerPaymentApprovals = asyncHandler(async (req, res) => {
  const approvals = await Approval.find({
    approvalfor: "Customer Payment",
    status: "Approved"
  });
  const options = approvals.map(a => ({
    label: `${a.approval_id} - ${a.reason}`,
    value: a.approval_id
  }));
  return res.status(200).json(new ApiResponse(200, options, "Approvals fetched"));
});

const getAssetsForAssetSale = asyncHandler(async (req, res) => {
  const { assetType } = req.query;
  const assets = await Asset.find({ assetType, status: "Awaiting Disposal" });
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
      status: asset.status,
      disposalId: asset.disposalDetails?.disposalId || null
    }, "Asset details fetched")
  );
});

const getSalesDebitAccounts = asyncHandler(async (req, res) => {
  const accounts = await FinancialAccount.find({ account_category: "Debit Account" });
  const options = [
    ...accounts.map(a => ({
      label: `${a.account_id} - ${a.account_name}`,
      value: a.account_id
    }))
  ];
  return res.status(200).json(new ApiResponse(200, options, "Debit accounts fetched"));
});

const getSalesCreditAccounts = asyncHandler(async (req, res) => {
  const accounts = await FinancialAccount.find({ account_category: "Credit Account" });
  const options = [
    ...accounts.map(a => ({
      label: `${a.account_id} - ${a.account_name}`,
      value: a.account_id
    }))
  ];
  return res.status(200).json(new ApiResponse(200, options, "Credit accounts fetched"));
});

export {
  completeSaleTransaction,
  createSaleTransaction,
  getApprovedCustomerPaymentApprovals,
  getAssetDetailsById,
  getAssetsForAssetSale,
  getCustomersByType,
  getPendingPaymentsByCustomer,
  getSalesCreditAccounts,
  getSalesDebitAccounts
};

