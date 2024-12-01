import mongoose from "mongoose"

const depositOrdersSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "properties"
    },
    depositAmount: String,
    date: Date,
    status: {
        type: String,
        enum: ["Paid", "In progress", "Cancelled"],
        default: "In progress"
    }
})

const DepositOrdersModel = mongoose.model("depositOrders", depositOrdersSchema)

export default DepositOrdersModel