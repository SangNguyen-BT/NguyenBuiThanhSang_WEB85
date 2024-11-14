import http from "http";
import { customers, products, orders } from "./data.js";
import url from "url";

const app = http.createServer((req, res) => {
  const endpoint = req.url;

                // For Task 5
  const parsedUrl = url.parse(endpoint, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (path === "/") {
    res.end("Hello");
  }
                // Task 1
  else if (path === "/customers") {
    res.end(JSON.stringify(customers))
  }
                // Task 2
  else if (path.startsWith("/customers/") && !path.includes("/orders")) {
    const id = path.split("/")[2]
    const customer = customers.find(cus => cus.id === id)

    if (customer) {
        res.end(JSON.stringify(customer))
    } else {
        res.end("Customer not found")
    }
  }
                // Task 3
  else if (path.startsWith("/customers/") && path.endsWith("/orders")) {
    const customerId = path.split("/")[2];
    const customerOrder = orders.filter(o => o.customerId === customerId);

    if (customerOrder.length > 0) {
        response.end(JSON.stringify(customerOrder))
    } else {
        response.end("Order not found")
    }
  }
                // Task 4 
  else if (path === "/orders/highvalue") {
    const highValue = orders.filter(o => o.totalPrice > 10000000)
    
    if (highValue) {
        response.end(JSON.stringify(highValue))
    } else {
        response.end("404 Not Found")
    }
  }
                // Task 5
  else if (path === "/products") {
    const minPrice = parseInt(query.minPrice) || 0;
    const maxPrice = parseInt(query.maxPrice) || Infinity;

    const filterProducts = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    response.end(JSON.stringify(filterProducts))
  }

  else {
    response.end("404 Not Found");
  }
});

app.listen(8080, () => {
  console.log("Server is running on localhost:8080");
});