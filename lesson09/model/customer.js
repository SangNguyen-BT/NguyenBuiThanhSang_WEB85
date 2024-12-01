import mongoose from "mongoose"

const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts"
    }
})

const CustomerModel = mongoose.model("customers", customerSchema)

export default CustomerModel