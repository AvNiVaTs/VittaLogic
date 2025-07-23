import { Vendor } from "../models/vendor.model.js"
import { VendorPayment } from "../models/vendorPayment.model.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { getNextSequence } from "../utils/getNextSequence.js"

const toNumber = (decimal) => parseFloat(decimal?.toString() || 0)

const createVendorPayment = asyncHandler(async (req, res) => {
    const {
        vendor_id,
        payment_amount_in_vendor_currency,
        exchangeRate,
        due_date,
        purpose,
        payment_method,
        status
    } = req.body

    if(!vendor_id || !payment_amount_in_vendor_currency || !exchangeRate || !due_date || !purpose || !payment_method){
        throw new ApiErr(400, "Fill all required fields")
    }

    const vendor = await Vendor.findOne({vendor_id}).select("currency")
    if(!vendor){
        throw new ApiErr(404, "Vendor not found");
    }

    // Get currency from correct location
    let currency = null;
    if (vendor.vendor_location === "International") {
        currency = vendor.internationalBankDetails?.currency;
    } else {
        currency = "INR"; // default or hardcoded for Indian vendors
    }

    if (!currency) {
        throw new ApiErr(400, "Currency is missing in vendor details");
    }

    const payment_id = `VEN_PAY-${(await getNextSequence("payment_id")).toString().padStart(5, "0")}`
    const indianAmount = toNumber(payment_amount_in_vendor_currency)*toNumber(exchangeRate)

    const newPayment = await VendorPayment.create({
        payment_id: payment_id,
        vendor_id,
        currency,
        payment_amount_in_vendor_currency,
        exchangeRate,
        payment_amount_in_indian_currency: indianAmount,
        due_date,
        purpose,
        payment_method,
        status,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, newPayment, "Vendor payment created")
    )
})

const getAllVendorPayments = asyncHandler(async (req, res) => {
  const payments = await VendorPayment.find().sort({ createdAt: -1 }).lean(); // 👈 lean added

  const enrichedPayments = await Promise.all(
    payments.map(async (payment) => {
      const vendor = await Vendor.findOne(
        { vendor_id: payment.vendor_id },
        "vendor_id company_Name"
      ).lean(); // 👈 lean added here too

      return {
        ...payment,
        vendorDetails: vendor || null
      };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, enrichedPayments, "Vendor payments fetched"));
});


const getVendorPaymentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find vendor payment by custom ObjectId
    const payment = await VendorPayment.findOne({payment_id: id})
    if (!payment) {
        throw new ApiErr(400, "Payment not found");
    }

    // Find vendor by custom vendor_id (string)
    const vendor = await Vendor.findOne(
        { vendor_id: payment.vendor_id },
        "vendor_id company_Name"
    );

    // Attach vendor details to the response
    const responseData = {
        ...payment.toObject(),
        vendorDetails: vendor || null
    };

    return res.status(200).json(
        new ApiResponse(200, responseData, "Vendor payment found")
    );
})

const updateVendorPayment = asyncHandler(async (req, res) => {
    const { payment_id } = req.params;
    const { due_date, status } = req.body;

    const payment = await VendorPayment.findOne({ payment_id });
    if (!payment) {
        throw new ApiErr(404, "Vendor payment not found");
    }

    const updates = {};
    if (due_date) updates.due_date = due_date;
    if (status) updates.status = status;
    updates.updatedBy = req.body.updatedBy;

    const updated = await VendorPayment.findOneAndUpdate({ payment_id }, updates, { new: true });

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Vendor payment updated"));
});

const deleteVendorPayment = asyncHandler(async (req, res) => {
    const { payment_id } = req.params;

    const deleted = await VendorPayment.findOneAndDelete({ payment_id });

    if (!deleted) {
        throw new ApiErr(404, "Vendor payment not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleted, "Vendor payment deleted"));
});

const searchVendorPayment = asyncHandler(async (req, res) => {
    const { company_Name, vendor_id, payment_id, status } = req.query;
    const query = {};

    if (status) query.status = status;
    if (payment_id) query.payment_id = payment_id.trim();
    if (vendor_id) query.vendor_id = vendor_id;

    // Handle search by company name
    if (company_Name) {
        const vendors = await Vendor.find(
            {
                company_Name: {
                    $regex: company_Name,
                    $options: "i"
                }
            },
            "vendor_id"
        );

        const vendorIds = vendors.map(v => v.vendor_id); // Custom IDs like VEN-00001

        if (vendorIds.length > 0) {
            query.vendor_id = { $in: vendorIds };
        } else {
            return res.status(200).json(
                new ApiResponse(200, [], "No vendor payment found for given company name")
            );
        }
    }

    // Fetch payments using custom vendor_id (string)
    const payments = await VendorPayment.find(query);

    // Manually join vendor info
    const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
            const vendor = await Vendor.findOne(
                { vendor_id: payment.vendor_id },
                "vendor_id company_Name"
            );

            return {
                ...payment.toObject(),
                vendorDetails: vendor || null,
            };
        })
    );

    return res.status(200).json(
        new ApiResponse(200, enrichedPayments, "Vendor Payment details found")
    );
})

const getVendorsForDropDown = asyncHandler(async (req, res) => {
    const vendors = await Vendor.find({}, "vendor_id company_Name")

    const formatted = vendors.map(vendor=>({
        value: vendor.vendor_id,
        label: `${vendor.vendor_id}-${vendor.company_Name}`
    }))

    return res
    .status(200)
    .json(
        new ApiResponse(200, formatted, "Vendor dropdown data fetched")
    )
})

export {
    createVendorPayment, deleteVendorPayment, getAllVendorPayments,
    getVendorPaymentById, getVendorsForDropDown, searchVendorPayment, updateVendorPayment
}
