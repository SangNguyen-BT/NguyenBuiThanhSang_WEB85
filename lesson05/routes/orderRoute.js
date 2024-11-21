import express from "express"
import { createOrder, getOrderHighvalue, updatedOrderQuantity } from "../controller/orderController.js"

const Router = express.Router()

Router.route("/").post(createOrder)
Router.route("/highvalue").get(getOrderHighvalue)
Router.route("/:orderId").put(updatedOrderQuantity)

export default Router