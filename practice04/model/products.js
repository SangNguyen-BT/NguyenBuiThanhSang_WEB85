import mongoose from "mongoose";
import Collection from "../database/Collection.js";

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    quantity: Number
})

const ProductModel = mongoose.model(Collection.PRODUCTS, productSchema)

export default ProductModel