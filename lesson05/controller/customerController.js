import CustomerModel from "../model/customers.js"
import OrderModel from "../model/orders.js"

export const createCustomer = async (req, res, next) => {
    try {
        const {id, name, email, age} = req.body

        if (!id || !name || !email || !age) throw new Error("Invalid data")

        const existedEmail = await CustomerModel.findOne({email})
        if (existedEmail) throw new Error("Email is already existed!")

        const createdCustomer = await CustomerModel.create({
            id, name, email, age
        })

        res.status(201).send({
            message: "Register successfully!",
            data: createdCustomer,
            success: true
        })

    } catch (error) {
        next(error)
    }
}

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await CustomerModel.find(req.query)

        res.status(201).send({
            message: "Get user successful",
            data: customers,
            success: true,
        })

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false,
        })
    }
}

export const getCustomerById = async (req, res) => {
    try {
        const { cId } = req.params

        const customer = await CustomerModel.findOne({id: cId})
        if (!customer) throw new Error("Customer does not exist")

        res.status(201).send({
            message: "Get user successful",
            data: customer,
            success: true,
        })

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false,
        })
    }
}

export const getCustomerOrders = async (req, res) => {
    try {
        const { cId } = req.params

        const customer = await CustomerModel.findOne({id: cId})
        if (!customer) throw new Error("Customer does not exist")

        const orders = await OrderModel.find({customerId: cId})

        res.status(201).send({
            message: "Get user's order successful",
            data: orders,
            success: true,
        })
        
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false,
        })
    }
}

export const deleteCustomer = async (req, res) => {
    try {
        const {cId} = req.params

        const deletedCustomer = await CustomerModel.findOneAndDelete({id: cId});
        if (!deletedCustomer) throw new Error('Customer not found');

        res.status(201).send({
            message: 'Customer deleted successfully',
            data: deletedCustomer,
            success: true
        });

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
}