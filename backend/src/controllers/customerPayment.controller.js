import { CustomerPayment } from "../models/customerPayment.model.js";
import { Customer } from "../models/customer.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { getNextSequence } from "../utils/getNextSequence.js"
import { ApiErr } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const createCustomerPayment = asyncHandler(async (req, res) => {
    const {
        customer_id,
        payment_amount,
        purpose,
        due_date,
        credit_days,
        outstanding_amount,
        exchange_rate
    } = req.body

    if(!customer_id ||
        !customer_id ||
        !payment_amount ||
        !purpose?.trim() ||
        !due_date ||
        credit_days === undefined ||
        outstanding_amount === undefined ||
        !exchange_rate
    ){
        throw new ApiErr(400, "All mandatory fields are required")
    }

    const customer = await Customer.findOne({customer_Id: customer_id})
    if(!customer){
        throw new ApiErr(404, "Customer not found")
    }

    let currency;
    if (customer.customer_Location === "International") {
    currency = customer.internationalDetails?.defaultCurrency;
    } else {
    currency = "INR"; // or whatever default you're assuming for Indian customers
    }

    if (!currency) {
    throw new ApiErr(400, "Currency is missing for this customer");
    }

    const payment_id = `CUST-PAY-${(await getNextSequence("customer_payment_id")).toString().padStart(5, "0")}`

    const payment_amount_in_customer_currency = payment_amount;
    const payment_amount_in_inr = payment_amount * exchange_rate;

    const payment = await CustomerPayment.create({
        customer_payment_id: payment_id,
        customer_id: customer.customer_Id,
        payment_amount_in_customer_currency,
        payment_amount_in_inr,
        purpose,
        due_date,
        credit_days,
        outstanding_amount,
        currency,
        exchange_rate,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    if(!payment){
        throw new ApiErr(404, "Something went wrong")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment, "Customer Payment created")
    )
})

const getAllCustomerPayments = asyncHandler(async (req, res) => {
    const payments = await CustomerPayment.find().sort({ createdAt: -1 });

    const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
            const customer = await Customer.findOne(
                { customer_id: payment.customer_id },
                "customer_id company_Name"
            );

            return {
                ...payment.toObject(),
                customerDetails: customer || null
            };
        })
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, enrichedPayments, "Payments fetched successfully")
        );
})

const updateCustomerPayment = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {due_date, status, receivables_aging, credit_days, updatedBy} = req.body

    const allowedUpdated = {}

    if(due_date) allowedUpdated.due_date = due_date
    if(status) allowedUpdated.status = status
    if(receivables_aging) allowedUpdated.receivables_aging = receivables_aging
    if(credit_days!==undefined) allowedUpdated.credit_days = credit_days
    allowedUpdated.updatedBy = updatedBy

    const updatedPayment = await CustomerPayment.findOneAndUpdate(
        { customer_payment_id: id },
        allowedUpdated,
        {new: true, runValidators: true}
    )

    if(!updatedPayment){
        throw new ApiErr(404, "Payment Record not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedPayment, "Payment updated successfully")
    )
})

const deleteCustomerPayment = asyncHandler(async (req, res) => {
    const {id} = req.params

    const deleted = await CustomerPayment.findOneAndDelete({customer_payment_id: id})
    if(!deleted){
        throw new ApiErr(404, "Payment record not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Payment deleted successfully")
    )
})

const filterPaymentByStatus = asyncHandler(async (req, res) => {
    const { status } = req.query;

    if (!status) {
        throw new ApiErr(400, "Status query parameter is required");
    }

    const payments = await CustomerPayment.find({ status });

    const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
            const customer = await Customer.findOne(
                { customer_id: payment.customer_id },
                "customer_id company_Name"
            );

            return {
                ...payment.toObject(),
                customerDetails: customer || null
            };
        })
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, enrichedPayments, `Payments with status '${status}' fetched`)
        );
})

const getCustomerDropDownOptions = asyncHandler(async (req, res) => {
    const customer = await Customer.find({}, "customer_Id company_Name")

    const options = customer.map(c => ({
        customer_id: c.customer_Id,
        label: `${c.customer_Id} - ${c.company_Name}`
    }))

    return res
    .status(200)
    .json(
        new ApiResponse(200, options, "Customer dropdown list fetched")
    )
})

export {
    createCustomerPayment,
    getAllCustomerPayments,
    updateCustomerPayment,
    deleteCustomerPayment,
    filterPaymentByStatus,
    getCustomerDropDownOptions
}