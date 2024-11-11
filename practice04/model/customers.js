import mongoose from "mongoose";
import Collection from "../database/Collection.js";

const customerSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    age: Number
})

const CustomerModel = mongoose.model(Collection.CUSTOMERS, customerSchema)

export default CustomerModel