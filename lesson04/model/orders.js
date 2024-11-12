import mongoose from "mongoose";
import Collection from "../database/Collection.js";

const orderSchema = new mongoose.Schema({
    orderId: String,
    customerId: String,
    productId: String,
    quantity: Number,
    totalPrice: Number
})

const OrderModel = mongoose.model(Collection.ORDERS, orderSchema)

export default OrderModel