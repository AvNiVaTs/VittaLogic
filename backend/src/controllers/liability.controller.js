import { Liability } from "../models/liability.model.js";
import { InternalTransaction } from "../models/internalTransaction.model.js";
import { FinancialAccount } from "../models/companyFinancial.model.js";
import { Vendor } from "../models/vendor.model.js";
import { Approval } from "../models/approval.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErr } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getNextSequence } from "../utils/getNextSequence.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import dayjs from "dayjs";

// Helper to calculate paid amount from Internal Transactions
const calculatePaidAmount = async (liability_id) => {
  const transactions = await InternalTransaction.find({
    reference_type: "Liability",
    liability_id,
  });

  return transactions.reduce((sum, tx) => sum + parseFloat(tx.amount.toString()), 0);
};

// Helper to calculate total payable amount based on interest
const calculateTotalPaymentAmount = ({ principal, rate, interest_type, payment_terms, start_date, due_date }) => {
  const start = dayjs(start_date);
  const end = dayjs(due_date);
  const durationInYears = end.diff(start, 'day') / 365;

  if (durationInYears <= 0) {
    throw new ApiErr(400, "Due date must be after start date");
  }

  const R = rate / 100;
  const P = principal;

  let n = 1; // default: yearly
  switch (payment_terms) {
    case "Monthly": n = 12; break;
    case "Quarterly": n = 4; break;
    case "Yearly": n = 1; break;
    case "One-time": n = 0; break;
    default: throw new ApiErr(400, "Invalid payment term");
  }

  let total = P;

  if (interest_type === "Simple" && n > 0) {
    total = P + (P * R * durationInYears);
  } else if (interest_type === "Compound" && n > 0) {
    total = P * Math.pow((1 + R / n), n * durationInYears);
  } else if (interest_type === "None" || n === 0) {
    total = P;
  }

  return total;
};

// CREATE Liability
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
    approval_id,
    createdBy,
    updatedBy
  } = req.body;

  if (!liability_name || !liability_type || !start_date || !due_date || !principle_amount ||
    !interest_type || !interest_rate || !payment_terms || !current_status || !priority ||
    !liability_account || !liability_vendor || !approval_id || !createdBy || !updatedBy) {
    throw new ApiErr(400, "All required fields must be filled");
  }

  let attachmentUrl = null;
  if (req.files?.attachment?.[0]?.path) {
    const attachmentPath = req.files.attachment[0].path;
    const uploaded = await uploadOnCloudinary(attachmentPath);
    if (uploaded?.url) attachmentUrl = uploaded.url;
    if (fs.existsSync(attachmentPath)) fs.unlinkSync(attachmentPath);
  }

  const liaId = `LIAB-${(await getNextSequence("liability_id")).toString().padStart(5, "0")}`;
  const paidAmount = await calculatePaidAmount(liaId);
  const calculated_payment_amount = calculateTotalPaymentAmount({
    principal: parseFloat(principle_amount),
    rate: parseFloat(interest_rate),
    interest_type,
    payment_terms,
    start_date,
    due_date
  });

  const liability = await Liability.create({
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
    calculated_payment_amount,
    attachment: attachmentUrl,
    approval_id,
    createdBy,
    updatedBy
  });

  if (!liability) throw new ApiErr(500, "Failed to create liability");

  return res.status(200).json(new ApiResponse(200, liability, "Liability created successfully"));
});

// GET All
const getAllLiabilities = asyncHandler(async (req, res) => {
  const liabilities = await Liability.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, liabilities, "All liabilities fetched"));
});

// SEARCH by ID or Name
const searchLiability = asyncHandler(async (req, res) => {
  const { id, name } = req.query;
  if (!id && !name) throw new ApiErr(400, "Provide id or name to search");

  const query = id
    ? { liability_id: id }
    : { liability_name: { $regex: name, $options: "i" } };

  const result = await Liability.find(query);
  if (!result.length) throw new ApiErr(404, "Nothing found");

  return res.status(200).json(new ApiResponse(200, result, "Found results"));
});

// FILTER by type or priority
const filterLiabilities = asyncHandler(async (req, res) => {
  const { type, priority } = req.query;
  if (!type && !priority) throw new ApiErr(400, "Provide type or priority");

  const filter = {};
  if (type) filter.liability_type = type;
  if (priority) filter.priority = priority;

  const result = await Liability.find(filter);
  if (!result.length) throw new ApiErr(404, "Nothing found");

  return res.status(200).json(new ApiResponse(200, result, "Filtered results"));
});

// SORT by Paid Amount
const sortByPaidAmount = asyncHandler(async (req, res) => {
  const liabilities = await Liability.find().sort({ paid_amount: -1 });
  return res.status(200).json(new ApiResponse(200, liabilities, "Sorted by paid amount"));
});

// UPDATE selected fields
const updateLiability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const allowedUpdates = ["due_date", "interest_rate", "payment_terms", "current_status"];
  const updates = {};

  for (let k of allowedUpdates) {
    if (req.body[k] !== undefined) {
      updates[k] = req.body[k];
    }
  }
  if (updates.interest_rate !== undefined) {
    updates.interest_rate = mongoose.Types.Decimal128.fromString(updates.interest_rate.toString());
  }

  updates.updatedBy = req.body.updatedBy;

  const updated = await Liability.findOneAndUpdate({ liability_id: id }, updates, { new: true });
  if (!updated) throw new ApiErr(404, "Liability not found");

  return res.status(200).json(new ApiResponse(200, updated, "Details updated successfully"));
});

// DROPDOWN: Liability Accounts
const liabilityAccountsDropdown = asyncHandler(async (req, res) => {
  const accounts = await FinancialAccount.find({ account_type: "Liability" });
  const options = accounts.map(account => ({
    label: `${account.account_id}-${account.account_name}`,
    value: account.account_id
  }));
  return res.status(200).json(new ApiResponse(200, options, "Liability account options fetched"));
});

// DROPDOWN: Vendors
const liabilityVendorsDropdown = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({ vendor_type: "Liability" });
  const options = vendors.map(vendor => ({
    label: `${vendor.vendor_id}-${vendor.company_Name}`,
    value: vendor.vendor_id
  }));
  return res.status(200).json(new ApiResponse(200, options, "Liability vendor options fetched"));
});

// DROPDOWN: Approvals
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
};