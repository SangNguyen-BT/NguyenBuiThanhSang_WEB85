import http from "http";
import { customers, products, orders } from "./data.js";

const app = http.createServer((request, response) => {
  const endpoint = request.url;

  if (endpoint === "/") {
    response.end("Hello");
  } 
            // Task 1
  else if (endpoint === "/customers") {
    response.end(JSON.stringify(customers))
  }
            // Task 2
  else if (endpoint.startsWith("/customers/") && !endpoint.includes("/orders")) {
    const id = endpoint.split("/")[2];
    const customer = customers.find((cus) => cus.id === id);

    if (customer) {
      response.end(JSON.stringify(customer));
    } else {
      response.end("Customer not found");
    }
  } 
            // Task 3
  else if (endpoint.startsWith("/customers/") && endpoint.endsWith("/orders")) {
    const customerId = endpoint.split("/")[2];
    const customerOrder = orders.filter(o => o.customerId === customerId);

    if (customerOrder.length > 0) {
        response.end(JSON.stringify(customerOrder))
    } else {
        response.end("Order not found")
    }
  }
            // Task 4
  else if (endpoint === "/orders/highvalue") {
    const highValue = orders.filter(o => o.totalPrice > 10000000)
    
    if (highValue) {
        response.end(JSON.stringify(highValue))
    } else {
        response.end("404 Not Found")
    }
  }

  else {
    response.end("404 Not Found");
  }
});

app.listen(8080, () => {
  console.log("Server is running on localhost:8080");
});
