import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    quantity: Number
})

const ProductModel = mongoose.model("products", productSchema)

export default ProductModel