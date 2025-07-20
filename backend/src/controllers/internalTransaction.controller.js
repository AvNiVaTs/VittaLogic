import { InternalTransaction } from "../models/internalTransaction.model.js";
import { EmployeeSalary } from "../models/employeeSalary.model.js";
import { Approval } from "../models/approval.model.js";
import { Department } from "../models/department.model.js";
import { Liability } from "../models/liability.model.js";
import { FinancialAccount } from "../models/companyFinancial.model.js";
import { Asset } from "../models/assets.model.js";
import { getNextSequence } from "../utils/getNextSequence.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErr } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createInternalTransaction = asyncHandler(async (req, res) => {
    const {
        transactionDate,
        approvalId,
        referenceType,
        salaryDetails,
        liabilityDetails,
        refundInvestmentDetails,
        maintenanceRepairDetails,
        amount,
        transactionTypes,
        transactionMode,
        transactionSubmode,
        debitAccount,
        creditAccount,
        status,
        narration
    } = req.body;

    const transactionId = `INT_TXN-${(await getNextSequence("internal_transaction")).toString().padStart(5, "0")}`;

    if (debitAccount === "NA" && creditAccount === "NA") {
        throw new ApiErr(400, "Only one of Debit or Credit account can be N/A");
    }

    const disallowedApprovals = ["Asset", "Customer Payment", "Vendor Payment"];

    const approvalRecord = await Approval.findOne({
        approval_id: approvalId,
        status: "Approved",
        approvalfor: { $nin: disallowedApprovals }
    });

    if (!approvalRecord) {
    throw new ApiErr(400, "Invalid or disallowed approval ID. It must be approved and not for Asset, Customer Payment, or Vendor Payment.");
    }


    if (referenceType === "Salary") {
        const { department, employeeId, payMonth } = salaryDetails || {};

        if (!department || !employeeId || !payMonth) {
        throw new ApiErr(400, "Department, Employee ID, and Pay Month are required for Salary reference");
        }

        const salaryRecord = await EmployeeSalary.findOne({
        department,
        employee: employeeId,
        payMonth
        });

        if (!salaryRecord) {
        throw new ApiErr(404, "No matching EmployeeSalary record found");
        }

        salaryDetails.referenceId = salaryRecord.salaryId;
    }

    if (referenceType === "Refund/Investment") {
        refundInvestmentDetails.referenceId = `REF-${(await getNextSequence("refundReference")).toString().padStart(5, "0")}`;
    }

    if (referenceType === "Liability") {
        const { liabilityType, liabilityName } = liabilityDetails || {};

        if (!liabilityType || !liabilityName) {
        throw new ApiErr(400, "Liability Type and Liability Name are required");
        }

        const liabilityRecord = await Liability.findOne({
        liability_type: liabilityType,
        liability_name: liabilityName
        });

        if (!liabilityRecord) {
        throw new ApiErr(404, "Matching liability not found");
        }

        liabilityDetails.referenceId = liabilityRecord.liability_id;

        const calculated = parseFloat(liabilityRecord.calculated_payment_amount?.toString() || 0);
        const paid = parseFloat(liabilityRecord.paid_amount?.toString() || 0);
        const amountNum = parseFloat(amount);

        if (paid + amountNum > calculated) {
        throw new ApiErr(400, `Payment exceeds remaining amount. Remaining: ₹${(calculated - paid).toFixed(2)}`);
        }

        liabilityRecord.paid_amount = paid + amountNum;
        await liabilityRecord.save();
    }

    if (referenceType === "Maintenance / Repair") {
        const { assetType, assetId } = maintenanceRepairDetails || {};

        if (!assetType || !assetId) {
        throw new ApiErr(400, "Asset Type and Asset ID are required for Maintenance / Repair reference");
        }

        const assetRecord = await Asset.findOne({
        assetType,
        assetId,
        assetStatus: { $in: ["Maintenance Needed", "Repair Needed", "Under Maintenance", "Under Repair"] }
        });

        if (!assetRecord) {
        throw new ApiErr(404, "No matching asset found for Maintenance / Repair");
        }

        maintenanceRepairDetails.referenceId = assetRecord.maintenanceDetails?.maintenanceId;
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

    const internalTransaction = await InternalTransaction.create({
        transactionId,
        enteredBy: req.body.createdBy,
        transactionDate,
        approvalId,
        reference_type: referenceType,
        salaryDetails,
        liabilityDetails,
        refundInvestmentDetails,
        maintenanceRepairDetails,
        amount,
        transactionTypes,
        transactionMode,
        transactionSubmode,
        debitAccount,
        creditAccount,
        status,
        narration,
        attachments: attachmentUrl
    });

    return res.status(201).json(
        new ApiResponse(201, internalTransaction, "Internal transaction created successfully")
    );
});

