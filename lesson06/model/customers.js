import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    age: Number,
    password: String,
    role: String
}, {timestamps: true})

const CustomerModel = mongoose.model("customers",customerSchema)

export default CustomerModel