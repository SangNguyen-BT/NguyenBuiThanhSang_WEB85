import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: String,
    customerId: String,
    productId: String,
    quantity: Number,
    totalPrice: Number
})

const OrderModel = mongoose.model("orders", orderSchema)

export default OrderModel