const getDepartmentsForSalaryDropdown = asyncHandler(async (req, res) => {
  const departments = await Department.find();
  const options = departments.map((d) => ({
    label: `${d.department_id} - ${d.departmentName}`,
    value: d.department_id
  }));
  return res.status(200).json(new ApiResponse(200, options, "Departments fetched"));
});

const getEmployeesByDepartmentForSalary = asyncHandler(async (req, res) => {
  const { departmentId, payMonth } = req.query;
  const salaries = await EmployeeSalary.find({
    department: departmentId,
    payMonth
  }).populate({
    path: "employee",
    model: "Employee",
    localField: "employee",
    foreignField: "employeeId", // <- match against custom ID
    justOne: true
  });
  const options = salaries.map((s) => ({
    label: `${s.employee?.employeeId} - ${s.employee?.employeeName} - ₹${s.netSalary} - ${s.payMonth}`,
    value: s.employee?.employeeId
  }));
  return res.status(200).json(new ApiResponse(200, options, "Employees fetched"));
});

const getLiabilitiesByType = asyncHandler(async (req, res) => {
  const { liabilityType } = req.query;
  if (!liabilityType) {
    throw new ApiErr(400, "Liability type is required");
  }
  const liabilities = await Liability.find({ liability_type: liabilityType });
  const options = liabilities.map((l) => {
    const calculated = parseFloat(l.calculated_payment_amount?.toString() || 0);
    const paid = parseFloat(l.paid_amount?.toString() || 0);
    const remaining = calculated - paid;
    return {
      label: `${l.liability_name} - (₹${remaining.toFixed(2)})`,
      value: l.liability_name
    };
  });
  return res.status(200).json(new ApiResponse(200, options, "Liabilities fetched"));
});

const getAssetsForMaintenanceRepair = asyncHandler(async (req, res) => {
  const { assetType } = req.query;
  if (!assetType) {
    throw new ApiErr(400, "Asset type is required");
  }
  const assets = await Asset.find({
    assetType,
    assetStatus: { $in: ["Maintenance Needed", "Repair Needed", "Under Maintenance", "Under Repair"] }
  });
  const options = assets.map((a) => ({
    label: `${a.assetId} - ${a.assetName}`,
    value: a.assetId
  }));
  return res.status(200).json(new ApiResponse(200, options, "Assets fetched for maintenance/repair"));
});

const getInternalDebitAccounts = asyncHandler(async (req, res) => {
  const accounts = await FinancialAccount.find({ account_category: "Debit Account" });
  const options = [,
    ...accounts.map(a => ({
      label: `${a.account_id} - ${a.account_name}`,
      value: a.account_id
    }))
  ];
  return res.status(200).json(new ApiResponse(200, options, "Debit accounts fetched"));
});

const getInternalCreditAccounts = asyncHandler(async (req, res) => {
  const accounts = await FinancialAccount.find({ account_category: "Credit Account" });
  const options = [,
    ...accounts.map(a => ({
      label: `${a.account_id} - ${a.account_name}`,
      value: a.account_id
    }))
  ];
  return res.status(200).json(new ApiResponse(200, options, "Credit accounts fetched"));
});

const getInternalTransactionDropdownApprovals = asyncHandler(async (req, res) => {
  const excluded = ["Asset", "Vendor Payment", "Customer Payment"];

  const approvals = await Approval.find({
    status: "Approved",
    approvalfor: { $nin: excluded }
  });

  const options = approvals.map(a => ({
    label: `${a.approval_id} - ${a.reason}`,
    value: a.approval_id
  }));

  return res.status(200).json(new ApiResponse(200, options, "Approvals fetched"));
});

export {
  createInternalTransaction,
  getDepartmentsForSalaryDropdown,
  getEmployeesByDepartmentForSalary,
  getLiabilitiesByType,
  getAssetsForMaintenanceRepair,
  getInternalDebitAccounts,
  getInternalCreditAccounts,
  getInternalTransactionDropdownApprovals,


  // completeInternalTransactions,
  // getEmployeeSalaryOptions,
  // getRepairAssets,
};