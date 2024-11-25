import express from "express"
import mongoose from "mongoose"
import CustomerModel from "./model/customers.js"
import ProductModel from "./model/products.js"
import OrderModel from "./model/orders.js"

mongoose.connect("mongodb+srv://kennySang:dragon9076@cluster0.r6njk.mongodb.net/L04")

const app = express()
app.use(express.json())

app.post("/api/v1/products", async (req, res) => {
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

app.post("/api/v1/orders", async (req, res) => {
    try {
        const { orderId, customerId, productId, quantity } = req.body;

        if (!orderId) throw new Error("Order ID is required");
        if (!customerId) throw new Error("Customer ID is required");
        if (!productId) throw new Error("Product ID is required");
        if (!quantity || quantity < 1) throw new Error("Quantity must be at least 1");

        const customer = await CustomerModel.findOne({ id: customerId });
        if (!customer) throw new Error("Customer does not exist");

        const product = await ProductModel.findOne({ id: productId });
        if (!product) throw new Error("Product does not exist");

        const totalPrice = product.price * quantity;

        const createdOrder = await OrderModel.create({
            orderId,
            customerId,
            productId,
            quantity,
            totalPrice
        });
// DON'T USE THE INSERTMANY
        res.status(201).send({
            message: "Order created successfully",
            data: createdOrder,
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

        // Task 6
app.post("/api/v1/customers", async (req,res) => {
    try {
        const {id, name, email, age} = req.body
        if (!id) throw new Error("ID is required")
        if (!name) throw new Error("Name is required")
        if (!email) throw new Error("Email is required")
        if (!age) throw new Error("Age is required")

        const existedEmail = await CustomerModel.findOne({
            email
        })
        if (existedEmail) throw new Error("Email is already existed!")

        const createdCustomer = await CustomerModel.create({
            id,
            name,
            email,
            age
        })
        // await CustomerModel.insertMany([
        //     {
        //         id: "c002",
        //         name: "Trần Thị B",
        //         email: "tranthib@example.com",
        //         age: 32
        //     },
        //     {
        //         id: "c003",
        //         name: "Lê Văn C",
        //         email: "levanc@example.com",
        //         age: 24
        //     },
        //     {
        //         id: "c004",
        //         name: "Phạm Thị D",
        //         email: "phamthid@example.com",
        //         age: 29
        //     },
        //     {
        //         id: "c005",
        //         name: "Hoàng Văn E",
        //         email: "hoangvane@example.com",
        //         age: 35
        //     },
        //     {
        //         id: "c006",
        //         name: "Đỗ Thị F",
        //         email: "dothif@example.com",
        //         age: 27
        //     },
        //     {
        //         id: "c007",
        //         name: "Vũ Văn G",
        //         email: "vuvang@example.com",
        //         age: 31
        //     },
        //     {
        //         id: "c008",
        //         name: "Phan Thị H",
        //         email: "phanthih@example.com",
        //         age: 26
        //     },
        //     {
        //         id: "c009",
        //         name: "Ngô Văn I",
        //         email: "ngovani@example.com",
        //         age: 33
        //     },
        //     {
        //         id: "c010",
        //         name: "Đặng Thị K",
        //         email: "dangthik@example.com",
        //         age: 30
        //     }
        // ])
        res.status(201).send({
            message: "Register successfully",
            data: createdCustomer,
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
app.get("/api/v1/customers", async (req, res) => {
    try {
        const { name } = req.query
        const filterCustomers = name ? { name } : {}
        const customers = await CustomerModel.find(filterCustomers)

        res.status(201).send({
            message: "Get user successful",
            data: customers,
            success: true,
        })

    } catch (err) {
        res.status(403).send({
            message: err.message,
            data: null,
            success: false,
        })
    }
})

        // Task 2
app.get("/api/v1/customers/:cId", async (req, res) => {
    try {
        const {cId} = req.params

        const customer = await CustomerModel.findOne({id: cId})
        if (!customer) throw new Error("Customer does not exist")

        res.status(201).send({
          message: 'Customer found!',
          data: customer,
          success: true
      })

    } catch (err) {
        res.status(403).send({
            message: err.message,
            data: null,
            success: false,
        })
    }
})

        // Task 3
app.get("/api/v1/customers/:cId/orders", async (req, res) => {
    try {
        const {cId} = req.params

        const customer = await CustomerModel.findOne({id: cId})
        if (!customer) throw new Error('Customer does not exist');

        const orders = await OrderModel.find({customerId: cId})

        res.status(201).send({
          message: 'Order found!',
          data: orders,
          success: true
      })

    } catch (err) {
        res.status(403).send({
            message: err.message,
            data: null,
            success: false,
        })
    }
})

        // Task 4
app.get("/api/v1/orders/highvalue", async (req, res) => {
    try {
        const minPrice = 10000000
            // $gte (Greater Than or Equal to)
            // $lt (Less Than)
            // $lte (Less Than or Equal to)
            // $eq (Equal to)
            // $ne (Not Equal to)
            // $in (In an Array)
            // $and (Logical AND)
        const highValueOrders = await OrderModel.find({ totalPrice: { $gt: minPrice } });

        res.status(201).send({
            message: "Orders retrieved successfully",
            data: highValueOrders,
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

        // Task 5
app.get("/api/v1/products", async (req,res) => {
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

    } catch (err) {
        res.status(403).send({
            message: err.message,
            data: null,
            success: false
        })
    }
})

        // Task 7
app.post("/api/v1/orders", async (req, res) => {
    try {
        const {orderId, customerId, productId, quantity} = req.body

        const customer = await CustomerModel.findOne({id: customerId})
        if (!customer) throw new Error("Customer not found")
    
        const product = await ProductModel.findOne({id: productId})
        if (!product || quantity > product.quantity) throw new Error("Invalid Product")
        
        const totalPrice = product.price * quantity

        const createdOrder = await OrderModel.create({
            orderId,
            customerId,
            productId,
            quantity,
            totalPrice
        })
        
        product.quantity -= quantity;
        await product.save();

        res.status(201).send({
            message: "Order created successfully",
            data: createdOrder,
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

        // Task 8
app.put('/api/v1/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params
        const { quantity } = req.body;

        const order = await OrderModel.findOne({orderId: orderId});
        if (!order) throw new Error('Order not found');

        const product = await ProductModel.findOne({ id: order.productId });
        if (!product || product.quantity + order.quantity < quantity) throw new Error('Insufficient product stock');

        product.quantity += order.quantity - quantity;
        order.quantity = quantity;
        order.totalPrice = product.price * quantity;

        await order.save();
        await product.save();

        res.status(201).send({
            message: 'Order updated successfully!',
            data: order,
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

        // Task 9
app.delete('/api/v1/customers/:cId', async (req, res) => {
    try {
        const {cId} = req.params

        const deletedCustomer = await CustomerModel.findOneAndDelete({id: cId});
        if (!deletedCustomer) throw new Error('Customer not found');

        res.status(200).send({
            message: 'Customer deleted successfully',
            data: deletedCustomer,
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
    console.log("Server is running")
})