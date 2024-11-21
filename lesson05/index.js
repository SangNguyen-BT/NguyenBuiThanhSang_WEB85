import express from "express"
import mongoose from "mongoose"

import { createNewOrder } from "./controller/orderController.js"

import handleError from "./middleware/handleError.js"

import productRoute from "./routes/productRoute.js"
import userRoute from "./routes/userRoute.js"
import orderRoute from "./routes/orderRoute.js"

mongoose.connect("mongodb+srv://kennySang:dragon9076@cluster0.r6njk.mongodb.net/L04")

const app = express()

app.use(express.json())

app.use("/api/v1/products", productRoute)
app.use("/api/v1/customers", userRoute)

app.use("/api/v1/orders", orderRoute)
app.post("/api/v1/neworders", createNewOrder)

app.use(handleError)

// app.post("/api/v1/products", createProduct)
// app.get("/api/v1/products", getProduct)      // also can use query minPrice = 5000000 & maxPrice = 10000000

// app.post("/api/v1/orders", createOrder)
// app.post("/api/v1/neworders", createNewOrder)            // based on data product created
// app.get("/api/v1/orders/highvalue", getOrderHighvalue)   // minPrice = 10000000
// app.put("/api/v1/orders/:orderId", updatedOrderQuantity);

// app.post("/api/v1/customers", createCustomer)
// app.get("/api/v1/customers", getAllCustomers)
// app.get("/api/v1/customers/:cId", getCustomerById)
// app.delete("/api/v1/customers/:cId", deleteCustomer);
// app.get("/api/v1/customers/:cId/orders", getCustomerOrders)

app.listen(8080, () => {
    console.log("Server is running")
})