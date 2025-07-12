import {Customer} from "../models/customer.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {getNextSequence} from "../utils/getNextSequence.js"

const createCustomer = asyncHandler(async (req, res) => {
    const {
        company_Name,
        address,
        company_Email,
        customer_Types,
        contact_Person,
        industry_Sector,
        billing_Address,
        receiver_Name,
        receiver_ContactNo,
        shipping_Addresses,
        customerPriority,
        customer_Location,
        indianDetails,
        internationalDetails
    } = req.body

    if(!company_Name?.trim() ||
    !address?.trim() ||
    !company_Email?.trim() ||
    !Array.isArray(customer_Types) ||
    customer_Types.length === 0 ||
    !contact_Person ||
    !contact_Person.name?.trim() ||
    !contact_Person.email?.trim() ||
    !contact_Person.number?.trim() ||
    !billing_Address ||
    !receiver_Name ||
    !receiver_ContactNo ||
    !shipping_Addresses ||
    !Array.isArray(shipping_Addresses) ||
    shipping_Addresses.length === 0 ||
    !customerPriority ||
    !customer_Location?.trim()){
        throw new ApiErr(400, "All mandatory fields must be filled")
    }

    if(customer_Location==="Indian" && !indianDetails){
        throw new ApiErr(400, "Indian customer details are required")
    }
    if(customer_Location==="International" && !internationalDetails){
        throw new ApiErr(400, "International customer details are required")
    }

    const custId = `CUS-${(await getNextSequence("customer_Id")).toString().padStart(5, "0")}`

    const newCus = await Customer.create({
        customer_Id: custId,
        company_Name,
        address,
        company_Email,
        customer_Types,
        contact_Person: {
            name: contact_Person.name,
            email: contact_Person.email,
            number: contact_Person.number
        },
        industry_Sector,
        billing_Address,
        receiver_Name,
        receiver_ContactNo,
        shipping_Addresses,
        customerPriority,
        customer_Location,
        indianDetails: customer_Location==="Indian"? indianDetails : undefined,
        internationalDetails: customer_Location==="International"? internationalDetails : undefined,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy
    })

    const createdCust = await Customer.findOne({customer_Id: custId})
    if(!createdCust){
        throw new ApiErr(400, "Something went wrong while registering customer")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdCust, "Customer successfully added to database")
    )
})

const getAllCustomer = asyncHandler(async (req, res) => {
    const cust = await Customer.find().sort({createdAt: -1})

    if(!cust || cust.length===0){
        throw new ApiErr(404, "Customer not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, cust, "Customer fetched successfully")
    )
})

const updateCust = asyncHandler(async (req, res) => {
    const {id} = req.params
    const updates = req.body
    updates.updatedBy = req.body.updatedBy

    const updatedCustomer = await Customer.findOneAndUpdate({customer_Id: id}, updates, {
        new: true,
        runValidator: true
    })

    if(!updatedCustomer){
        throw new ApiErr(404, "Customer not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedCustomer, "Customer details fetched")
    )
})

const deleteCustomer = asyncHandler(async (req, res) => {
    const {id} = req.params

    const customer = await Customer.findOneAndDelete({customer_Id: id})
    if(!customer){
        throw new ApiErr(404, "Customer not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, customer, "Customer deleted")
    )
})

const searchCustomerById = asyncHandler(async (req, res) => {
    const {id} = req.params

    const cust = await Customer.findOne({customer_Id: id})

    if(!cust){
        throw new ApiErr(404, "Customer not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, cust, "Customer fetched by id")
    )
})

const searchCustomerByName = asyncHandler(async (req, res) => {
    const {name} = req.query

    if(!name){
        throw new ApiErr(400, "Name required to search")
    }

    const cust = await Customer.find({
        company_Name: {
            $regex: name,
            $options: "i"
        }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, cust, "Company Found")
    )
})

const filterCustomerByPriority = asyncHandler(async (req, res) => {
    const {priority} = req.query

    if(!priority){
        throw new ApiErr(400, "Priority query is required")
    }

    const cust = await Customer.find({customerPriority: priority})

    return res
    .status(200)
    .json(
        new ApiResponse(200, cust, "Customer")
    )
})

export {
    createCustomer,
    getAllCustomer,
    updateCust,
    deleteCustomer,
    searchCustomerById,
    searchCustomerByName,
    filterCustomerByPriority
}