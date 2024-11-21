import express from "express"
import mongoose from "mongoose"

import { createNewOrder } from "./controller/orderController.js"

import handleError from "./middleware/handleError.js"
import { authorize, roles } from "./middleware/authorize.js"

import productRoute from "./routes/productRoute.js"
import customerRoute from "./routes/customerRoute.js"
import orderRoute from "./routes/orderRoute.js"
import authRoute from "./routes/authRoute.js"

mongoose.connect("mongodb+srv://kennySang:dragon9076@cluster0.r6njk.mongodb.net/L04")

const app = express()

app.use(express.json())

app.use("/auth/login", authRoute)

app.use("/api/v1/products", productRoute)
app.use("/api/v1/customers", customerRoute)
app.use("/api/v1/orders", orderRoute)
app.post("/api/v1/neworders", authorize(roles.customer), createNewOrder)

app.use(handleError)

app.listen(8080, () => {
    console.log("Server is running")
})