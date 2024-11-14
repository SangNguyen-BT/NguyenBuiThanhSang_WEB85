import express from "express";
import { customers, orders, products } from "./data.js";

const app = express();
app.use(express.json());

app.get("", (req, res) => {
  const data = { school: "MindX" };
  res.send(data);
});

// READ = GET
app.get("/orders", (req,res) => {
  res.send(orders)
})
        // Task 1
app.get("/customers", (req, res) => {
  res.send(customers);
});

        // Task 2
app.get("/customers/:id", (req, res) => {
  const { id } = req.params;
  const customer = customers.find((cus) => cus.id === id);

  if (customer) {
    res.status(200).send({
      status: "success",
      message: "Customer found",
      data: customer,
    });
  } else {
    res.status(404).send({
      status: "fail",
      message: "Customer not found",
      data: null,
    });
  }
});

        // Task 3
app.get("/customers/:cId/orders", (req, res) => {
  const { cId } = req.params;
  const filterOrders = orders.filter((o) => o.customerId === cId);

  res.send(filterOrders);
});

        // Task 4
app.get("/orders/highvalue", (req, res) => {
  const highValue = orders.filter((o) => o.totalPrice > 10000000);

  res.send(highValue);
});

        // Task 5
app.get("/products", (req, res) => {
  const queryParams = req.query;
  const minPrice = queryParams.minPrice || 0;
  const maxPrice = queryParams.maxPrice || Infinity;
  const filterProducts = products.filter(
    (p) => p.price >= minPrice && p.price <= maxPrice
  );

  res.send(filterProducts);
});

app.get("/orders/:cId/:pId", (req, res) => {
  const { cId, pId } = req.params;
  const filterOrders = orders.filter(
    (o) => o.customerId === cId && o.productId === pId
  );

  res.send(filterOrders);
});

// CREATE = POST
          // Task 6
app.post("/customers", (req, res) => {
  const body = req.body;
  customers.push(body);
  res.send(customers);
});

        // Task 7
app.post("/orders", (req, res) => {
  const {customerId, productId, orderId, quantity} = req.body;

  const product = products.find(p => p.id === productId)

  if (quantity > product.quantity) {
    return res.status(404).send({
      status: "fail",
      message: "Exceed stock",
      data: null
    })
  }

  const totalPrice = product.price * quantity

  const newOrder = {
    orderId,
    customerId,
    productId,
    quantity,
    totalPrice
  }
  orders.push(newOrder);
  res.send(newOrder);
})


// UPDATE = PUT
app.put("/customers/:id", (req, res) => {
  const { id } = req.params;
  const fieldsUpdate = req.body;

  const customer = customers.find((cus) => cus.id == id);
  Object.keys(fieldsUpdate).forEach(
    (key) => (customer[key] = fieldsUpdate[key])
  );

  res.send(customer);
});

        // Task 8
app.put("/orders/:oId", (req,res) => {
  const {oId} = req.params;
  const {quantity} = req.body

  const order = orders.find(o => o.orderId === oId)
  if (!order) {
    return res.status(404).send({
      status: "fail",
      message: "Order not found",
      data:  null
    })
  }

  const product = products.find(p => p.id === order.productId)
  if (!product) {
    return res.status(404).send({
      status: "fail",
      message: "Product not found",
      data: null,
    });
  }

  order.quantity = quantity
  order.totalPrice = product.price * quantity

  res.status(200).send(order)
})

// DELETE = DELETE
        // Task 9
app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  const filterCustomers = customers.filter((cus) => cus.id != id);

  res.send(filterCustomers);
});

app.listen(8080, () => {
  console.log("Server is running on localhost:8080");
});