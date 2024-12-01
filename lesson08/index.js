import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"

import {checkRegisterFields} from "./middleware/register.js"
import {checkLoginFields} from "./middleware/login.js"
import { authenUser } from "./middleware/apiKey.js";
import {checkOrderFields} from "./middleware/checkOrder.js"

import CustomerModel from "./model/customer.js";
import ProductModel from "./model/product.js";
import OrderModel from "./model/order.js";

mongoose.connect("mongodb+srv://kennySang:dragon9076@cluster0.r6njk.mongodb.net/L07")

const app = express()
app.use(express.json())

        // TOKEN 
const secretKey = "mysecretkey"

const userData = {
    id: "123",
    username: "Kenny",
    role: "user"
}

const token = jwt.sign(userData, secretKey, {expiresIn: "1h"})
console.log(token);

jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
        console.log(new Error ("JWT verification failed"), err.message);
    } else {
        console.log("Decoded JWT", decoded);
    }    
})

app.get('/validate-token', (req, res, next) => {
    const authHeader = req.headers["authorization"]

    console.log(authHeader);
    
})
        //* */
app.post("/products", async (req, res) => {
    try {
        const {id, name, price, quantity} = req.body
        if (!id) throw new Error("Id id required")
        if (!name) throw new Error("Name is required")
        if (!price) throw new Error("Price is required")
        if (!quantity) throw new Error("Quantity is required")

        const existedId = await ProductModel.findOne({
            id
        })
        if (existedId) throw new Error("Id is already existed!")

        const createdProduct = await ProductModel.create({
            id,
            name,
            price,
            quantity
        })

        res.status(201).send({
            message: "Register successfully",
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
})
        // Task 1
app.post('/register',checkRegisterFields, async (req,res,next) => {
    try {
        const { name, email, age, password } = req.body

        const existedCustomer = await CustomerModel.findOne({email})
        if (existedCustomer) throw new Error("Email already exists")

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        
        const newCustomer = await CustomerModel.create({
            id: uuidv4(),
            name,
            email,
            age,
            passwordHash: hash,
            salt,
            role: "user"
        })

        res.status(201).send({
            message: "Register successfully",
            data: newCustomer,
            success: true
        })

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        })
    }
})

        // Task 2
app.post('/login', checkLoginFields, async (req, res, next) => {
    try {
        const {email, password} = req.body

        const user = await CustomerModel.findOne({email})
        if (!user) throw new Error("Sai tài khoản hoặc mật khẩu")

        const hashingPasswordLogin = bcrypt.hashSync(password, user.salt)
        if(hashingPasswordLogin !== user.passwordHash) throw new Error("Sai tài khoản hoặc mật khẩu")

        const randomString = uuidv4()
        user.randomString = randomString
        await user.save()

        const apiKey = `web/${user.id}/${email}/${randomString}`

        res.status(201).send({
            message:'Login successfully!',
            apiKey
        })

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        })
    }
})

        // Task 3
app.get("/users/:id/orders", authenUser, async (req, res, next) => {
    try {
        const {id} = req.params

        const validId = await CustomerModel.findOne({id: id})
        if (!validId) throw new Error("Not authorized to see order")

        const orders = await OrderModel.find({customerId: id})

        res.status(201).send({
            message:'Get order successfully!',
            orders,
            success: true
        })

    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        })
    }
})

        // Task 4
app.post("/orders", authenUser, checkOrderFields, async (req, res, next) => {
    try {
        const { productId, quantity} = req.body
        const user = req.user

        const product = await ProductModel.findOne({ id: productId });
        if (!product || product.quantity < quantity) throw new Error("Invalid data");

        const totalPrice = product.price * quantity

        const newOrder = await OrderModel.create({
            orderId: uuidv4(),
            customerId: user.id,
            productId,
            quantity,
            totalPrice
        })

        product.quantity -= quantity;
        await product.save();

        res.status(201).send({
            message:'Create order successfully!',
            newOrder,
            success: true
        })
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        })
    }
})

        // Task 5
app.put('/orders/:id', authenUser, checkOrderFields, async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, quantity } = req.body;
        const user = req.user;
        
        const order = await OrderModel.findOne({ orderId: id, customerId: user.id });
        if (!order) throw new Error("Order not found");
        
        const product = await ProductModel.findOne({ id: productId });
        if (!product || product.quantity < quantity) throw new Error("Product not available or insufficient quantity");

        product.quantity -= quantity - order.quantity;
        order.productId = productId;
        order.quantity = quantity;
        order.totalPrice = product.price * quantity;
        
        await product.save();
        await order.save();

        res.status(201).send({
            message: 'Order updated successfully!',
            data: order,
            success: true
        })
        } catch (error) {
            res.status(403).send({
                message: error.message,
                data: null,
                success: false
                })
            }
        });

        // Task 6
app.delete('/orders/:id', authenUser, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const deletedOrder = await OrderModel.findOneAndDelete({ orderId: id, customerId: user.id });
        if (!deletedOrder) throw new Error("Order not found");

        res.status(200).send({
            message: 'Order deleted successfully',
            data: deletedOrder,
            success: true
        });
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

app.listen(8080, () => {
    console.log("Server is running");
})