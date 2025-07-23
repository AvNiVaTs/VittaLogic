import { InternalTransaction } from "../models/internalTransaction.model.js";
import { PurchaseTransaction } from "../models/purchasetransaction.model.js";
import { SaleTransaction } from "../models/saletransaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTransactionHistory = asyncHandler(async (req, res) => {
  const { transactionId = "", status = "All", type = "All" } = req.query;

  const transactionIdFilter = transactionId
    ? { transactionId: { $regex: transactionId, $options: "i" } }
    : {};

  const statusFilter = status !== "All" ? { status } : {};

  const filters = {
    ...transactionIdFilter,
    ...statusFilter,
  };

  const formattedResults = [];

  // Common populate options for custom IDs
  const approvalPopulate = {
    path: "approvalId",
    model: "Approval",
    select: "approvalId",
    localField: "approvalId",
    foreignField: "approvalId",
    justOne: true
  };

  const debitAccountPopulate = {
    path: "debitAccount",
    model: "FinancialAccount",
    select: "accountName",
    localField: "debitAccount",
    foreignField: "accountId",
    justOne: true
  };

  const creditAccountPopulate = {
    path: "creditAccount",
    model: "FinancialAccount",
    select: "accountName",
    localField: "creditAccount",
    foreignField: "accountId",
    justOne: true
  };

  const enteredByPopulate = {
    path: "enteredBy",
    model: "Employee",
    select: "employeeName",
    localField: "enteredBy",
    foreignField: "employeeId",
    justOne: true
  };

  const createdByPopulate = {
    path: "createdBy",
    model: "Employee",
    select: "employeeName",
    localField: "createdBy",
    foreignField: "employeeId",
    justOne: true
  };

  const fetchAndFormat = async (model, typeLabel, populateOptions, formatterFn) => {
    const records = await model.find(filters).populate(populateOptions);
    return records.map((record) => formatterFn(record.toObject()));
  };

  // Internal Transaction
  if (type === "Internal" || type === "All") {
    const records = await fetchAndFormat(
      InternalTransaction,
      "Internal",
      [
        approvalPopulate,
        debitAccountPopulate,
        creditAccountPopulate,
        enteredByPopulate
      ],
      (tx) => ({
        transactionId: tx.transactionId,
        transactionDate: tx.transactionDate,
        status: tx.status,
        transactionType: `Internal - ${tx.reference_type}`,
        amount: tx.amount,
        mode: `${tx.transactionMode} - ${tx.transactionSubmode}`,
        referenceId:
          tx.reference_type === "Salary"
            ? tx.salaryDetails?.referenceId
            : tx.reference_type === "Liability"
            ? tx.liabilityDetails?.referenceId
            : tx.reference_type === "Refund/Investment"
            ? tx.refundInvestmentDetails?.referenceId
            : tx.reference_type === "Maintenance / Repair"
            ? tx.maintenanceRepairDetails?.referenceId
            : null,
        approvalId: tx.approvalId?.approvalId || null,
        debitAccount: tx.debitAccount?.accountName || null,
        creditAccount: tx.creditAccount?.accountName || null,
        narration: tx.narration,
        enteredBy: tx.enteredBy?.employeeName || null,
        source: "Internal"
      })
    );
    formattedResults.push(...records);
  }

  // Purchase Transaction
  if (type === "Purchase" || type === "All") {
    const records = await fetchAndFormat(
      PurchaseTransaction,
      "Purchase",
      [
        approvalPopulate,
        {
          path: "vendorId",
          model: "Vendor",
          select: "vendorName",
          localField: "vendorId",
          foreignField: "vendorId",
          justOne: true
        },
        debitAccountPopulate,
        creditAccountPopulate,
        {
          path: "enteredBy",
          model: "Employee",
          select: "employeeName",
          localField: "enteredBy",
          foreignField: "employeeId",
          justOne: true
        }
      ],
      (tx) => ({
        transactionId: tx.transactionId,
        transactionDate: tx.purchaseDate,
        status: tx.status,
        transactionType: `Purchase - ${tx.transactionType}`,
        amount: tx.purchaseAmount,
        mode: `${tx.transactionMode} - ${tx.transactionSubmode}`,
        referenceId: tx.vendorId?.vendorName || null,
        approvalId: tx.approvalId?.approvalId || null,
        debitAccount: tx.debitAccount?.accountName || null,
        creditAccount: tx.creditAccount?.accountName || null,
        narration: tx.narration,
        enteredBy: tx.enteredBy?.employeeName || null,
        source: "Purchase"
      })
    );
    formattedResults.push(...records);
  }

  // Sale Transaction
  if (type === "Sale" || type === "All") {
    const records = await fetchAndFormat(
      SaleTransaction,
      "Sale",
      [
        approvalPopulate,
        {
          path: "customerId",
          model: "Customer",
          select: "customerName",
          localField: "customerId",
          foreignField: "customerId",
          justOne: true
        },
        debitAccountPopulate,
        creditAccountPopulate,
        enteredByPopulate
      ],
      (tx) => ({
        transactionId: tx.transactionId,
        transactionDate: tx.saleDate,
        status: tx.status,
        transactionType: `Sale - ${tx.transactionType}`,
        amount: tx.saleAmount,
        mode: `${tx.transactionMode} - ${tx.transactionSubmode}`,
        referenceId: tx.customerId?.customerName || null,
        approvalId: tx.approvalId?.approvalId || null,
        debitAccount: tx.debitAccount?.accountName || null,
        creditAccount: tx.creditAccount?.accountName || null,
        narration: tx.narration,
        enteredBy: tx.enteredBy?.employeeName || null,
        source: "Sale"
      })
    );
    formattedResults.push(...records);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, formattedResults, "Transaction history fetched"));
});

export { getTransactionHistory };

