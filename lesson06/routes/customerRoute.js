import express from "express"
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, getCustomerOrders } from "../controller/customerController.js"
import { authorize, roles } from "../middleware/authorize.js"

const Router = express.Router()

Router.route("/")
.post(authorize(roles.admin), createCustomer)
.get(getAllCustomers)

Router.route("/:cId")
.get(authorize(roles.admin), getCustomerById)
.delete(authorize(roles.customer), deleteCustomer);

Router.route("/:cId/orders")
.get(authorize(roles.admin), getCustomerOrders)

export default Router