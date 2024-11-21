import express from "express"
import { createOrder, getOrderHighvalue, updatedOrderQuantity } from "../controller/orderController.js"
import { authorize, roles } from "../middleware/authorize.js"

const Router = express.Router()

Router.route("/").post(authorize(roles.customer), createOrder)
Router.route("/highvalue").get(authorize(roles.admin), getOrderHighvalue)
Router.route("/:orderId").put(authorize(roles.customer), updatedOrderQuantity)

export default Router