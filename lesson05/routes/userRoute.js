import express from "express"
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, getCustomerOrders } from "../controller/customerController.js"

const Router = express.Router()

Router.route("/").post(createCustomer).get(getAllCustomers)

Router.route("/:cId").get(getCustomerById).delete(deleteCustomer)

Router.route("/:cId/orders").get(getCustomerOrders)

export default Router