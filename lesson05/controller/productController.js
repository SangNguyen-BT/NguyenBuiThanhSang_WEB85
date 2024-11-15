import ProductModel from "../model/products.js";

export const createProduct = async (req, res) => {
    try {
        const {id, name, price, quantity} = req.body

        if (!id || !name || !price || !quantity) throw new Error("Invalid data")

        const existedId = await ProductModel.findOne({id})
        if (existedId) throw new Error("Id is already existed")

        const createdProduct = await ProductModel.create({
            id,name,price,quantity
        })

        res.status(201).send({
            message: "Register successfully!",
            data: createdProduct,
            success: true
        })

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        })
    }
}

export const getProduct = async (req, res) => {
    try {
        const minPrice = parseInt(req.query.minPrice) || 0
        const maxPrice = parseInt(req.query.maxPrice) || Infinity
        
        const products = await ProductModel.find({
            price: {$gte: minPrice, $lte: maxPrice}
        })

        res.status(201).send({
            message: "Products retrieved successfully",
            data: products,
            success: true
        })

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false,
        })
    }
}