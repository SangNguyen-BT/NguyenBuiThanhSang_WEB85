import OrderModel from "../model/orders.js";
import CustomerModel from "../model/customers.js";
import ProductModel from "../model/products.js";

export const createOrder = async (req, res, next) => {
    try {
        const {orderId, customerId, productId, quantity} = req.body

        if (!orderId || !customerId || !productId || !quantity) throw new Error("Invalid data")

        const customer = await CustomerModel.findOne({id: customerId})
        if (!customer) throw new Error("Customer does not exist")

        const product = await ProductModel.findOne({id: productId})
        if (!product) throw new Error("Product does not exist")

        const totalPrice = product.price * quantity

        const createdOrder = await OrderModel.create({
            orderId, customerId, productId, quantity, totalPrice
        })

        res.status(201).send({
            message: "Register successfully!",
            data: createdOrder,
            success: true
        })

    } catch (error) {
        next(error)
    }
}

export const getOrderHighvalue = async (req, res, next) => {
    try {
        const minPrice = 10000000

        const highValueOrders = await OrderModel.find({totalPrice: {$gt: minPrice}})

        res.status(201).send({
            message: "Orders retrieved successfully",
            data: highValueOrders,
            success: true
        });

    } catch (error) {
        next(error)
    }
}

export const createNewOrder = async (req, res, next) => {
    try {
        const {orderId, customerId, productId, quantity} = req.body

        const existedOrderId = await OrderModel.findOne({orderId})
        if (existedOrderId) throw new Error("ID is already existed")
            
        const customer = await CustomerModel.findOne({id: customerId})
        if (!customer) throw new Error("Customer not found")
    
        const product = await ProductModel.findOne({id: productId})
        if (!product || quantity > product.quantity) throw new Error("Invalid Product")
        
        const totalPrice = product.price * quantity

        const createdNewOrder = await OrderModel.create({
            orderId,
            customerId,
            productId,
            quantity,
            totalPrice
        })
        
        product.quantity -= quantity;
        await product.save();

        res.status(201).send({
            message: "New Order created successfully",
            data: createdNewOrder,
            success: true
        })

    } catch (error) {
        next(error)
    }
}

export const updatedOrderQuantity = async (req, res, next) => {
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
        next(error)
    }
}